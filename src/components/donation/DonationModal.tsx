"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../LanguageContext";
import { ApiRequestError, fetchApi } from "../../lib/api";
import { getAuthHeader } from "../../lib/supabaseClient";
import { DonationReceipt, RECEIPT_STORAGE_KEY, downloadDonationReceipt } from "../../lib/donationReceipt";
import { downloadDedicationCertificate, DedicationCertificateData } from "../../lib/dedicationCertificate";
import { FormFieldLabel, RequiredMark } from "../FormFieldLabel";
import {
  DONATION_PRESET_AMOUNTS,
  MAX_DONATION_AMOUNT,
  MIN_DONATION_AMOUNT,
  SITE_DETAILS,
} from "../../lib/siteDetails";
import { FundId, FUNDS_DATA } from "../../data/fundsData";

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; contact: string; email?: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: { ondismiss: () => void };
};

type RazorpayCheckout = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

type PaymentOutcome = "idle" | "cancelled" | "failed" | "pending-verification" | "success";

function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load secure checkout.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load secure checkout."));
    document.body.appendChild(script);
  });
}

export interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFund?: FundId;
  defaultAmount?: number;
  plantCount?: number;
  dedicationOccasion?: string;
  dedicationName?: string;
  publicConsent?: boolean;
}

