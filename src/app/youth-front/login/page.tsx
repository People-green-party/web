"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../components/LanguageContext";
import { PortalLoginScreen } from "../../../components/PortalLoginScreen";
import { fetchApi } from "../../../lib/api";
import { setPortalToken } from "../../../lib/portalAuth";
import { completeOtpLogin } from "../../../lib/completeOtpLogin";

export default function YouthOtpLogin() {
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
  const sanitize = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const sendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); setInfo("");
    const clean = sanitize(phone);
    if (clean.length !== 10) { setError(isHi ? "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number."); return; }
    setLoading(true);
    try {
      const phoneNumber = `+91${clean}`;
      const check = await fetchApi("users/check-phone", { method: "POST", body: JSON.stringify({ phone: phoneNumber }) });
      if (!check?.exists || !check?.portals?.youth) {
        setError(isHi ? "यह नंबर जिंदा यूथ सदस्य के रूप में पंजीकृत नहीं है।" : "This number is not registered as a Zinda Youth member.");
        return;
      }
      const { isAuthDevMode } = await import("../../../lib/authDevMode");
      if (isAuthDevMode()) {
        setOtpSimulated(true); setStep("otp"); setInfo(isHi ? "डेवलपमेंट OTP: 123456" : "Development OTP: 123456"); return;
      }
      const { supabase } = await import("../../../lib/supabaseClient");
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStep("otp"); setInfo(isHi ? `OTP आपके पंजीकृत मोबाइल नंबर +91 ${clean.slice(0, 5)} ${clean.slice(5)} पर भेज दिया गया है।` : `OTP has been sent to your registered mobile number +91 ${clean.slice(0, 5)} ${clean.slice(5)}.`);
    } catch (err: any) {
      setError(err?.message || (isHi ? "OTP भेजा नहीं जा सका।" : "Could not send OTP."));
    } finally { setLoading(false); }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) { setError(isHi ? "कृपया 6 अंकों का OTP दर्ज करें।" : "Please enter the 6-digit OTP."); return; }
    setLoading(true);
    try {
      const phoneNumber = `+91${sanitize(phone)}`;
      const { isAuthDevMode } = await import("../../../lib/authDevMode");
      let result: any;
      if (otpSimulated && isAuthDevMode()) {
        if (otp !== "123456") throw new Error(isHi ? "OTP गलत है।" : "Invalid OTP.");
        result = await fetchApi("users/login-otp", { method: "POST", body: JSON.stringify({ phone: phoneNumber }) });
      } else {
        const { supabase } = await import("../../../lib/supabaseClient");
        const { data, error: verifyError } = await supabase.auth.verifyOtp({ phone: phoneNumber, token: otp, type: "sms" });
        if (verifyError) throw verifyError;
        const token = data.session?.access_token;
        if (!token) throw new Error(isHi ? "OTP सत्र नहीं मिला।" : "OTP session was not created.");
        result = await completeOtpLogin(phoneNumber, token);
      }
      if (!result?.access_token) throw new Error(isHi ? "लॉगिन नहीं हो सका।" : "Login could not be completed.");
      setPortalToken("youth", result.access_token);
      router.push("/youth-front/my-dashboard");
    } catch (err: any) { setError(err?.message || (isHi ? "OTP सत्यापन विफल रहा।" : "OTP verification failed.")); }
    finally { setLoading(false); }
  };

  return <PortalLoginScreen variant="youth" language={language} step={step} phone={phone} otp={otp} loading={loading} error={error} info={info} sendLabel={isHi ? "OTP भेजें" : "Send OTP"} sendingLabel={isHi ? "भेज रहे हैं…" : "Sending…"} verifyLabel={isHi ? "OTP सत्यापित करें और लॉगिन करें" : "Verify OTP & Login"} verifyingLabel={isHi ? "सत्यापित कर रहे हैं…" : "Verifying…"} onPhoneChange={(value) => setPhone(sanitize(value))} onOtpChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))} onSend={sendOtp} onVerify={verifyOtp} onChangeNumber={() => { setStep("phone"); setOtp(""); setError(""); setInfo(""); }} joinHref="/youth-front/join" />;
}
