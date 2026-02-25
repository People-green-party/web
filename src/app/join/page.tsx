"use client";

import React, { useMemo, useRef, useState, useEffect, ChangeEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';
import { getTranslation } from './location_utils';
import { useLanguage } from '../../components/LanguageContext';
import { Phone } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import html2canvas from 'html2canvas';

// --- Canvas / color helpers ---
const normalizeCssColor = (() => {
  if (typeof document === 'undefined') {
    return (c: string, _fallback: string) => c;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return (c: string, _fallback: string) => c;
  }
  return (c: string, fallback: string) => {
    const v = (c || '').trim();
    if (!v || v === 'none') return v;
    if (/\b(lab|lch|oklab|oklch|color-mix)\(/i.test(v)) return fallback;
    ctx.fillStyle = '#000';
    try {
      ctx.fillStyle = v;
      return ctx.fillStyle as string;
    } catch {
      return fallback;
    }
  };
})();

function inlineComputedColors(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of nodes) {
    const cs = window.getComputedStyle(el);
    el.style.color = normalizeCssColor(cs.color, 'rgb(0, 0, 0)');
    el.style.backgroundColor = normalizeCssColor(cs.backgroundColor, 'transparent');
    el.style.borderColor = normalizeCssColor(cs.borderColor, 'rgba(0, 0, 0, 0)');
    el.style.outlineColor = normalizeCssColor(cs.outlineColor, 'rgba(0, 0, 0, 0)');
    (el.style as any).textDecorationColor = normalizeCssColor((cs as any).textDecorationColor || cs.color, 'rgb(0, 0, 0)');
    el.style.boxShadow = cs.boxShadow;
  }
}

function sanitizeForCanvas(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
  for (const el of nodes) {
    el.style.boxShadow = 'none';
    (el.style as any).textShadow = 'none';
    (el.style as any).filter = 'none';
    (el.style as any).backdropFilter = 'none';
  }

  const gradientNodes = root.querySelectorAll<HTMLElement>('.bg-gradient-to-br');
  gradientNodes.forEach((el) => {
    el.style.backgroundImage = 'linear-gradient(135deg, rgb(4, 51, 11), rgb(11, 90, 42))';
    el.style.backgroundColor = 'rgb(4, 51, 11)';
  });
}

// --- Translations ---
const translations = {
  en: {
    joinPage: {
      header: {
        title: "Join Peoples Green Party",
        subtitle: "Unite for Progress, Stand for a Better Tomorrow"
      },
      wizard: {
        heroTitle: 'Become a Leader in Your Region, Join Our Leadership Program!',
        newRegistration: 'New Registration',
        step1: 'Register Yourself',
        step2: 'OTP Verification',
        step3: 'Get Your ID Card',
        step4: 'Leadership Program',
        sendOtp: 'Send OTP →',
        sending: 'Sending...',
        back: '← Back',
        otpTitle: 'OTP Verification',
        otpSubtitlePrefix: 'Code sent to',
        verifyContinue: 'Verify & Continue',
        verifying: 'Verifying...',
        idCongrats: 'Congratulations! You are now a Member',
        idReady: 'Your Digital ID Card is ready',
        downloadId: 'Download ID Card',
        proceedProgram: 'Proceed to Program →',
        leadershipJoined: 'You have joined the Leadership Program!',
        inviteTitle: 'Invite your 5 team members',
        inviteSubtitle: 'Share your link on WhatsApp to quickly recruit members from your Local Unit.',
        inviteShareText: 'Join Peoples Green Party using my invite link:',
        shareWhatsApp: 'Share on WhatsApp',
        copyLink: 'Copy Link',
        referralTitle: 'Your Referral Code',
        referralSubtitle: 'People can scan or use this code to join.',
        referralLabel: 'Your referral code',
        leaderLabel: 'Leader',
        slotLabel: 'SLOT',
        slotsHint: 'Complete your team by adding 5 influential people from your region.',
        appointmentTitle: 'Appointment Letter',
        appointmentReady: 'Your official appointment letter is ready for download.',
        appointmentLocked: 'Recruit 5 members in your Local Unit to unlock your appointment letter.',
        appointmentParty: 'Peoples Green Party',
        appointmentDear: 'Dear',
        appointmentBody: 'We are pleased to inform you that you have successfully completed the Leadership Program by recruiting 5 members in your Local Unit. You are hereby appointed as the CWC President for your area.',
        appointmentDesignation: 'Designation',
        appointmentCwcPresident: 'CWC President',
        appointmentDate: 'Date',
        appointmentAuthorized: 'Authorized Signatory',
        goDashboard: 'Go to Dashboard',
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
    },
    nav: {
      home: "Home",
      about: "About",
      constitution: "Constitution",
      donate: "Donate",
      declaration: "Declaration",
      join: "Join Us",
      login: "Login",
      weAreAravali: "We are Aravali",
      leaders: "Leadership"
    },
    footer: {
      follow: "Follow Us",
      useful: "Useful Links",
      additional: "Additional Links",
      contact: "Contact Us",
      address: "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan",
      audit: "Audit Report and Information About Donation",
      eci: "ECI Disclosure",
      criminal: "Declaration about criminal antecedents of candidates set up by the party"
    }
  },
  hi: {
    joinPage: {
      header: {
        title: "पीपल्स ग्रीन पार्टी से जुड़ें",
        subtitle: "प्रगति के लिए एकजुट हों, बेहतर कल के लिए खड़े हों"
      },
      wizard: {
        heroTitle: 'अपने क्षेत्र में लीडर बनें, हमारे लीडरशिप प्रोग्राम से जुड़ें!',
        newRegistration: 'नया पंजीकरण',
        step1: 'पंजीकरण करें',
        step2: 'OTP सत्यापन',
        step3: 'अपना ID कार्ड प्राप्त करें',
        step4: 'लीडरशिप प्रोग्राम',
        sendOtp: 'OTP भेजें →',
        sending: 'भेज रहे हैं...',
        back: '← वापस',
        otpTitle: 'OTP सत्यापन',
        otpSubtitlePrefix: 'कोड भेजा गया',
        verifyContinue: 'सत्यापित करें और आगे बढ़ें',
        verifying: 'सत्यापित कर रहे हैं...',
        idCongrats: 'बधाई हो! आप अब सदस्य हैं',
        idReady: 'आपका डिजिटल ID कार्ड तैयार है',
        downloadId: 'ID कार्ड डाउनलोड करें',
        proceedProgram: 'प्रोग्राम पर जाएँ →',
        leadershipJoined: 'आप लीडरशिप प्रोग्राम में शामिल हो गए हैं!',
        inviteTitle: 'अपने 5 टीम सदस्यों को आमंत्रित करें',
        inviteSubtitle: 'अपने लोकल यूनिट से सदस्यों को जल्दी जोड़ने के लिए WhatsApp पर अपना लिंक साझा करें।',
        inviteShareText: 'मेरे इनवाइट लिंक से Peoples Green Party से जुड़ें:',
        shareWhatsApp: 'WhatsApp पर शेयर करें',
        copyLink: 'लिंक कॉपी करें',
        referralTitle: 'आपका रेफरल कोड',
        referralSubtitle: 'लोग स्कैन करके या इस कोड से जुड़ सकते हैं।',
        referralLabel: 'आपका रेफरल कोड',
        leaderLabel: 'लीडर',
        slotLabel: 'स्लॉट',
        slotsHint: 'अपने क्षेत्र के 5 प्रभावशाली लोगों को जोड़कर टीम पूरी करें।',
        appointmentTitle: 'नियुक्ति पत्र',
        appointmentReady: 'आपका आधिकारिक नियुक्ति पत्र डाउनलोड के लिए तैयार है।',
        appointmentLocked: 'अपने लोकल यूनिट में 5 सदस्य जोड़कर नियुक्ति पत्र अनलॉक करें।',
        appointmentParty: 'पीपल्स ग्रीन पार्टी',
        appointmentDear: 'प्रिय',
        appointmentBody: 'हमें यह बताते हुए खुशी हो रही है कि आपने अपने लोकल यूनिट में 5 सदस्यों को जोड़कर लीडरशिप प्रोग्राम सफलतापूर्वक पूरा कर लिया है। आपको आपके क्षेत्र के लिए CWC अध्यक्ष नियुक्त किया जाता है।',
        appointmentDesignation: 'पद',
        appointmentCwcPresident: 'CWC अध्यक्ष',
        appointmentDate: 'तारीख',
        appointmentAuthorized: 'अधिकृत हस्ताक्षरकर्ता',
        goDashboard: 'डैशबोर्ड पर जाएँ',
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
    },
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      constitution: "संविधान",
      donate: "दान करें",
      declaration: "घोषणा पत्र",
      join: "जुड़ें",
      login: "लॉगिन",
      weAreAravali: "वी आर अरावली",
      leaders: "नेतृत्व"
    },
    footer: {
      follow: "हमें फॉलो करें",
      useful: "उपयोगी लिंक",
      additional: "अतिरिक्त लिंक",
      contact: "संपर्क करें",
      address: "हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान",
      audit: "ऑडिट रिपोर्ट और दान के बारे में जानकारी",
      eci: "ECI प्रकटीकरण",
      criminal: "उम्मीदवारों के आपराधिक पूर्ववृत्त के बारे में घोषणा"
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
  const [otpSimulated, setOtpSimulated] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState({ loksabhas: false, vidhansabhas: false, localUnits: false });
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);
  const [meSummary, setMeSummary] = useState<any>(null);
  const [meProgress, setMeProgress] = useState<any>(null);
  const [meRecruits, setMeRecruits] = useState<any[]>([]);
  const idCardRef = useRef<HTMLDivElement | null>(null);
  const appointmentRef = useRef<HTMLDivElement | null>(null);

  const registrationValidationError = useMemo(() => {
    if (!formData.firstName.trim()) return 'Please enter your first name.';
    if (!formData.lastName.trim()) return 'Please enter your last name.';
    const mobile = formData.mobile.replace(/\D/g, '');
    if (mobile.length < 10) return 'Please enter a valid 10-digit mobile number.';
    const pin = formData.pin.replace(/\D/g, '');
    if (pin.length < 4 || pin.length > 6) return 'Please create a 4–6 digit login PIN.';
    if (!formData.loksabhaId) return 'Please select your Loksabha.';
    if (!formData.vidhansabhaId) return 'Please select your Vidhansabha.';
    if (!formData.localUnitId) return 'Please select your Local Unit.';
    return null;
  }, [
    formData.firstName,
    formData.lastName,
    formData.mobile,
    formData.pin,
    formData.loksabhaId,
    formData.vidhansabhaId,
    formData.localUnitId,
  ]);

  const isRegistrationReady = useMemo(() => {
    return !registrationValidationError;
  }, [registrationValidationError]);

  // Determine the effective origin for QR and Sharing
  const effectiveOrigin = typeof window !== 'undefined'
    ? (['peoplesgreen.org', 'www.peoplesgreen.org'].includes(window.location.hostname)
      ? 'https://peoplesgreen.org'
      : (window.location.hostname === 'localhost'
        ? 'https://web-tau-tawny-syvli4qect.vercel.app'
        : window.location.origin))
    : 'https://peoplesgreen.org';

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

  const canDownloadAppointment = useMemo(() => {
    const localTotal = Number(meProgress?.localTotal ?? 0);
    return localTotal >= 5;
  }, [meProgress?.localTotal]);

  // Load Loksabhas on mount
  useEffect(() => {
    const loadLoksabhas = async () => {
      setLocLoading((s) => ({ ...s, loksabhas: true }));
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
    };
    loadLoksabhas();
  }, []);

  const normalizeCssColor = useMemo(() => {
    if (typeof document === 'undefined') return (c: string) => c;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return (c: string) => c;
    return (c: string, fallback: string) => {
      const v = (c || '').trim();
      if (!v || v === 'none') return v;
      if (/\b(lab|lch|oklab|oklch|color-mix)\(/i.test(v)) return fallback;
      ctx.fillStyle = '#000';
      try {
        ctx.fillStyle = v;
        return ctx.fillStyle as string;
      } catch {
        return fallback;
      }
    };
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
    setFormData(prev => ({ ...prev, localUnitId: '' }));
    if (!vidhansabhaId) {
      setLocalUnits([]);
      return;
    }

    let isCancelled = false;
    setLocalUnits([]);
    setLocLoading(prev => ({ ...prev, localUnits: true }));
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi(`geo/vidhansabhas/${vidhansabhaId}/local-units`)
        .then((data) => {
          if (isCancelled) return;
          setLocalUnits(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error('Failed to load Local Units', err);
          setLocalUnits([]);
        })
        .finally(() => {
          if (isCancelled) return;
          setLocLoading(prev => ({ ...prev, localUnits: false }));
        });
    });

    return () => {
      isCancelled = true;
    };
  }, [formData.vidhansabhaId]);

  async function downloadAsPng(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;

    // Pre-sanitize the live subtree to strip problematic color functions before cloning
    try {
      if (typeof window !== 'undefined') {
        inlineComputedColors(ref.current as HTMLElement);
        sanitizeForCanvas(ref.current as HTMLElement);
      }
    } catch (e) {
      console.warn('Pre-sanitize for canvas failed', e);
    }

    const canvas = await html2canvas(ref.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
      onclone: (doc: Document) => {
        const win = doc.defaultView as any;
        if (win && !win.__pgpPatchedGetComputedStyle) {
          const BAD_COLOR_RE = /\b(lab|lch|oklab|oklch|color-mix)\(/i;
          const origGetComputed = win.getComputedStyle.bind(win);
          win.__pgpPatchedGetComputedStyle = true;
          win.getComputedStyle = ((elt: Element) => {
            const cs = origGetComputed(elt);
            return new Proxy(cs, {
              get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'string' && BAD_COLOR_RE.test(value)) {
                  const key = String(prop).toLowerCase();
                  if (key.includes('color')) return 'rgb(0,0,0)';
                  if (key.includes('background')) return 'none';
                  return '';
                }
                return value;
              },
            }) as any;
          }) as any;
        }

        const cloned = doc.getElementById('pgp-capture-root') as HTMLElement | null;
        if (!cloned) return;
        const nodes = [cloned, ...Array.from(cloned.querySelectorAll<HTMLElement>('*'))];
        for (const el of nodes) {
          const cs = doc.defaultView?.getComputedStyle(el);
          if (!cs) continue;
          el.style.boxShadow = 'none';
          (el.style as any).textShadow = 'none';
          (el.style as any).filter = 'none';
          (el.style as any).backdropFilter = 'none';

          const hasBadColor = (value: string | null | undefined) => {
            if (!value) return false;
            return /\b(lab|lch|oklab|oklch|color-mix)\(/i.test(value);
          };

          const bgImg = cs.backgroundImage || cs.background;
          if (hasBadColor(bgImg)) {
            el.style.backgroundImage = 'none';
          }

          const borderImg = (cs as any).borderImageSource as string | undefined;
          if (hasBadColor(borderImg)) {
            (el.style as any).borderImage = 'none';
          }

          const outlineColor = cs.outlineColor;
          if (hasBadColor(outlineColor)) {
            el.style.outlineColor = 'transparent';
          }

          const borderColor = cs.borderColor;
          if (hasBadColor(borderColor)) {
            el.style.borderColor = 'transparent';
          }
        }

        const gradientNodes = cloned.querySelectorAll<HTMLElement>('.bg-gradient-to-br');
        gradientNodes.forEach((el) => {
          el.style.backgroundImage = 'linear-gradient(135deg, rgb(4, 51, 11), rgb(11, 90, 42))';
          el.style.backgroundColor = 'rgb(4, 51, 11)';
          const innerTextNodes = Array.from(el.querySelectorAll<HTMLElement>('*'));
          for (const t of innerTextNodes) {
            const cs = doc.defaultView?.getComputedStyle(t);
            if (!cs) continue;
            if (cs.color && cs.color !== 'rgb(0, 0, 0)') {
              t.style.color = cs.color;
            } else {
              t.style.color = '#ffffff';
            }
          }
        });
      },
    });
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b: Blob | null) => resolve(b), 'image/png'));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit() {
    if (registrationValidationError) {
      setOtpError(registrationValidationError);
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
      const userProfileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: phoneNumber,
        password: randomPassword,
        pin: formData.pin,
        address: 'India',
        localUnitId: parseInt(formData.localUnitId),
        referralCode: formData.referralCode || undefined,
        authUserId: isPhoneSignupDisabled ? undefined : authData?.user?.id,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      console.log('Registration successful:', userData);

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
        const [summaryRes, progressRes, recruitsRes] = await Promise.all([
          fetchApi('users/me/summary'),
          fetchApi('users/me/recruitment-progress'),
          fetchApi('users/me/recruits'),
        ]);
        setMeSummary(summaryRes);
        setMeProgress(progressRes);
        setMeRecruits(recruitsRes?.recruits || []);
      } catch (e) {
        console.warn('Failed to load post-registration user data', e);
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

  function handleVidhansabhaChange(event: ChangeEvent<HTMLSelectElement>): void {
    const vidhansabhaId = event.target.value;
    setFormData(prev => ({ ...prev, vidhansabhaId, localUnitId: '' }));
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
    if (step === 3) return t.joinPage.wizard.step3;
    return t.joinPage.wizard.step4;
  }, [step]);

  const selectedLoksabhaName = useMemo(() => {
    const id = Number(formData.loksabhaId);
    const found = loksabhas.find((l) => Number(l.id) === id);
    return found ? getTranslation(found.name, language) : '';
  }, [formData.loksabhaId, loksabhas, language]);

  const selectedVidhansabhaName = useMemo(() => {
    const id = Number(formData.vidhansabhaId);
    const found = vidhansabhas.find((v) => Number(v.id) === id);
    return found ? getTranslation(found.name, language) : '';
  }, [formData.vidhansabhaId, vidhansabhas, language]);

  const selectedLocalUnitLabel = useMemo(() => {
    const id = Number(formData.localUnitId);
    const found = localUnits.find((u) => Number(u.id) === id);
    if (!found) return '';
    const name = getTranslation(found.name, language);
    return found.type ? `${name} (${found.type})` : name;
  }, [formData.localUnitId, localUnits, language]);

  const idCardDesignation = useMemo(() => {
    const role = (meSummary?.user?.role || 'Member') as string;
    const rawName = (meSummary?.user?.cwcName || '') as string;
    let cwcLabel = '';
    if (rawName) {
      const parts = rawName.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      const num = Number.parseInt(last, 10);
      if (!Number.isNaN(num)) {
        cwcLabel = `CWC ${num}`;
      } else {
        cwcLabel = 'CWC';
      }
    }

    if (role === 'CWCPresident') return cwcLabel ? `${cwcLabel} President` : 'CWC President';
    if (role === 'CWCMember') return cwcLabel ? `${cwcLabel} Member` : 'CWC Member';
    if (role === 'ExtendedMember') return cwcLabel ? `${cwcLabel} Extended Member` : 'Extended Member';
    return 'Member';
  }, [meSummary?.user?.role, meSummary?.user?.cwcName]);

  const visibleRecruits = useMemo(() => {
    const recruits = Array.isArray(meRecruits) ? meRecruits : [];
    return recruits.slice(0, 5);
  }, [meRecruits]);

  return (
    <div className="min-h-screen bg-[#F7FCF9] text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="w-full max-w-[1200px] px-4 lg:px-8 mt-[28px] flex flex-col items-center">
        <h1 className="text-center font-semibold text-[28px] lg:text-[44px] leading-tight tracking-[-0.3px] text-[#04330B] max-w-[880px]">
          {t.joinPage.wizard.heroTitle}
        </h1>

        <section className="w-full mt-10 bg-white rounded-[28px] border border-[#E4F2EA] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-[360px] w-full bg-[#04330B] text-white p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={step === 1 ? 'w-7 h-7 rounded-full bg-[#10B981] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  1
                </div>
                <div className={step === 1 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step1}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={step === 3 ? 'w-7 h-7 rounded-full bg-[#10B981] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  2
                </div>
                <div className={step === 3 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step3}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className={step === 4 ? 'w-7 h-7 rounded-full bg-[#10B981] text-[#04330B] flex items-center justify-center font-bold' : 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold'}>
                  3
                </div>
                <div className={step === 4 ? 'font-semibold' : 'font-semibold opacity-60'}>{t.joinPage.wizard.step4}</div>
              </div>
            </div>

            <div className="mt-10">
              <img src="/PGPlogo.svg" alt="PGP" className="w-[120px] opacity-90" />
              <div className="mt-4 text-[12px] text-white/70 italic">
                "Together we represent the power of choice and the future of Rajasthan."
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 lg:p-12">
            <div className="text-center">
              <div className="text-[18px] font-bold text-[#04330B]">{step === 1 ? t.joinPage.wizard.newRegistration : stepLabel}</div>
            </div>

            {step === 1 && (
              <div className="mt-8 max-w-[520px] mx-auto">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none"
                      placeholder="First Name"
                      autoComplete="off"
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none"
                      placeholder="Last Name"
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-[100px_1fr] gap-3 min-w-0">
                      <div className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 flex items-center font-semibold text-[#587E67] bg-white">+91</div>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '');
                          const normalized = digits.startsWith('91') ? digits.slice(2) : (digits.startsWith('0') ? digits.slice(1) : digits);
                          setFormData({ ...formData, mobile: normalized.slice(0, 10) });
                        }}
                        inputMode="numeric"
                        className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none min-w-0"
                        placeholder="Mobile Number"
                        autoComplete="off"
                      />
                    </div>

                    <input
                      type="password"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      inputMode="numeric"
                      className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none"
                      placeholder="Create Login PIN"
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={formData.loksabhaId}
                      onChange={handleLoksabhaChange}
                      disabled={locLoading.loksabhas}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none"
                    >
                      <option value="">Select Loksabha</option>
                      {loksabhas.map((l: any) => (
                        <option key={l.id} value={l.id}>{getTranslation(l.name, language)}</option>
                      ))}
                    </select>

                    <select
                      value={formData.vidhansabhaId}
                      onChange={handleVidhansabhaChange}
                      disabled={!formData.loksabhaId || locLoading.vidhansabhas}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none"
                    >
                      <option value="">Select Vidhansabha</option>
                      {vidhansabhas.map((v: any) => (
                        <option key={v.id} value={v.id}>{getTranslation(v.name, language)}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={formData.localUnitId}
                    onChange={(e) => setFormData({ ...formData, localUnitId: e.target.value })}
                    disabled={!formData.vidhansabhaId || locLoading.localUnits}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none"
                  >
                    <option value="">Select Local Unit (Ward/Village)</option>
                    {localUnits.map((u: any) => (
                      <option key={u.id} value={u.id}>{getTranslation(u.name, language)}{u.type ? ` (${u.type})` : ''}</option>
                    ))}
                  </select>

                  {!showReferralInput && !formData.referralCode ? (
                    <button
                      type="button"
                      onClick={() => setShowReferralInput(true)}
                      className="text-left text-[#0D5229] text-sm font-semibold hover:underline"
                    >
                      + I have a referral code
                    </button>
                  ) : (
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none uppercase"
                      placeholder="Referral Code (Optional)"
                      autoComplete="off"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !isRegistrationReady}
                    className="w-full h-[50px] rounded-[12px] bg-[#04330B] text-white font-semibold disabled:opacity-60"
                  >
                    {loading ? t.joinPage.wizard.sending : t.joinPage.wizard.sendOtp}
                  </button>

                  {apiError && <div className="text-center text-[12px] text-red-500 font-semibold">{apiError}</div>}
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
                    className="text-[#0D5229] font-semibold hover:underline"
                  >
                    {t.joinPage.wizard.back}
                  </button>
                </div>
                <div className="mx-auto w-16 h-16 rounded-full bg-[#EAF7EE] flex items-center justify-center">
                  <Phone className="text-[#10B981]" />
                </div>
                <div className="mt-6 text-[22px] font-bold text-[#04330B]">{t.joinPage.wizard.otpTitle}</div>
                <div className="mt-2 text-[#587E67] font-semibold">{t.joinPage.wizard.otpSubtitlePrefix} +91{formData.mobile.replace(/\D/g, '').slice(-10)}</div>

                <div className="mt-6 flex items-center justify-center">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    className="w-[240px] h-[54px] text-center tracking-[0.5em] font-bold text-[#04330B] rounded-[12px] border border-[#B9D3C4] outline-none"
                    placeholder="000000"
                  />
                </div>

                {otpError && <div className="mt-3 text-[12px] text-red-500 font-semibold">{otpError}</div>}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="mt-8 w-[280px] h-[50px] rounded-[12px] bg-[#10B981] text-white font-semibold shadow disabled:opacity-60"
                >
                  {loading ? t.joinPage.wizard.verifying : t.joinPage.wizard.verifyContinue}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 max-w-[640px] mx-auto flex flex-col items-center">
                <div className="text-[18px] font-bold text-[#10B981]">{t.joinPage.wizard.idCongrats}</div>
                <div className="text-[#587E67] font-semibold mt-1">{t.joinPage.wizard.idReady}</div>

                <div className="mt-8" ref={idCardRef} id="pgp-capture-root">
                  <div className="w-[360px] h-[210px] rounded-[18px] bg-gradient-to-br from-[#04330B] to-[#0B5A2A] p-5 text-white shadow-[0px_18px_40px_rgba(0,0,0,0.25)] relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-[180px] h-[180px] rounded-full bg-white/10" />
                    <div className="absolute -left-10 -bottom-10 w-[140px] h-[140px] rounded-full bg-white/10" />

                    <div className="flex items-start justify-between">
                      <div className="bg-white rounded-md px-2 py-1">
                        <img src="/PGPlogo.svg" alt="PGP" className="h-6" />
                      </div>
                      <div className="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center">
                        <UserIcon />
                      </div>
                    </div>
                    <div className="mt-8 font-bold text-[18px] uppercase tracking-wide">
                      {meSummary?.user?.name || `${formData.firstName} ${formData.lastName}`}
                    </div>
                    <div className="mt-1 text-[12px] text-white/80 font-semibold">
                      {idCardDesignation}
                    </div>
                    <div className="mt-1 text-[12px] text-white/80 font-semibold">
                      {selectedLoksabhaName}, {selectedVidhansabhaName}, {selectedLocalUnitLabel}
                    </div>
                    <div className="absolute bottom-4 left-5 text-[12px] font-bold tracking-widest text-white/90">
                      {meSummary?.user?.memberId || 'PGP-XXXXXX'}
                    </div>
                    <div className="absolute bottom-4 right-5 w-10 h-10 rounded bg-white/15" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadAsPng(idCardRef, `PGP-ID-${(meSummary?.user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                  className="mt-6 w-[360px] h-[44px] rounded-[10px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6]"
                >
                  {t.joinPage.wizard.downloadId}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="mt-3 w-[360px] h-[50px] rounded-[12px] bg-[#04330B] text-white font-semibold"
                >
                  {t.joinPage.wizard.proceedProgram}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="mt-8 max-w-[760px] mx-auto">
                <div className="w-full rounded-[12px] border border-[#DDEEE4] bg-[#F1FBF6] text-[#04330B] font-semibold text-center py-3">
                  {t.joinPage.wizard.leadershipJoined}
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                  <div className="mt-5 rounded-[14px] border border-[#DDEEE4] bg-white p-5 shadow-sm">
                    <div className="text-[#04330B] font-bold">{t.joinPage.wizard.inviteTitle}</div>
                    <div className="mt-1 text-[12px] text-[#587E67] font-semibold">
                      {t.joinPage.wizard.inviteSubtitle}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const code = userReferralCode || meSummary?.user?.referralCode;
                          const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                          const text = `${t.joinPage.wizard.inviteShareText} ${inviteUrl}`;
                          const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                          window.open(waUrl, '_blank');
                        }}
                        className="flex-1 h-[46px] rounded-[12px] bg-[#10B981] text-white font-semibold"
                      >
                        {t.joinPage.wizard.shareWhatsApp}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const code = userReferralCode || meSummary?.user?.referralCode;
                          const inviteUrl = code ? `${effectiveOrigin}/join?ref=${code}` : `${effectiveOrigin}/join`;
                          await navigator.clipboard.writeText(inviteUrl);
                        }}
                        className="h-[46px] px-4 rounded-[12px] border border-[#B9D3C4] text-[#04330B] font-semibold bg-[#F1FBF6]"
                      >
                        {t.joinPage.wizard.copyLink}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[16px] border border-[#E4F2EA] bg-white p-5 shadow-sm">
                    <div className="text-[#04330B] font-bold">{t.joinPage.wizard.referralTitle}</div>
                    <div className="mt-1 text-[12px] text-[#587E67] font-semibold">{t.joinPage.wizard.referralSubtitle}</div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[#587E67] font-semibold">{t.joinPage.wizard.referralLabel}</div>
                        <div className="text-[22px] font-bold text-[#04330B] tracking-[0.2em]">
                          {(userReferralCode || meSummary?.user?.referralCode || '--------').toString().toUpperCase()}
                        </div>
                      </div>
                      <div className="w-[96px] h-[96px] rounded-[14px] border border-[#DDEEE4] bg-[#F7FCF9] flex items-center justify-center overflow-hidden">
                        {String(userReferralCode || meSummary?.user?.referralCode || '').trim() ? (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              `${effectiveOrigin}/join?ref=${String(userReferralCode || meSummary?.user?.referralCode || '').trim().toUpperCase()}`
                            )}`}
                            alt="QR Code"
                            className="w-[88px] h-[88px]"
                          />
                        ) : (
                          <div className="text-[12px] font-bold text-[#587E67]">QR</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                  <SlotCircle label={t.joinPage.wizard.leaderLabel} filled name={meSummary?.user?.name || 'You'} photoUrl={meSummary?.user?.photoUrl || null} />
                  {Array.from({ length: 5 }).map((_, i) => {
                    const recruit = visibleRecruits[i];
                    return (
                      <SlotCircle
                        key={i}
                        label={`${t.joinPage.wizard.slotLabel} ${i + 1}`}
                        filled={!!recruit}
                        name={recruit?.name}
                        photoUrl={recruit?.photoUrl || null}
                      />
                    );
                  })}
                </div>

                <div className="mt-6 text-center text-[#587E67] font-semibold text-[13px]">
                  {t.joinPage.wizard.slotsHint}
                </div>

                <div className="mt-10 w-full rounded-[16px] border border-[#E4F2EA] bg-white p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-md bg-white/15 flex items-center justify-center">
                      <DocIcon />
                    </div>
                    <div>
                      <div className="font-bold text-[#04330B]">{t.joinPage.wizard.appointmentTitle}</div>
                      <div className="text-[12px] text-[#587E67] font-semibold">
                        {canDownloadAppointment ? t.joinPage.wizard.appointmentReady : t.joinPage.wizard.appointmentLocked}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canDownloadAppointment}
                    onClick={() => downloadAsPng(appointmentRef, `PGP-Appointment-${(meSummary?.user?.name || 'Member').replace(/\s+/g, '-')}.png`)}
                    className={canDownloadAppointment
                      ? 'w-12 h-12 rounded-full bg-[#04330B] text-white flex items-center justify-center'
                      : 'w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed'}
                    title={canDownloadAppointment ? 'Download' : 'Locked'}
                  >
                    <DownloadIcon />
                  </button>
                </div>

                <div className="sr-only">
                  <div ref={appointmentRef} className="w-[800px] bg-white p-10 border-[10px] border-[#C8A04B]">
                    <div className="text-center">
                      <div className="text-[22px] font-bold text-[#04330B]">{t.joinPage.wizard.appointmentTitle}</div>
                      <div className="mt-2 text-[#587E67] font-semibold">{t.joinPage.wizard.appointmentParty}</div>
                    </div>
                    <div className="mt-8 text-[#04330B] font-semibold">{t.joinPage.wizard.appointmentDear} {meSummary?.user?.name || 'Member'},</div>
                    <div className="mt-4 text-[#587E67] font-semibold leading-relaxed">
                      {t.joinPage.wizard.appointmentBody}
                    </div>
                    <div className="mt-8 text-[#587E67] font-semibold">{t.joinPage.wizard.appointmentDesignation}: <span className="text-[#04330B] font-bold">{t.joinPage.wizard.appointmentCwcPresident}</span></div>
                    <div className="mt-10 flex justify-between items-end">
                      <div className="text-[#587E67] font-semibold">{t.joinPage.wizard.appointmentDate}: {new Date().toLocaleDateString()}</div>
                      <div className="text-right">
                        <div className="text-[#04330B] font-bold">{t.joinPage.wizard.appointmentAuthorized}</div>
                        <div className="text-[#587E67] font-semibold">{t.joinPage.wizard.appointmentParty}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="mt-10 w-full h-[52px] rounded-[12px] bg-[#04330B] text-white font-semibold"
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

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SlotCircle({ label, filled, name, photoUrl }: { label: string; filled: boolean; name?: string; photoUrl?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-2 w-[92px]">
      <div className={filled ? 'w-14 h-14 rounded-full bg-[#04330B] text-white flex items-center justify-center border-4 border-[#EAF7EE]' : 'w-14 h-14 rounded-full bg-white text-[#587E67] flex items-center justify-center border border-dashed border-[#B9D3C4]'}>
        {filled && photoUrl ? (
          <img src={photoUrl.startsWith('http') ? photoUrl : photoUrl} alt={name || label} className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon />
        )}
      </div>
      <div className="text-[10px] font-bold text-[#587E67] uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <JoinPageContent />
    </Suspense>
  );
}