export function DonationModal({
  isOpen,
  onClose,
  defaultFund = "peoples-green-fund",
  defaultAmount,
  plantCount,
  dedicationOccasion,
  dedicationName,
  publicConsent,
}: DonationModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [selectedFund, setSelectedFund] = useState<FundId>(defaultFund);
  const [isDeclared, setIsDeclared] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [wantsTaxDocumentation, setWantsTaxDocumentation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [paymentOutcome, setPaymentOutcome] = useState<PaymentOutcome>("idle");
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [dedicationData, setDedicationData] = useState<DedicationCertificateData | null>(null);
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "guest">("checking");
  const [showAuthGate, setShowAuthGate] = useState(false);

  const [form, setForm] = useState({
    citizen: "" as "" | "yes" | "no",
    fullName: "",
    phone: "",
    pan: "",
    amount: defaultAmount ? String(defaultAmount) : "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    setSelectedFund(defaultFund);
  }, [defaultFund]);

  useEffect(() => {
    if (defaultAmount) {
      setForm((prev) => ({ ...prev, amount: String(defaultAmount) }));
    }
  }, [defaultAmount]);

  useEffect(() => {
    let active = true;
    getAuthHeader({ allowSession: true })
      .then((header) => {
        if (active) setAuthStatus(header.Authorization ? "authenticated" : "guest");
      })
      .catch(() => {
        if (active) setAuthStatus("guest");
      });
    return () => {
      active = false;
    };
  }, []);

  if (!isOpen) return null;

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const panRequired = Number(form.amount) > 20000 || wantsTaxDocumentation;
  const currentFundInfo = FUNDS_DATA[selectedFund];

  const goToContributionStep = () => {
    setSubmitMsg(null);
    setPaymentOutcome("idle");
    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);
    if (form.citizen !== "yes") {
      setSubmitMsg({
        type: "err",
        text: isHi
          ? "केवल भारतीय नागरिक ही राजनीतिक दान कर सकते हैं।"
          : "Only Indian citizens can make political contributions.",
      });
      return;
    }
    if (
      !form.fullName.trim() ||
      !phoneDigits ||
      !form.address.trim() ||
      !form.state.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      setSubmitMsg({
        type: "err",
        text: isHi ? "कृपया सभी आवश्यक जानकारी भरें।" : "Please complete all required fields.",
      });
      return;
    }
    if (phoneDigits.length !== 10) {
      setSubmitMsg({
        type: "err",
        text: isHi ? "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.",
      });
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setSubmitMsg({
        type: "err",
        text: isHi ? "कृपया 6 अंकों का सही पिन कोड दर्ज करें।" : "Please enter a valid 6-digit PIN code.",
      });
      return;
    }

    if (authStatus !== "authenticated") {
      setShowAuthGate(true);
      return;
    }

    setFormStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);
    setPaymentOutcome("idle");

    if (!isDeclared) {
      setSubmitMsg({
        type: "err",
        text: isHi ? "कृपया आगे बढ़ने के लिए घोषणा स्वीकार करें।" : "Please accept the declaration to continue.",
      });
      return;
    }
    if (!acceptedPolicies) {
      setSubmitMsg({
        type: "err",
        text: isHi
          ? "कृपया आगे बढ़ने के लिए नियम और शर्तें तथा रिफंड नीति स्वीकार करें।"
          : "Please accept the Terms & Conditions and Refund Policy to continue.",
      });
      return;
    }
    if (form.citizen !== "yes") {
      setSubmitMsg({
        type: "err",
        text: isHi ? "केवल भारतीय नागरिक ही राजनीतिक दान कर सकते हैं।" : "Only Indian citizens can make donations.",
      });
      return;
    }

    const amount = Number(form.amount);
    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);

    if (!Number.isSafeInteger(amount) || amount < MIN_DONATION_AMOUNT) {
      setSubmitMsg({
        type: "err",
        text: isHi
          ? `दान राशि कम से कम ₹${MIN_DONATION_AMOUNT} होनी चाहिए।`
          : `Donation amount must be at least ₹${MIN_DONATION_AMOUNT}.`,
      });
      return;
    }
    if (MAX_DONATION_AMOUNT !== null && amount > MAX_DONATION_AMOUNT) {
      setSubmitMsg({
        type: "err",
        text: isHi
          ? "योगदान राशि स्वीकृत अधिकतम लेन-देन सीमा से अधिक है।"
          : "The contribution exceeds the maximum transaction amount.",
      });
      return;
    }

    const normalizedPan = form.pan.trim().toUpperCase();
    if (panRequired && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
      setSubmitMsg({
        type: "err",
        text: isHi ? "कृपया सही पैन कार्ड नंबर दर्ज करें।" : "Please enter a valid PAN.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Build payloads with graceful fallbacks
      const fullDonationPayload = {
        fullName: form.fullName.trim(),
        phone: phoneDigits,
        pan: panRequired ? normalizedPan : undefined,
        amount,
        country: "India",
        address: form.address.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        pincode: form.pincode,
        isIndianCitizen: true,
        declarationAccepted: isDeclared,
        policiesAccepted: acceptedPolicies,
        policyVersion: "2026-10-28",
        fund: selectedFund,
        plantCount: plantCount ?? undefined,
        dedicationOccasion: dedicationOccasion ?? undefined,
        dedicationName: dedicationName ?? undefined,
        publicConsent: publicConsent ?? undefined,
      };

      const fallbackPayload = {
        fullName: form.fullName.trim(),
        phone: phoneDigits,
        pan: panRequired ? normalizedPan : undefined,
        amount,
        country: "India",
        address: form.address.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        pincode: form.pincode,
        isIndianCitizen: true,
        declarationAccepted: isDeclared,
        policiesAccepted: acceptedPolicies,
        policyVersion: "2026-10-28",
        fund: selectedFund,
      };

      const callOrderApi = (payload: Record<string, unknown>, suppress = false) =>
        fetchApi("donations/razorpay/order", {
          method: "POST",
          body: JSON.stringify(payload),
          suppressErrorLog: suppress,
        }) as Promise<{
          donationId: number;
          orderId: string;
          keyId: string;
          amount: number;
          currency: string;
        }>;

      let order;
      try {
        order = await callOrderApi(fullDonationPayload, true);
      } catch (err: unknown) {
        if (err instanceof ApiRequestError && err.status === 400) {
          if (selectedFund === "green-fund" && plantCount) {
            throw new Error("GREEN_FUND_DETAILS_NOT_ACCEPTED");
          }
          try {
            order = await callOrderApi(fallbackPayload, true);
          } catch {
            throw err;
          }
        } else {
          throw err;
        }
      }

      await loadRazorpayCheckout();
      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) throw new Error("Unable to load secure checkout.");

      const checkout = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: SITE_DETAILS.legalName,
        description: `${currentFundInfo.title.en} Contribution`,
        order_id: order.orderId,
        prefill: {
          name: form.fullName.trim(),
          contact: phoneDigits,
        },
        theme: { color: "#04330B" },
        modal: {
          ondismiss: () => {
            setPaymentOutcome("cancelled");
            setSubmitMsg({
              type: "err",
              text: isHi
                ? "पुष्टि से पहले भुगतान विंडो बंद हो गई। यदि राशि कटी है तो संपर्क करें।"
                : "Payment window closed before confirmation. Contact support if debited.",
            });
            setSubmitting(false);
          },
        },
        handler: async (payment: RazorpayPaymentResponse) => {
          try {
            const verification = (await fetchApi("donations/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpayOrderId: payment.razorpay_order_id,
                razorpaySignature: payment.razorpay_signature,
              }),
            })) as Partial<DonationReceipt> & { verified?: boolean; donationId?: number };

            if (!verification.verified || !Number.isSafeInteger(verification.donationId)) {
              throw new Error("Payment verification response was incomplete");
            }

            const completedReceipt: DonationReceipt = {
              donationId: Number(verification.donationId),
              paymentId: verification.paymentId || payment.razorpay_payment_id,
              orderId: verification.orderId || payment.razorpay_order_id,
              fullName: verification.fullName || form.fullName.trim(),
              amount: Number.isFinite(Number(verification.amount)) ? Number(verification.amount) : amount,
              paidAt: verification.paidAt || new Date().toISOString(),
              pan: verification.pan || (panRequired ? normalizedPan : undefined),
              receiptToken: verification.receiptToken,
            };

            setReceipt(completedReceipt);

            if (completedReceipt.receiptToken) {
              window.localStorage.setItem(
                RECEIPT_STORAGE_KEY,
                JSON.stringify({
                  donationId: completedReceipt.donationId,
                  receiptToken: completedReceipt.receiptToken,
                })
              );
            }

            // Save plant dedication certificate details
            if (dedicationName && selectedFund === "green-fund") {
              const certData: DedicationCertificateData = {
                donationId: completedReceipt.donationId,
                paymentId: completedReceipt.paymentId,
                donorName: completedReceipt.fullName,
                dedicatedName: dedicationName,
                occasion: dedicationOccasion || "Special Occasion",
                plantCount: plantCount || 1,
                paidAt: completedReceipt.paidAt,
              };
              setDedicationData(certData);
              try {
                window.localStorage.setItem(
                  `pgp-dedication-${completedReceipt.donationId}`,
                  JSON.stringify(certData)
                );
              } catch {}
            }

            setPaymentOutcome("success");
            setSubmitMsg(null);
          } catch {
            setPaymentOutcome("pending-verification");
            setSubmitMsg({
              type: "err",
              text: isHi
                ? "भुगतान पूरा हो गया है, लेकिन पुष्टि लंबित है। कृपया दोबारा भुगतान न करें।"
                : "Payment completed, confirmation pending. Please do not pay again.",
            });
          } finally {
            setSubmitting(false);
          }
        },
      });

      checkout.open();
    } catch (error) {
      setPaymentOutcome("failed");
      setSubmitMsg({
        type: "err",
        text:
          error instanceof Error && error.message === "GREEN_FUND_DETAILS_NOT_ACCEPTED"
            ? isHi
              ? "समर्पण का विवरण सहेजा नहीं जा सका, इसलिए भुगतान शुरू नहीं किया गया। कृपया सहायता से संपर्क करें।"
              : "Your dedication details could not be saved, so payment was not started. Please contact support."
            : isHi
              ? "भुगतान शुरू नहीं हो सका। कृपया पुनः प्रयास करें।"
              : "Unable to start payment. Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative my-8 w-full max-w-[620px] rounded-[24px] bg-white p-6 sm:p-8 text-[#2D3A31] shadow-2xl border border-[#DDEEE4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-[#F0F5F2] text-[#04330B] hover:bg-[#E2EDE6] text-lg font-bold transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Success View */}
        {paymentOutcome === "success" && receipt ? (
          <div className="py-4 text-center space-y-5">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#E4F5E9] text-[36px] font-bold text-[#04330B]">
              ✓
            </div>
            <h3 className="font-['Familjen_Grotesk'] text-[26px] font-bold text-[#04330B] leading-tight">
              {isHi ? "योगदान की पुष्टि हो गई!" : "Donation Confirmed!"}
            </h3>
            <p className="text-sm text-[#587E67] max-w-md mx-auto leading-relaxed">
              {isHi
                ? `धन्यवाद! आपका ₹${Number(receipt.amount).toLocaleString("en-IN")} का स्वैच्छिक योगदान सफलतापूर्वक प्राप्त हो गया है।`
                : `Thank you! Your voluntary contribution of INR ${Number(receipt.amount).toLocaleString("en-IN")} has been verified.`}
            </p>

            <div className="rounded-xl bg-[#F6FAF7] border border-[#DCEBE2] p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="font-bold text-[#04330B]">{isHi ? "रसीद संख्या" : "Receipt No"}:</span>
                <span className="font-mono">PGP-{receipt.donationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#04330B]">{isHi ? "चुना हुआ कोष" : "Fund"}:</span>
                <span>{isHi ? currentFundInfo.title.hi : currentFundInfo.title.en}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#04330B]">{isHi ? "भुगतान आईडी" : "Payment ID"}:</span>
                <span className="font-mono text-[11px] truncate max-w-[200px]">{receipt.paymentId}</span>
              </div>
              {dedicationData && (
                <div className="flex justify-between pt-1 border-t border-[#DCEBE2] text-[#0B5A2A] font-semibold">
                  <span>{isHi ? "समर्पित नाम" : "Dedicated to"}:</span>
                  <span>{dedicationData.dedicatedName} ({dedicationData.plantCount} {isHi ? "पौधे" : "Plants"})</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              {dedicationData && (
                <button
                  type="button"
                  onClick={() => downloadDedicationCertificate(dedicationData)}
                  className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#16A34A] font-['Familjen_Grotesk'] text-[15.5px] font-bold text-white shadow-md hover:bg-[#15803D] transition-all"
                >
                  📜 {isHi ? "समर्पण प्रमाणपत्र डाउनलोड करें (PDF)" : "Download Dedication Certificate (PDF)"}
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadDonationReceipt(receipt)}
                className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#04330B] font-['Familjen_Grotesk'] text-[15.5px] font-bold text-white shadow-md hover:bg-[#064e11] transition-all"
              >
                📄 {isHi ? "दान रसीद डाउनलोड करें (PDF)" : "Download Official Receipt (PDF)"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-[12px] border border-[#C5DCCF] text-sm font-bold text-[#04330B] hover:bg-[#F9FBF9]"
              >
                {isHi ? "पूर्ण करें" : "Done"}
              </button>
            </div>
          </div>
        ) : showAuthGate ? (
          /* Auth Gate */
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#E0F2E6] text-[30px] text-[#04330B]">
              ♡
            </div>
            <h3 className="font-['Familjen_Grotesk'] text-[24px] font-bold text-[#04330B]">
              {isHi ? "दान करने से पहले जुड़ें या लॉगिन करें" : "Join or Log In Before Donating"}
            </h3>
            <p className="text-sm text-[#587E67] max-w-md mx-auto leading-relaxed">
              {isHi
                ? "सत्यापित योगदान रिकॉर्ड और अपनी रसीद प्राप्त करने के लिए पहले पार्टी से जुड़ें या अपने खाते में लॉगिन करें।"
                : "For verified contribution records and access to your receipt, please join the party or log in to your account first."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <Link
                href="/join?next=%2Fdonation"
                className="flex h-12 items-center justify-center rounded-[12px] bg-[#04330B] font-bold text-white hover:bg-[#064e11]"
              >
                {isHi ? "हमसे जुड़ें" : "Join Us"}
              </Link>
              <Link
                href="/login?next=%2Fdonation"
                className="flex h-12 items-center justify-center rounded-[12px] border border-[#04330B] font-bold text-[#04330B] hover:bg-[#F0F7F2]"
              >
                {isHi ? "लॉगिन करें" : "Log In"}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowAuthGate(false)}
              className="text-xs font-bold text-[#587E67] underline pt-2"
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
          </div>
        ) : (
          /* Main Multi-step Form */
          <div>
            {/* Header */}
            <div className="pr-8 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {isHi ? currentFundInfo.category.hi : currentFundInfo.category.en}
              </span>
              <h2 className="font-['Familjen_Grotesk'] text-[22px] sm:text-[25px] font-bold text-[#04330B] mt-2">
                {isHi ? currentFundInfo.title.hi : currentFundInfo.title.en}
              </h2>
              {dedicationName ? (
                <p className="text-xs text-[#0B5A2A] font-semibold mt-1">
                  🌿 {isHi ? "समर्पण" : "Dedication"}: {dedicationName} · {plantCount} {isHi ? "पौधे" : "Plant(s)"} ({dedicationOccasion})
                </p>
              ) : (
                <p className="text-xs text-[#587E67] mt-1">
                  {isHi ? "स्वैच्छिक राजनीतिक व सामाजिक योगदान" : "Voluntary political and civic contribution"}
                </p>
              )}
            </div>

            {/* Stepper indicator */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                    formStep >= 1 ? "bg-[#04330B] text-white" : "border border-[#B9D3C4] text-[#587E67]"
                  }`}
                >
                  {formStep === 2 ? "✓" : "1"}
                </span>
                <span className="text-xs font-bold text-[#04330B]">
                  {isHi ? "विवरण सत्यापित करें" : "Your Details"}
                </span>
              </div>
              <span className={`h-px w-8 ${formStep === 2 ? "bg-[#04330B]" : "bg-[#B9D3C4]"}`} />
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                    formStep === 2 ? "bg-[#04330B] text-white" : "border border-[#B9D3C4] text-[#789080]"
                  }`}
                >
                  2
                </span>
                <span className={`text-xs font-bold ${formStep === 2 ? "text-[#04330B]" : "text-[#789080]"}`}>
                  {isHi ? "योगदान करें" : "Contribution"}
                </span>
              </div>
            </div>

            {submitMsg && (
              <p
                className={`mb-4 text-xs font-semibold rounded-lg px-3 py-2 ${
                  submitMsg.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                }`}
              >
                {submitMsg.text}
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* STEP 1 */}
              {formStep === 1 ? (
                <>
                  {/* Fund Selector if not fixed */}
                  <div className="space-y-1.5">
                    <FormFieldLabel className="text-xs font-bold text-[#04330B]">
                      {isHi ? "कोष का चयन करें" : "Select Fund Subdivision"}
                    </FormFieldLabel>
                    <select
                      value={selectedFund}
                      onChange={(e) => setSelectedFund(e.target.value as FundId)}
                      className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-semibold text-[#04330B] bg-white focus:outline-none focus:border-[#04330B]"
                    >
                      <option value="peoples-green-fund">
                        {isHi ? "पीपुल्स ग्रीन फंड (राजनीतिक संगठन)" : "People's Green Fund (Political Organisation)"}
                      </option>
                      <option value="green-fund">
                        {isHi ? "ग्रीन फंड (महान हरित दीवार मिशन)" : "Green Fund (Great Green Wall Mission)"}
                      </option>
                      <option value="democracy-fund">
                        {isHi ? "लोकतंत्र फंड (संवैधानिक अधिकार)" : "Democracy Fund (Constitutional Rights)"}
                      </option>
                    </select>
                  </div>

                  {/* Indian Citizen */}
                  <fieldset className="space-y-1">
                    <legend className="text-xs font-bold text-[#04330B]">
                      {isHi ? "क्या आप भारतीय नागरिक हैं?" : "Are you an Indian citizen?"}
                      <RequiredMark />
                    </legend>
                    <div className="flex gap-5 pt-1">
                      {(["yes", "no"] as const).map((choice) => (
                        <label key={choice} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium">
                          <input
                            type="radio"
                            name="modal-citizen"
                            value={choice}
                            checked={form.citizen === choice}
                            onChange={() => setField("citizen", choice)}
                            className="size-4 accent-[#04330B]"
                          />
                          {choice === "yes" ? (isHi ? "हाँ" : "Yes") : isHi ? "नहीं" : "No"}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Name */}
                  <div className="space-y-1">
                    <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "पूरा नाम" : "Full Name"}
                    </FormFieldLabel>
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      placeholder={isHi ? "पूरा नाम" : "Full Name"}
                      className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "मोबाइल नंबर" : "Mobile Number"}
                    </FormFieldLabel>
                    <div className="flex gap-2">
                      <div className="w-14 h-11 rounded-lg border border-[#C5DCCF] flex items-center justify-center font-bold text-xs text-[#587E67] bg-[#F9FBF9]">
                        +91
                      </div>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="flex-1 h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "पता" : "Address"}
                    </FormFieldLabel>
                    <input
                      required
                      type="text"
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder={isHi ? "मकान / गली / इलाका" : "Street address"}
                      className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                    />
                  </div>

                  {/* State, City, PIN */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "राज्य" : "State"}
                      </FormFieldLabel>
                      <input
                        required
                        type="text"
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                        placeholder="State"
                        className="w-full h-10 rounded-lg border border-[#C5DCCF] px-2.5 text-xs font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "शहर" : "City"}
                      </FormFieldLabel>
                      <input
                        required
                        type="text"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="City"
                        className="w-full h-10 rounded-lg border border-[#C5DCCF] px-2.5 text-xs font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "पिन कोड" : "PIN"}
                      </FormFieldLabel>
                      <input
                        required
                        type="text"
                        value={form.pincode}
                        onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="6 digits"
                        maxLength={6}
                        className="w-full h-10 rounded-lg border border-[#C5DCCF] px-2.5 text-xs font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToContributionStep}
                    className="mt-3 h-12 w-full rounded-xl bg-[#04330B] font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md hover:bg-[#064e11] transition-all"
                  >
                    {isHi ? "आगे बढ़ें →" : "Continue →"}
                  </button>
                </>
              ) : (
                /* STEP 2 */
                <>
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "योगदान राशि (₹)" : "Contribution Amount (₹)"}
                    </FormFieldLabel>
                    {!defaultAmount && (
                      <div className="grid grid-cols-4 gap-2 pb-1">
                        {DONATION_PRESET_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setField("amount", String(val))}
                            className={`h-9 rounded-lg border text-xs font-bold transition-colors ${
                              form.amount === String(val)
                                ? "bg-[#04330B] text-white border-[#04330B]"
                                : "border-[#C5DCCF] text-[#04330B] hover:bg-[#F0F7F2]"
                            }`}
                          >
                            ₹{val.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      required
                      type="number"
                      min={MIN_DONATION_AMOUNT}
                      value={form.amount}
                      onChange={(e) => setField("amount", e.target.value)}
                      placeholder="Amount in ₹"
                      className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-base font-bold text-[#04330B] focus:outline-none focus:border-[#04330B]"
                    />
                  </div>

                  {/* Tax doc */}
                  <label className="flex items-start gap-2 cursor-pointer text-xs font-medium text-[#2D3A31]">
                    <input
                      type="checkbox"
                      checked={wantsTaxDocumentation}
                      onChange={(e) => setWantsTaxDocumentation(e.target.checked)}
                      className="mt-0.5 size-4 accent-[#04330B]"
                    />
                    <span>{isHi ? "मुझे कर कटौती दस्तावेज (80GGC) चाहिए" : "I need tax deduction documentation"}</span>
                  </label>

                  {/* PAN if required */}
                  {panRequired && (
                    <div className="space-y-1">
                      <FormFieldLabel required className="text-xs font-bold text-[#04330B]">
                        PAN
                      </FormFieldLabel>
                      <input
                        required
                        type="text"
                        value={form.pan}
                        onChange={(e) =>
                          setField("pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))
                        }
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-bold uppercase tracking-wider text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                  )}

                  {/* Declarations */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDeclared}
                        onChange={(e) => setIsDeclared(e.target.checked)}
                        className="mt-0.5 size-4 accent-[#BE1E2D]"
                      />
                      <span className="text-[12px] leading-snug text-[#587E67]">
                        {isHi
                          ? "मैं पुष्टि करता/करती हूँ कि मैं भारतीय नागरिक हूँ और दी गई जानकारी सत्य है।"
                          : "I confirm that I am an Indian citizen and the information provided is correct."}
                        <RequiredMark />
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedPolicies}
                        onChange={(e) => setAcceptedPolicies(e.target.checked)}
                        className="mt-0.5 size-4 accent-[#BE1E2D]"
                      />
                      <span className="text-[12px] leading-snug text-[#587E67]">
                        {isHi ? "मैंने " : "I agree to "}
                        <Link href="/terms-and-conditions" target="_blank" className="font-bold underline text-[#0D5229]">
                          {isHi ? "नियम और शर्तें" : "Terms & Conditions"}
                        </Link>{" "}
                        {isHi ? "तथा " : "and "}
                        <Link href="/refund-cancellation-policy" target="_blank" className="font-bold underline text-[#0D5229]">
                          {isHi ? "रिफंड नीति" : "Refund Policy"}
                        </Link>
                        .<RequiredMark />
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-[1fr_2fr] gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="h-12 rounded-xl border border-[#04330B] font-bold text-sm text-[#04330B] hover:bg-[#F0F7F2]"
                    >
                      {isHi ? "← पीछे" : "← Back"}
                    </button>
                    <button
                      type="submit"
                      disabled={!isDeclared || !acceptedPolicies || submitting}
                      className={`h-12 rounded-xl font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md transition-all ${
                        isDeclared && acceptedPolicies && !submitting
                          ? "bg-[#04330B] hover:bg-[#064e11] active:scale-[0.98]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {submitting
                        ? isHi
                          ? "भुगतान खोला जा रहा है…"
                          : "Opening payment…"
                        : isHi
                        ? "दान के लिए आगे बढ़ें →"
                        : "Proceed to Donate →"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
