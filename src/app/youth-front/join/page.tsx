"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Phone, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from "../../../components/LanguageContext";
import { FormFieldLabel, RequiredMark } from "../../../components/FormFieldLabel";
import { setPortalToken } from "../../../lib/portalAuth";

// --- Translations ---
const translations = {
  hi: {
    wizard: {
      step1Title: "अपनी ZINDA प्रोफाइल बनाएं",
      step1Subtitle: "अपनी ZINDA आईडी प्राप्त करें, मिशन अनलॉक करें, XP अर्जित करें और एक स्क्वाड में शामिल हों।",
      firstName: "पहला नाम",
      firstNamePlaceholder: "पहला नाम",
      lastName: "अंतिम नाम",
      lastNamePlaceholder: "अंतिम नाम",
      mobileNumber: "मोबाइल नंबर",
      mobilePlaceholder: "+91 XXXXX XXXXX",
      referralCode: "रेफरल कोड (वैकल्पिक)",
      referralPlaceholder: "रेफरल कोड दर्ज करें",
      btnSendOtp: "OTP भेजें →",
      btnSendingOtp: "OTP भेज रहे हैं...",
      
      step2Title: "OTP सत्यापन",
      step2Subtitle: "कोड भेजा गया:",
      otpLabel: "OTP दर्ज करें",
      otpPlaceholder: "6-अंकों का OTP दर्ज करें",
      btnVerify: "सत्यापित करें और आगे बढ़ें",
      btnVerifying: "सत्यापित कर रहे हैं...",
      btnBack: "← वापस",

      step3Title: "अपनी ZINDA प्रोफाइल बनाएं",
      step3Subtitle: "हमें अपने बारे में बताएं कि आप कौन हैं और कैसे योगदान देना चाहते हैं।",
      ageGroup: "आयु वर्ग",
      selectAgeGroup: "आयु वर्ग चुनें",
      gender: "लिंग (वैकल्पिक)",
      selectGender: "लिंग चुनें",
      female: "महिला",
      male: "पुरुष",
      other: "अन्य",
      preferNotToSay: "बताना नहीं चाहते",
      joinAs: "मैं शामिल हो रहा हूँ",
      selectOption: "विकल्प चुनें",
      workOn: "मैं काम करना चाहता हूँ",
      selectTrack: "ट्रैक चुनें",
      schoolCollege: "स्कूल / कॉलेज / विश्वविद्यालय / पेशा",
      schoolCollegePlaceholder: "संस्था का नाम दर्ज करें",
      courseClass: "कोर्स / कक्षा / वर्तमान भूमिका (वैकल्पिक)",
      courseClassPlaceholder: "जैसे: बी.टेक, बीए द्वितीय वर्ष, कक्षा 12",
      pinLabel: "लॉगिन पिन बनाएं (4-6 अंक)",
      pinPlaceholder: "4-6 अंकों का पिन बनाएं",
      pinHint: "अपने खाते में लॉगिन करने के लिए इस पिन का उपयोग करें",
      district: "जिला",
      ward: "वार्ड",
      village: "गांव",
      wardPlaceholder: "वार्ड (यदि लागू हो)",
      villagePlaceholder: "गांव (यदि लागू हो)",
      optionalInstagram: "इंस्टाग्राम (वैकल्पिक)",
      optionalWhatsapp: "WhatsApp नंबर (वैकल्पिक)",
      skills: "कौशल (वैकल्पिक)",
      consentTitle: "संचार सहमति",
      consentText: "मैं अपडेट, कार्यों, कार्यक्रमों और मुद्दों के फॉलो-अप के लिए फोन, व्हाट्सएप, एसएमएस या ईमेल पर Zinda Youth से संचार प्राप्त करने के लिए सहमत हूं। आप किसी भी समय ऑप्ट आउट कर सकते हैं।",
      conductTitle: "आचार संहिता",
      conductText: "मैं आचार संहिता स्वीकार करता हूं: कोई हिंसा, अभद्र भाषा, फर्जी खबरें, उत्पीड़न, धमकी, जातिगत दुर्व्यवहार, सांप्रदायिक लक्ष्यीकरण या डॉक्सिंग नहीं। उल्लंघन के परिणामस्वरूप हटाने सहित अनुशासनात्मक कार्रवाई होगी।",
      btnRegister: "मेरी ZINDA आईडी बनाएं",
      btnRegistering: "ZINDA आईडी बनाई जा रही है..."
    },
    options: {
      age_16_17: "16-17 नागरिक स्वयंसेवक / सहयोगी",
      age_18_plus: "18+ सक्रिय युवा सदस्य",
      below_16: "16 वर्ष से कम",
      
      student: "कॉलेज / विश्वविद्यालय छात्र",
      coaching: "कोचिंग छात्र",
      firstTimeVoter: "पहली बार मतदाता",
      unemployed: "बेरोजगार युवा",
      professional: "युवा पेशेवर",
      digital: "डिजिटल क्रिएटर",
      ward: "वार्ड / मोहल्ला स्वयंसेवक",
      village: "गांव / पंचायत स्वयंसेवक",
      environment: "पर्यावरण स्वयंसेवक",
      civicAssociate: "नागरिक सहयोगी, केवल 16-17 आयु वर्ग",

      trackCampus: "कैंपस के मुद्दे",
      trackWard: "वार्ड / मोहल्ले के मुद्दे",
      trackVillage: "गांव / पंचायत के मुद्दे",
      trackDigital: "डिजिटल सामग्री",
      trackIssue: "मुद्दे रिपोर्ट करना",
      trackEnvironment: "पर्यावरण / जंगल / पानी",
      trackResearch: "अनुसंधान / RTI / नीति",
      trackSpeaking: "सार्वजनिक भाषण / वाद-विवाद",
      trackMembership: "सदस्यता निर्माण"
    },
    errors: {
      selectAge: "कृपया अपना आयु वर्ग चुनें।",
      below16Limit: "16 वर्ष से कम आयु में अभी पूर्ण सदस्यता नहीं खुलती। पैरेंट/अभिभावक के साथ partypeoplesgreen@gmail.com पर लिखें — हम आपको waitlist पर रखेंगे।",
      enterCampus: "कृपया अपना स्कूल, कॉलेज, विश्वविद्यालय या पेशा दर्ज करें।",
      selectJoinAs: "कृपया चुनें कि आप किस रूप में जुड़ रहे हैं।",
      selectTrack: "कृपया चुनें कि आप किस काम में शामिल होना चाहते हैं।",
      acceptConduct: "आगे बढ़ने के लिए कृपया आचार संहिता स्वीकार करें।",
      regFailed: "पंजीकरण विफल रहा",
      sendOtpFailed: "OTP भेजने में असमर्थ",
      otpFailed: "OTP सत्यापन विफल रहा",
      devOtpHint: "Dev mode: Use OTP 123456",
      invalidOtp: "अमान्य OTP। देव मोड में 123456 का उपयोग करें।",
      alreadyRegistered: "यह नंबर पहले से Zinda Youth में रजिस्टर है। कृपया Youth Login से लॉगिन करें।",
      invalidMobile: "कृपया सही 10 अंकों का मोबाइल नंबर डालें।",
      invalidPin: "लॉगिन पिन 4 से 6 अंकों का होना चाहिए।",
    }
  },
  en: {
    wizard: {
      step1Title: "Create Your ZINDA Profile",
      step1Subtitle: "Get your ZINDA ID, unlock missions, earn XP and join a Squad.",
      firstName: "First Name",
      firstNamePlaceholder: "First name",
      lastName: "Last Name",
      lastNamePlaceholder: "Last name",
      mobileNumber: "Mobile Number",
      mobilePlaceholder: "+91 XXXXX XXXXX",
      referralCode: "Referral Code (Optional)",
      referralPlaceholder: "Enter referral code",
      btnSendOtp: "Send OTP →",
      btnSendingOtp: "Sending OTP...",
      
      step2Title: "OTP Verification",
      step2Subtitle: "Code sent to:",
      otpLabel: "Enter OTP",
      otpPlaceholder: "Enter 6-digit OTP",
      btnVerify: "Verify & Continue",
      btnVerifying: "Verifying...",
      btnBack: "← Back",

      step3Title: "Create Your ZINDA Profile",
      step3Subtitle: "Tell us who you are and how you want to contribute.",
      ageGroup: "Age Group",
      selectAgeGroup: "Select age group",
      gender: "Gender (Optional)",
      selectGender: "Select gender",
      female: "Female",
      male: "Male",
      other: "Other",
      preferNotToSay: "Prefer not to say",
      joinAs: "I am joining as",
      selectOption: "Select option",
      workOn: "I want to work on",
      selectTrack: "Select track",
      schoolCollege: "School / College / University / Profession",
      schoolCollegePlaceholder: "Enter institution name",
      courseClass: "Course / Class / Current Role (Optional)",
      courseClassPlaceholder: "e.g., B.Tech, BA 2nd Year, Class 12",
      pinLabel: "Create Login PIN (4-6 digits)",
      pinPlaceholder: "Create 4-6 digit PIN",
      pinHint: "Use this PIN to login to your account",
      district: "District",
      ward: "Ward",
      village: "Village",
      wardPlaceholder: "Ward (if applicable)",
      villagePlaceholder: "Village (if applicable)",
      optionalInstagram: "Instagram (Optional)",
      optionalWhatsapp: "WhatsApp Number (Optional)",
      skills: "Skills (Optional)",
      consentTitle: "Communication Consent",
      consentText: "I agree to receive communication from Zinda Youth on phone, WhatsApp, SMS, or email for updates, tasks, events, and issue follow-ups. You can opt out anytime.",
      conductTitle: "Code of Conduct",
      conductText: "I accept the code of conduct: no violence, hate speech, fake news, harassment, threats, caste abuse, communal targeting, or doxxing. Violations will result in disciplinary action including removal.",
      btnRegister: "Create My ZINDA ID",
      btnRegistering: "Creating ZINDA ID..."
    },
    options: {
      age_16_17: "16-17 Civic Volunteer / Associate",
      age_18_plus: "18+ Active Youth Member",
      below_16: "Below 16",
      
      student: "College / University Student",
      coaching: "Coaching Student",
      firstTimeVoter: "First-time Voter",
      unemployed: "Unemployed Youth",
      professional: "Young Professional",
      digital: "Digital Creator",
      ward: "Ward / Mohalla Volunteer",
      village: "Village / Panchayat Volunteer",
      environment: "Environment Volunteer",
      civicAssociate: "Civic Associate, age 16–17 only",

      trackCampus: "Campus Issues",
      trackWard: "Ward / Mohalla Issues",
      trackVillage: "Village / Panchayat Issues",
      trackDigital: "Digital Content",
      trackIssue: "Issue Reporting",
      trackEnvironment: "Environment / Jungle / Water",
      trackResearch: "Research / RTI / Policy",
      trackSpeaking: "Public Speaking / Debate",
      trackMembership: "Membership Building"
    },
    errors: {
      selectAge: "Please select your age group.",
      below16Limit: "Full membership opens at 16+. Email partypeoplesgreen@gmail.com with a parent/guardian — we'll keep you on the waitlist.",
      enterCampus: "Please enter your school, college, university, or profession.",
      selectJoinAs: "Please select who you are joining as.",
      selectTrack: "Please select what you want to work on.",
      acceptConduct: "Please accept the code of conduct to continue.",
      regFailed: "Registration failed",
      sendOtpFailed: "Failed to send OTP",
      otpFailed: "OTP verification failed",
      devOtpHint: "Dev mode: Use OTP 123456",
      invalidOtp: "Invalid OTP. Use 123456 in dev mode.",
      alreadyRegistered: "This number is already a Zinda Youth account. Please use Youth Login.",
      invalidMobile: "Please enter a valid 10-digit mobile number.",
      invalidPin: "Login PIN must be 4-6 digits.",
    }
  }
};

