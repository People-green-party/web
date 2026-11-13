"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../LanguageContext";
import { ApiRequestError, fetchApi } from "../../lib/api";
import { FormFieldLabel, RequiredMark } from "../FormFieldLabel";
import { DonationPaymentNotice } from "./DonationPaymentNotice";
import { useDonationPaymentConfig } from "./useDonationPaymentConfig";
import { DonationAttemptNotice, useDonationAttemptGuard } from "./DonationAttemptGuard";
import { donationAmountErrorMessage, getDonationPaymentAttempt, paymentInitiationUncertainMessage, validateDonationPaymentAmount, type DonationPaymentAttempt } from "../../lib/donationPayment";
import { parseCcavenueOrder, saveCcavenueResultReference, submitCcavenueCheckout } from "../../lib/ccavenueCheckout";
import {
  DONATION_PRESET_AMOUNTS,
} from "../../lib/siteDetails";
import { FundId, FUNDS_DATA } from "../../data/fundsData";

type PaymentOutcome = "idle" | "cancelled" | "failed" | "pending-verification" | "test-success" | "success";

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
  const payment = useDonationPaymentConfig();
  const attemptGuard = useDonationAttemptGuard();
  const paymentAttempt = useRef<DonationPaymentAttempt | null>(null);
  const submissionInFlight = useRef(false);

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [selectedFund, setSelectedFund] = useState<FundId>(plantCount !== undefined ? "green-fund" : defaultFund);
  const [isDeclared, setIsDeclared] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [wantsTaxDocumentation, setWantsTaxDocumentation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [paymentOutcome, setPaymentOutcome] = useState<PaymentOutcome>("idle");

  const [form, setForm] = useState({
    citizen: "" as "" | "yes" | "no",
    fullName: "",
    phone: "",
    pan: "",
    amount: plantCount !== undefined ? String(plantCount * 1500) : defaultAmount ? String(defaultAmount) : "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [previousDefaults, setPreviousDefaults] = useState({ defaultFund, defaultAmount, plantCount });
  // Adjust only fields controlled by changed defaults, preserving donor input.
  if (previousDefaults.defaultFund !== defaultFund || previousDefaults.defaultAmount !== defaultAmount || previousDefaults.plantCount !== plantCount) {
    setPreviousDefaults({ defaultFund, defaultAmount, plantCount });
    if (previousDefaults.defaultFund !== defaultFund || previousDefaults.plantCount !== plantCount) {
      setSelectedFund(plantCount !== undefined ? "green-fund" : defaultFund);
    }
    if ((previousDefaults.defaultAmount !== defaultAmount || previousDefaults.plantCount !== plantCount) && (plantCount !== undefined || defaultAmount)) {
      setForm((prev) => ({ ...prev, amount: String(plantCount !== undefined ? plantCount * 1500 : defaultAmount) }));
    }
  }

  if (!isOpen) return null;

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const panRequired = Number(form.amount) > 20000 || wantsTaxDocumentation;
  const currentFundInfo = FUNDS_DATA[selectedFund];

  const goToContributionStep = () => {
    if (submissionInFlight.current || attemptGuard.blocked || paymentOutcome === "pending-verification") return;
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


    setFormStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionInFlight.current || attemptGuard.blocked || paymentOutcome === "pending-verification") return;
    const attemptConfig = payment.config ? { ...payment.config } : null;
    if (!payment.canPay || !attemptConfig) {
      setSubmitMsg({ type: "err", text: donationAmountErrorMessage("unavailable", payment.config, isHi) });
      return;
    }
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

    const amountError = validateDonationPaymentAmount(amount, attemptConfig);
    if (amountError) {
      setSubmitMsg({ type: "err", text: donationAmountErrorMessage(amountError, payment.config, isHi) });
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

    submissionInFlight.current = true;
    setSubmitting(true);
    let checkoutLoaded = false;
    let orderRequestStarted = false;
    let attemptKey: string | undefined;
    try {
      checkoutLoaded = true;
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

      // Retain this key after an uncertain response; a retry must reuse its order.
      paymentAttempt.current = getDonationPaymentAttempt(fullDonationPayload, paymentAttempt.current);
      attemptKey = paymentAttempt.current.key;
      attemptGuard.begin(attemptKey);
      orderRequestStarted = true;

      const response = await fetchApi("donations/ccavenue/order", {
        method: "POST",
        skipAuth: true,
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ ...fullDonationPayload, paymentAttemptKey: attemptKey }),
        cache: "no-store",
      });
      const order = parseCcavenueOrder(response, attemptConfig.environment, attemptKey);
      attemptGuard.update(attemptKey, { provider: "ccavenue", donationId: order.donationId, orderId: order.orderId });
      saveCcavenueResultReference(window.sessionStorage, { orderId: order.orderId, token: order.statusToken });
      setPaymentOutcome("pending-verification");
      setSubmitMsg({ type: "ok", text: isHi ? "CCAvenue की सुरक्षित भुगतान वेबसाइट पर ले जाया जा रहा है…" : "Opening CCAvenue’s secure payment website…" });
      submitCcavenueCheckout(order);
      submissionInFlight.current = false;
      setSubmitting(false);
      return;
    } catch (error) {
      const safeValidationFailure = orderRequestStarted && error instanceof ApiRequestError && error.status === 400;
      if (safeValidationFailure && attemptKey) attemptGuard.resolve(attemptKey);
      const uncertain = checkoutLoaded && !safeValidationFailure;
      setPaymentOutcome(uncertain ? "pending-verification" : "failed");
      setSubmitMsg({
        type: "err",
        text: uncertain ? paymentInitiationUncertainMessage(isHi)
          : safeValidationFailure && error instanceof Error ? error.message
            : isHi ? "सुरक्षित भुगतान विंडो लोड नहीं हुई। कोई भुगतान शुरू नहीं हुआ है। कृपया फिर से प्रयास करें।"
              : "Secure checkout could not load. No payment was initiated. Please try again.",
      });
      submissionInFlight.current = false;
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

        {/* Verified results and receipts are rendered on the CCAvenue result page. */}
        {/* Main Multi-step Form: donor details do not require an account. */}
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
                  🌿 {isHi ? "समर्पण" : "Dedication"}: {dedicationName} · {plantCount} {isHi ? "पेड़" : "Plant(s)"} ({dedicationOccasion})
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
                role="alert"
                aria-live="polite"
                className={`mb-4 text-xs font-semibold rounded-lg px-3 py-2 ${
                  submitMsg.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
                }`}
              >
                {submitMsg.text}
              </p>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <DonationPaymentNotice id="donation-modal-payment-status" isHi={isHi} payment={payment} busy={submitting} />
              <DonationAttemptNotice guard={attemptGuard} isHi={isHi} busy={submitting} />
              {/* STEP 1 */}
              {formStep === 1 ? (
                <>
                  {/* Fund Selector if not fixed */}
                  <div className="space-y-1.5">
                    <FormFieldLabel htmlFor="donation-modal-fund" className="text-xs font-bold text-[#04330B]">
                      {isHi ? "कोष का चयन करें" : "Select Fund Subdivision"}
                    </FormFieldLabel>
                    <select
                      id="donation-modal-fund"
                      disabled={plantCount !== undefined}
                      value={selectedFund}
                      onChange={(e) => setSelectedFund(e.target.value as FundId)}
                      className="w-full h-11 rounded-lg border border-[#C5DCCF] px-3 text-sm font-semibold text-[#04330B] bg-white focus:outline-none focus:border-[#04330B]"
                    >
                      <option value="peoples-green-fund">
                        {isHi ? "पीपुल्स ग्रीन फंड (राजनीतिक संगठन)" : "People's Green Fund (Political Organisation)"}
                      </option>
                      <option value="green-fund">
                        {isHi ? "ग्रीन फंड (Great Green Wall Mission)" : "Green Fund (Great Green Wall Mission)"}
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
                    <FormFieldLabel htmlFor="donation-modal-name" required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "पूरा नाम" : "Full Name"}
                    </FormFieldLabel>
                    <input
                      id="donation-modal-name"
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
                    <FormFieldLabel htmlFor="donation-modal-mobile" required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "मोबाइल नंबर" : "Mobile Number"}
                    </FormFieldLabel>
                    <div className="flex gap-2">
                      <div className="w-14 h-11 rounded-lg border border-[#C5DCCF] flex items-center justify-center font-bold text-xs text-[#587E67] bg-[#F9FBF9]">
                        +91
                      </div>
                      <input
                        id="donation-modal-mobile"
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
                    <FormFieldLabel htmlFor="donation-modal-address" required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "पता" : "Address"}
                    </FormFieldLabel>
                    <input
                      id="donation-modal-address"
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
                      <FormFieldLabel htmlFor="donation-modal-state" required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "राज्य" : "State"}
                      </FormFieldLabel>
                      <input
                        id="donation-modal-state"
                        required
                        type="text"
                        value={form.state}
                        onChange={(e) => setField("state", e.target.value)}
                        placeholder="State"
                        className="w-full h-10 rounded-lg border border-[#C5DCCF] px-2.5 text-xs font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <FormFieldLabel htmlFor="donation-modal-city" required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "शहर" : "City"}
                      </FormFieldLabel>
                      <input
                        id="donation-modal-city"
                        required
                        type="text"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="City"
                        className="w-full h-10 rounded-lg border border-[#C5DCCF] px-2.5 text-xs font-medium text-[#04330B] focus:outline-none focus:border-[#04330B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <FormFieldLabel htmlFor="donation-modal-pincode" required className="text-xs font-bold text-[#04330B]">
                        {isHi ? "पिन कोड" : "PIN"}
                      </FormFieldLabel>
                      <input
                        id="donation-modal-pincode"
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
                    <FormFieldLabel htmlFor="donation-modal-amount" required className="text-xs font-bold text-[#04330B]">
                      {isHi ? "योगदान राशि (₹)" : "Contribution Amount (₹)"}
                    </FormFieldLabel>
                    {!defaultAmount && plantCount === undefined && (
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
                      id="donation-modal-amount"
                      required
                      type="number"
                      readOnly={plantCount !== undefined}
                      min={payment.config?.limitsConfirmed ? payment.config.minAmount ?? undefined : undefined}
                      max={payment.config?.limitsConfirmed ? payment.config.maxAmount ?? undefined : undefined}
                      step="1"
                      aria-describedby="donation-modal-payment-status"
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
                      <FormFieldLabel htmlFor="donation-modal-pan" required className="text-xs font-bold text-[#04330B]">
                        PAN
                      </FormFieldLabel>
                      <input
                        id="donation-modal-pan"
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
                  <p className="text-xs text-[#587E67]">
                    <Link href="/privacy-policy" target="_blank" className="font-bold underline text-[#0D5229]">
                      {isHi ? "गोपनीयता नीति पढ़ें" : "Read the Privacy Policy"}
                    </Link>
                  </p>
                  <div className="grid grid-cols-[1fr_2fr] gap-3 pt-2">
                    <button
                      type="button"
                      disabled={submitting || attemptGuard.blocked || paymentOutcome === "pending-verification"}
                      onClick={() => setFormStep(1)}
                      className="h-12 rounded-xl border border-[#04330B] font-bold text-sm text-[#04330B] hover:bg-[#F0F7F2]"
                    >
                      {isHi ? "← पीछे" : "← Back"}
                    </button>
                    <button
                      type="submit"
                      aria-describedby="donation-modal-payment-status"
                      disabled={!payment.canPay || attemptGuard.blocked || !isDeclared || !acceptedPolicies || form.citizen !== "yes" || submitting || paymentOutcome === "pending-verification"}
                      className={`h-12 rounded-xl font-['Familjen_Grotesk'] text-[16px] font-bold text-white shadow-md transition-all ${
                        payment.canPay && !attemptGuard.blocked && isDeclared && acceptedPolicies && form.citizen === "yes" && !submitting && paymentOutcome !== "pending-verification"
                          ? "bg-[#04330B] hover:bg-[#064e11] active:scale-[0.98]"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {submitting
                        ? isHi
                          ? "भुगतान खोला जा रहा है…"
                          : "Opening payment…"
                        : payment.status === "loading"
                          ? isHi ? "उपलब्धता जाँची जा रही है…" : "Checking availability…"
                          : !payment.canPay
                            ? isHi ? "भुगतान अभी उपलब्ध नहीं है" : "Payments unavailable"
                            : isHi ? "दान के लिए आगे बढ़ें →" : "Proceed to Donate →"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
      </div>
    </div>
  );
}
