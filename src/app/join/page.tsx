"use client";

import React, { useState, useEffect, ChangeEvent, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';
import { getTranslation } from './location_utils';
import { useLanguage } from '../../components/LanguageContext';
import { Share2 } from 'lucide-react';
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
      invite: {
        title: "Share Your Invitation",
        titleGeneric: "Invite Your Friends",
        subtitle: "Together we are stronger. Use your personal QR code to grow our community.",
        subtitleGeneric: "Become a part of the green revolution and start building your network today.",
        scanToJoin: "SCAN TO JOIN PGP",
        shareWhatsApp: "Share on WhatsApp",
        copyLink: "Copy Invite Link",
        linkCopied: "Link copied to clipboard!",
        steps: {
          step1: { title: "Scan QR", desc: "Quick join in seconds" },
          step2: { title: "Share link", desc: "Invite your network" }
        },
        whyJoin: {
          title: "Why Invite Friends?",
          descPart1: "The Peoples Green Party is a",
          descPart2: "people-powered movement",
          descPart3: ". By inviting others, you help us bring",
          descPart4: "sustainable change",
          descPart5: "to",
          descPart6: "Rajasthan",
          descPart7: ". Join hands for a greener tomorrow!"
        }
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
      invite: {
        title: "अपना निमंत्रण साझा करें",
        titleGeneric: "अपने मित्रों को आमंत्रित करें",
        subtitle: "साथ मिलकर हम मजबूत हैं। हमारे समुदाय को बढ़ाने के लिए अपने व्यक्तिगत क्यूआर कोड का उपयोग करें।",
        subtitleGeneric: "हरित क्रांति का हिस्सा बनें और आज ही अपना नेटवर्क बनाना शुरू करें।",
        scanToJoin: "जुड़ने के लिए स्कैन करें",
        shareWhatsApp: "WhatsApp पर साझा करें",
        copyLink: "लिंक कॉपी करें",
        linkCopied: "लिंक क्लिपबोर्ड पर कॉपी हो गया!",
        steps: {
          step1: { title: "क्यूआर स्कैन करें", desc: "सेकंडों में हमसे जुड़ें" },
          step2: { title: "लिंक साझा करें", desc: "अपने नेटवर्क को जोड़ें" }
        },
        whyJoin: {
          title: "मित्रों को आमंत्रित क्यों करें?",
          descPart1: "पीपल्स ग्रीन पार्टी एक",
          descPart2: "जन-शक्ति आंदोलन",
          descPart3: "है। दूसरों को आमंत्रित करके, आप",
          descPart4: "राजस्थान",
          descPart5: "में",
          descPart6: "सतत परिवर्तन",
          descPart7: "लाने में हमारी मदद करते हैं। एक बेहतर कल के लिए हाथ मिलाएं! ✨"
        }
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
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);

  // Determine the effective origin for QR and Sharing
  // Using the Vercel deployment URL as requested for testing
  const effectiveOrigin = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' ? 'https://web-tau-tawny-syvli4qect.vercel.app' : window.location.origin)
    : 'https://web-tau-tawny-syvli4qect.vercel.app';

  // Load user info if logged in (for referral QR)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const { fetchApi } = await import('../../lib/api');
        const summary = await fetchApi('users/me/summary');
        if (summary?.user?.referralCode) {
          setUserReferralCode(summary.user.referralCode);
        }
      } catch (e) {
        console.warn('Could not fetch user info on join page', e);
      }
    };
    fetchUser();
  }, []);

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
        <section className="w-full h-auto flex flex-col lg:flex-row gap-[24px] justify-center items-center lg:items-start py-[40px] pb-[120px]">

          {/* Left: Interactive Section (QR Invite + Video/Image) */}
          {/* Left: Enhanced Invitation Section */}
          <div className="relative w-full lg:w-[512px] h-auto lg:h-[950px] flex flex-col shadow-[0px_20px_60px_rgba(0,0,0,0.15)] rounded-[12px] bg-white border border-[#E4F2EA] overflow-hidden shrink-0 mb-8 bg-gradient-to-br from-white via-[#F7FCF9] to-[#ECFDF5]">
            {/* Green Aesthetic Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#059669] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 p-8 py-10 flex flex-col items-center gap-8 relative z-10">
              {/* Header */}
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-[28px] font-bold text-[#04330B] tracking-tight">
                  {userReferralCode ? t.joinPage.invite.title : t.joinPage.invite.titleGeneric}
                </h3>
                <p className="text-[15px] text-[#587E67] max-w-[340px] leading-relaxed font-medium">
                  {userReferralCode
                    ? t.joinPage.invite.subtitle
                    : t.joinPage.invite.subtitleGeneric}
                </p>
              </div>

              {/* QR Code Container with Premium Glow */}
              <div className="bg-white p-5 rounded-[32px] border border-[#B9D3C4] shadow-[0px_20px_40px_rgba(16,185,129,0.12)] relative group ring-8 ring-[#10B981]/5 transition-transform hover:scale-[1.02]">
                {userReferralCode ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${effectiveOrigin}/join?ref=${userReferralCode}`)}`}
                      alt="Referral QR Code"
                      className="w-[170px] h-[170px] block"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="px-5 py-2 bg-[#04330B] text-white font-bold rounded-full text-[12px] uppercase tracking-[0.2em] shadow-lg">
                      REF: {userReferralCode}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${effectiveOrigin}/join`)}`}
                        alt="Generic Join Link QR"
                        className="w-[170px] h-[170px] block"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div className="px-5 py-2 bg-[#10B981] text-white font-bold rounded-full text-[12px] uppercase tracking-[0.1em] shadow-md">
                      {t.joinPage.invite.scanToJoin}
                    </div>
                  </div>
                )}
              </div>

              {/* Sharing Buttons */}
              <div className="flex flex-row flex-wrap justify-center gap-4 w-full max-w-[440px]">
                <button
                  onClick={() => {
                    const url = `${effectiveOrigin}/join${userReferralCode ? `?ref=${userReferralCode}` : ''}`;
                    const text = language === 'hi'
                      ? (userReferralCode
                        ? `नमस्ते! पीपल्स ग्रीन पार्टी आंदोलन में मेरे साथ शामिल हों। 🌿 यहाँ पंजीकरण करें: ${url}`
                        : `नमस्ते! आज ही पीपल्स ग्रीन Party आंदोलन में शामिल हों! 🌿 यहाँ पंजीकरण करें: ${url}`)
                      : (userReferralCode
                        ? `Namaste! Join me in the Peoples Green Party movement. 🌿 Register here: ${url}`
                        : `Namaste! Join the Peoples Green Party movement today! 🌿 Register here: ${url}`);
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#20bd5a] hover:scale-[1.05] transition-all shadow-xl active:scale-95 text-[14px] whitespace-nowrap"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>{t.joinPage.invite.shareWhatsApp}</span>
                </button>

                <button
                  onClick={() => {
                    const url = `${effectiveOrigin}/join${userReferralCode ? `?ref=${userReferralCode}` : ''}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                      alert(t.joinPage.invite.linkCopied);
                    }
                  }}
                  className="flex items-center justify-center gap-3 bg-white border border-[#10B981]/30 text-[#04330B] px-8 py-3.5 rounded-full font-bold hover:bg-[#EAF7EE] transition-all text-[14px] shadow-lg active:scale-95 whitespace-nowrap"
                >
                  <Share2 size={20} />
                  <span>{t.joinPage.invite.copyLink}</span>
                </button>
              </div>

              {/* Informational Section to fill space */}
              <div className="w-full flex flex-col gap-5 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#10B981]/10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-[#EAF7EE] rounded-full flex items-center justify-center text-[#10B981] font-bold">1</div>
                    <p className="text-[13px] font-bold text-[#04330B]">{t.joinPage.invite.steps.step1.title}</p>
                    <p className="text-[11px] text-[#587E67]">{t.joinPage.invite.steps.step1.desc}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#10B981]/10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-[#EAF7EE] rounded-full flex items-center justify-center text-[#10B981] font-bold">2</div>
                    <p className="text-[13px] font-bold text-[#04330B]">{t.joinPage.invite.steps.step2.title}</p>
                    <p className="text-[11px] text-[#587E67]">{t.joinPage.invite.steps.step2.desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Join PGP? - Full Touch Footer with Animations */}
            <div className="bg-[#04330B] px-8 pt-8 pb-14 text-left relative overflow-hidden group mt-auto border-t border-[#10B981]/20">
              {/* Dynamic Animated Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981] opacity-20 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125 blur-[100px] animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#059669] opacity-10 rounded-full -ml-16 -mb-16 blur-[60px]" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-white font-bold text-[20px] font-['Familjen_Grotesk'] tracking-tight">
                    {t.joinPage.invite.whyJoin.title}
                  </h4>
                  <span className="inline-block animate-bounce origin-bottom">🌿</span>
                </div>

                <p className="text-[#A7CBB6] text-[14px] leading-relaxed font-medium tracking-tight max-w-[420px]">
                  {language === 'hi' ? (
                    <>
                      {t.joinPage.invite.whyJoin.descPart1} <span className="text-white font-bold">{t.joinPage.invite.whyJoin.descPart2}</span> {t.joinPage.invite.whyJoin.descPart3} <span className="text-[#10B981] font-bold">{t.joinPage.invite.whyJoin.descPart4}</span> {t.joinPage.invite.whyJoin.descPart5} <span className="text-[#10B981] font-bold underline decoration-2 underline-offset-4">{t.joinPage.invite.whyJoin.descPart6}</span> {t.joinPage.invite.whyJoin.descPart7}
                    </>
                  ) : (
                    <>
                      {t.joinPage.invite.whyJoin.descPart1} <span className="text-white font-bold">{t.joinPage.invite.whyJoin.descPart2}</span>{t.joinPage.invite.whyJoin.descPart3} <span className="text-[#10B981] font-bold">{t.joinPage.invite.whyJoin.descPart4}</span> {t.joinPage.invite.whyJoin.descPart5} <span className="text-[#10B981] font-bold underline decoration-2 underline-offset-4">{t.joinPage.invite.whyJoin.descPart6}</span> {t.joinPage.invite.whyJoin.descPart7}
                    </>
                  )}
                </p>
              </div>

              {/* Interactive Hover Border Glow */}
              <div className="absolute inset-0 border-t-2 border-transparent group-hover:border-[#10B981]/30 transition-all duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Right: Registration Form - Fixed Width on Desktop */}
          <div
            className="w-full lg:w-[512px] h-auto lg:h-[950px] bg-gradient-to-br from-white via-[#F7FCF9] to-[#ECFDF5] rounded-[12px] border border-[#E4F2EA] p-[32px] flex flex-col gap-[28px] shadow-[0px_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden shrink-0 mb-8"
          >
            {/* Green Aesthetic Effects for Form */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#10B981] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#059669] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
            {/* Form Header Section */}
            <div className="w-full lg:w-[448px] h-auto lg:h-[72px] flex flex-col gap-[12px] items-center relative z-10">
              <h2 className="w-full text-center text-[32px] leading-[38px] font-semibold tracking-[-0.3px] text-[#04330B] font-['Familjen_Grotesk']">
                {t.joinPage.form.title}
              </h2>
              <p className="w-full lg:w-[380px] text-center text-[16px] leading-[22px] font-semibold tracking-[-0.3px] text-[#587E67] font-['Familjen_Grotesk']">
                {t.joinPage.form.subtitle}
              </p>
            </div>

            {/* Form Content Section */}
            <form
              className="w-full lg:w-[448px] flex flex-col items-center overflow-y-auto custom-noscroll relative z-10"
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
        </section>
        {/* 3. Dedicated Video Section (Below Content) */}
        <section className="w-full px-4 mb-[120px]">
          <div className="max-w-[1048px] mx-auto">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-[24px] overflow-hidden shadow-[0px_30px_70px_rgba(0,0,0,0.2)] group">
              <img
                src="/joinus.png"
                alt="People gathering"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay with subtle green tint */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(180deg, rgba(4, 51, 11, 0) 0%, rgba(4, 51, 11, 0.6) 100%)'
                }}
              />

              {/* Play Button matching Donation Page style */}
              <button
                type="button"
                className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] hover:scale-110 transition-transform"
              >
                <img src="/Play-Button.svg" alt="Play" className="w-full h-full" />
              </button>

              {/* Video Info Label */}
              <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-2">
                <div className="px-3 py-1 bg-[#10B981] text-white text-[12px] font-bold rounded-full w-fit uppercase tracking-widest shadow-lg">
                  Watch Story
                </div>
                <h3 className="text-white text-3xl font-bold font-['Familjen_Grotesk'] drop-shadow-md">
                  Experience the PGP Movement 🌿
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>

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