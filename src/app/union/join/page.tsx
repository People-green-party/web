"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';
import { useLanguage } from '../../../components/LanguageContext';
import { Phone, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';

// --- Translations ---
const translations = {
  hi: {
    joinPage: {
      header: {
        title: "पीपल्स ग्रीन पार्टी: असंगठित संघों का सशक्तिकरण",
        subtitle: "एक साथ खड़े रहें, अपने अधिकारों के लिए लड़ें"
      },
      wizard: {
        heroTitle: 'पीपल्स ग्रीन पार्टी:\nअसंगठित संघों का सशक्तिकरण',
        newRegistration: 'नया पंजीकरण',
        step1: 'पंजीकरण करें',
        step2: 'OTP सत्यापन',
        step3: 'अपना ID कार्ड प्राप्त करें',
        sendOtp: 'OTP भेजें →',
        sending: 'भेज रहे हैं...',
        back: '← वापस',
        otpTitle: 'OTP सत्यापन',
        otpSubtitlePrefix: 'कोड भेजा गया',
        verifyContinue: 'सत्यापित करें और आगे बढ़ें',
        verifying: 'सत्यापित कर रहे हैं...',
        idCongrats: 'बधाई हो! आप अब संघ सदस्य हैं',
        idReady: 'आपका डिजिटल ID कार्ड तैयार है',
        downloadId: 'ID कार्ड डाउनलोड करें',
        goDashboard: 'डैशबोर्ड पर जाएँ',
      },
      form: {
        title: "पंजीकरण फॉर्म",
        subtitle: "हमारे साथ अपनी यात्रा शुरू करने के लिए नीचे दिया गया फॉर्म भरें।",
        fullName: "पूरा नाम",
        mobile: "मोबाइल नंबर",
        selectUnion: "अपना संघ चुनें",
        address: "पूरा घर का पता",
        addressPlaceholder: "अपना पूरा पता दर्ज करें",
        submit: "जुड़ें"
      }
    },
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      login: "लॉगिन",
    }
  },
  en: {
    joinPage: {
      header: {
        title: "Peoples Green Party Unorganized Union Empowerment",
        subtitle: "Stand Together, Fight for Your Rights"
      },
      wizard: {
        heroTitle: 'Join Your Union\nBuild Collective Power!',
        newRegistration: 'New Registration',
        step1: 'Register Yourself',
        step2: 'OTP Verification',
        step3: 'Get Your ID Card',
        sendOtp: 'Send OTP →',
        sending: 'Sending...',
        back: '← Back',
        otpTitle: 'OTP Verification',
        otpSubtitlePrefix: 'Code sent to',
        verifyContinue: 'Verify & Continue',
        verifying: 'Verifying...',
        idCongrats: 'Congratulations! You are now a Union Member',
        idReady: 'Your Digital ID Card is ready',
        downloadId: 'Download ID Card',
        goDashboard: 'Go to Dashboard',
      },
      form: {
        title: "Registration Form",
        subtitle: "Fill the form below to begin your journey with us.",
        fullName: "Full Name",
        mobile: "Mobile Number",
        selectUnion: "Select Your Union",
        address: "Full Home Address",
        addressPlaceholder: "Enter your complete address",
        submit: "Join Us"
      }
    },
    nav: {
      home: "Home",
      about: "About",
      login: "Login",
    }
  }
};

// Union options (in Hindi)
const UNION_OPTIONS = [
  { value: 'E-Rickshaw Union', label: 'ई-रिक्शा चालक संघ' },
  { value: 'Haat Worker Union', label: 'हाट व ठेला विक्रेता संघ' },
  { value: 'Gig Worker Union', label: 'राजस्थान गिग वर्कर्स संघ' },
  { value: 'Vahan Chalak Union', label: 'राजस्थान वाहन चालक संघ' },
  { value: 'Other', label: 'अन्य (विवरण दें)' },
];

// --- Join Page Content ---

