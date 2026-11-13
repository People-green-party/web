export type DonationPaymentConfig = {
  enabled: boolean;
  provider: "ccavenue" | null;
  environment: "test" | "production";
  limitsConfirmed: boolean;
  minAmount: number | null;
  maxAmount: number | null;
  reason: "disabled" | "limits_unconfirmed" | "configuration_missing" | "hosted_checkout_approval_required" | "integration_unavailable" | null;
};

function isPositiveAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function parseDonationPaymentConfig(value: unknown): DonationPaymentConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid payment availability response");
  }
  const config = value as Record<string, unknown>;
  if (
    typeof config.enabled !== "boolean" ||
    typeof config.limitsConfirmed !== "boolean" ||
    !["ccavenue", null].includes(config.provider as string | null) ||
    !["test", "production"].includes(config.environment as string) ||
    !(config.minAmount === null || isPositiveAmount(config.minAmount)) ||
    !(config.maxAmount === null || isPositiveAmount(config.maxAmount)) ||
    (isPositiveAmount(config.minAmount) && isPositiveAmount(config.maxAmount) && config.maxAmount < config.minAmount) ||
    !["disabled", "limits_unconfirmed", "configuration_missing", "hosted_checkout_approval_required", "integration_unavailable", null].includes(config.reason as string | null)
  ) {
    throw new Error("Invalid payment availability response");
  }
  return {
    enabled: config.enabled,
    provider: config.provider as DonationPaymentConfig["provider"],
    environment: config.environment as DonationPaymentConfig["environment"],
    limitsConfirmed: config.limitsConfirmed,
    minAmount: config.minAmount as number | null,
    maxAmount: config.maxAmount as number | null,
    reason: config.reason as DonationPaymentConfig["reason"],
  };
}

export function canInitiateDonationPayment(config: DonationPaymentConfig | null): boolean {
  // Provider-specific checkout still requires every server-controlled gate.
  return !!config && config.enabled === true && config.limitsConfirmed === true &&
    config.provider === "ccavenue" &&
    config.reason === null &&
    (config.environment === "test" || config.environment === "production") &&
    isPositiveAmount(config.minAmount) &&
    (config.maxAmount === null || (isPositiveAmount(config.maxAmount) && config.maxAmount >= config.minAmount));
}

export type DonationAmountError = "unavailable" | "invalid" | "below_minimum" | "above_maximum" | "above_storage_limit";

export type DonationPaymentAttempt = { payload: string; key: string };

export function getDonationPaymentAttempt(
  payload: Record<string, unknown>,
  previous: DonationPaymentAttempt | null,
): DonationPaymentAttempt {
  const serialized = JSON.stringify(payload);
  if (previous?.payload === serialized) return previous;
  return { payload: serialized, key: crypto.randomUUID() };
}

export const UNRESOLVED_DONATION_STORAGE_KEY = "pgp-unresolved-donation-attempt";
export const DONATION_ATTEMPT_CHANGED_EVENT = "pgp-donation-attempt-changed";

export type UnresolvedDonationAttempt = {
  key: string;
  startedAt: number;
  // Retain old unresolved markers to prevent duplicate donations after migration.
  // This is recovery metadata, never a selectable checkout provider.
  provider?: "razorpay" | "ccavenue";
  donationId?: number;
  orderId?: string;
  paymentId?: string;
};

type AttemptStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function parseUnresolvedAttempt(value: unknown): UnresolvedDonationAttempt {
  const candidate = value as Partial<UnresolvedDonationAttempt> | null;
  if (!candidate || typeof candidate !== "object" ||
      typeof candidate.key !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate.key) ||
      !Number.isSafeInteger(candidate.startedAt) || Number(candidate.startedAt) <= 0 ||
      (candidate.provider !== undefined && !["razorpay", "ccavenue"].includes(candidate.provider)) ||
      (candidate.donationId !== undefined && (!Number.isSafeInteger(candidate.donationId) || candidate.donationId <= 0)) ||
      (candidate.orderId !== undefined && (typeof candidate.orderId !== "string" || !/^(?:order_[A-Za-z0-9]+|PGP[0-9a-f]{24})$/.test(candidate.orderId))) ||
      (candidate.paymentId !== undefined && (typeof candidate.paymentId !== "string" || !/^pay_[A-Za-z0-9]+$/.test(candidate.paymentId)))) {
    throw new Error("The previous payment attempt could not be read safely");
  }
  // Copy an explicit allowlist: donor details and payment signatures never enter this marker.
  return {
    key: candidate.key,
    startedAt: candidate.startedAt!,
    ...(candidate.provider !== undefined ? { provider: candidate.provider } : {}),
    ...(candidate.donationId !== undefined ? { donationId: candidate.donationId } : {}),
    ...(candidate.orderId !== undefined ? { orderId: candidate.orderId } : {}),
    ...(candidate.paymentId !== undefined ? { paymentId: candidate.paymentId } : {}),
  };
}

