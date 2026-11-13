"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { useLanguage } from "../../../components/LanguageContext";
import { fetchApi } from "../../../lib/api";
import {
  isVerifiedCcavenueTerminalStatus, parseCcavenueResultFragment, parseCcavenueStatus,
  readCcavenueResultReference, saveCcavenueResultReference,
  type CcavenueResultReference, type CcavenueStatus,
} from "../../../lib/ccavenueCheckout";
import { clearUnresolvedDonationAttempt, DONATION_ATTEMPT_CHANGED_EVENT } from "../../../lib/donationPayment";
import { downloadDonationReceipt, RECEIPT_STORAGE_KEY } from "../../../lib/donationReceipt";
import { downloadDedicationCertificate } from "../../../lib/dedicationCertificate";
import { dedicationFromVerifiedReceipt } from "../../../lib/donationDedication";
import { SITE_DETAILS } from "../../../lib/siteDetails";

export default function DonationPaymentResultPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [reference, setReference] = useState<CcavenueResultReference | null>(null);
  const [result, setResult] = useState<CcavenueStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const controller = useRef<AbortController | null>(null);

  const checkStatus = useCallback(async (current: CcavenueResultReference) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    setError(false);
    const request = new AbortController();
    controller.current = request;
    const timeout = window.setTimeout(() => request.abort(), 15_000);
    try {
      const response = await fetchApi("donations/ccavenue/status", {
        method: "POST", body: JSON.stringify(current), skipAuth: true,
        cache: "no-store", suppressErrorLog: true, signal: request.signal,
      });
      if (!mounted.current || request.signal.aborted) return;
      const checked = parseCcavenueStatus(response, current);
      setResult(checked);
      if (isVerifiedCcavenueTerminalStatus(checked)) {
        try {
          clearUnresolvedDonationAttempt(window.sessionStorage, current.token);
          window.dispatchEvent(new Event(DONATION_ATTEMPT_CHANGED_EVENT));
        } catch { /* A browser-storage failure cannot undo a verified result. */ }
      }
      if (checked.receipt) {
        try {
          window.localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify({
            donationId: checked.receipt.donationId, receiptToken: checked.receipt.receiptToken,
          }));
        } catch { /* Keep the verified receipt available in memory. */ }
      }
    } catch {
      if (mounted.current && controller.current === request) setError(true);
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
      if (mounted.current && controller.current === request) setChecking(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    const initialize = async () => {
      // Deferring also avoids consuming a return fragment during a discarded mount.
      await Promise.resolve();
      if (!active) return;
      try {
        const fragment = window.location.hash;
        // Remove the bearer reference before making a request or rendering it.
        if (fragment) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        const current = fragment
          ? parseCcavenueResultFragment(fragment)
          : readCcavenueResultReference(window.sessionStorage);
        if (!current) throw new Error("No payment reference");
        setReference(current);
        try { saveCcavenueResultReference(window.sessionStorage, current); } catch {}
        await checkStatus(current);
      } catch {
        if (active) { setError(true); setChecking(false); }
      }
    };
    void initialize();
    return () => {
      active = false;
      mounted.current = false;
      controller.current?.abort();
    };
  }, [checkStatus]);

  const terminal = result && isVerifiedCcavenueTerminalStatus(result);
  const successful = terminal && result.status === "successful";
  const testSuccess = successful && result.testMode;
  const receipt = successful && !result.testMode ? result.receipt : undefined;
  const dedication = dedicationFromVerifiedReceipt(receipt);
  const handleDownload = async (download: () => unknown) => {
    setDownloadError(false);
    try { await download(); }
    catch { setDownloadError(true); }
  };

  const title = checking
    ? isHi ? "भुगतान की स्थिति जाँची जा रही है" : "Checking payment status"
    : error ? isHi ? "भुगतान की पुष्टि नहीं हो सकी" : "Payment could not be confirmed"
      : testSuccess ? isHi ? "परीक्षण भुगतान सफल" : "Simulated test payment succeeded"
        : receipt ? isHi ? "योगदान की पुष्टि हो गई है" : "Contribution verified"
          : terminal && result.status === "failed" ? isHi ? "भुगतान असफल रहा" : "Payment failed"
            : terminal && result.status === "cancelled" ? isHi ? "भुगतान रद्द हुआ" : "Payment cancelled"
              : isHi ? "भुगतान की पुष्टि लंबित है" : "Payment confirmation pending";
  const message = checking
    ? isHi ? "सर्वर से वास्तविक भुगतान स्थिति की पुष्टि की जा रही है। कृपया दोबारा भुगतान न करें।" : "Checking the actual payment state with the server. Please do not pay again."
    : error ? isHi ? "अभी परिणाम की पुष्टि नहीं की जा सकी। कृपया स्थिति फिर से जाँचें या सहायता से संपर्क करें। जाँच होने तक दोबारा भुगतान न करें।" : "The outcome could not be confirmed. Check the status again or contact support. Do not pay again until this attempt has been checked."
      : testSuccess ? isHi ? "यह केवल अनुकरण किया गया परीक्षण था। कोई वास्तविक दान प्राप्त नहीं हुआ है और कोई दान रसीद या समर्पण प्रमाणपत्र जारी नहीं हुआ है।" : "This was a simulated test only. No real donation was received, and no donation receipt or dedication certificate was issued."
        : receipt ? isHi ? "आपके सत्यापित योगदान के लिए धन्यवाद। रसीद नीचे उपलब्ध है।" : "Thank you for your verified contribution. Your receipt is available below."
          : terminal ? isHi ? "सर्वर ने इस प्रयास की अंतिम स्थिति की पुष्टि की है। कोई योगदान रसीद जारी नहीं की गई है। यदि खाते से राशि कटी है, तो इस संदर्भ के साथ सहायता से संपर्क करें।" : "The server has verified the final state of this attempt. No contribution receipt has been issued. If your account was debited, contact support with this reference."
            : isHi ? "अभी भुगतान का अंतिम परिणाम प्राप्त नहीं हुआ है। कृपया दोबारा भुगतान न करें। इसी प्रयास की स्थिति फिर से जाँचें।" : "A final payment result is not available yet. Please do not pay again. Check this same attempt’s status again.";

  return (
    <div className="min-h-screen bg-[#F5F9F6] pt-[90px] text-[#04330B] lg:pt-[112px]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <section className="rounded-3xl border border-[#DDEEE4] bg-white p-6 shadow-sm sm:p-10" aria-labelledby="payment-result-heading">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">{isHi ? "योगदान की स्थिति" : "Contribution status"}</p>
          <div role="status" aria-live="polite" aria-atomic="true">
            <h1 id="payment-result-heading" className="text-3xl font-bold">{title}</h1>
            <p className="mt-4 leading-relaxed text-[#365341]">{message}</p>
          </div>
          {reference ? <p className="mt-5 break-all text-sm">{isHi ? "ऑर्डर संदर्भ" : "Order reference"}: <span className="font-mono">{reference.orderId}</span></p> : null}
          {receipt ? <>
            <dl className="mt-6 grid gap-4 rounded-2xl bg-[#F5F9F6] p-5 sm:grid-cols-2">
              <div><dt className="text-sm">{isHi ? "रसीद संख्या" : "Receipt number"}</dt><dd className="font-bold">PGP-{receipt.donationId}</dd></div>
              <div><dt className="text-sm">{isHi ? "राशि" : "Amount"}</dt><dd className="font-bold">₹{receipt.amount.toLocaleString("en-IN")}</dd></div>
              <div><dt className="text-sm">{isHi ? "योगदानकर्ता" : "Contributor"}</dt><dd className="font-bold">{receipt.fullName}</dd></div>
              <div><dt className="text-sm">{isHi ? "भुगतान दिनांक" : "Payment date"}</dt><dd className="font-bold">{new Date(receipt.paidAt).toLocaleString(isHi ? "hi-IN" : "en-IN")}</dd></div>
            </dl>
            <button className="mt-6 rounded-xl bg-[#04330B] px-5 py-3 font-bold text-white" type="button" onClick={() => void handleDownload(() => downloadDonationReceipt(receipt))}>{isHi ? "रसीद डाउनलोड करें (PDF)" : "Download receipt (PDF)"}</button>
            {dedication ? <button className="mt-3 ml-0 rounded-xl border border-[#04330B] px-5 py-3 font-bold sm:ml-3" type="button" onClick={() => void handleDownload(() => downloadDedicationCertificate(dedication))}>{isHi ? "समर्पण प्रमाणपत्र डाउनलोड करें" : "Download dedication certificate"}</button> : null}
            {downloadError ? <p role="alert" className="mt-4 text-sm text-red-700">{isHi ? "PDF डाउनलोड नहीं हो सका। आपका योगदान सत्यापित है। कृपया डाउनलोड फिर से प्रयास करें या सहायता से संपर्क करें।" : "The PDF could not be downloaded. Your contribution remains verified. Please try the download again or contact support."}</p> : null}
          </> : null}
          {reference && !terminal ? <button className="mt-6 rounded-xl bg-[#04330B] px-5 py-3 font-bold text-white disabled:opacity-50" type="button" disabled={checking} onClick={() => void checkStatus(reference)}>{isHi ? "स्थिति फिर से जाँचें" : "Check status again"}</button> : null}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a href={`mailto:${SITE_DETAILS.email}`} className="underline">{isHi ? "सहायता से संपर्क करें" : "Contact support"}</a>
            <Link href="/" className="underline">{isHi ? "मुख्य पृष्ठ" : "Home"}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
