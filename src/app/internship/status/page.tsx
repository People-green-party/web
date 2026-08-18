"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { FormFieldLabel } from "@/components/FormFieldLabel";
import { useLanguage } from "@/components/LanguageContext";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { fetchApi } from "@/lib/api";
import { clearInternSession, setInternSession } from "@/lib/internApi";

type Mode = "login" | "otp_request" | "otp_verify" | "set_pin";

function InternLoginInner() {
  const { language } = useLanguage();
  const academy = getAcademyI18n(language);
  const t = academy.loginPage;
  const a = academy.applyPage;
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

  /** Only accepted interns get the portal; everyone else tracks their application. */
  const landingFor = (application: { status?: string } | undefined) =>
    application?.status === "accepted"
      ? "/internship/dashboard"
      : "/internship/application-status";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (sanitize(phone).length !== 10) {
      setError(t.errorMobile);
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setError(a.errorPin);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchApi("leadership-academy/login-pin", {
        method: "POST",
        body: JSON.stringify({ phone: sanitize(phone), pin }),
      });
      if (!data?.access_token) throw new Error(t.errorLogin);
      setInternSession(data.access_token, data.application);
      router.push(landingFor(data.application));
    } catch {
      setError(t.errorLogin);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (sanitize(phone).length !== 10) {
      setError(t.errorMobile);
      return;
    }
    setLoading(true);
    try {
      const lookup = await fetchApi("leadership-academy/applications/status", {
        method: "POST",
        body: JSON.stringify({ phone: sanitize(phone) }),
      });
      if (!lookup?.found) {
        setError(t.errorNoApplication);
        return;
      }

      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const { supabase } = await import("@/lib/supabaseClient");
      const phoneNumber = `+91${sanitize(phone)}`;

      if (isAuthDevMode()) {
        setOtpSimulated(true);
        setMode("otp_verify");
        setInfo(t.infoOtpDev);
        return;
      }

      const { error: otpErr } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (otpErr) throw otpErr;
      setMode("otp_verify");
      setInfo(t.infoOtpSent);
    } catch {
      setError(t.errorOtpSend);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError(t.errorOtpLength);
      return;
    }
    setLoading(true);
    try {
      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const { supabase } = await import("@/lib/supabaseClient");
      if ((otpSimulated || isAuthDevMode()) && isAuthDevMode()) {
        if (otp !== "123456") {
          setError(t.errorOtpInvalid);
          return;
        }
        setMode("set_pin");
        setInfo(t.infoOtpVerified);
        return;
      }
      const { error: vErr } = await supabase.auth.verifyOtp({
        phone: `+91${sanitize(phone)}`,
        token: otp,
        type: "sms",
      });
      if (vErr) throw vErr;
      setMode("set_pin");
      setInfo(t.infoOtpVerified);
    } catch {
      setError(t.errorOtpInvalid);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{4,6}$/.test(newPin)) {
      setError(a.errorPin);
      return;
    }
    if (newPin !== confirmPin) {
      setError(t.errorPinMismatch);
      return;
    }
    setLoading(true);
    try {
      const { isAuthDevMode } = await import("@/lib/authDevMode");
      const headers: Record<string, string> = {};
      if (!isAuthDevMode()) {
        const { supabase } = await import("@/lib/supabaseClient");
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          setError(t.errorOtpExpired);
          return;
        }
        headers.Authorization = `Bearer ${token}`;
      }
      const data = await fetchApi("leadership-academy/set-pin", {
        method: "POST",
        headers,
        body: JSON.stringify({ phone: sanitize(phone), pin: newPin }),
      });
      if (!data?.access_token) throw new Error(t.errorSetPin);
      setInternSession(data.access_token, data.application);
      router.push(landingFor(data.application));
    } catch {
      setError(t.errorSetPin);
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login"
      ? t.titleLogin
      : mode === "otp_request"
        ? t.titleForgot
        : mode === "otp_verify"
          ? t.titleOtp
          : t.titleSetPin;

  return (
    <AcademyShell>
      <section className="mx-auto w-full max-w-[600px] px-4 lg:px-8 py-14">
        <div className="rounded-[28px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">{t.brand}</p>
        <h1 className="mt-2 text-2xl lg:text-3xl font-bold text-[#04330B] tracking-tight">{title}</h1>
        <p className="mt-3 text-gray-600 font-medium text-sm">{t.subtitle}</p>

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
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <FormFieldLabel required>{t.mobile}</FormFieldLabel>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(sanitize(e.target.value))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                placeholder={t.mobilePh}
              />
            </div>
            <div>
              <FormFieldLabel required>{t.pin}</FormFieldLabel>
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
                  aria-label={showPin ? t.hidePin : t.showPin}
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
                {t.forgot}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? t.loggingIn : t.login}
            </button>
          </form>
        )}

        {mode === "otp_request" && (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
            <div>
              <FormFieldLabel required>{t.mobile}</FormFieldLabel>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(sanitize(e.target.value))}
                className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
                placeholder={t.mobilePh}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
            >
              {loading ? t.sending : t.sendOtp}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-sm font-semibold text-[#587E67]">
              {t.backLogin}
            </button>
          </form>
        )}

        {mode === "otp_verify" && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
            <div>
              <FormFieldLabel required>{t.otp}</FormFieldLabel>
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
              {loading ? t.verifying : t.verify}
            </button>
          </form>
        )}

        {mode === "set_pin" && (
          <form onSubmit={handleSetPin} className="mt-8 space-y-4">
            <div>
              <FormFieldLabel required>{t.newPin}</FormFieldLabel>
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
              <FormFieldLabel required>{t.confirmPin}</FormFieldLabel>
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
              {loading ? t.saving : t.savePin}
            </button>
          </form>
        )}

        <div className="mt-8 flex flex-col gap-3 text-sm font-semibold">
          <Link href="/internship/apply" className="text-[#0D5229] hover:underline">
            {t.apply}
          </Link>
          <Link href="/internship" className="text-[#587E67] hover:underline">
            {t.backInternships}
          </Link>
        </div>
        </div>
      </section>
    </AcademyShell>
  );
}

export default function InternshipLoginPage() {
  const { language } = useLanguage();
  const t = getAcademyI18n(language).loginPage;

  return (
    <Suspense
      fallback={<div className="p-16 text-center text-[#587E67] font-semibold">{t.loading}</div>}
    >
      <InternLoginInner />
    </Suspense>
  );
}