export function readUnresolvedDonationAttempt(storage: Pick<Storage, "getItem">): UnresolvedDonationAttempt | null {
  const saved = storage.getItem(UNRESOLVED_DONATION_STORAGE_KEY);
  return saved === null ? null : parseUnresolvedAttempt(JSON.parse(saved));
}

export function beginUnresolvedDonationAttempt(storage: AttemptStorage, key: string): UnresolvedDonationAttempt {
  if (readUnresolvedDonationAttempt(storage)) {
    throw new Error("A previous payment attempt must be checked before another payment");
  }
  const attempt = parseUnresolvedAttempt({ key, startedAt: Date.now() });
  storage.setItem(UNRESOLVED_DONATION_STORAGE_KEY, JSON.stringify(attempt));
  return attempt;
}

export function updateUnresolvedDonationAttempt(
  storage: AttemptStorage,
  key: string,
  references: Pick<UnresolvedDonationAttempt, "provider" | "donationId" | "orderId" | "paymentId">,
): UnresolvedDonationAttempt {
  const existing = readUnresolvedDonationAttempt(storage);
  if (!existing || existing.key !== key) throw new Error("Payment attempt no longer matches");
  const attempt = parseUnresolvedAttempt({ ...existing, ...references, key: existing.key, startedAt: existing.startedAt });
  storage.setItem(UNRESOLVED_DONATION_STORAGE_KEY, JSON.stringify(attempt));
  return attempt;
}

// Call only after authenticated, verified terminal status or an order-validation 400 that
// occurs before the API creates an order. Timeouts, dismissals, 409 and 503 retain it.
export function clearUnresolvedDonationAttempt(storage: AttemptStorage, key: string): boolean {
  const existing = readUnresolvedDonationAttempt(storage);
  if (!existing || existing.key !== key) return false;
  storage.removeItem(UNRESOLVED_DONATION_STORAGE_KEY);
  return true;
}

export function paymentInitiationUncertainMessage(isHi: boolean): string {
  return isHi
    ? "भुगतान शुरू होने की स्थिति की पुष्टि नहीं हुई है। सहायता टीम द्वारा इस प्रयास की जाँच होने तक दोबारा भुगतान न करें।"
    : "Payment initiation is not confirmed. Do not pay again until support has checked this attempt.";
}

export function validateDonationPaymentAmount(
  amount: number,
  config: DonationPaymentConfig | null,
): DonationAmountError | null {
  if (!canInitiateDonationPayment(config)) return "unavailable";
  if (!Number.isSafeInteger(amount)) return "invalid";
  if (amount < config!.minAmount!) return "below_minimum";
  if (config!.maxAmount !== null && amount > config!.maxAmount) return "above_maximum";
  // This is a technical storage constraint, not an approved contribution policy.
  if (amount > 2_147_483_647) return "above_storage_limit";
  return null;
}

export function donationAmountErrorMessage(
  error: DonationAmountError,
  config: DonationPaymentConfig | null,
  isHi: boolean,
): string {
  if (error === "unavailable") {
    return isHi ? "ऑनलाइन योगदान अभी उपलब्ध नहीं है। कृपया उपलब्धता फिर से जाँचें।" : "Online contributions are currently unavailable. Please check availability again.";
  }
  if (error === "below_minimum" && config?.minAmount) {
    const minimum = config.minAmount.toLocaleString("en-IN");
    return isHi ? `योगदान राशि कम से कम ₹${minimum} होनी चाहिए।` : `The contribution must be at least ₹${minimum}.`;
  }
  if (error === "above_maximum" && config?.maxAmount) {
    const maximum = config.maxAmount.toLocaleString("en-IN");
    return isHi ? `योगदान राशि ₹${maximum} से अधिक नहीं हो सकती।` : `The contribution cannot exceed ₹${maximum}.`;
  }
  if (error === "above_storage_limit") {
    return isHi ? "यह राशि ऑनलाइन भुगतान के लिए समर्थित सीमा से अधिक है। कृपया योगदान संबंधी सहायता के लिए हमसे संपर्क करें।" : "This amount exceeds the supported online payment limit. Please contact us for contribution assistance.";
  }
  return isHi ? "कृपया रुपये में पूर्णांक राशि दर्ज करें।" : "Please enter a whole-number amount in rupees.";
}