const UnionJoinPageContent = () => {
  const { language } = useLanguage();
  // Default to Hindi for union page
  const t = translations[language as keyof typeof translations] || translations.hi;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pin: '',
    unionName: '',
    address: '',
    referralCode: '',
  });
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSimulated, setOtpSimulated] = useState(false);
  const [meSummary, setMeSummary] = useState<any>(null);

  const registrationValidationError = useMemo(() => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    const mobile = formData.mobile.replace(/\D/g, '');
    if (mobile.length < 10) return 'Please enter a valid 10-digit mobile number.';
    const pin = formData.pin.replace(/\D/g, '');
    if (pin.length < 4 || pin.length > 6) return 'Please create a 4–6 digit login PIN.';
    if (!formData.unionName) return 'Please select your Union.';
    if (!formData.address.trim()) return 'Please enter your address.';
    return null;
  }, [formData.name, formData.mobile, formData.pin, formData.unionName, formData.address]);

  const isRegistrationReady = useMemo(() => {
    return !registrationValidationError;
  }, [registrationValidationError]);

  // Clear form on mount but preserve referral code if present in URL
  useEffect(() => {
    const urlRefCode = searchParams.get('ref') || '';
    setFormData({
      name: '',
      mobile: '',
      pin: '',
      unionName: '',
      address: '',
      referralCode: urlRefCode,
    });
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setShowOtpField(false);
  }, [searchParams]);

  async function handleSubmit() {
    if (registrationValidationError) {
      setOtpError(registrationValidationError);
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      const randomPassword = Math.random().toString(36).slice(-8) + "Aa1!";
      const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
      if (authUserError) {
        console.warn('Could not fetch Supabase user after OTP verification:', authUserError.message);
      }

      const { fetchApi } = await import('../../../lib/api');

      const userProfileData = {
        name: formData.name,
        phone: phoneNumber,
        password: randomPassword,
        pin: formData.pin,
        address: formData.address,
        unionName: formData.unionName,
        referralCode: formData.referralCode || undefined,
        authUserId: authUserData?.user?.id || undefined,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      console.log('Union registration successful:', userData);

      const loginRes = await fetchApi('users/login-pin', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber, pin: formData.pin }),
      });

      if (typeof window !== 'undefined') {
        if (userData?.user?.id) {
          window.localStorage.setItem('devUserId', String(userData.user.id));
        }
        if (loginRes?.access_token) {
          window.localStorage.setItem('access_token', loginRes.access_token);
        }
      }

      try {
        const summaryRes = await fetchApi('users/me/summary');
        setMeSummary(summaryRes);
      } catch (e) {
        console.warn('Failed to load post-registration user data', e);
      }

      setStep(3);
    } catch (error: any) {
      console.error('Registration error:', error);
      setOtpError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    const devAuthMode = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';
    if ((devAuthMode || otpSimulated) && otp === '123456') {
      setStep(2);
      handleSubmit();
      return;
    }

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) {
        if (otp === '123456' && otpError?.includes('Simulating OTP sent')) {
          console.log('Simulated OTP verification successful');
          setStep(2);
          handleSubmit();
          return;
        }
        throw error;
      }
      console.log('OTP verified successfully');
      setStep(2);
      handleSubmit();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    const devAuthMode = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';
    if (devAuthMode) {
      if (registrationValidationError) {
        setOtpError(registrationValidationError);
        return;
      }
      setOtpSent(true);
      setShowOtpField(true);
      setOtpSimulated(true);
      setOtpError('Dev mode: Simulating OTP sent. Use OTP: 123456');
      setStep(2);
      return;
    }

    if (registrationValidationError) {
      setOtpError(registrationValidationError);
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const check = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (check?.exists) {
        setOtpError('This mobile number is already registered. Please log in instead.');
        setTimeout(() => {
          router.push('/login');
        }, 1200);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.warn('Supabase Auth Error (falling back to simulation):', error.message);
        throw error;
      }

      setOtpSent(true);
      setShowOtpField(true);
      setStep(2);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const isConfigError = error.message === 'Unsupported phone provider' ||
        error.message?.includes('Unsupported phone provider') ||
        error.message === 'Failed to fetch' ||
        error.message?.includes('apikey') ||
        error.message?.includes('Signups not allowed');

      if (isConfigError) {
        console.warn('SMS provider not configured (falling back to simulation).', error.message);
        setOtpSent(true);
        setShowOtpField(true);
        setOtpSimulated(true);
        setOtpError('SMS provider not configured. Simulating OTP sent. Use OTP: 123456');
        setStep(2);
      } else {
        setOtpError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const stepLabel = useMemo(() => {
    if (step === 1) return t.joinPage.wizard.step1;
    if (step === 2) return t.joinPage.wizard.step2;
    return t.joinPage.wizard.step3;
  }, [step]);

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="w-full max-w-[1200px] px-4 lg:px-8 mt-[28px] mb-12 lg:mb-24 flex flex-col items-center">
        <h1 className="text-center font-semibold text-[28px] lg:text-[44px] leading-tight tracking-[-0.3px] text-[#04330B] max-w-[880px] flex flex-col gap-3 lg:gap-2">
          {t.joinPage.wizard.heroTitle.split('\n').map((line: string, index: number) => (
            <span key={index}>{line}</span>
          ))}
        </h1>

        <section className="w-full mt-10 bg-white rounded-[28px] border border-[#BBF7D0] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-[360px] w-full bg-gradient-to-br from-[#04330B] to-[#0B5A2A] text-white p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={step === 1 ? 'w-7 h-7 rounded-full bg-[#22C55E] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  1
                </div>
                <div className={step === 1 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step1}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={step === 2 ? 'w-7 h-7 rounded-full bg-[#22C55E] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  2
                </div>
                <div className={step === 2 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step2}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={step === 3 ? 'w-7 h-7 rounded-full bg-[#22C55E] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  3
                </div>
                <div className={step === 3 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step3}</div>
              </div>
            </div>

            <div className="mt-10">
              <div className="mt-4 text-[12px] text-white/70 italic">
                "हम मजदूरों के अधिकारों और सम्मान के लिए एक साथ लड़ते हैं।"
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12">
            <div className="text-center">
              <div className="text-[18px] font-bold text-[#04330B]">{step === 1 ? t.joinPage.wizard.newRegistration : stepLabel}</div>
            </div>

            {step === 1 && (
              <div className="mt-8 mb-5 max-w-[520px] mx-auto">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  {/* Full Name */}
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none"
                    placeholder={t.joinPage.form.fullName}
                    autoComplete="off"
                  />

                  {/* Mobile Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-[70px_1fr] gap-3 min-w-0">
                      <div className="h-[46px] rounded-[10px] border border-[#BBF7D0] px-3 flex items-center justify-center font-semibold text-[#04330B] bg-white">+91</div>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '');
                          const normalized = digits.startsWith('91') ? digits.slice(2) : (digits.startsWith('0') ? digits.slice(1) : digits);
                          setFormData({ ...formData, mobile: normalized.slice(0, 10) });
                        }}
                        inputMode="numeric"
                        className="h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none min-w-0"
                        placeholder={t.joinPage.form.mobile}
                        autoComplete="off"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        inputMode="numeric"
                        className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none"
                        placeholder="लॉगिन PIN बनाएं"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#04330B] hover:text-[#0B5A2A] transition-colors"
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Union Selection Dropdown */}
                  <select
                    value={formData.unionName}
                    onChange={(e) => setFormData({ ...formData, unionName: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] bg-white outline-none"
                  >
                    <option value="">{t.joinPage.form.selectUnion}</option>
                    {UNION_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>

                  {/* Free Text Address */}
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-[100px] rounded-[10px] border border-[#BBF7D0] p-3 font-semibold text-[#04330B] outline-none resize-none"
                    placeholder={t.joinPage.form.addressPlaceholder}
                  />

                  {/* Referral Code (Optional) */}
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                    className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none uppercase"
                    placeholder="रेफरल कोड (वैकल्पिक)"
                    autoComplete="off"
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !isRegistrationReady}
                    className="w-full h-[50px] rounded-[12px] bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white font-semibold disabled:opacity-60"
                  >
                    {loading ? t.joinPage.wizard.sending : t.joinPage.wizard.sendOtp}
                  </button>

                  {otpError && <div className="text-center text-[12px] text-red-500 font-semibold">{otpError}</div>}
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="mt-10 max-w-[520px] mx-auto text-center">
                <div className="flex items-center justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp('');
                      setOtpError('');
                      setStep(1);
                    }}
                    className="text-[#04330B] font-semibold hover:underline"
                  >
                    {t.joinPage.wizard.back}
                  </button>
                </div>
                <div className="mx-auto w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <Phone className="text-[#04330B]" />
                </div>
                <div className="mt-6 text-[22px] font-bold text-[#04330B]">{t.joinPage.wizard.otpTitle}</div>
                <div className="mt-2 text-[#04330B] font-semibold">{t.joinPage.wizard.otpSubtitlePrefix} +91{formData.mobile.replace(/\D/g, '').slice(-10)}</div>

                <div className="mt-6 flex items-center justify-center">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    className="w-[240px] h-[54px] text-center tracking-[0.5em] font-bold text-[#04330B] rounded-[12px] border border-[#BBF7D0] outline-none"
                    placeholder="000000"
                  />
                </div>

                {otpError && <div className="mt-3 text-[12px] text-red-500 font-semibold">{otpError}</div>}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-8 w-[280px] h-[50px] rounded-[12px] bg-[#04330B] text-white font-semibold shadow disabled:opacity-60"
                >
                  {loading ? t.joinPage.wizard.verifying : t.joinPage.wizard.verifyContinue}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 max-w-[640px] mx-auto flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#04330B] to-[#0B5A2A] flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
                </div>
                <div className="text-[24px] font-bold text-[#04330B]">{t.joinPage.wizard.idCongrats}</div>
                <div className="text-[#04330B]/70 font-medium mt-2 mb-8">{t.joinPage.wizard.idReady}</div>
                
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-[360px] h-[50px] rounded-[12px] bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white font-semibold"
                >
                  {t.joinPage.wizard.goDashboard}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function UnionJoinPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <UnionJoinPageContent />
    </Suspense>
  );
}
