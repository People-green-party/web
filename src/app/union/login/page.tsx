"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';
import { useLanguage } from '../../../components/LanguageContext';
import { fetchApi } from '../../../lib/api';
import { setPortalToken } from '../../../lib/portalAuth';
import { PortalLoginScreen } from '../../../components/PortalLoginScreen';
import { completeOtpLogin } from '../../../lib/completeOtpLogin';

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
      numberNotFound: "यह मोबाइल नंबर यूनियन सदस्य के रूप में पंजीकृत नहीं है। कृपया पहले यूनियन जॉइन करें।",
      notUnionMember: "यह नंबर पार्टी/अन्य पोर्टल पर है, यूनियन में नहीं। पहले यूनियन जॉइन पूरा करें।",
      invalidOtp: "OTP गलत है। कृपया दोबारा कोशिश करें।",
      loginSuccess: "लॉगिन सफल!",
      back: "वापस",
    }
  },
  en: {
    loginPage: {
      title: "Union Member Login",
      subtitle: "Sign in to your Union account",
      mobile: "Mobile Number",
      sendOtp: "Send OTP",
      sending: "Sending...",
      otpTitle: "OTP Verification",
      otpSubtitle: "Code sent to",
      verify: "Verify",
      verifying: "Verifying...",
      resend: "Resend OTP",
      resendIn: "Resend OTP in {seconds}s",
      notRegistered: "Not a Union member yet?",
      joinNow: "Join Union",
      invalidNumber: "Please enter a valid 10-digit mobile number",
      numberNotFound: "This number is not registered as a Union member. Please join the Union first.",
      notUnionMember: "This number is registered on another portal, not Union. Complete Union join first.",
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
      
      // Only Union-registered accounts can login here
      const check = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!check?.exists) {
        setError(t.loginPage.numberNotFound);
        setLoading(false);
        return;
      }
      if (!check?.canLoginUnion && !check?.portals?.union) {
        setError(t.loginPage.notUnionMember);
        setLoading(false);
        return;
      }

      const { isAuthDevMode } = await import('../../../lib/authDevMode');
      const devAuthMode = isAuthDevMode();

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
        options: { shouldCreateUser: true },
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

      const { isAuthDevMode } = await import('../../../lib/authDevMode');
      if (isConfigError && isAuthDevMode()) {
        setStep('otp');
        setOtpSimulated(true);
        setResendTimer(60);
      } else if (isConfigError) {
        setError('SMS login is temporarily unavailable. Please try again later.');
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

      const { isAuthDevMode } = await import('../../../lib/authDevMode');
      // Dev-only OTP simulation → real JWT for this phone (not anonymous Supabase)
      if ((otpSimulated || isAuthDevMode()) && isAuthDevMode()) {
        if (otp === '123456') {
          const loginRes = await fetchApi('users/dev-login', {
            method: 'POST',
            body: JSON.stringify({ phone: phoneNumber }),
          });
          if (!loginRes?.access_token) {
            throw new Error('Dev login failed — no token returned');
          }
          if (typeof window !== 'undefined') {
            setPortalToken('union', loginRes.access_token);
            if (loginRes?.id) {
              window.localStorage.setItem('devUserId', String(loginRes.id));
            }
          }
          router.push('/union/dashboard');
          return;
        }
        setError(t.loginPage.invalidOtp);
        setLoading(false);
        return;
      }

      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        throw verifyError;
      }

      const accessToken = verifyData.session?.access_token;
      if (!accessToken) throw new Error('OTP session was not created');
      const loginRes = await completeOtpLogin(phoneNumber, accessToken);
      if (!loginRes?.access_token) throw new Error('Login could not be completed');
      setPortalToken('union', loginRes.access_token);
      router.push('/union/dashboard');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || t.loginPage.invalidOtp);
    } finally {
      setLoading(false);
    }
  };

  return <PortalLoginScreen variant="union" language={language} step={step} phone={phone} otp={otp} loading={loading} error={error} info={otpSimulated ? "Dev mode: Use OTP 123456" : undefined} sendLabel={t.loginPage.sendOtp} sendingLabel={t.loginPage.sending} verifyLabel={t.loginPage.verify} verifyingLabel={t.loginPage.verifying} onPhoneChange={(value) => { setPhone(sanitizePhoneInput(value)); setError(''); }} onOtpChange={(value) => { setOtp(value.replace(/\D/g, '').slice(0, 6)); setError(''); }} onSend={(event) => { event.preventDefault(); void handleSendOtp(); }} onVerify={(event) => { event.preventDefault(); void handleVerifyOtp(); }} onChangeNumber={() => { setStep('phone'); setOtp(''); setError(''); }} joinHref="/union/join" resendLabel={resendTimer > 0 ? t.loginPage.resendIn.replace('{seconds}', String(resendTimer)) : t.loginPage.resend} onResend={() => { void handleSendOtp(); }} resendDisabled={resendTimer > 0} />;
};

export default function UnionLoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <UnionLoginPageContent />
    </Suspense>
  );
}
