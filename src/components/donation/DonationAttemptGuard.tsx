"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  beginUnresolvedDonationAttempt,
  clearUnresolvedDonationAttempt,
  DONATION_ATTEMPT_CHANGED_EVENT,
  paymentInitiationUncertainMessage,
  readUnresolvedDonationAttempt,
  updateUnresolvedDonationAttempt,
  UNRESOLVED_DONATION_STORAGE_KEY,
  type UnresolvedDonationAttempt,
} from "../../lib/donationPayment";
import { SITE_DETAILS } from "../../lib/siteDetails";

const LOADING = "__loading__";
const UNAVAILABLE = "__unavailable__";

function subscribeToAttempts(listener: () => void) {
  window.addEventListener(DONATION_ATTEMPT_CHANGED_EVENT, listener);
  window.addEventListener("pageshow", listener);
  return () => {
    window.removeEventListener(DONATION_ATTEMPT_CHANGED_EVENT, listener);
    window.removeEventListener("pageshow", listener);
  };
}

function attemptSnapshot() {
  try { return window.sessionStorage.getItem(UNRESOLVED_DONATION_STORAGE_KEY); }
  catch { return UNAVAILABLE; }
}

export function useDonationAttemptGuard() {
  const saved = useSyncExternalStore(subscribeToAttempts, attemptSnapshot, () => LOADING);
  const ready = saved !== LOADING;
  let storageAvailable = ready && saved !== UNAVAILABLE;
  let marker: UnresolvedDonationAttempt | null = null;
  if (storageAvailable) {
    try { marker = readUnresolvedDonationAttempt({ getItem: () => saved }); }
    catch { storageAvailable = false; }
  }

  const announce = () => window.dispatchEvent(new Event(DONATION_ATTEMPT_CHANGED_EVENT));
  const begin = (key: string) => {
    try {
      const attempt = beginUnresolvedDonationAttempt(window.sessionStorage, key);
      announce();
      return attempt;
    } catch (error) {
      announce();
      throw error;
    }
  };
  const update = (key: string, references: Pick<UnresolvedDonationAttempt, "provider" | "donationId" | "orderId" | "paymentId">) => {
    try {
      updateUnresolvedDonationAttempt(window.sessionStorage, key, references);
      announce();
    } catch {
      // The original marker was already saved before the order request. A
      // failed reference update must not discard a verified provider result.
      announce();
    }
  };
  const resolve = (key: string) => {
    try {
      const cleared = clearUnresolvedDonationAttempt(window.sessionStorage, key);
      announce();
      return cleared;
    } catch {
      announce();
      return false;
    }
  };
  return { marker, ready, storageAvailable, blocked: !ready || !storageAvailable || marker !== null, begin, update, resolve };
}

export function DonationAttemptNotice({ guard, isHi, busy }: {
  guard: ReturnType<typeof useDonationAttemptGuard>;
  isHi: boolean;
  busy: boolean;
}) {
  if (!guard.ready || !guard.blocked || busy) return null;
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p>{guard.storageAvailable
        ? paymentInitiationUncertainMessage(isHi)
        : isHi
          ? "इस ब्राउज़र में पिछले भुगतान की स्थिति सुरक्षित रूप से जाँची नहीं जा सकी। नया भुगतान शुरू नहीं किया जाएगा। कृपया सहायता से संपर्क करें।"
          : "The previous payment state could not be checked safely in this browser. A new payment will not be started. Please contact support."}</p>
      {guard.marker?.paymentId || guard.marker?.orderId ? <p className="mt-2 break-all font-mono text-xs">{isHi ? "संदर्भ" : "Reference"}: {guard.marker.paymentId || guard.marker.orderId}</p> : null}
      {guard.marker?.provider === "ccavenue" ? <Link className="mt-2 mr-4 inline-block font-bold underline" href="/donation/payment-result">
        {isHi ? "इस भुगतान की स्थिति जाँचें" : "Check this payment’s status"}
      </Link> : null}
      <a className="mt-2 inline-block font-bold underline" href={`mailto:${SITE_DETAILS.email}`}>
        {isHi ? "सहायता से संपर्क करें" : "Contact support"}: {SITE_DETAILS.email}
      </a>
    </div>
  );
}
