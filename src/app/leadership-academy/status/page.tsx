"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { FormFieldLabel } from "@/components/FormFieldLabel";
import { fetchApi } from "@/lib/api";
import { clearInternSession, setInternSession } from "@/lib/internApi";

type Mode = "login" | "otp_request" | "otp_verify" | "set_pin";

function InternLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams?.get("mode");

  const [mode, setMode] = useState<Mode>(
    modeParam === "forgot" || modeParam === "otp_request" ? "otp_request" : "login",
  );
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [otpSimulated, setOtpSimulated] = useState(false);

  useEffect(() => {
    clearInternSession();
  }, []);

  const sanitize = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (sanitize(phone).length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setError("PIN must be 4-6 digits");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchApi("leadership-academy/login-pin", {
        method: "POST",
        body: JSON.stringify({ phone: sanitize(phone), pin }),
      });
      if (!data?.access_token) throw new Error("Login failed");
      setInternSession(data.access_token, data.application);
      router.push("/leadership-academy/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (sanitize(phone).length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const lookup = await fetchApi("leadership-academy/applications/status", {
        method: "POST",
        body: JSON.stringify({ phone: sanitize(phone) }),
      });
      if (!lookup?.found) {
        setError("No internship application found. Please Apply first.");
        return;
      }

      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const { supabase } = await import("@/lib/supabaseClient");
      const phoneNumber = `+91${sanitize(phone)}`;

      if (isAuthDevMode()) {
        setOtpSimulated(true);
        setMode("otp_verify");
        setInfo("Dev mode: use OTP 123456");
        return;
      }

      const { error: otpErr } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (otpErr) throw otpErr;
      setMode("otp_verify");
      setInfo("OTP sent to your phone");
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const { supabase } = await import("@/lib/supabaseClient");
      if ((otpSimulated || isAuthDevMode()) && isAuthDevMode()) {
        if (otp !== "123456") {
          setError("Invalid OTP");
          return;
        }
        setMode("set_pin");
        setInfo("OTP verified. Set your internship login PIN.");
        return;
      }
      const { error: vErr } = await supabase.auth.verifyOtp({
        phone: `+91${sanitize(phone)}`,
        token: otp,
        type: "sms",
      });
      if (vErr) throw vErr;
      setMode("set_pin");
      setInfo("OTP verified. Set your internship login PIN.");
    } catch (err: any) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{4,6}$/.test(newPin)) {
      setError("PIN must be 4-6 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchApi("leadership-academy/set-pin", {
        method: "POST",
        body: JSON.stringify({ phone: sanitize(phone), pin: newPin }),
      });
      if (!data?.access_token) throw new Error("Could not set PIN");
      setInternSession(data.access_token, data.application);
      router.push("/leadership-academy/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login"
      ? "Internship Login"
      : mode === "otp_request"
        ? "Forgot / Set PIN"
        : mode === "otp_verify"
          ? "Verify OTP"
          : "Create Login PIN";

  return (
    <AcademyShell>
      <section className="mx-auto max-w-lg px-5 py-16">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">PGP Internships</p>
        <h1 className="mt-2 text-3xl font-black text-[#04330B] tracking-tight">{title}</h1>
        <p className="mt-2 text-[#587E67] font-semibold text-sm">
          Login with the mobile number and PIN from your internship application. You&apos;ll see
          status, classes, and tasks in your dashboard.
        </p>

        {error && (
          <div className="mt-6 flex gap-2 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626] font-semibold text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}
        {info && !error && (
          <div className="mt-6 rounded-2xl bg-[#EAF7EE] border border-[#B9D3C4] p-4 text-[#0D5229] font-semibold text-sm">
            {info}
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="mt-8 space-y-4 rounded-3xl border border-[#DDEEE4] bg-white p-6">
            <div>
              <FormFieldLabel required>Mobile number</FormFieldLabel>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(sanitize(e.target.value))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <FormFieldLabel required>Login PIN</FormFieldLabel>
              <div className="mt-2 flex gap-2">
                <input
                  type={showPin ? "text" : "password"}
                  required
                  minLength={4}
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="h-12 px-4 rounded-xl border border-[#DDEEE4]"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMode("otp_request")}
                className="mt-2 text-sm font-semibold text-[#0D5229] hover:underline"
              >
                Forgot PIN? / First-time set PIN
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? "Logging in…" : "Login to dashboard"}
            </button>
          </form>
        )}

        {mode === "otp_request" && (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4 rounded-3xl border border-[#DDEEE4] bg-white p-6">
            <div>
              <FormFieldLabel required>Mobile number</FormFieldLabel>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(sanitize(e.target.value))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-sm font-semibold text-[#587E67]">
              ← Back to login
            </button>
          </form>
        )}

        {mode === "otp_verify" && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4 rounded-3xl border border-[#DDEEE4] bg-white p-6">
            <div>
              <FormFieldLabel required>OTP</FormFieldLabel>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold tracking-widest outline-none focus:border-[#16A34A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </form>
        )}

        {mode === "set_pin" && (
          <form onSubmit={handleSetPin} className="mt-8 space-y-4 rounded-3xl border border-[#DDEEE4] bg-white p-6">
            <div>
              <FormFieldLabel required>New PIN</FormFieldLabel>
              <input
                type="password"
                required
                minLength={4}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
              />
            </div>
            <div>
              <FormFieldLabel required>Confirm PIN</FormFieldLabel>
              <input
                type="password"
                required
                minLength={4}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save PIN & open dashboard"}
            </button>
          </form>
        )}

        <div className="mt-8 flex flex-col gap-3 text-sm font-semibold">
          <Link href="/leadership-academy/apply" className="text-[#0D5229] hover:underline">
            Apply for Internship →
          </Link>
          <Link href="/leadership-academy" className="text-[#587E67] hover:underline">
            ← Back to Internships
          </Link>
        </div>
      </section>
    </AcademyShell>
  );
}

export default function InternshipLoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-[#587E67] font-semibold">Loading…</div>}>
      <InternLoginInner />
    </Suspense>
  );
}
