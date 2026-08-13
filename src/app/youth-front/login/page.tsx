"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { FormFieldLabel } from "../../../components/FormFieldLabel";

type Mode = "login" | "otp_request" | "otp_verify" | "set_new_pin";

function YouthLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/youth-front/my-dashboard";
  const modeParam = searchParams?.get("mode");

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otpSimulated, setOtpSimulated] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [mode, setMode] = useState<Mode>(
    modeParam === "otp_request" || modeParam === "forgot" ? "otp_request" : "login",
  );

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const sanitizePhoneInput = (value: string) =>
    String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);

  const safeNext = (path: string) =>
    path.startsWith("/youth-front") ? path : "/youth-front/my-dashboard";

  const goLoginMode = () => {
    setMode("login");
    setError("");
    setInfo("");
    setOtp("");
    setNewPin("");
    setConfirmNewPin("");
    // Keep youth URL — never bounce to /login
    router.replace(`/youth-front/login?next=${encodeURIComponent(safeNext(nextPath))}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const cleanedPhone = sanitizePhoneInput(phone);
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!pin || pin.length < 4 || pin.length > 6) {
      setError("Please enter a valid 4-6 digit PIN");
      return;
    }

    setLoading(true);
    try {
      const { fetchApi } = await import("../../../lib/api");
      const phoneNumber = `+91${cleanedPhone}`;
      const data = await fetchApi("users/login-pin", {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber, pin }),
      });

      if (!data.access_token) throw new Error("Login failed");

      const tag = String(data.user?.programTag || "").toLowerCase();
      const isYouth = tag.includes("jinda") || tag.includes("youth");
      if (!isYouth) {
        try {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
        } catch {
          /* ignore */
        }
        setError(
          "This is not a Jinda Youth account. Join Jinda Youth first, or use Party / Union login for those portals.",
        );
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      if (data.user) localStorage.setItem("user_info", JSON.stringify(data.user));
      router.push(safeNext(nextPath));
    } catch (err: any) {
      setError(err.message || "Invalid phone or PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const cleanedPhone = sanitizePhoneInput(phone);
    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const { fetchApi } = await import("../../../lib/api");
      const { supabase } = await import("../../../lib/supabaseClient");
      const { isAuthDevMode } = await import("../../../lib/authDevMode");
      const phoneNumber = `+91${cleanedPhone}`;

      const check = await fetchApi("users/check-phone", {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber }),
      });
      if (!check?.exists || !check?.canLoginYouth) {
        setError("This number is not registered as Jinda Youth. Please join first.");
        return;
      }

      if (isAuthDevMode()) {
        setOtpSimulated(true);
        setMode("otp_verify");
        setResendTimer(60);
        setInfo("Dev mode: use OTP 123456");
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (otpError) {
        if (
          otpError.message === "Unsupported phone provider" ||
          String(otpError.message || "").toLowerCase().includes("sms")
        ) {
          if (isAuthDevMode()) {
            setOtpSimulated(true);
            setMode("otp_verify");
            setResendTimer(60);
            setInfo("Dev mode: use OTP 123456");
            return;
          }
        }
        throw otpError;
      }

      setOtpSimulated(false);
      setMode("otp_verify");
      setResendTimer(60);
      setInfo("OTP sent. Enter the code to continue.");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { supabase } = await import("../../../lib/supabaseClient");
      const { isAuthDevMode } = await import("../../../lib/authDevMode");
      const phoneNumber = `+91${sanitizePhoneInput(phone)}`;

      if ((otpSimulated || isAuthDevMode()) && isAuthDevMode()) {
        if (otp !== "123456") {
          setError("Invalid OTP. Use 123456 in dev mode.");
          return;
        }
        setMode("set_new_pin");
        setInfo("OTP verified. Set your new Jinda Youth PIN.");
        return;
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });
      if (verifyError) throw verifyError;

      if (typeof window !== "undefined") localStorage.removeItem("access_token");
      setMode("set_new_pin");
      setInfo("OTP verified. Set your new Jinda Youth PIN.");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newPin || newPin.length < 4 || newPin.length > 6) {
      setError("PIN must be 4-6 digits");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const { fetchApi } = await import("../../../lib/api");
      const { supabase } = await import("../../../lib/supabaseClient");
      const { isAuthDevMode } = await import("../../../lib/authDevMode");
      const phoneNumber = `+91${sanitizePhoneInput(phone)}`;

      let headers: Record<string, string> = {};
      const { data } = await supabase.auth.getSession();
      if (!data.session && isAuthDevMode()) {
        headers = { Authorization: `Bearer dev-token:${phoneNumber}` };
      }

      await fetchApi("users/set-pin-with-token", {
        method: "POST",
        headers,
        body: JSON.stringify({ pin: newPin, phone: phoneNumber }),
      });

      try {
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }

      setPin("");
      setNewPin("");
      setConfirmNewPin("");
      setOtp("");
      setMode("login");
      setInfo("PIN updated. Please login with your new PIN.");
      router.replace(`/youth-front/login?next=${encodeURIComponent(safeNext(nextPath))}`);
    } catch (err: any) {
      setError(err.message || "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login"
      ? "Jinda Youth Login"
      : mode === "otp_request"
        ? "Forgot PIN / Set PIN"
        : mode === "otp_verify"
          ? "Verify OTP"
          : "Set New PIN";

  const subtitle =
    mode === "login"
      ? "Login with the mobile number and PIN from your Jinda Youth registration"
      : mode === "otp_request"
        ? "No PIN yet, or forgot it? Enter your mobile number — we'll send OTP so you can set a new PIN"
        : mode === "otp_verify"
          ? `Code sent to +91 ${sanitizePhoneInput(phone)}`
          : "Create a new 4–6 digit login PIN for Jinda Youth";

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-md px-5 lg:px-8 py-14">
        <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => {
              if (mode === "login") router.back();
              else goLoginMode();
            }}
            className="mb-6 flex items-center gap-2 text-[#587E67] font-semibold hover:text-[#04330B]"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Jinda Youth</p>
          <h1 className="mt-2 text-3xl lg:text-4xl font-black tracking-[-0.05em]">{title}</h1>
          <p className="mt-3 text-[#587E67] font-semibold">{subtitle}</p>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}
          {info && !error && (
            <div className="mt-6 rounded-2xl bg-[#EAF7EE] border border-[#B9D3C4] p-4 text-[#0D5229] font-semibold text-sm">
              {info}
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  Mobile Number
                </FormFieldLabel>
                <div className="flex gap-2">
                  <div className="flex h-[46px] items-center rounded-[10px] border border-[#DDEEE4] bg-[#F5FBF7] px-4 font-semibold text-[#587E67]">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                    className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                    placeholder="Enter 10-digit number"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  Login PIN
                </FormFieldLabel>
                <div className="flex gap-2">
                  <input
                    type={showPin ? "text" : "password"}
                    required
                    minLength={4}
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                    placeholder="Enter 4-6 digit PIN"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("otp_request");
                    setError("");
                    setInfo("");
                    router.replace(
                      `/youth-front/login?mode=otp_request&next=${encodeURIComponent(safeNext(nextPath))}`,
                    );
                  }}
                  className="mt-2 text-sm font-semibold text-[#0D5229] hover:underline"
                >
                  Forgot PIN? / First-time set PIN
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/youth-front/join")}
                  className="text-[#0D5229] text-sm font-semibold hover:underline"
                >
                  Not a member? Join Jinda Youth
                </button>
              </div>
            </form>
          )}

          {mode === "otp_request" && (
            <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  Mobile Number
                </FormFieldLabel>
                <div className="flex gap-2">
                  <div className="flex h-[46px] items-center rounded-[10px] border border-[#DDEEE4] bg-[#F5FBF7] px-4 font-semibold text-[#587E67]">
                    +91
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                    className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                    placeholder="Jinda Youth mobile number"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[12px] bg-[#04330B] font-black text-white hover:bg-[#16A34A] disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {mode === "otp_verify" && (
            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  OTP
                </FormFieldLabel>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold tracking-[0.3em] outline-none focus:border-[#16A34A]"
                  placeholder="6-digit code"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={() => handleSendOtp({ preventDefault() {} } as React.FormEvent)}
                  className="mt-2 text-sm font-semibold text-[#0D5229] disabled:opacity-40"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[12px] bg-[#04330B] font-black text-white hover:bg-[#16A34A] disabled:opacity-50"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </form>
          )}

          {mode === "set_new_pin" && (
            <form onSubmit={handleSetNewPin} className="mt-8 space-y-6">
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  New PIN
                </FormFieldLabel>
                <div className="flex gap-2">
                  <input
                    type={showNewPin ? "text" : "password"}
                    required
                    minLength={4}
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4]"
                  >
                    {showNewPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  Confirm PIN
                </FormFieldLabel>
                <input
                  type={showNewPin ? "text" : "password"}
                  required
                  minLength={4}
                  maxLength={6}
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                  inputMode="numeric"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[12px] bg-[#04330B] font-black text-white hover:bg-[#16A34A] disabled:opacity-50"
              >
                {loading ? "Saving…" : "Save PIN & Continue"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function YouthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5FBF7] pt-[70px] flex items-center justify-center text-[#587E67] font-['Familjen_Grotesk']">
          Loading…
        </div>
      }
    >
      <YouthLoginInner />
    </Suspense>
  );
}
