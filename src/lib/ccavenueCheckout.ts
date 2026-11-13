import type { DonationReceipt } from "./donationReceipt";

export const CCAVENUE_RESULT_STORAGE_KEY = "pgp-ccavenue-result-reference";
const ORDER_ID = /^PGP[0-9a-f]{24}$/;
const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CcavenueResultReference = { orderId: string; token: string };
export type CcavenueOrder = {
  donationId: number;
  orderId: string;
  environment: "test" | "production";
  statusToken: string;
  checkout: { action: string; method: "POST"; fields: { encRequest: string; access_code: string } };
};
export type CcavenueStatus = {
  status: "initiated" | "pending" | "successful" | "failed" | "cancelled";
  verified: boolean;
  testMode: boolean;
  receipt?: DonationReceipt;
};

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid payment response");
  return value as Record<string, unknown>;
}

export function parseCcavenueResultReference(value: unknown): CcavenueResultReference {
  const reference = record(value);
  if (typeof reference.orderId !== "string" || !ORDER_ID.test(reference.orderId) ||
      typeof reference.token !== "string" || !TOKEN.test(reference.token)) {
    throw new Error("Invalid payment reference");
  }
  return { orderId: reference.orderId, token: reference.token };
}

export function parseCcavenueResultFragment(fragment: string): CcavenueResultReference {
  const params = new URLSearchParams(fragment.replace(/^#/, ""));
  if (params.getAll("orderId").length !== 1 || params.getAll("token").length !== 1) {
    throw new Error("Invalid payment return reference");
  }
  // A URL status/success parameter is never evidence of a payment outcome.
  return parseCcavenueResultReference({ orderId: params.get("orderId"), token: params.get("token") });
}

export function saveCcavenueResultReference(storage: Pick<Storage, "setItem">, reference: CcavenueResultReference) {
  storage.setItem(CCAVENUE_RESULT_STORAGE_KEY, JSON.stringify(parseCcavenueResultReference(reference)));
}

export function readCcavenueResultReference(storage: Pick<Storage, "getItem">): CcavenueResultReference | null {
  const saved = storage.getItem(CCAVENUE_RESULT_STORAGE_KEY);
  return saved === null ? null : parseCcavenueResultReference(JSON.parse(saved));
}

export function isAllowedCcavenueAction(action: unknown, environment: "test" | "production"): action is string {
  if (typeof action !== "string") return false;
  // Exact allowlist: no alternate ports, credentials, fragments or extra parameters.
  // A test action must be supplied by the configured backend, never inferred here.
  return environment === "production"
    ? action === "https://secure.ccavenue.com/gTransaction.do?command=initiateTransaction"
    : action === "https://test.ccavenue.com/gTransaction.do?command=initiateTransaction";
}

export function parseCcavenueOrder(value: unknown, environment: "test" | "production", attemptKey: string): CcavenueOrder {
  const order = record(value);
  const checkout = record(order.checkout);
  const fields = record(checkout.fields);
  if (!Number.isSafeInteger(order.donationId) || Number(order.donationId) <= 0 ||
      typeof order.orderId !== "string" || !ORDER_ID.test(order.orderId) || order.environment !== environment ||
      typeof order.statusToken !== "string" || !TOKEN.test(order.statusToken) || order.statusToken !== attemptKey ||
      checkout.method !== "POST" || !isAllowedCcavenueAction(checkout.action, environment) ||
      typeof fields.encRequest !== "string" || fields.encRequest.length < 56 || fields.encRequest.length > 65_536 ||
      fields.encRequest.length % 2 !== 0 || !/^[a-f0-9]+$/i.test(fields.encRequest) ||
      typeof fields.access_code !== "string" || !fields.access_code || fields.access_code.length > 512 ||
      Object.keys(fields).some((name) => name !== "encRequest" && name !== "access_code")) {
    throw new Error("Hosted payment response could not be validated");
  }
  return {
    donationId: Number(order.donationId), orderId: order.orderId, environment, statusToken: order.statusToken,
    checkout: { action: checkout.action, method: "POST", fields: { encRequest: fields.encRequest, access_code: fields.access_code } },
  };
}

export function submitCcavenueCheckout(order: CcavenueOrder, document: Document = window.document) {
  // Validate again at the browser boundary; never render server-provided HTML.
  const checked = parseCcavenueOrder(order, order.environment, order.statusToken);
  const form = document.createElement("form");
  form.method = "POST";
  form.action = checked.checkout.action;
  form.target = "_self";
  form.acceptCharset = "UTF-8";
  form.hidden = true;
  for (const name of ["encRequest", "access_code"] as const) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = checked.checkout.fields[name];
    form.appendChild(input);
  }
  document.body.appendChild(form);
  try { form.submit(); }
  finally { form.remove(); }
}

export function parseCcavenueStatus(value: unknown, reference: CcavenueResultReference): CcavenueStatus {
  const result = record(value);
  if (!["initiated", "pending", "successful", "failed", "cancelled"].includes(String(result.status)) ||
      typeof result.verified !== "boolean" || typeof result.testMode !== "boolean" || result.orderId !== reference.orderId) {
    throw new Error("Invalid payment status response");
  }
  const status: CcavenueStatus = {
    status: result.status as CcavenueStatus["status"], verified: result.verified, testMode: result.testMode,
  };
  // Unverified, non-success, and simulated responses can never produce a receipt.
  if (status.status !== "successful" || !status.verified || status.testMode) return status;
  const receipt = record(result.receipt);
  if (!Number.isSafeInteger(receipt.donationId) || Number(receipt.donationId) <= 0 ||
      receipt.orderId !== reference.orderId || typeof receipt.paymentId !== "string" || !receipt.paymentId.trim() ||
      typeof receipt.fullName !== "string" || !receipt.fullName.trim() ||
      !Number.isSafeInteger(receipt.amount) || Number(receipt.amount) <= 0 ||
      typeof receipt.paidAt !== "string" || !Number.isFinite(Date.parse(receipt.paidAt)) ||
      typeof receipt.receiptToken !== "string" || !/^[a-f0-9]{64}$/.test(receipt.receiptToken)) {
    throw new Error("Verified receipt response was incomplete");
  }
  status.receipt = {
    donationId: Number(receipt.donationId), orderId: reference.orderId, paymentId: receipt.paymentId,
    fullName: receipt.fullName, amount: Number(receipt.amount), paidAt: receipt.paidAt, receiptToken: receipt.receiptToken,
    ...(typeof receipt.pan === "string" ? { pan: receipt.pan } : {}),
    ...(["peoples-green-fund", "green-fund", "democracy-fund"].includes(String(receipt.fund)) ? { fund: receipt.fund as DonationReceipt["fund"] } : {}),
    ...(Number.isSafeInteger(receipt.plantCount) && Number(receipt.plantCount) > 0 ? { plantCount: Number(receipt.plantCount) } : {}),
    ...(typeof receipt.dedicationName === "string" ? { dedicationName: receipt.dedicationName } : {}),
    ...(typeof receipt.dedicationOccasion === "string" ? { dedicationOccasion: receipt.dedicationOccasion } : {}),
    ...(typeof receipt.publicConsent === "boolean" ? { publicConsent: receipt.publicConsent } : {}),
  };
  return status;
}

export function isVerifiedCcavenueTerminalStatus(status: CcavenueStatus): boolean {
  return status.verified && ["successful", "failed", "cancelled"].includes(status.status);
}
