"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';
import { useLanguage } from '../../../components/LanguageContext';
import { Phone, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { fetchApi } from '../../../lib/api';

// --- Translations ---
const translations = {
  hi: {
    loginPage: {
      title: "यूनियन सदस्य लॉगिन",
      subtitle: "अपने खाते में लॉगिन करें",
      mobile: "मोबाइल नंबर",
      sendOtp: "OTP भेजें",
      sending: "भेज रहे हैं...",
      otpTitle: "OTP सत्यापन",
      otpSubtitle: "कोड भेजा गया",
      verify: "सत्यापित करें",
      verifying: "सत्यापित कर रहे हैं...",
      resend: "OTP दोबारा भेजें",
      resendIn: "OTP दोबारा भेजें {seconds} सेकंड में",
      notRegistered: "अभी तक पंजीकृत नहीं हैं?",
      joinNow: "अभी जुड़ें",
      invalidNumber: "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें",
      numberNotFound: "यह मोबाइल नंबर पंजीकृत नहीं है। कृपया पहले जुड़ें।",
      invalidOtp: "OTP गलत है। कृपया दोबारा कोशिश करें।",
      loginSuccess: "लॉगिन सफल!",
      back: "वापस",
    }
  },
  en: {
    loginPage: {
      title: "Union Member Login",
      subtitle: "Sign in to your account",
      mobile: "Mobile Number",
      sendOtp: "Send OTP",
      sending: "Sending...",
      otpTitle: "OTP Verification",
      otpSubtitle: "Code sent to",
      verify: "Verify",
      verifying: "Verifying...",
      resend: "Resend OTP",
      resendIn: "Resend OTP in {seconds}s",
      notRegistered: "Not registered yet?",
      joinNow: "Join Now",
      invalidNumber: "Please enter a valid 10-digit mobile number",
      numberNotFound: "This mobile number is not registered. Please join first.",
      invalidOtp: "Invalid OTP. Please try again.",
      loginSuccess: "Login Successful!",
      back: "Back",
    }
  }
};

const UnionLoginPageContent = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.hi;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSimulated, setOtpSimulated] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const sanitizePhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    // Only strip 91 if length > 10 (country code + number), not for 10-digit numbers starting with 91
    const normalized = (digits.length > 10 && digits.startsWith('91')) ? digits.slice(2) : (digits.startsWith('0') ? digits.slice(1) : digits);
    return normalized.slice(0, 10);
  };

  const handleSendOtp = async () => {
    const sanitizedPhone = sanitizePhoneInput(phone);
    
    if (sanitizedPhone.length !== 10) {
      setError(t.loginPage.invalidNumber);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const phoneNumber = `+91${sanitizedPhone}`;
      
      // Check if phone is registered
      const check = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!check?.exists) {
        setError(t.loginPage.numberNotFound);
        setLoading(false);
        return;
      }

      const devAuthMode = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';
      
      if (devAuthMode) {
        setStep('otp');
        setOtpSimulated(true);
        setResendTimer(60);
        setLoading(false);
        return;
      }

      // Send OTP via Supabase
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (otpError) {
        throw otpError;
      }

      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      const isConfigError = err.message?.includes('Unsupported phone provider') || 
                           err.message?.includes('Failed to fetch') ||
                           err.message?.includes('Signups not allowed');
      
      if (isConfigError) {
        setStep('otp');
        setOtpSimulated(true);
        setResendTimer(60);
      } else {
        setError(err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const phoneNumber = `+91${sanitizePhoneInput(phone)}`;

      // Dev mode - accept 123456
      if (otpSimulated || process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true') {
        if (otp === '123456') {
          // Create session for dev mode
          const { data: { session }, error: sessionError } = await supabase.auth.signInAnonymously();
          if (sessionError) throw sessionError;
          
          // Get user info from backend
          const userData = await fetchApi('users/check-phone', {
            method: 'POST',
            body: JSON.stringify({ phone: phoneNumber }),
          });

          if (userData?.user?.id) {
            localStorage.setItem('devUserId', String(userData.user.id));
          }
          
          router.push('/union/dashboard');
          return;
        } else {
          setError(t.loginPage.invalidOtp);
          setLoading(false);
          return;
        }
      }

      // Real OTP verification
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        throw verifyError;
      }

      // Get user info
      const userData = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (userData?.user?.id) {
        localStorage.setItem('devUserId', String(userData.user.id));
      }

      router.push('/union/dashboard');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || t.loginPage.invalidOtp);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
      setError('');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      
      <main className="w-full max-w-[600px] px-4 lg:px-8 mt-10 mb-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#04330B] font-semibold mb-6 hover:opacity-70"
        >
          <ArrowLeft size={20} />
          <span>{t.loginPage.back}</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[28px] border border-[#BBF7D0] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] p-8 lg:p-12">
          
          {step === 'phone' ? (
            <>
              {/* Phone Step */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04330B] to-[#0B5A2A] flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-white" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-[#04330B] mb-2">{t.loginPage.title}</h1>
                <p className="text-gray-600">{t.loginPage.subtitle}</p>
              </div>

              {/* Phone Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-[70px_1fr] gap-3">
                  <div className="h-[56px] rounded-[12px] border border-[#BBF7D0] px-3 flex items-center justify-center font-bold text-[#04330B] bg-white text-lg">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(sanitizePhoneInput(e.target.value));
                      setError('');
                    }}
                    inputMode="numeric"
                    className="h-[56px] rounded-[12px] border border-[#BBF7D0] px-4 font-bold text-[#04330B] outline-none text-lg"
                    placeholder={t.loginPage.mobile}
                    autoComplete="off"
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Send OTP Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                  className="w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white font-bold text-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      {t.loginPage.sending}
                    </>
                  ) : (
                    t.loginPage.sendOtp
                  )}
                </button>

                {/* Join Now Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600 mb-2">{t.loginPage.notRegistered}</p>
                  <button
                    onClick={() => router.push('/union/join')}
                    className="text-[#04330B] font-bold hover:underline"
                  >
                    {t.loginPage.joinNow} →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#04330B] to-[#0B5A2A] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-white" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-[#04330B] mb-2">{t.loginPage.otpTitle}</h1>
                <p className="text-gray-600">
                  {t.loginPage.otpSubtitle} <span className="font-bold">+91{sanitizePhoneInput(phone)}</span>
                </p>
                {otpSimulated && (
                  <p className="text-sm text-amber-600 mt-2 font-semibold">Dev mode: Use OTP 123456</p>
                )}
              </div>

              {/* OTP Input */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  inputMode="numeric"
                  className="w-full h-[56px] rounded-[12px] border border-[#BBF7D0] px-4 font-bold text-[#04330B] outline-none text-center text-2xl tracking-[0.5em]"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                />

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white font-bold text-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      {t.loginPage.verifying}
                    </>
                  ) : (
                    t.loginPage.verify
                  )}
                </button>

                {/* Resend OTP */}
                <button
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="w-full h-[48px] rounded-[12px] border border-[#04330B] text-[#04330B] font-semibold disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-400"
                >
                  {resendTimer > 0 
                    ? t.loginPage.resendIn.replace('{seconds}', String(resendTimer))
                    : t.loginPage.resend
                  }
                </button>

                {/* Change Number */}
                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-center text-[#04330B] font-semibold hover:underline"
                >
                  ← {t.loginPage.back}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default function UnionLoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <UnionLoginPageContent />
    </Suspense>
  );
}
