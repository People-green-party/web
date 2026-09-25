"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalLoginScreen } from "@/components/PortalLoginScreen";
import { fetchApi } from "@/lib/api";
import { clearInternSession, setInternSession } from "@/lib/internApi";

function InternOtpLogin() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otpSimulated, setOtpSimulated] = useState(false);

  useEffect(() => clearInternSession(), []);

  const sanitize = (value: string) => value.replace(/\D/g, "").slice(0, 10);
  const landingFor = (application?: { status?: string }) =>
    application?.status === "accepted" ? "/internship/dashboard" : "/internship/application-status";

  const sendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setInfo("");
    const cleanPhone = sanitize(phone);
    if (cleanPhone.length !== 10) {
      setError(isHi ? "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const lookup = await fetchApi("internship/applications/status", { method: "POST", body: JSON.stringify({ phone: cleanPhone }) });
      if (!lookup?.found) {
        setError(isHi ? "इस मोबाइल नंबर पर कोई इंटर्नशिप आवेदन नहीं मिला।" : "No internship application was found for this mobile number.");
        return;
      }
      const { isAuthDevMode } = await import("@/lib/authDevMode");
      if (isAuthDevMode()) {
        setOtpSimulated(true);
        setStep("otp");
        setInfo(isHi ? "डेवलपमेंट OTP: 123456" : "Development OTP: 123456");
        return;
      }
      const { supabase } = await import("@/lib/supabaseClient");
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: `+91${cleanPhone}`,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStep("otp");
      setInfo(isHi ? `OTP आपके पंजीकृत मोबाइल नंबर +91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)} पर भेज दिया गया है।` : `OTP has been sent to your registered mobile number +91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}.`);
    } catch (err: any) {
      setError(err?.message || (isHi ? "OTP भेजा नहीं जा सका। कृपया दोबारा कोशिश करें।" : "Could not send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError(isHi ? "कृपया 6 अंकों का OTP दर्ज करें।" : "Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = sanitize(phone);
      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const headers: Record<string, string> = {};
      if (otpSimulated && isAuthDevMode()) {
        if (otp !== "123456") throw new Error(isHi ? "OTP गलत है।" : "Invalid OTP.");
      } else {
        const { supabase } = await import("@/lib/supabaseClient");
        const { data, error: verifyError } = await supabase.auth.verifyOtp({ phone: `+91${cleanPhone}`, token: otp, type: "sms" });
        if (verifyError) throw verifyError;
        const accessToken = data.session?.access_token;
        if (!accessToken) throw new Error(isHi ? "OTP सत्र नहीं मिला।" : "OTP session was not created.");
        headers.Authorization = `Bearer ${accessToken}`;
      }
      const result = await fetchApi("internship/login-otp", { method: "POST", headers, body: JSON.stringify({ phone: cleanPhone }) });
      if (!result?.access_token) throw new Error(isHi ? "लॉगिन नहीं हो सका।" : "Login could not be completed.");
      setInternSession(result.access_token, result.application);
      router.push(landingFor(result.application));
    } catch (err: any) {
      setError(err?.message || (isHi ? "OTP सत्यापन विफल रहा।" : "OTP verification failed."));
    } finally {
      setLoading(false);
    }
  };

  return <PortalLoginScreen variant="internship" language={language} step={step} phone={phone} otp={otp} loading={loading} error={error} info={info} sendLabel={isHi ? "OTP भेजें" : "Send OTP"} sendingLabel={isHi ? "भेज रहे हैं…" : "Sending…"} verifyLabel={isHi ? "OTP सत्यापित करें और लॉगिन करें" : "Verify OTP & Login"} verifyingLabel={isHi ? "सत्यापित कर रहे हैं…" : "Verifying…"} onPhoneChange={(value) => setPhone(sanitize(value))} onOtpChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))} onSend={sendOtp} onVerify={verifyOtp} onChangeNumber={() => { setStep("phone"); setOtp(""); setError(""); setInfo(""); }} joinHref="/internship/apply" />;
}

export default function InternshipStatusPage() {
  return <Suspense fallback={null}><InternOtpLogin /></Suspense>;
}
