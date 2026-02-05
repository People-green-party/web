"use client";

import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';
import { getTranslation } from './location_utils';
import { useLanguage } from '../../components/LanguageContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

// --- Translations ---
const translations = {
  en: {
    joinPage: {
      header: {
        title: "Join Peoples Green Party",
        subtitle: "Unite for Progress, Stand for a Better Tomorrow"
      },
      form: {
        title: "Registration Form",
        subtitle: "Fill the form below to begin your journey with us.",
        firstName: "First Name",
        lastName: "Last Name",
        mobile: "Mobile Number",
        state: "State",
        district: "District",
        constituency: "Assembly Constituency",
        zip: "ZIP/Postal Code",
        agreeJoin: "Do you agree to join the party?",
        agreeResponsibility: "Do you want to take any responsibility or position in the party?",
        submit: "Join Us"
      },
      options: {
        states: ["Rajasthan", "Uttar Pradesh"],
        districts: ["Jaipur", "Agra"],
        constituencies: ["Constituency 1", "Constituency 2"]
      }
    }
  },
  hi: {
    joinPage: {
      header: {
        title: "पीपल्स ग्रीन पार्टी से जुड़ें",
        subtitle: "प्रगति के लिए एकजुट हों, बेहतर कल के लिए खड़े हों"
      },
      form: {
        title: "पंजीकरण फॉर्म",
        subtitle: "हमारे साथ अपनी यात्रा शुरू करने के लिए नीचे दिया गया फॉर्म भरें।",
        firstName: "पहला नाम",
        lastName: "अंतिम नाम",
        mobile: "मोबाइल नंबर",
        state: "राज्य",
        district: "ज़िला",
        constituency: "विधान सभा क्षेत्र",
        zip: "पिन कोड",
        agreeJoin: "क्या आप पार्टी में शामिल होने के लिए सहमत हैं?",
        agreeResponsibility: "क्या आप पार्टी में कोई जिम्मेदारी या पद लेना चाहते हैं?",
        submit: "जुड़ें"
      },
      options: {
        states: ["राजस्थान", "उत्तर प्रदेश"],
        districts: ["जयपुर", "आगरा"],
        constituencies: ["निर्वाचन क्षेत्र 1", "निर्वाचन क्षेत्र 2"]
      }
    }
  }
};

// --- Join Page Content ---

