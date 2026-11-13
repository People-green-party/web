"use client";

import type { useDonationPaymentConfig } from "./useDonationPaymentConfig";

type Props = {
  id: string;
  isHi: boolean;
  payment: ReturnType<typeof useDonationPaymentConfig>;
  busy?: boolean;
};

export function DonationPaymentNotice({ id, isHi, payment, busy = false }: Props) {
  const { config, status, canPay, retry } = payment;
  const loading = status === "loading";
  const limits = config?.limitsConfirmed && config.minAmount != null
    ? config.maxAmount != null
      ? `₹${config.minAmount.toLocaleString("en-IN")} – ₹${config.maxAmount.toLocaleString("en-IN")}`
      : `₹${config.minAmount.toLocaleString("en-IN")}`
    : null;
  const message = loading
    ? isHi ? "ऑनलाइन योगदान की उपलब्धता जाँची जा रही है…" : "Checking online contribution availability…"
    : status === "error"
      ? isHi ? "भुगतान की उपलब्धता की पुष्टि नहीं हो सकी। कृपया फिर से जाँचें।" : "Payment availability could not be confirmed. Please check again."
      : !canPay
        ? config?.reason === "disabled"
          ? isHi
            ? "ऑनलाइन भुगतान अभी बंद हैं। फ़ॉर्म पूरा करने पर भी भुगतान शुरू नहीं होगा। कृपया बाद में फिर से जाँचें।"
            : "Online payments are currently turned off. Completing this form will not start a payment. Please check again later."
          : isHi ? "ऑनलाइन योगदान अभी उपलब्ध नहीं है। कृपया बाद में फिर से जाँचें।" : "Online contributions are currently unavailable. Please check again later."
        : config?.environment === "test"
          ? isHi ? "केवल परीक्षण भुगतान उपलब्ध है। यह वास्तविक योगदान नहीं है।" : "Only test payments are available. This is not a live contribution."
          : isHi ? "ऑनलाइन योगदान उपलब्ध है।" : "Online contributions are available.";

  return (
    <div className="rounded-xl border border-[#DDEEE4] bg-[#F5F9F6] px-4 py-3 text-sm text-[#254B34]">
      <div id={id} role="status" aria-live="polite" aria-atomic="true">
        <p className="font-semibold">{message}</p>
        {limits ? (
          <p className="mt-1 text-xs">
            {config?.maxAmount == null
              ? isHi ? "प्रति लेन-देन स्वीकृत न्यूनतम राशि:" : "Approved minimum amount per transaction:"
              : isHi ? "प्रति लेन-देन स्वीकृत राशि:" : "Approved amount per transaction:"} {limits}
          </p>
        ) : !loading && status !== "error" ? (
          <p className="mt-1 text-xs">{isHi ? "प्रति लेन-देन राशि की सीमा की पुष्टि लंबित है।" : "Transaction amount limits are awaiting confirmation."}</p>
        ) : null}
      </div>
      {!canPay && (
        <button
          type="button"
          onClick={retry}
          disabled={loading || busy}
          className="mt-2 font-bold text-xs text-[#0D5229] underline disabled:cursor-wait disabled:opacity-60"
        >
          {isHi ? "उपलब्धता फिर से जाँचें" : "Check availability again"}
        </button>
      )}
    </div>
  );
}