const SKILLS_LIST = [
  { value: 'Design', labelHi: 'डिजाइन', labelEn: 'Design' },
  { value: 'Video Editing', labelHi: 'वीडियो संपादन', labelEn: 'Video Editing' },
  { value: 'Writing', labelHi: 'लेखन', labelEn: 'Writing' },
  { value: 'Public Speaking', labelHi: 'सार्वजनिक भाषण', labelEn: 'Public Speaking' },
  { value: 'Research', labelHi: 'अनुसंधान', labelEn: 'Research' },
  { value: 'Social Media', labelHi: 'सोशल मीडिया', labelEn: 'Social Media' },
  { value: 'Event Management', labelHi: 'कार्यक्रम प्रबंधन', labelEn: 'Event Management' },
  { value: 'Photography', labelHi: 'फोटोग्राफी', labelEn: 'Photography' },
];

function YouthJoinPageInner() {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'hi'] || translations.en;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    otp: '',
    pin: '',
    referralCode: '',
    youthAgeGroup: '',
    gender: '',
    memberType: '',
    track: '',
    campusName: '',
    courseOrClass: '',
    district: '',
    ward: '',
    village: '',
    instagramId: '',
    whatsappNumber: '',
    youthSkills: [] as string[],
    communicationConsent: false,
    codeOfConductAccepted: false,
  });

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      setFormData((prev) => (prev.referralCode ? prev : { ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const mobileDigits = formData.mobile.replace(/\D/g, '').slice(-10);
    if (mobileDigits.length !== 10) {
      setError(t.errors.invalidMobile || 'Enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }
    if (!/^\d{4,6}$/.test(formData.pin || '')) {
      setError(t.errors.invalidPin || 'Login PIN must be 4-6 digits');
      setLoading(false);
      return;
    }

    const { isAuthDevMode } = await import('../../../lib/authDevMode');
    if (isAuthDevMode()) {
      setStep(2);
      setError(t.errors.devOtpHint);
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = `+91${mobileDigits}`;

      // Portal-aware check: same phone can be Party/Union and still join Zinda Youth
      const check = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (check?.exists && (check?.portals?.youth || check?.canLoginYouth)) {
        setError(t.errors.alreadyRegistered);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        throw new Error(error.message);
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message || t.errors.sendOtpFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { isAuthDevMode } = await import('../../../lib/authDevMode');
    if (isAuthDevMode()) {
      if (formData.otp !== '123456') {
        setError(t.errors.invalidOtp);
        setLoading(false);
        return;
      }
      setStep(3);
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: formData.otp,
        type: 'sms',
      });

      if (error) {
        throw new Error(error.message);
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || t.errors.otpFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.youthAgeGroup) {
      setError(t.errors.selectAge);
      setLoading(false);
      return;
    }
    if (formData.youthAgeGroup === 'below-16') {
      setError(t.errors.below16Limit);
      setLoading(false);
      return;
    }
    if (!formData.campusName.trim()) {
      setError(t.errors.enterCampus);
      setLoading(false);
      return;
    }
    if (!formData.memberType) {
      setError(t.errors.selectJoinAs);
      setLoading(false);
      return;
    }
    if (!formData.track) {
      setError(t.errors.selectTrack);
      setLoading(false);
      return;
    }
    if (!formData.district.trim()) {
      setError(language === 'hi'
        ? 'ZINDA ID के लिए कृपया अपना जिला दर्ज करें।'
        : 'Please enter your district for ZINDA ID generation.');
      setLoading(false);
      return;
    }
    if (!formData.communicationConsent) {
      setError(language === 'hi'
        ? 'आगे बढ़ने के लिए कृपया संचार सहमति स्वीकार करें।'
        : 'Please accept communication consent to continue.');
      setLoading(false);
      return;
    }
    if (!formData.codeOfConductAccepted) {
      setError(t.errors.acceptConduct);
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
      if (authUserError) {
        console.warn('Could not fetch Supabase user after OTP verification:', authUserError.message);
      }

      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      if (fullName.length < 2) {
        setError('Please enter your full name.');
        setLoading(false);
        return;
      }

      const userProfileData = {
        name: fullName,
        phone: phoneNumber,
        pin: formData.pin,
        referralCode: formData.referralCode || undefined,
        programTag: 'Zinda Youth',
        campaignSource: 'CockroachCampusMovement',
        youthAgeGroup: formData.youthAgeGroup,
        memberType: formData.memberType || undefined,
        track: formData.track || undefined,
        district: formData.district?.trim() || undefined,
        ward: formData.ward?.trim() || undefined,
        village: formData.village?.trim() || undefined,
        gender: formData.gender || undefined,
        campusName: formData.campusName.trim(),
        courseOrClass: formData.courseOrClass.trim(),
        instagramId: formData.instagramId.trim() || undefined,
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, '').slice(-10) || undefined,
        youthSkills: [
          ...formData.youthSkills,
          formData.track ? `track:${formData.track}` : '',
        ].filter(Boolean).join(','),
        communicationConsent: formData.communicationConsent,
        codeOfConductAccepted: formData.codeOfConductAccepted,
        authUserId: authUserData?.user?.id || undefined,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      // Keep the new member signed in so thank-you → dashboard works
      if (userData?.access_token) {
        try {
          setPortalToken('youth', userData.access_token);
          localStorage.setItem(
            'user_info',
            JSON.stringify({
              id: userData.id,
              name: userData.name,
              programTag: userData.programTag || 'Zinda Youth',
            }),
          );
        } catch {
          /* ignore storage errors */
        }
      }

      router.push('/youth-front/thank-you');
    } catch (err: any) {
      setError(err.message || t.errors.regFailed);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      youthSkills: prev.youthSkills.includes(skill)
        ? prev.youthSkills.filter(s => s !== skill)
        : [...prev.youthSkills, skill]
    }));
  };

  const getCampusLabel = () => {
    const isHi = language === 'hi';
    switch (formData.memberType) {
      case 'student':
        return isHi ? 'कॉलेज / विश्वविद्यालय का नाम' : 'College / University name';
      case 'coaching':
        return isHi ? 'कोचिंग संस्थान का नाम' : 'Coaching institute name';
      case 'professional':
        return isHi ? 'पेशा / कार्यस्थल' : 'Profession / Workplace';
      case 'ward':
        return isHi ? 'वार्ड / इलाका' : 'Ward / Locality';
      case 'village':
        return isHi ? 'गांव / पंचायत' : 'Village / Panchayat';
      default:
        return isHi ? 'स्कूल / कॉलेज / विश्वविद्यालय / पेशा' : 'School / College / University / Profession';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-5 lg:px-8 py-14">
        <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
          {/* Step 1: Mobile & OTP */}
          {step === 1 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">{t.wizard.step1Title}</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                {t.wizard.step1Subtitle}
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.firstName}</FormFieldLabel>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.firstNamePlaceholder}
                    />
                  </div>
                  <div>
                    <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.lastName}</FormFieldLabel>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.lastNamePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.mobileNumber}</FormFieldLabel>
                  <div className="flex gap-2">
                    <div className="flex h-[46px] items-center rounded-[10px] border border-[#DDEEE4] bg-[#F5FBF7] px-4 font-semibold text-[#587E67]">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                        })
                      }
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.mobilePlaceholder}
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                    {t.wizard.pinLabel}
                  </FormFieldLabel>
                  <div className="flex gap-2">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      minLength={4}
                      maxLength={6}
                      pattern="[0-9]*"
                      value={formData.pin}
                      onChange={(e) =>
                        setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })
                      }
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.pinPlaceholder}
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#587E67]">{t.wizard.pinHint}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.referralCode}</label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.wizard.referralPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.wizard.btnSendingOtp : t.wizard.btnSendOtp}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">{t.wizard.step2Title}</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                {t.wizard.step2Subtitle} {formData.mobile}
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.otpLabel}</FormFieldLabel>
                  <div className="flex gap-2">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.otpPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.wizard.btnVerifying : t.wizard.btnVerify}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full h-[52px] rounded-[12px] border border-[#BBF7D0] bg-white px-7 font-black text-[#04330B] hover:bg-[#F5FBF7] transition-colors"
                >
                  {t.wizard.btnBack}
                </button>
              </form>
            </>
          )}

          {/* Step 3: Youth Details */}
          {step === 3 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">{t.wizard.step3Title}</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                {t.wizard.step3Subtitle}
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.ageGroup}</FormFieldLabel>
                    <select
                      required
                      value={formData.youthAgeGroup}
                      onChange={(e) => setFormData({ ...formData, youthAgeGroup: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">{t.wizard.selectAgeGroup}</option>
                      <option value="16-17">{t.options.age_16_17}</option>
                      <option value="18+">{t.options.age_18_plus}</option>
                      <option value="below-16">{t.options.below_16}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.gender}</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">{t.wizard.selectGender}</option>
                      <option value="female">{t.wizard.female}</option>
                      <option value="male">{t.wizard.male}</option>
                      <option value="other">{t.wizard.other}</option>
                      <option value="prefer-not-to-say">{t.wizard.preferNotToSay}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.joinAs}</FormFieldLabel>
                    <select
                      required
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">{t.wizard.selectOption}</option>
                      <option value="student">{t.options.student}</option>
                      <option value="coaching">{t.options.coaching}</option>
                      <option value="first-time-voter">{t.options.firstTimeVoter}</option>
                      <option value="unemployed">{t.options.unemployed}</option>
                      <option value="professional">{t.options.professional}</option>
                      <option value="digital">{t.options.digital}</option>
                      <option value="ward">{t.options.ward}</option>
                      <option value="village">{t.options.village}</option>
                      <option value="environment">{t.options.environment}</option>
                      <option value="civic-associate">{t.options.civicAssociate}</option>
                    </select>
                  </div>
                  <div>
                    <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.workOn}</FormFieldLabel>
                    <select
                      required
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">{t.wizard.selectTrack}</option>
                      <option value="campus">{t.options.trackCampus}</option>
                      <option value="ward-mohalla">{t.options.trackWard}</option>
                      <option value="village">{t.options.trackVillage}</option>
                      <option value="digital">{t.options.trackDigital}</option>
                      <option value="issue">{t.options.trackIssue}</option>
                      <option value="environment">{t.options.trackEnvironment}</option>
                      <option value="research">{t.options.trackResearch}</option>
                      <option value="speaking">{t.options.trackSpeaking}</option>
                      <option value="membership">{t.options.trackMembership}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{getCampusLabel()}</FormFieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.campusName}
                    onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.wizard.schoolCollegePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.courseClass}</label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.courseOrClass}
                    onChange={(e) => setFormData({ ...formData, courseOrClass: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.wizard.courseClassPlaceholder}
                  />
                </div>

                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.pinLabel}</FormFieldLabel>
                  <div className="flex gap-2">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      minLength={4}
                      maxLength={6}
                      pattern="[0-9]*"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.pinPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#587E67]">{t.wizard.pinHint}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">
                      {t.wizard.district} <span className="text-[#D93025]" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.district}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.ward}</label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.wardPlaceholder || t.wizard.ward}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.village}</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.villagePlaceholder || t.wizard.village}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.optionalInstagram}</label>
                    <input
                      type="text"
                      value={formData.instagramId}
                      onChange={(e) => setFormData({ ...formData, instagramId: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.optionalWhatsapp}</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder={t.wizard.mobilePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">{t.wizard.skills}</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SKILLS_LIST.map((skill) => (
                      <button
                        key={skill.value}
                        type="button"
                        onClick={() => toggleSkill(skill.value)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                          formData.youthSkills.includes(skill.value)
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#DCFCE7] text-[#04330B] hover:bg-[#BBF7D0]'
                        }`}
                      >
                        {language === 'hi' ? skill.labelHi : skill.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#FFF7ED] p-4 border border-[#FED7AA]">
                  <div className="text-sm font-bold text-[#9A3412] mb-3">
                    {t.wizard.consentTitle}
                    <RequiredMark />
                  </div>
                  <label className="flex items-start gap-3 text-[12px] font-semibold text-[#04330B]">
                    <input
                      type="checkbox"
                      checked={formData.communicationConsent}
                      onChange={(e) => setFormData({ ...formData, communicationConsent: e.target.checked })}
                      className="mt-1"
                      required
                    />
                    <span>{t.wizard.consentText}</span>
                  </label>
                </div>

                <div className="rounded-xl bg-[#FEF2F2] p-4 border border-[#FECACA]">
                  <div className="text-sm font-bold text-[#991B1B] mb-3">
                    {t.wizard.conductTitle}
                    <RequiredMark />
                  </div>
                  <label className="flex items-start gap-3 text-[12px] font-semibold text-[#04330B]">
                    <input
                      type="checkbox"
                      checked={formData.codeOfConductAccepted}
                      onChange={(e) => setFormData({ ...formData, codeOfConductAccepted: e.target.checked })}
                      className="mt-1"
                      required
                    />
                    <span>{t.wizard.conductText}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t.wizard.btnRegistering : t.wizard.btnRegister}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-[52px] rounded-[12px] border border-[#BBF7D0] bg-white px-7 font-black text-[#04330B] hover:bg-[#F5FBF7] transition-colors"
                >
                  {t.wizard.btnBack}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function YouthJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5FBF7] pt-[70px] lg:pt-[92px] flex items-center justify-center font-['Familjen_Grotesk'] text-[#587E67]">
          Loading…
        </div>
      }
    >
      <YouthJoinPageInner />
    </Suspense>
  );
}