const JoinPageContent = () => {
  const { language } = useLanguage();
  // Fallback to English if key missing, or use local translations
  const t = translations[language as keyof typeof translations] || translations.en;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [loksabhas, setLoksabhas] = useState<any[]>([]);
  const [vidhansabhas, setVidhansabhas] = useState<any[]>([]);
  const [localUnits, setLocalUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    pin: '',
    referralCode: '',
    loksabhaId: '',
    vidhansabhaId: '',
    localUnitId: '',
    customLocalUnitName: '',
    agreeJoin: false,
    agreeResponsibility: false
  });
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState({ loksabhas: false, vidhansabhas: false, localUnits: false });

  // Load Loksabhas on mount
  useEffect(() => {
    setLocLoading(prev => ({ ...prev, loksabhas: true }));
    setApiError(null);
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi('geo/loksabhas')
        .then(data => {
          setLoksabhas(data);
          if (Array.isArray(data) && data.length === 0) {
            console.warn("Loksabhas list is empty from API");
          }
        })
        .catch(err => {
          console.error("Failed to load Loksabhas", err);
          setApiError("Failed to load districts. Please check your internet connection.");
        })
        .finally(() => setLocLoading(prev => ({ ...prev, loksabhas: false })));
    });
  }, []);

  // Clear form on mount but preserve referral code if present in URL
  useEffect(() => {
    const urlRefCode = searchParams.get('ref') || '';

    setFormData({
      firstName: '',
      lastName: '',
      mobile: '',
      pin: '',
      referralCode: urlRefCode, // Set from URL
      loksabhaId: '',
      vidhansabhaId: '',
      localUnitId: '',
      customLocalUnitName: '',
      agreeJoin: false,
      agreeResponsibility: false
    });
    setShowReferralInput(!!urlRefCode);
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setShowOtpField(false);
  }, [searchParams]);

  useEffect(() => {
    const vidhansabhaId = formData.vidhansabhaId;
    if (!vidhansabhaId) {
      setLocalUnits([]);
      return;
    }

    setLocLoading(prev => ({ ...prev, localUnits: true }));
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi(`geo/vidhansabhas/${vidhansabhaId}/local-units`)
        .then((data) => setLocalUnits(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error('Failed to load Local Units', err);
          setLocalUnits([]);
        })
        .finally(() => setLocLoading(prev => ({ ...prev, localUnits: false })));
    });
  }, [formData.vidhansabhaId]);


  async function handleSubmit() {
    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      setOtpError('Please fill all required fields');
      return;
    }

    if (!formData.agreeJoin || !formData.agreeResponsibility) {
      setOtpError('Please agree to the terms');
      return;
    }
    if (!formData.pin || formData.pin.length < 4 || formData.pin.length > 8) {
      setOtpError('Please create a 4-8 digit Login PIN');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      const randomPassword = Math.random().toString(36).slice(-8) + "Aa1!";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password: randomPassword,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });

      const isPhoneSignupDisabled =
        !!authError &&
        (authError.message.includes('Phone signups are disabled') ||
          authError.message.includes('Phone signups disabled'));

      if (authError) {
        if (isPhoneSignupDisabled) {
          console.warn('Phone signups disabled; continuing with backend registration without auth user id');
        }
        if (authError.message.includes('already registered') ||
          authError.message.includes('already been registered') ||
          authError.message.includes('User already registered') ||
          authError.message.includes('duplicate')) {
          setOtpError('This phone number is already registered. Please sign in instead.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        } else if (!isPhoneSignupDisabled) {
          throw authError;
        }
      }

      const { fetchApi } = await import('../../lib/api');

      if (!formData.localUnitId) {
        setOtpError('Please select your Local Unit');
        return;
      }
      if (formData.localUnitId === 'other' && !formData.customLocalUnitName) {
        setOtpError('Please enter your Village/Ward Name');
        return;
      }
      const userProfileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: phoneNumber,
        password: randomPassword,
        pin: formData.pin,
        address: 'India',
        localUnitId: formData.localUnitId === 'other' ? undefined : parseInt(formData.localUnitId),
        customLocalUnitName: formData.localUnitId === 'other' ? formData.customLocalUnitName : undefined,
        vidhansabhaId: formData.vidhansabhaId ? parseInt(formData.vidhansabhaId) : undefined,
        referralCode: formData.referralCode || undefined,
        authUserId: isPhoneSignupDisabled ? undefined : authData?.user?.id,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      console.log('Registration successful:', userData);

      if (typeof window !== 'undefined') {
        if (userData?.user?.id) {
          window.localStorage.setItem('devUserId', String(userData.user.id));
        }
        if (userData?.access_token) {
          window.localStorage.setItem('access_token', userData.access_token);
        }
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setOtpError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLoksabhaChange(event: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const loksabhaId = event.target.value;
    setFormData(prev => ({ ...prev, loksabhaId, vidhansabhaId: '', localUnitId: '' }));

    if (!loksabhaId) {
      setVidhansabhas([]);
      setLocalUnits([]);
      return;
    }

    setLocLoading(prev => ({ ...prev, vidhansabhas: true }));
    try {
      const { fetchApi } = await import('../../lib/api');
      const data = await fetchApi(`geo/loksabhas/${loksabhaId}/vidhansabhas`);
      setVidhansabhas(Array.isArray(data) ? data : []);
      setLocalUnits([]);
    } catch (error) {
      console.error('Error loading Vidhansabhas:', error);
      setVidhansabhas([]);
      setLocalUnits([]);
    } finally {
      setLocLoading(prev => ({ ...prev, vidhansabhas: false }));
    }
  }

  async function handleVerifyOtp(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) {
        if (otp === '123456' && otpError?.includes('Simulating OTP sent')) {
          console.log('Simulated OTP verification successful');
          handleSubmit();
          return;
        }
        throw error;
      }
      console.log('OTP verified successfully');
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

    if (!formData.mobile) {
      setOtpError('Mobile number is required');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const { supabase } = await import('../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.warn('Supabase Auth Error (falling back to simulation):', error.message);
        throw error;
      }

      setOtpSent(true);
      setShowOtpField(true);
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
        setOtpError('SMS provider not configured. Simulating OTP sent. Use OTP: 123456');
      } else {
        setOtpError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      {/* MAIN CONTENT WRAPPER */}
      <main className="w-full max-w-[1320px] px-4 lg:px-8 mt-[12px] flex flex-col items-center">

        {/* 1. Page Header Section */}
        <div className="flex flex-col items-center gap-[16px] w-full max-w-[676px] text-center">
          <h1 className="w-full font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
            {t.joinPage.header.title}
          </h1>
          <p className="w-full font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
            {t.joinPage.header.subtitle}
          </p>
        </div>

        {/* Gap between Header and Content */}
        <div className="h-[32px] w-full"></div>

        {/* 2. Content Section (Video + Form) */}
        <section className="w-full h-auto lg:h-[950px] flex flex-col lg:flex-row gap-[24px] pb-[80px]">

          {/* Left: Video Section - Fluid Width */}
          <div className="relative w-full lg:flex-1 h-[400px] lg:h-[950px] rounded-[8px] overflow-hidden bg-gray-100">
            <img
              src="/joinus.png"
              alt="People gathering"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(269.13deg, rgba(0, 0, 0, 0) 2.53%, rgba(0, 0, 0, 0.15) 99.37%)'
              }}
            />
            <button
              type="button"
              className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] hover:scale-105 transition-transform"
            >
              <img src="/Play-Button.svg" alt="Play" className="w-full h-full" />
            </button>
          </div>

          {/* Right: Registration Form - Fixed Width on Desktop */}
          <div
            className="w-full lg:w-[512px] h-auto lg:h-[950px] bg-white rounded-[8px] border border-[#E4F2EA] p-[32px] flex flex-col gap-[28px] shadow-[0px_4px_20px_0px_#0000001A] shrink-0"
          >
            {/* Form Header Section */}
            <div className="w-full lg:w-[448px] h-auto lg:h-[72px] flex flex-col gap-[12px] items-center">
              <h2 className="w-full text-center text-[32px] leading-[38px] font-semibold tracking-[-0.3px] text-[#04330B] font-['Familjen_Grotesk']">
                {t.joinPage.form.title}
              </h2>
              <p className="w-full lg:w-[380px] text-center text-[16px] leading-[22px] font-semibold tracking-[-0.3px] text-[#587E67] font-['Familjen_Grotesk']">
                {t.joinPage.form.subtitle}
              </p>
            </div>

            {/* Form Content Section */}
            <form
              className="w-full lg:w-[448px] flex flex-col items-center overflow-y-auto custom-noscroll"
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              autoComplete="off"
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                  .custom-noscroll::-webkit-scrollbar {
                    display: none;
                  }
                `}} />

              {/* Main Section */}
              <div className="flex flex-col w-full gap-[20px]">

                {/* Input Fields Section */}
                <div className="flex flex-col gap-[20px] w-full">
                  {/* 1. First Name */}
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.firstName}
                    autoComplete="off"
                  />

                  {/* 2. Last Name */}
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.lastName}
                    autoComplete="off"
                  />

                  {/* 3. Mobile */}
                  <div className="w-full h-[46px] flex gap-[8px]">
                    <div className="relative h-full w-[100px]">
                      <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[12px] pr-8 py-[12px] text-[16px] bg-white text-[#587E67] font-semibold tracking-[-0.3px] outline-none cursor-pointer">
                        <option>+91</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="flex-1 h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk']"
                      placeholder={t.joinPage.form.mobile}
                      autoComplete="off"
                    />
                  </div>

                  {/* 3b. Login PIN */}
                  <div className="w-full">
                    <input
                      type="password"
                      inputMode="numeric"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[0.2em] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk'] text-center"
                      placeholder="CREATE 6-DIGIT PIN"
                      autoComplete="new-password"
                    />
                    <p className="text-[11px] text-[#587E67] mt-1 text-center">
                      This PIN will be used to login to your dashboard later.
                    </p>
                  </div>

                  {/* 3c. Referral Code */}
                  <div className="w-full">
                    {!showReferralInput && !formData.referralCode ? (
                      <button
                        type="button"
                        onClick={() => setShowReferralInput(true)}
                        className="text-[#0D5229] text-sm font-semibold hover:underline"
                      >
                        + I have a referral code
                      </button>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="block text-xs mb-0.5 text-[#587E67]">
                          Referral Code (Optional)
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
                          placeholder="e.g. RAJ123"
                          className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[0.15em] text-[14px] placeholder-[#A3B8AA] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk'] uppercase bg-[#F9FBFA]"
                          autoComplete="off"
                        />
                        <p className="text-[11px] text-[#8CA596] mt-0.5">
                          Enter the code of the person who invited you. This helps us credit them for your membership.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4. District (Loksabha) */}
                  <div className="relative w-full h-[46px]">
                    <select
                      value={formData.loksabhaId}
                      onChange={handleLoksabhaChange}
                      disabled={locLoading.loksabhas}
                      className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] pr-10 py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk'] disabled:opacity-60 truncate"
                    >
                      <option value="">
                        {locLoading.loksabhas ? 'Loading...' : `${t.joinPage.form.district} (Loksabha)`}
                      </option>
                      {loksabhas.map((l: any) => (
                        <option key={l.id} value={l.id}>{getTranslation(l.name, language)}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                  {apiError && <p className="text-xs text-red-500 mt-[-15px] self-start">{apiError}</p>}

                  {/* 6. Constituency */}
                  <div className="relative w-full h-[46px]">
                    <select
                      value={formData.vidhansabhaId}
                      onChange={(e) => setFormData({ ...formData, vidhansabhaId: e.target.value })}
                      disabled={!formData.loksabhaId || locLoading.vidhansabhas}
                      className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] pr-10 py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk'] disabled:opacity-60 truncate"
                    >
                      <option value="">
                        {locLoading.vidhansabhas ? 'Loading constituencies...' : (formData.loksabhaId && vidhansabhas.length === 0 ? 'No constituencies found' : t.joinPage.form.constituency)}
                      </option>
                      {vidhansabhas.map((v: any) => (
                        <option key={v.id} value={v.id}>{getTranslation(v.name, language)}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  {/* 6b. Local Unit */}
                  <select
                    value={formData.localUnitId}
                    onChange={(e) => setFormData({ ...formData, localUnitId: e.target.value })}
                    disabled={!formData.vidhansabhaId || locLoading.localUnits}
                    className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] pr-10 py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk'] disabled:opacity-60 disabled:cursor-not-allowed truncate"
                  >
                    <option value="">
                      {locLoading.localUnits ? 'Loading units...' : (formData.vidhansabhaId && localUnits.length === 0 ? 'No Local Units found' : 'Select your Local Unit')}
                    </option>
                    {localUnits.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {getTranslation(u.name, language)}{u.type ? ` (${u.type})` : ''}
                      </option>
                    ))}
                    <option value="other">Other / My Village is not listed</option>
                  </select>

                  {/* 6c. Custom Local Unit Input */}
                  {formData.localUnitId === 'other' && (
                    <input
                      type="text"
                      value={formData.customLocalUnitName}
                      onChange={(e) => setFormData({ ...formData, customLocalUnitName: e.target.value })}
                      className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:border-[#04330B] focus:ring-0 transition-colors outline-none font-['Familjen_Grotesk']"
                      placeholder="Enter Village or Ward Name"
                      autoComplete="off"
                    />
                  )}
                </div>

                {/* --- CHECKBOX SECTION --- */}
                <div className="w-full flex flex-col gap-[16px] mt-[4px]">

                  {/* First Checkbox */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreeJoin}
                        onChange={(e) => setFormData({ ...formData, agreeJoin: e.target.checked })}
                        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
                      />
                      <div
                        className="w-[15px] h-[15px] bg-white border-[2px] border-[#587E67] rounded-none peer-checked:bg-[#587E67] pointer-events-none transition-all"
                        style={{ width: '15px', height: '15px' }}
                      />
                      <svg
                        className="absolute inset-0 m-auto w-[11px] h-[11px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200 z-20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="flex-1 text-[14px] leading-[20px] font-semibold text-[#587E67] tracking-[-0.3px] font-['Familjen_Grotesk']">
                      {t.joinPage.form.agreeJoin}
                    </span>
                  </label>

                  {/* Second Checkbox */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreeResponsibility}
                        onChange={(e) => setFormData({ ...formData, agreeResponsibility: e.target.checked })}
                        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
                      />
                      <div
                        className="w-[15px] h-[15px] bg-white border-[2px] border-[#587E67] rounded-none peer-checked:bg-[#587E67] pointer-events-none transition-all"
                        style={{ width: '15px', height: '15px' }}
                      />
                      <svg
                        className="absolute inset-0 m-auto w-[11px] h-[11px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200 z-20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="flex-1 text-[14px] leading-[20px] font-semibold text-[#587E67] tracking-[-0.3px] font-['Familjen_Grotesk']">
                      {t.joinPage.form.agreeResponsibility}
                    </span>
                  </label>
                </div>

                <div className="h-[24px] w-full shrink-0"></div>

                {otpSent && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP sent to {formData.mobile}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="flex-1 h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading || !otp}
                        className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    {otpError && (
                      <p className="mt-1 text-sm text-red-600">{otpError}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                      Didn't receive OTP?{' '}
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-600 hover:underline"
                        disabled={loading}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                ) : !showOtpField && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          </div>
        </section >
      </main >

      <Footer />
    </div >
  );
};

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <JoinPageContent />
    </Suspense>
  );
}