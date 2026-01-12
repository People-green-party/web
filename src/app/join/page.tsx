"use client";

import React, { useState, useContext, createContext, useEffect, ChangeEvent, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from '../../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X,
  Play,
  Menu,
} from "lucide-react";

import { STATE_LOKSABHA_MAP, getTranslation } from './location_utils';

// --- Translations ---
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      constitution: "Constitution",
      donate: "Donate",
      declaration: "Declaration",
      join: "Join Us",
      login: "Login"
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
    },
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
        constituency: "Your legislative assembly constituency",
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
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      constitution: "संविधान",
      donate: "दान करें",
      declaration: "घोषणा पत्र",
      join: "जुड़ें",
      login: "लॉगिन"
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
    },
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
        constituency: "आपकी विधान सभा निर्वाचन क्षेत्र",
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

// --- Context Setup ---

const LanguageContext = createContext<any>(null);

const useLanguage = () => useContext(LanguageContext);

// --- Navbar Component ---
const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.constitution, href: '/constitution' },
    { name: t.nav.donate, href: '/donation' },
    // { name: t.nav.declaration, href: '/declaration' },
  ];

  return (
    <nav className="bg-white fixed top-0 z-50 w-full flex justify-center">
      <div className="w-full max-w-[1320px] lg:h-[92px] h-[70px] relative flex items-center justify-between px-4 lg:px-0 bg-white">

        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-center leading-none cursor-pointer shrink-0">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[80px] lg:w-[114px] lg:h-[60px] h-[42px] object-cover" />
          </Link>

          <div className="hidden lg:flex items-center gap-[12px] absolute left-1/2 -translate-x-1/2 h-[46px]">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`w-[106px] h-[46px] flex items-center justify-center rounded-[8px] p-[12px] transition-colors font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-center whitespace-nowrap ${isActive
                    ? 'bg-[#EAF7EE] text-[#04330B]'
                    : 'bg-transparent text-[#587E67] hover:bg-gray-50'
                    }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions: Mobile optimized */}
        <div className="flex items-center gap-[10px] lg:gap-[20px]">

          {/* Language Toggle */}
          <div
            className="hidden lg:flex relative w-[84px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[4px] bg-white cursor-pointer"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'hi' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
              {language === 'hi' ? 'हि' : ''}
            </div>
            <div className={`flex-1 rounded-[4px] text-[16px] font-['Familjen_Grotesk'] font-semibold flex items-center justify-center transition-all ${language === 'en' ? 'bg-[#EAF7EE] text-[#04330B]' : 'bg-transparent text-transparent'}`}>
              {language === 'en' ? 'En' : ''}
            </div>
          </div>

          <div
            className="flex lg:hidden relative w-[50px] h-[36px] rounded-[8px] border border-[#B9D3C4] items-center justify-center font-bold text-[#04330B] cursor-pointer text-sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            {language === 'en' ? 'HI' : 'EN'}
          </div>

          <Link
            href="/join"
            className="hidden lg:flex w-[124px] h-[46px] items-center justify-center bg-[#0D5229] text-white font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-[#0a4220] transition-colors whitespace-nowrap"
          >
            {t.nav.join}
          </Link>
          <Link
            href="/login"
            className="hidden lg:flex w-[118px] h-[46px] items-center justify-center border border-[#0D5229] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] rounded-[8px] hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            {t.nav.login}
          </Link>

          <button
            className="lg:hidden p-2 text-gray-700 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg h-screen z-50">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50 text-lg">{link.name}</a>
          ))}
          <div className="flex flex-col gap-4 mt-2">
            <Link href="/join" className="w-full py-3 bg-green-900 text-white text-center rounded font-medium">
              {t.nav.join}
            </Link>
            <Link href="/login" className="w-full py-3 border border-gray-300 text-gray-700 rounded font-medium text-center block">
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer Component ---
const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white pt-[120px] pb-[40px] w-full">
      <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-start">

        {/* Col 1: Logo & Socials */}
        <div className="flex flex-col w-full lg:w-[255px]">
          <Link href="/">
            <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[255px] h-[136px] object-contain mb-[24px] cursor-pointer" />
          </Link>

          <div className="flex flex-col gap-[20px] w-full lg:w-[228px]">
            <h3 className="w-[228px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.footer.follow}
            </h3>

            <div className="w-[228px] h-[48px] flex gap-[12px]">
              {[Linkedin, Facebook, Instagram, X].map((Icon, i) => (
                <div key={i} className="w-[48px] h-[48px] rounded-[8px] border border-[#E4F2EA] bg-white p-[12px] flex items-center justify-center text-[#04330B] hover:bg-[#EAF7EE] transition-colors cursor-pointer">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Useful & Additional Links (Width 380) */}
        <div className="flex flex-col w-full lg:w-[380px] shrink-0 lg:ml-[152px] mt-10 lg:mt-0">

          {/* Useful Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[330px]">
            <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
              {t.footer.useful}
            </h3>
            <div className="w-[330px] h-[22px] flex gap-[40px] items-center">
              {[
                { label: t.nav.home, href: "/" },
                { label: t.nav.about, href: "/about" },
                { label: t.nav.constitution, href: "/constitution" },
                { label: t.nav.join, href: "/join" }
              ].map((link, i) => (
                <a key={i} href={link.href} className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] whitespace-nowrap transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="h-[48px]"></div>

          {/* Additional Links Block */}
          <div className="flex flex-col gap-[20px] w-full lg:w-[312px]">
            <h3 className="w-[200px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] whitespace-nowrap">
              {t.footer.additional}
            </h3>

            <div className="w-[312px] flex flex-col gap-1">
              {[
                t.footer.audit,
                t.footer.eci,
                t.footer.criminal
              ].map((text, i) => (
                <a key={i} href="#" className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] hover:text-[#04330B] block">
                  {text}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* 3. Right Section: Contact Us (Width 381) */}
        <div className="flex flex-col w-full lg:w-[381px] shrink-0 lg:ml-auto mt-10 lg:mt-0">
          <h3 className="w-[134px] h-[30px] font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] mb-[20px]">
            {t.footer.contact}
          </h3>

          <div className="flex flex-col gap-[32px] w-full lg:w-[381px]">

            {/* Address Section */}
            <div className="flex items-start gap-[12px] w-full lg:w-[381px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <p className="flex-1 lg:w-[321px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                {t.footer.address}
              </p>
            </div>

            {/* Phone Section */}
            <div className="flex items-start gap-[16px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col w-[151px]">
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9521627701</p>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">9950008786</p>
              </div>
            </div>

            {/* Email Section */}
            <div className="flex items-center gap-[16px]">
              <div className="w-[48px] h-[48px] shrink-0 rounded-[8px] border border-[#E4F2EA] bg-white flex items-center justify-center text-[#04330B] p-[12px]">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] opacity-70">
                joinus@peoplesgreen.org
              </p>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

// --- Join Page Content ---

// --- Mock Data ---
const MOCK_STATES_DATA = [
  "Rajasthan",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Delhi",
  "Maharashtra"
];

const JoinPageContent = () => {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [loksabhas, setLoksabhas] = useState<any[]>([]);
  const [vidhansabhas, setVidhansabhas] = useState<any[]>([]);
  const [localUnits, setLocalUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
    referralCode: '',
    state: '',
    loksabhaId: '',
    vidhansabhaId: '',
    localUnitId: '',
    zip: '',
    agreeJoin: false,
    agreeResponsibility: false
  });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Load Loksabhas on mount
  useEffect(() => {
    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi('locations/loksabhas')
        .then(data => setLoksabhas(data))
        .catch(err => console.error("Failed to load Loksabhas", err));
    });
  }, []);

  // Clear form on mount
  useEffect(() => {
    setFormData({
      firstName: '',
      lastName: '',
      mobile: '',
      password: '',
      referralCode: '',
      state: '',
      loksabhaId: '',
      vidhansabhaId: '',
      localUnitId: '',
      zip: '',
      agreeJoin: false,
      agreeResponsibility: false
    });
    setOtp('');
    setOtpError('');
    setOtpSent(false);
    setShowOtpField(false);
  }, []);

  const filteredLoksabhas = useMemo(() => {
    if (!formData.state) return [];
    const allowedNames = STATE_LOKSABHA_MAP[formData.state];
    if (!allowedNames) return loksabhas; // If state not in map, show associated loksabhas if array empty or undefined? Better to show none or all? 
    // If state is selected but no map, maybe show empty?
    // Based on user request "rj select kiya to rj ke hi district aaye", implies filtering.
    // If map exists, filter. If not, showing all might be confusing.
    // But MOCK_STATES_DATA are all in map except maybe typos.
    return loksabhas.filter((l: any) => allowedNames.includes(l.name));
  }, [formData.state, loksabhas]);

  useEffect(() => {
    const vidhansabhaId = formData.vidhansabhaId;
    if (!vidhansabhaId) {
      setLocalUnits([]);
      return;
    }

    import('../../lib/api').then(({ fetchApi }) => {
      fetchApi(`locations/vidhansabhas/${vidhansabhaId}/local-units`)
        .then((data) => setLocalUnits(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error('Failed to load Local Units', err);
          setLocalUnits([]);
        });
    });
  }, [formData.vidhansabhaId]);


  async function handleSubmit() {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.password) {
      setOtpError('Please fill all required fields');
      return;
    }

    if (String(formData.password).length < 8) {
      setOtpError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeJoin || !formData.agreeResponsibility) {
      setOtpError('Please agree to all terms and conditions');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      // Import Supabase client
      const { supabase } = await import('../../lib/supabaseClient');

      // Format phone number with country code if needed
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password: formData.password,
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
        // Dev bypass: allow onboarding even when Supabase phone signup is disabled
        if (isPhoneSignupDisabled) {
          console.warn('Phone signups disabled; continuing with backend registration without auth user id');
        }
        // If user already exists, inform them and offer to sign in
        if (authError.message.includes('already registered') ||
          authError.message.includes('already been registered') ||
          authError.message.includes('User already registered') ||
          authError.message.includes('duplicate')) {
          setOtpError('This phone number is already registered. Please sign in instead.');
          // Optionally redirect to login page after a delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        } else if (!isPhoneSignupDisabled) {
          throw authError;
        }
      }

      // Create user profile in your database
      const { fetchApi } = await import('../../lib/api');

      if (!formData.localUnitId) {
        setOtpError('Please select your Local Unit');
        return;
      }
      const userProfileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: phoneNumber,
        password: formData.password, // Note: In production, you might not want to send password to your API
        address: `${formData.state}, India`, // Combine state with country
        localUnitId: parseInt(formData.localUnitId),
        referralCode: formData.referralCode || undefined,
        authUserId: isPhoneSignupDisabled ? undefined : authData?.user?.id,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      console.log('Registration successful:', userData);

      if (typeof window !== 'undefined' && userData?.id) {
        window.localStorage.setItem('devUserId', String(userData.id));
      }

      // Redirect to dashboard after successful registration
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
      return;
    }

    try {
      // Use the same API helper that's used for loading Loksabhas
      const { fetchApi } = await import('../../lib/api');
      const data = await fetchApi(`locations/loksabhas/${loksabhaId}/vidhansabhas`);
      setVidhansabhas(Array.isArray(data) ? data : []);
      setLocalUnits([]);
    } catch (error) {
      console.error('Error loading Vidhansabhas:', error);
      setVidhansabhas([]);
      setLocalUnits([]);
      // Optionally show an error message to the user
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
      // Import Supabase client
      const { supabase } = await import('../../lib/supabaseClient');

      // Format phone number with country code if needed
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      // Verify OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) {
        // If verification fails, check if it's a simulated OTP scenario
        if (otp === '123456' && otpError?.includes('Simulating OTP sent')) {
          // Simulate successful verification for development
          console.log('Simulated OTP verification successful');
          // Proceed with form submission or next step
          handleSubmit();
          return;
        }
        throw error;
      }

      // OTP verified successfully
      console.log('OTP verified successfully');
      // Proceed with form submission or next step
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
      console.error('Mobile number is required');
      setOtpError('Mobile number is required');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      // Import Supabase client
      const { supabase } = await import('../../lib/supabaseClient');

      // Format phone number with country code if needed
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      // Send OTP to mobile number
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.warn('Supabase Auth Error (falling back to simulation):', error.message);
        throw error;
      }

      // OTP sent successfully
      setOtpSent(true);
      setShowOtpField(true);
    } catch (error: any) {
      console.error('Error sending OTP:', error);

      // Fallback to simulation mode when SMS provider is not configured
      const isConfigError = error.message === 'Unsupported phone provider' ||
        error.message === 'Failed to fetch' ||
        error.message?.includes('apikey') ||
        error.message?.includes('Signups not allowed');

      if (isConfigError) {
        // Simulate OTP sent for development/testing
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

  // ... (rest of the code remains the same)

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      {/* MAIN CONTENT WRAPPER */}
      <main className="w-full max-w-[1320px] px-4 lg:px-0 mt-[12px] flex flex-col items-center">

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
        <section className="w-full h-auto lg:h-[950px] flex flex-col lg:flex-row gap-[24px]">

          {/* Left: Video Section */}
          <div className="relative w-full lg:w-[768px] h-[400px] lg:h-[950px] rounded-[8px] overflow-hidden">
            <img
              src="/joinus.png"
              alt="People gathering"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(269.13deg, rgba(0, 0, 0, 0) 2.53%, rgba(0, 0, 0, 0.15) 99.37%)'
              }}
            />
            {/* Play Button */}
            <button
              type="button"
              className="absolute inset-0 z-20 m-auto flex items-center justify-center w-[100px] h-[100px] hover:scale-105 transition-transform"
            >
              <img src="/Play-Button.svg" alt="Play" className="w-full h-full" />
            </button>
          </div>

          {/* Right: Registration Form */}
          <div
            className="w-full lg:w-[512px] h-auto lg:h-[950px] bg-white rounded-[8px] border border-[#E4F2EA] p-[32px] flex flex-col gap-[28px] shadow-[0px_4px_20px_0px_#0000001A]"
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
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.firstName}
                    autoComplete="off"
                  />

                  {/* 2. Last Name */}
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder={t.joinPage.form.lastName}
                    autoComplete="off"
                  />

                  {/* 3. Mobile */}
                  <div className="w-full h-[46px] flex gap-[8px]">
                    <div className="relative h-full w-[80px]">
                      <select className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[12px] py-[12px] text-[16px] bg-white text-[#587E67] font-semibold tracking-[-0.3px] outline-none cursor-pointer">
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
                      className="flex-1 h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                      placeholder={t.joinPage.form.mobile}
                      autoComplete="off"
                    />
                  </div>

                  {/* 3b. Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                        minLength={8}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* 3c. Referral Code */}
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk']"
                    placeholder="Referral Code (Optional)"
                    autoComplete="off"
                  />

                  {/* 4. State & District */}
                  <div className="w-full h-[46px] flex gap-[14px]">
                    <div className="relative flex-1 h-full">
                      <select
                        value={formData.state}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            state: e.target.value,
                            loksabhaId: '',
                            vidhansabhaId: '',
                            localUnitId: ''
                          });
                          setVidhansabhas([]);
                          setLocalUnits([]);
                        }}
                        className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']"
                      >
                        <option value="">{t.joinPage.form.state}</option>
                        {Object.keys(STATE_LOKSABHA_MAP).sort().map((s) => (
                          <option key={s} value={s}>{getTranslation(s, language)}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>

                    <div className="relative flex-1 h-full">
                      <select
                        value={formData.loksabhaId}
                        onChange={handleLoksabhaChange}
                        className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']"
                      >
                        <option value="">{t.joinPage.form.district} (Loksabha)</option>
                        {filteredLoksabhas.map((l: any) => (
                          <option key={l.id} value={l.id}>{getTranslation(l.name, language)}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 6. Constituency */}
                  <div className="relative w-full h-[46px]">
                    <select
                      value={formData.vidhansabhaId}
                      onChange={(e) => setFormData({ ...formData, vidhansabhaId: e.target.value })}
                      className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk']"
                    >
                      <option value="">{t.joinPage.form.constituency}</option>
                      {vidhansabhas.map((v: any) => (
                        <option key={v.id} value={v.id}>{getTranslation(v.name, language)}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  {/* 6b. Local Unit */}
                  <div className="relative w-full h-[46px]">
                    <select
                      value={formData.localUnitId}
                      onChange={(e) => setFormData({ ...formData, localUnitId: e.target.value })}
                      disabled={!formData.vidhansabhaId || localUnits.length === 0}
                      className="appearance-none w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] bg-white text-[#587E67] outline-none cursor-pointer font-['Familjen_Grotesk'] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select your Local Unit</option>
                      {localUnits.map((u: any) => (
                        <option key={u.id} value={u.id}>
                          {getTranslation(u.name, language)}{u.type ? ` (${u.type})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#587E67]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  {/* 7. ZIP */}
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-semibold tracking-[-0.3px] text-[16px] placeholder-[#587E67] text-[#04330B] focus:outline-none focus:ring-1 focus:ring-green-600 outline-none font-['Familjen_Grotesk'] "
                    placeholder={t.joinPage.form.zip}
                    autoComplete="off"
                  />
                </div>

                {/* --- CHECKBOX SECTION FIXED --- */}
                <div className="w-full flex flex-col gap-[16px] mt-[4px]">

                  {/* First Checkbox Item */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    {/* Checkbox Container: Fixed 20x20 */}
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      {/* 1. Invisible Clickable Input Layer */}
                      <input
                        type="checkbox"
                        checked={formData.agreeJoin}
                        onChange={(e) => setFormData({ ...formData, agreeJoin: e.target.checked })}
                        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
                      />

                      {/* 2. Visual Box Layer (15x15px) */}
                      <div
                        className="w-[15px] h-[15px] bg-white border-[2px] border-[#587E67] rounded-none peer-checked:bg-[#587E67] pointer-events-none transition-all"
                        style={{ width: '15px', height: '15px' }} // Double enforcement
                      />

                      {/* 3. Checkmark Icon Layer */}
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

                  {/* Second Checkbox Item */}
                  <label className="flex items-start gap-[12px] cursor-pointer group select-none">
                    {/* Checkbox Container: Fixed 20x20 */}
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                      {/* 1. Invisible Clickable Input Layer */}
                      <input
                        type="checkbox"
                        checked={formData.agreeResponsibility}
                        onChange={(e) => setFormData({ ...formData, agreeResponsibility: e.target.checked })}
                        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
                      />

                      {/* 2. Visual Box Layer (15x15px) */}
                      <div
                        className="w-[15px] h-[15px] bg-white border-[2px] border-[#587E67] rounded-none peer-checked:bg-[#587E67] pointer-events-none transition-all"
                        style={{ width: '15px', height: '15px' }}
                      />

                      {/* 3. Checkmark Icon Layer */}
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
              </div>

              {/* Gap 24px before Button */}
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
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default function JoinPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: translations[language]
    }}>
      <JoinPageContent />
    </LanguageContext.Provider>
  );
}