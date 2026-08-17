"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';
import { useLanguage } from '../../../components/LanguageContext';
import { Phone, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { FormFieldLabel } from '../../../components/FormFieldLabel';
import { compressImageForUpload } from '../../../lib/compressImage';
import { getPortalToken, setPortalToken } from '../../../lib/portalAuth';

function friendlyOtpError(raw: string): string {
  const msg = String(raw || '');
  const lower = msg.toLowerCase();
  if (
    lower.includes('security purposes') ||
    lower.includes('rate limit') ||
    lower.includes('over_sms') ||
    lower.includes('only request this after')
  ) {
    return 'इस नंबर पर OTP हाल ही में भेजा गया है। 60–90 सेकंड बाद Resend दबाएँ। / OTP recently sent — wait 60–90s then Resend.';
  }
  if (lower.includes('unsupported phone') || lower.includes('sms provider') || lower.includes('signups not allowed')) {
    return 'SMS सेवा अस्थायी रूप से बंद है। थोड़ी देर बाद फिर कोशिश करें। / SMS temporarily unavailable.';
  }
  if (lower.includes('invalid phone') || lower.includes('phone number')) {
    return 'कृपया सही 10 अंकों का मोबाइल नंबर डालें।';
  }
  return msg || 'OTP भेजने में समस्या हुई। कृपया दोबारा कोशिश करें।';
}

// --- Translations ---
const translations = {
  hi: {
    joinPage: {
      header: {
        title: "पीपल्स ग्रीन पार्टी: असंगठित यूनियनों का सशक्तिकरण",
        subtitle: "एक साथ खड़े रहें, अपने अधिकारों के लिए लड़ें"
      },
      wizard: {
        heroTitle: 'पीपल्स ग्रीन पार्टी:\nअसंगठित यूनियनों का सशक्तिकरण',
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
        idCongrats: 'बधाई हो! आप अब यूनियन सदस्य हैं',
        idReady: 'आपका डिजिटल ID कार्ड तैयार है',
        downloadId: 'ID कार्ड डाउनलोड करें',
        goDashboard: 'डैशबोर्ड पर जाएँ',
      },
      form: {
        title: "पंजीकरण फॉर्म",
        subtitle: "हमारे साथ अपनी यात्रा शुरू करने के लिए नीचे दिया गया फॉर्म भरें।",
        fullName: "पूरा नाम",
        mobile: "मोबाइल नंबर",
        selectUnion: "अपना यूनियन चुनें",
        vehicleNumber: "वाहन नंबर",
        vehicleNumberPlaceholder: "अपना वाहन नंबर दर्ज करें (जैसे: RJ14AB1234)",
        governmentIdPlaceholder: "सरकारी ID नंबर (आधार/पैन/वोटर ID)",
        uploadPhotoLabel: "फोटो अपलोड करें",
        chooseFile: "फ़ाइल चुनें",
        photoSelected: "फोटो चुनी गई",
        noFileChosen: "कोई फ़ाइल नहीं चुनी गई",
        address: "पूरा घर का पता",
        addressPlaceholder: "अपना पूरा पता दर्ज करें",
        referralCode: "रेफरल कोड (वैकल्पिक)",
        referralPlaceholder: "रेफरल कोड दर्ज करें",
        submitting: "दर्ज किया जा रहा है...",
        submitRegistration: "पंजीकरण जमा करें",
        alreadyRegistered: "पहले से पंजीकृत हैं?",
        loginHere: "यहां लॉगिन करें →",
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
        vehicleNumber: "Vehicle Number",
        vehicleNumberPlaceholder: "Enter your vehicle number (e.g., RJ14AB1234)",
        governmentIdPlaceholder: "Government ID Number (Aadhaar/PAN/Voter ID)",
        uploadPhotoLabel: "Upload Photo",
        chooseFile: "Choose File",
        photoSelected: "Photo selected",
        noFileChosen: "No file chosen",
        address: "Full Home Address",
        addressPlaceholder: "Enter your complete address",
        referralCode: "Referral Code (Optional)",
        referralPlaceholder: "Enter referral code",
        submitting: "Submitting...",
        submitRegistration: "Submit Registration",
        alreadyRegistered: "Already registered?",
        loginHere: "Login here →",
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
  { value: 'ई-रिक्शा चालक यूनियन', label: 'ई-रिक्शा चालक यूनियन' },
  { value: 'हाट व ठेला विक्रेता यूनियन', label: 'हाट व ठेला विक्रेता यूनियन' },
  { value: 'राजस्थान गिग वर्कर्स यूनियन', label: 'राजस्थान गिग वर्कर्स यूनियन' },
  { value: 'राजस्थान वाहन चालक यूनियन', label: 'राजस्थान वाहन चालक यूनियन' },
  { value: 'अन्य', label: 'अन्य (विवरण दें)' },
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
    unionName: '',
    vehicleNumber: '',
    governmentId: '',
    address: '',
    photoUrl: '',
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
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // Countdown in seconds
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store File for upload after registration
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoHint, setPhotoHint] = useState('');

  const resetOtpState = () => {
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setShowOtpField(false);
    setPhoneVerified(false);
    setOtpSimulated(false);
    setResendTimer(0);
  };
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const registrationValidationError = useMemo(() => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    const mobile = formData.mobile.replace(/\D/g, '');
    if (mobile.length < 10) return 'Please enter a valid 10-digit mobile number.';
    if (!phoneVerified) return 'Please verify your phone number with OTP.';
    if (!formData.unionName) return 'Please select your Union.';
    // Vehicle number required for E-Rickshaw and Vahan Chalak unions
    const requiresVehicle = ['ई-रिक्शा चालक यूनियन', 'राजस्थान वाहन चालक यूनियन'].includes(formData.unionName);
    if (requiresVehicle && !formData.vehicleNumber.trim()) return 'Please enter your vehicle number.';
    if (!formData.governmentId.trim()) return 'Please enter your Government ID number.';
    if (!formData.address.trim()) return 'Please enter your address.';
    return null;
  }, [formData.name, formData.mobile, phoneVerified, formData.unionName, formData.vehicleNumber, formData.governmentId, formData.address]);

  const isRegistrationReady = useMemo(() => {
    return !registrationValidationError;
  }, [registrationValidationError]);

  // Clear form on mount; keep referral from ?ref=
  useEffect(() => {
    const urlRef = (searchParams?.get('ref') || '').toUpperCase();
    setFormData({
      name: '',
      mobile: '',
      unionName: '',
      vehicleNumber: '',
      governmentId: '',
      address: '',
      photoUrl: '',
      referralCode: urlRef,
    });
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setShowOtpField(false);
    setPhoneVerified(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        name: formData.name.trim(),
        phone: phoneNumber,
        password: randomPassword,
        address: formData.address.trim(),
        unionName: formData.unionName.trim(),
        vehicleNumber: formData.vehicleNumber.trim()
          ? formData.vehicleNumber.trim().toUpperCase()
          : undefined,
        governmentId: formData.governmentId.trim().toUpperCase(),
        authUserId: authUserData?.user?.id || undefined,
        referralCode: formData.referralCode.trim()
          ? formData.referralCode.trim().toUpperCase()
          : undefined,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      console.log('Union registration successful:', userData);

      if (typeof window !== 'undefined') {
        if (userData?.access_token) {
          setPortalToken('union', String(userData.access_token));
        }
        const { isAuthDevMode } = await import('../../../lib/authDevMode');
        if (isAuthDevMode() && userData?.id) {
          window.localStorage.setItem('devUserId', String(userData.id));
        }
      }

      // Upload photo separately after registration (prefer API JWT from register)
      if (selectedPhoto) {
        try {
          const { data: photoSession } = await supabase.auth.getSession();
          const photoToken =
            userData?.access_token ||
            photoSession?.session?.access_token ||
            getPortalToken('union');

          if (!photoToken) {
            throw new Error('No auth token for photo upload');
          }

          const { uploadMemberPhoto } = await import("../../../lib/uploadMemberPhoto");
          const uploaded = await uploadMemberPhoto(
            selectedPhoto,
            `Bearer ${photoToken}`,
            selectedPhoto.name || "profile.jpg",
          );
          if (!uploaded?.photoUrl) {
            throw new Error("Photo upload failed");
          }
          console.log('Photo uploaded successfully');
        } catch (photoError: any) {
          console.warn('Photo upload failed, but registration succeeded:', photoError);
          setOtpError(
            'पंजीकरण हो गया, लेकिन फोटो नहीं लगी। डैशबोर्ड से फोटो लगाएँ। / Registered, but photo failed — upload from dashboard.',
          );
          // Still go to dashboard after a short pause so they can fix photo
          await new Promise((r) => setTimeout(r, 1800));
        }
      }

      // Redirect to union dashboard after successful registration
      router.push('/union/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setOtpError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    // Only check phone number validation for OTP send
    const mobile = formData.mobile.replace(/\D/g, '');
    if (mobile.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const { isAuthDevMode } = await import('../../../lib/authDevMode');
    if (isAuthDevMode()) {
      setShowOtpField(true);
      setOtpSimulated(true);
      setOtpError('Dev mode: Use OTP: 123456');
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

      // Already a Union member → login, don't re-register
      if (check?.exists && (check?.portals?.union || check?.canLoginUnion)) {
        setOtpError('ALREADY_REGISTERED');
        setLoading(false);
        return;
      }

      // Party/Youth member without Union → allow OTP, then upgrade on submit
      // New phone → allow OTP for fresh Union registration
      // Do NOT write a pending DB row on OTP — incomplete joins polluted admin data.

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.warn('Supabase Auth Error:', error.message);
        throw error;
      }

      setShowOtpField(true);
      setOtpSent(true);
      setResendTimer(60); // Start 60 second countdown
      setOtpError('OTP भेज दिया गया। नहीं आया तो 60 सेकंड बाद Resend दबाएँ।');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const isConfigError = error.message === 'Unsupported phone provider' ||
        error.message?.includes('Unsupported phone provider') ||
        error.message === 'Failed to fetch' ||
        error.message?.includes('apikey') ||
        error.message?.includes('Signups not allowed');

      if (isConfigError && isAuthDevMode()) {
        console.warn('SMS provider not configured (dev simulation).', error.message);
        setShowOtpField(true);
        setOtpSimulated(true);
        setOtpError('SMS provider not configured. Use OTP: 123456');
        setResendTimer(60);
      } else if (isConfigError) {
        setOtpError(friendlyOtpError(error.message));
        setShowOtpField(true); // still show field so user can retry / change number
      } else {
        setOtpError(friendlyOtpError(error.message));
        // Rate-limit: keep OTP field open so they can wait + resend
        if (String(error.message || '').toLowerCase().includes('security purposes') ||
            String(error.message || '').toLowerCase().includes('rate')) {
          setShowOtpField(true);
          setResendTimer(60);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(): Promise<void> {
    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { isAuthDevMode } = await import('../../../lib/authDevMode');
      if (isAuthDevMode()) {
        if (otp === '123456') {
          setPhoneVerified(true);
          setShowOtpField(false);
          setOtpError('');
          return;
        }
        setOtpError('Invalid OTP. Use: 123456');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setOtpError(error.message || 'Invalid OTP. Please try again.');
        return;
      }

      setPhoneVerified(true);
      setShowOtpField(false);
      setOtpError('');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.message || 'Failed to verify OTP. Please try again.');
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
                  <div>
                    <FormFieldLabel required>{t.joinPage.form.fullName}</FormFieldLabel>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none"
                      placeholder={t.joinPage.form.fullName}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormFieldLabel required>{t.joinPage.form.mobile}</FormFieldLabel>
                      <div className="grid grid-cols-[70px_1fr] gap-3 min-w-0">
                        <div className="h-[46px] rounded-[10px] border border-[#BBF7D0] px-3 flex items-center justify-center font-semibold text-[#04330B] bg-white">+91</div>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '');
                            const normalized = (digits.length > 10 && digits.startsWith('91')) ? digits.slice(2) : (digits.startsWith('0') ? digits.slice(1) : digits);
                            const next = normalized.slice(0, 10);
                            if (next !== formData.mobile) {
                              resetOtpState();
                            }
                            setFormData({ ...formData, mobile: next });
                          }}
                          inputMode="numeric"
                          className="h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none min-w-0"
                          placeholder={t.joinPage.form.mobile}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* OTP Send / Resend */}
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        loading ||
                        formData.mobile.length < 10 ||
                        phoneVerified ||
                        (showOtpField && resendTimer > 0)
                      }
                      className="w-full h-[46px] rounded-[10px] bg-[#04330B] text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : phoneVerified ? (
                        '✓ Verified'
                      ) : showOtpField ? (
                        resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'
                      ) : (
                        'Send OTP'
                      )}
                    </button>

                    {/* OTP Input Field */}
                    {showOtpField && !phoneVerified && (
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <FormFieldLabel required>OTP</FormFieldLabel>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          inputMode="numeric"
                          className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none text-center tracking-[0.5em]"
                          placeholder="Enter OTP"
                          autoComplete="one-time-code"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={loading || otp.length < 6}
                          className="w-full h-[40px] rounded-[10px] bg-[#22C55E] text-white font-semibold disabled:opacity-60"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <p className="text-[11px] text-[#587E67] font-semibold text-center">
                          OTP नहीं आया? नंबर चेक करें, 60 सेकंड बाद ऊपर Resend दबाएँ।
                        </p>
                        {otpError && otpError !== 'ALREADY_REGISTERED' && <div className="text-center text-[12px] text-red-500 font-semibold">{otpError}</div>}
                        {otpError === 'ALREADY_REGISTERED' && (
                          <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-amber-700 text-sm font-semibold mb-2">
                              यह नंबर पहले से यूनियन सदस्य है।<br/>
                              <span className="text-xs">(Already a Union member — please login)</span>
                            </p>
                            <button
                              type="button"
                              onClick={() => router.push('/union/login')}
                              className="w-full h-[36px] rounded-[8px] bg-[#04330B] text-white text-sm font-semibold"
                            >
                              यूनियन लॉगिन → (Union Login)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {!showOtpField && otpError && otpError !== 'ALREADY_REGISTERED' && (
                      <div className="text-center text-[12px] text-red-500 font-semibold">{otpError}</div>
                    )}
                    {!showOtpField && otpError === 'ALREADY_REGISTERED' && (
                      <div className="text-center bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-amber-700 text-sm font-semibold mb-2">
                          यह नंबर पहले से यूनियन सदस्य है। Login करें।
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push('/union/login')}
                          className="w-full h-[36px] rounded-[8px] bg-[#04330B] text-white text-sm font-semibold"
                        >
                          यूनियन लॉगिन →
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <FormFieldLabel required>{t.joinPage.form.selectUnion}</FormFieldLabel>
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
                  </div>

                  {['ई-रिक्शा चालक यूनियन', 'राजस्थान वाहन चालक यूनियन'].includes(formData.unionName) && (
                    <div>
                      <FormFieldLabel required>{t.joinPage.form.vehicleNumber}</FormFieldLabel>
                      <input
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                        className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none uppercase"
                        placeholder={t.joinPage.form.vehicleNumberPlaceholder}
                        autoComplete="off"
                      />
                    </div>
                  )}

                  <div>
                    <FormFieldLabel required>Government ID</FormFieldLabel>
                    <input
                      type="text"
                      value={formData.governmentId}
                      onChange={(e) => setFormData({ ...formData, governmentId: e.target.value.toUpperCase() })}
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none uppercase"
                      placeholder={t.joinPage.form.governmentIdPlaceholder}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormFieldLabel>{t.joinPage.form.uploadPhotoLabel}</FormFieldLabel>
                    <div className="w-full min-h-[46px] rounded-[10px] border border-[#BBF7D0] bg-white flex items-center px-4 py-2">
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setPhotoBusy(true);
                          setPhotoHint('');
                          try {
                            const compressed = await compressImageForUpload(file);
                            setSelectedPhoto(compressed);
                            if (formData.photoUrl?.startsWith('blob:')) {
                              URL.revokeObjectURL(formData.photoUrl);
                            }
                            setFormData({ ...formData, photoUrl: URL.createObjectURL(compressed) });
                            setPhotoHint('फोटो तैयार है। Submit के बाद कार्ड पर लगेगी।');
                          } catch (err: any) {
                            setSelectedPhoto(null);
                            setPhotoHint(err?.message || 'Photo failed. Use a clear JPG/PNG under 5MB.');
                          } finally {
                            setPhotoBusy(false);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="py-2 px-4 rounded-full bg-[#DCFCE7] text-[#04330B] font-semibold cursor-pointer hover:bg-[#BBF7D0] transition-colors"
                      >
                        {photoBusy ? 'Processing…' : t.joinPage.form.chooseFile}
                      </label>
                      <span className="ml-3 text-[#04330B]/60 text-sm truncate">
                        {selectedPhoto ? t.joinPage.form.photoSelected : t.joinPage.form.noFileChosen}
                      </span>
                    </div>
                    {photoHint ? (
                      <p className="text-[11px] font-semibold text-[#0D5229]">{photoHint}</p>
                    ) : (
                      <p className="text-[11px] text-[#587E67] font-semibold">
                        JPG/PNG चुनें। बाद में डैशबोर्ड से भी फोटो बदल सकते हैं।
                      </p>
                    )}
                    {formData.photoUrl && (
                      <img src={formData.photoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto" />
                    )}
                  </div>

                  <div>
                    <FormFieldLabel required>{t.joinPage.form.address}</FormFieldLabel>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full h-[100px] rounded-[10px] border border-[#BBF7D0] p-3 font-semibold text-[#04330B] outline-none resize-none"
                      placeholder={t.joinPage.form.addressPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">
                      {t.joinPage.form.referralCode}
                    </label>
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referralCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-3 font-semibold text-[#04330B] outline-none"
                      placeholder={t.joinPage.form.referralPlaceholder}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !isRegistrationReady}
                    className="w-full h-[50px] rounded-[12px] bg-gradient-to-r from-[#04330B] to-[#0B5A2A] text-white font-semibold disabled:opacity-60"
                  >
                    {loading ? t.joinPage.form.submitting : t.joinPage.form.submitRegistration}
                  </button>

                  {/* Login Link for existing users */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm mb-2">
                      {t.joinPage.form.alreadyRegistered}
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/union/login')}
                      className="text-[#04330B] font-bold hover:underline"
                    >
                      {t.joinPage.form.loginHere}
                    </button>
                  </div>

                  {otpError && otpError !== 'ALREADY_REGISTERED' && <div className="text-center text-[12px] text-red-500 font-semibold">{otpError}</div>}
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
