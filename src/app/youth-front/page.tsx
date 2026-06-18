"use client";

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Megaphone, ShieldCheck, Trophy, Users, MessageCircle, AlertTriangle, Leaf, Mic, FileText, MapPin, Zap, X, LogIn } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { useLanguage } from '@/components/LanguageContext';

const joinHref = '/youth-front/join';

const translations = {
  hi: {
    hero: {
      tag: "#काकरोचकैंपसआंदोलन",
      title: "PGP यूथ फ्रंट",
      subtitle: "केवल राजनीति मत देखो। बदलाव लाओ।",
      desc1: "PGP यूथ फ्रंट छात्रों, पहली बार मतदान करने वाले मतदाताओं, बेरोजगार युवाओं, युवा पेशेवरों, रचनाकारों, वार्ड स्वयंसेवकों और ग्राम आयोजकों के लिए एक राजस्थान-व्यापी युवा कार्रवाई नेटवर्क है।",
      desc2: "वास्तविक मुद्दों की रिपोर्ट करने, युवाओं को आमंत्रित करने, सामग्री बनाने, स्थानीय यूथ एक्शन सेल्स बनाने और भविष्य के नेता बनने के लिए शामिल हों।",
      firstMissionTitle: "आपका पहला मिशन:",
      firstMissionDesc: "जुड़ें। सत्यापित करें। अपना ट्रैक चुनें। 3 युवाओं को आमंत्रित करें। एक वास्तविक मुद्दे की रिपोर्ट करें। अपनी स्थानीय टीम बनाएं।",
      btnJoin: "PGP यूथ फ्रंट से जुड़ें",
      btnLogin: "लॉगिन करें",
      btnReport: "मुद्दा रिपोर्ट करें",
      ageHint: "18+ सक्रिय युवा सदस्यों के रूप में शामिल हो सकते हैं। 16-17 केवल सुरक्षित नागरिक, जागरूकता और पर्यावरण गतिविधियों के लिए नागरिक सहयोगियों के रूप में शामिल हो सकते हैं।"
    },
    movement: {
      title: "यह #CockroachCampusMovement क्या है?",
      desc1: "जब व्यवस्था गंदी, भ्रष्ट और आम लोगों से कट जाती है, तो युवा मूकदर्शक बनकर नहीं रह सकते।",
      desc2: "#CockroachCampusMovement पीपल्स ग्रीन पार्टी यूथ फ्रंट का सार्वजनिक अभियान है।",
      bullet1: "यह कोई मज़ाक नहीं है।",
      bullet2: "यह सिर्फ एक मीम नहीं है।",
      bullet3: "यह अस्तित्व, प्रतिरोध और संगठित युवा कार्रवाई का प्रतीक है।",
      desc3: "हम स्थानीय नेताओं की एक नई पीढ़ी का निर्माण कर रहे हैं जो वास्तविक समस्याओं को उजागर कर सकते हैं, लोगों को संगठित कर सकते हैं, लोकतंत्र की रक्षा कर सकते हैं, प्रकृति की रक्षा कर सकते हैं और बदलाव के लिए दबाव बना सकते हैं।"
    },
    scope: {
      title: "यह केवल कॉलेज के छात्रों के लिए नहीं है",
      subtitle: "आप जुड़ सकते हैं:",
      items: [
        'कॉलेज या विश्वविद्यालय से',
        'कोचिंग संस्थान से',
        'वार्ड या मोहल्ले से',
        'गांव या पंचायत से',
        'डिजिटल क्रिएटर कम्युनिटी से',
        'पर्यावरण स्वयंसेवक समूह से',
        'युवा पेशेवर नेटवर्क से',
        'स्कूल से, केवल नागरिक सहयोगी के रूप में यदि आयु 16-17 है',
      ],
      notice: "जहां भी 10 सत्यापित युवा एक साथ आते हैं, वहां यूथ एक्शन सेल शुरू हो सकता है।"
    },
    mission: {
      title: "शामिल होने के बाद आप क्या करेंगे?",
      subtitle: "आपका स्टार्टर मिशन",
      steps: [
        'OTP सत्यापन पूरा करें।',
        'अपना ट्रैक चुनें।',
        'अपने जिला समूह में शामिल हों।',
        'अपने रेफरल लिंक का उपयोग करके 3 युवाओं को आमंत्रित करें।',
        'फोटो या वीडियो प्रमाण के साथ एक वास्तविक मुद्दे की रिपोर्ट करें।',
        '10-सदस्यीय यूथ एक्शन सेल बनाने या उसमें शामिल होने में मदद करें।',
      ]
    },
    tracks: {
      title: "अपना ट्रैक चुनें",
      roles: [
        { title: 'मुद्दा रिपोर्टर', desc: 'अपने क्षेत्र की वास्तविक समस्याओं की रिपोर्ट करें: सड़क, पानी, कचरा, बिजली, भ्रष्टाचार, परिसर की समस्याएं, जंगल का विनाश और सार्वजनिक सेवा की विफलता।' },
        { title: 'डिजिटल स्वयंसेवक', desc: 'रील्स, पोस्टर, मीम्स, व्याख्याकार, कहानियां और अभियान सामग्री बनाएं।' },
        { title: 'ग्राउंड स्वयंसेवक', desc: 'सदस्यता अभियान, सार्वजनिक चर्चा, बैठकें, सर्वेक्षण और स्थानीय गतिविधियों में सहायता करें।' },
        { title: 'पर्यावरण स्वयंसेवक', desc: 'जंगल बचाओ, जल संरक्षण, स्वच्छता, प्रदूषण और हरित अभियानों पर काम करें।' },
        { title: 'अनुसंधान स्वयंसेवक', desc: 'नीति नोट्स, आरटीआई, डेटा, रिपोर्ट और मुद्दा दस्तावेजीकरण में सहायता करें।' },
        { title: 'सार्वजनिक वक्ता', desc: 'बहस, चर्चा, लाइव सत्र और स्थानीय सार्वजनिक संचार में शामिल हों।' }
      ]
    },
    issueInfo: {
      title: "आपका मुद्दा सिर्फ एक फॉर्म में गायब नहीं होगा",
      desc1: "जब आप किसी मुद्दे की रिपोर्ट करते हैं, तो वह PGP यूथ फ्रंट इश्यू सिस्टम में दर्ज होता है।",
      flow: ['सबमिट किया गया', 'समीक्षा की गई', 'सत्यापित', 'आवंटित', 'प्राधिकरण / जन अभियान को भेजा गया', 'फॉलो-अप', 'सुलझाया गया या एस्केलेटेड'],
      warning: "हर मुद्दा सार्वजनिक अभियान नहीं बनेगा। बार-बार आने वाले, सत्यापित और उच्च प्रभाव वाले मुद्दों को प्राथमिकता दी जाएगी।",
      desc2: "यह PGP को राजस्थान का एक वास्तविक लोगों का मुद्दा मानचित्र बनाने में मदद करता है।"
    },
    squad: {
      title: "10-सदस्यीय यूथ एक्शन सेल शुरू करें",
      subtitle: "यूथ एक्शन सेल यहाँ बनाया जा सकता है:",
      locations: ['कैंपस', 'वार्ड', 'गांव', 'मोहल्ला', 'कोचिंग हब', 'डिजिटल क्रिएटर ग्रुप', 'पर्यावरण ग्रुप'],
      requirementsTitle: "एक सेल सक्रिय होता है जब उसमें होते हैं:",
      requirements: [
        '10 OTP-सत्यापित सदस्य',
        'एक जिम्मेदार कैप्टन',
        'एक पूर्ण गतिविधि',
        'जिला स्तर की मंजूरी',
      ],
      rolesTitle: "हर सदस्य को भूमिका मिलती है",
      roles: [
        'सेल कैप्टन',
        'वाइस कैप्टन',
        'सदस्यता लीड',
        'डिजिटल क्रिएटर',
        'मीम / क्रिएटिव लीड',
        'मुद्दा रिपोर्टर',
        'इवेंट लीड',
        'पर्यावरण लीड',
        'दस्तावेज़ीकरण लीड',
        'अनुशासन लीड',
      ],
      notice: "यह भीड़ नहीं है। यह एक संगठित युवा संरचना है।"
    },
    levels: {
      title: "सदस्य से लीडर के रूप में विकसित हों",
      steps: [
        { level: 'समर्थक', desc: 'आप शामिल हुए और अपनी पहचान सत्यापित की।' },
        { level: 'योगदानकर्ता', desc: 'आपने युवाओं को आमंत्रित किया या अपने पहले मुद्दे की रिपोर्ट की।' },
        { level: 'सक्रिय स्वयंसेवक', desc: 'आपने नियमित कार्य पूरे किए।' },
        { level: 'यूथ एक्शन सेल सदस्य', desc: 'आप एक स्थानीय 10-सदस्यीय टीम का हिस्सा बने।' },
        { level: 'यूथ एक्शन सेल कैप्टन', desc: 'आपने एक सत्यापित स्थानीय सेल का नेतृत्व करने में मदद की।' },
        { level: 'जिला युवा आयोजक', desc: 'आपने कई स्थानीय सेल्स को समन्वित करने में मदद की।' },
        { level: 'राज्य युवा फेलो', desc: 'आप भविष्य के नेतृत्व पाइपलाइन का हिस्सा बने।' },
      ]
    },
    conduct: {
      title: "अनुशासन से कोई समझौता नहीं",
      warning: "PGP यूथ फ्रंट इसकी अनुमति नहीं देता:",
      items: [
        'हिंसा',
        'अभद्र भाषा (Hate speech)',
        'फर्जी खबरें',
        'उत्पीड़न (Harassment)',
        'धमकी',
        'जातिगत दुर्व्यवहार',
        'सांप्रदायिक लक्ष्यीकरण',
        'डॉक्सिंग (Doxxing)',
        'सत्यापित प्रमाण के बिना व्यक्तिगत हमले',
      ],
      notice: "यह आंदोलन निडर है, लेकिन जिम्मेदार है।"
    },
    cta: {
      title: "राजस्थान को ऐसे युवाओं की जरूरत है जो काम करते हैं",
      desc: "रील्स देखने, निजी तौर पर शिकायत करने या पुरानी पार्टियों में सुधार का इंतजार करने से राजनीति नहीं बदलेगी।",
      bullet1: "PGP यूथ फ्रंट से जुड़ें।",
      bullet2: "वास्तविक मुद्दों की रिपोर्ट करें।",
      bullet3: "अपना स्थानीय यूथ एक्शन सेल बनाएं।",
      bullet4: "बदलाव के सूत्रधार बनें।",
      notice: "PGP यूथ फ्रंट सिर्फ एक छात्र विंग नहीं है। यह लोकतंत्र, पर्यावरण, स्वच्छ शासन और स्थानीय नेतृत्व के लिए एक राजस्थान-व्यापी युवा कार्रवाई नेटवर्क है।"
    }
  },
  en: {
    hero: {
      tag: "#CockroachCampusMovement",
      title: "PGP Youth Front",
      subtitle: "Don't just watch politics. Build change.",
      desc1: "PGP Youth Front is a Rajasthan-wide youth action network for students, first-time voters, unemployed youth, young professionals, creators, ward volunteers and village organisers.",
      desc2: "Join to report real issues, invite youth, create content, build local Youth Action Cells and become a future leader.",
      firstMissionTitle: "Your first mission:",
      firstMissionDesc: "Join. Verify. Choose your track. Invite 3 youth. Report one real issue. Build your local team.",
      btnJoin: "Join PGP Youth Front",
      btnLogin: "Login",
      btnReport: "Report an Issue",
      ageHint: "18+ can join as active youth members. 16–17 can join only as civic associates for safe civic, awareness and environment activities."
    },
    movement: {
      title: "What is #CockroachCampusMovement?",
      desc1: "When the system becomes dirty, corrupt and disconnected from ordinary people, youth cannot remain silent spectators.",
      desc2: "#CockroachCampusMovement is the public campaign of PGP Youth Front.",
      bullet1: "It is not a joke.",
      bullet2: "It is not just a meme.",
      bullet3: "It is a symbol of survival, resistance and organised youth action.",
      desc3: "We are building a new generation of local leaders who can expose real problems, organise people, protect democracy, defend nature and create pressure for change."
    },
    scope: {
      title: "This is not only for college students",
      subtitle: "You can join from:",
      items: [
        'College or university',
        'Coaching institute',
        'Ward or mohalla',
        'Village or panchayat',
        'Digital creator community',
        'Environment volunteer group',
        'Young professional network',
        'School, only as civic associate if age is 16–17',
      ],
      notice: "Wherever 10 verified youth come together, a Youth Action Cell can begin."
    },
    mission: {
      title: "What will you do after joining?",
      subtitle: "Your Starter Mission",
      steps: [
        'Complete OTP verification.',
        'Choose your track.',
        'Join your district group.',
        'Invite 3 youth using your referral link.',
        'Report one real issue with photo or video proof.',
        'Help build or join a 10-member Youth Action Cell.',
      ]
    },
    tracks: {
      title: "Choose your track",
      roles: [
        { title: 'Issue Reporter', desc: 'Report real problems from your area: roads, water, garbage, electricity, corruption, campus problems, forest destruction and public service failure.' },
        { title: 'Digital Volunteer', desc: 'Create reels, posters, memes, explainers, stories and campaign content.' },
        { title: 'Ground Volunteer', desc: 'Help with membership drives, public discussions, meetings, surveys and local activities.' },
        { title: 'Environment Volunteer', desc: 'Work on jungle bachao, water conservation, cleanliness, pollution and green drives.' },
        { title: 'Research Volunteer', desc: 'Help with policy notes, RTI, data, reports and issue documentation.' },
        { title: 'Public Speaker', desc: 'Join debates, discussions, live sessions and local public communication.' }
      ]
    },
    issueInfo: {
      title: "Your issue will not disappear into a form",
      desc1: "When you report an issue, it enters the PGP Youth Front issue system.",
      flow: ['Submitted', 'Reviewed', 'Verified', 'Assigned', 'Sent to Authority / Public Campaign', 'Follow-up', 'Resolved or Escalated'],
      warning: "Not every issue will become a public campaign. Repeated, verified and high-impact issues will be prioritised.",
      desc2: "This helps PGP build a real people's issue map of Rajasthan."
    },
    squad: {
      title: "Start a 10-member Youth Action Cell",
      subtitle: "A Youth Action Cell can be formed in a:",
      locations: ['Campus', 'Ward', 'Village', 'Mohalla', 'Coaching hub', 'Digital creator group', 'Environment group'],
      requirementsTitle: "A cell becomes active when it has:",
      requirements: [
        '10 OTP-verified members',
        'One responsible captain',
        'One completed activity',
        'District-level approval',
      ],
      rolesTitle: "Every member gets a role",
      roles: [
        'Cell Captain',
        'Vice Captain',
        'Membership Lead',
        'Digital Creator',
        'Meme / Creative Lead',
        'Issue Reporter',
        'Event Lead',
        'Environment Lead',
        'Documentation Lead',
        'Discipline Lead',
      ],
      notice: "This is not a crowd. This is an organised youth structure."
    },
    levels: {
      title: "Grow from member to leader",
      steps: [
        { level: 'Supporter', desc: 'You joined and verified your identity.' },
        { level: 'Contributor', desc: 'You invited youth or reported your first issue.' },
        { level: 'Active Volunteer', desc: 'You completed regular tasks.' },
        { level: 'Youth Action Cell Member', desc: 'You became part of a local 10-member team.' },
        { level: 'Youth Action Cell Captain', desc: 'You helped lead a verified local cell.' },
        { level: 'District Youth Organiser', desc: 'You helped coordinate multiple local cells.' },
        { level: 'State Youth Fellow', desc: 'You became part of the future leadership pipeline.' },
      ]
    },
    conduct: {
      title: "Discipline is non-negotiable",
      warning: "PGP Youth Front does not allow:",
      items: [
        'Violence',
        'Hate speech',
        'Fake news',
        'Harassment',
        'Threats',
        'Caste abuse',
        'Communal targeting',
        'Doxxing',
        'Personal attacks without verified proof',
      ],
      notice: "This movement is fearless, but responsible."
    },
    cta: {
      title: "Rajasthan needs youth who act",
      desc: "Politics will not change by watching reels, complaining in private, or waiting for old parties to improve.",
      bullet1: "Join PGP Youth Front.",
      bullet2: "Report real issues.",
      bullet3: "Build your local Youth Action Cell.",
      bullet4: "Become a change maker.",
      notice: "PGP Youth Front is not just a student wing. It is a Rajasthan-wide youth action network for democracy, environment, clean governance and local leadership."
    }
  }
};

export default function YouthFrontPage() {
  const { language } = useLanguage();
  const t = translations[language as 'en' | 'hi'] || translations.en;
  
  const roleIcons = [AlertTriangle, Megaphone, Users, Leaf, FileText, Mic];

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-[#BBF7D0]">
              <Megaphone size={18} /> {t.hero.tag}
            </div>
            <h1 className="mt-7 text-4xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-2xl lg:text-3xl font-bold text-[#BBF7D0]">
              {t.hero.subtitle}
            </p>
            <p className="mt-6 max-w-3xl text-lg text-white/78 leading-8">
              {t.hero.desc1}
            </p>
            <p className="mt-4 max-w-3xl text-lg text-white/78 leading-8">
              {t.hero.desc2}
            </p>
            <div className="mt-8 rounded-2xl bg-white/10 p-6 border border-white/20">
              <div className="text-xl font-black text-[#BBF7D0] mb-3">{t.hero.firstMissionTitle}</div>
              <div className="grid gap-2 text-white/90 font-semibold">
                <div>• {t.hero.firstMissionDesc}</div>
              </div>
            </div>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link href={joinHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-7 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                {t.hero.btnJoin} <ArrowRight size={20} />
              </Link>
              <Link href="/youth-front/login" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#04330B] shadow-xl shadow-black/10">
                {t.hero.btnLogin} <LogIn size={20} />
              </Link>
              <Link href="/youth-front/report-issue" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-black text-white">
                {t.hero.btnReport} <AlertTriangle size={20} />
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/60">
              {t.hero.ageHint}
            </p>
          </div>
        </section>

        {/* What is this movement? */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.movement.title}</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-4">
              {t.movement.desc1}
            </p>
            <p className="text-lg text-[#04330B] font-bold leading-8 mb-4">
              {t.movement.desc2}
            </p>
            <div className="grid gap-3 mt-6">
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <X size={20} className="text-[#DC2626]" /> {t.movement.bullet1}
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <X size={20} className="text-[#DC2626]" /> {t.movement.bullet2}
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <CheckCircle2 size={20} className="text-[#16A34A]" /> {t.movement.bullet3}
              </div>
            </div>
            <p className="mt-6 text-lg text-[#04330B] font-semibold leading-8">
              {t.movement.desc3}
            </p>
          </div>
        </section>

        {/* Not only college students */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.scope.title}</h2>
          <p className="text-lg text-[#587E67] font-semibold mb-8">{t.scope.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.scope.items.map((item) => (
              <div key={item} className="rounded-2xl bg-white border border-[#DDEEE4] p-5 font-bold text-[#04330B]">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#DCFCE7] p-6 border border-[#BBF7D0]">
            <p className="text-lg font-black text-[#04330B]">
              {t.scope.notice}
            </p>
          </div>
        </section>

        {/* What will you do after joining? */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.mission.title}</h2>
          <p className="text-xl font-bold text-[#587E67] mb-8">{t.mission.subtitle}</p>
          <div className="grid gap-4">
            {t.mission.steps.map((task, index) => (
              <div key={task} className="rounded-2xl bg-white border border-[#DDEEE4] p-6 flex gap-4">
                <div className="shrink-0 w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <span className="text-2xl font-black text-[#04330B]">{index + 1}</span>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-lg font-bold text-[#04330B]">{task}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Choose your track */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.tracks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.tracks.roles.map((role, index) => {
              const IconComponent = roleIcons[index];
              return (
                <div key={role.title} className="rounded-2xl bg-white border border-[#DDEEE4] p-6">
                  {IconComponent && <IconComponent className="text-[#16A34A]" size={32} />}
                  <h3 className="mt-4 text-xl font-black text-[#04330B]">{role.title}</h3>
                  <p className="mt-3 text-[#587E67] font-semibold leading-7">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What happens to reported issues */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.issueInfo.title}</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-6">
              {t.issueInfo.desc1}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {t.issueInfo.flow.map((status, index) => (
                <div key={status} className="flex items-center">
                  <span className="px-3 py-2 rounded-lg bg-[#DCFCE7] text-[#04330B] font-bold text-sm">{status}</span>
                  {index < t.issueInfo.flow.length - 1 && <ArrowRight size={16} className="mx-1 text-[#587E67]" />}
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-[#FEF3C7] p-4 border border-[#F59E0B]">
              <p className="text-[#04330B] font-semibold">
                {t.issueInfo.warning}
              </p>
            </div>
            <p className="mt-6 text-lg text-[#04330B] font-semibold leading-8">
              {t.issueInfo.desc2}
            </p>
          </div>
        </section>

        {/* Youth Action Cell */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.squad.title}</h2>
          <p className="text-lg text-[#587E67] font-semibold mb-8">{t.squad.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {t.squad.locations.map((location) => (
              <div key={location} className="rounded-2xl bg-white border border-[#DDEEE4] p-4 font-bold text-[#04330B] text-center">
                {location}
              </div>
            ))}
          </div>
          <div className="rounded-[32px] bg-[#DCFCE7] border border-[#BBF7D0] p-8">
            <h3 className="text-xl font-black text-[#04330B] mb-4">{t.squad.requirementsTitle}</h3>
            <div className="grid gap-3">
              {t.squad.requirements.map((req) => (
                <div key={req} className="flex items-center gap-3 font-bold text-[#04330B]">
                  <CheckCircle2 size={20} className="text-[#16A34A]" /> {req}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 roles in every cell */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.squad.rolesTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {t.squad.roles.map((role) => (
              <div key={role} className="rounded-2xl bg-white border border-[#DDEEE4] p-4 font-bold text-[#04330B] text-center">
                {role}
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#04330B] p-6 text-white">
            <p className="text-lg font-black">{t.squad.notice}</p>
          </div>
        </section>

        {/* Growth levels */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.levels.title}</h2>
          <div className="space-y-4">
            {t.levels.steps.map((item, index) => (
              <div key={item.level} className="rounded-2xl bg-white border border-[#DDEEE4] p-6 flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <span className="text-xl font-black text-[#04330B]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-black text-[#04330B]">{item.level}</div>
                  <div className="text-[#587E67] font-semibold mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code of conduct */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.conduct.title}</h2>
          <div className="rounded-[32px] bg-[#FEE2E2] border border-[#DC2626] p-8 lg:p-12">
            <p className="text-lg font-black text-[#DC2626] mb-6">{t.conduct.warning}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {t.conduct.items.map((action) => (
                <div key={action} className="flex items-center gap-2 font-bold text-[#04330B]">
                  <X size={18} className="text-[#DC2626]" /> {action}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-[#04330B] p-6 text-white">
              <p className="text-lg font-black">{t.conduct.notice}</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">{t.cta.title}</h2>
            <p className="max-w-3xl mx-auto text-lg text-white/78 leading-8 mb-8">
              {t.cta.desc}
            </p>
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="text-lg font-bold text-[#BBF7D0]">{t.cta.bullet1}</div>
              <div className="text-lg font-bold text-[#BBF7D0]">{t.cta.bullet2}</div>
              <div className="text-lg font-bold text-[#BBF7D0]">{t.cta.bullet3}</div>
              <div className="text-lg font-bold text-[#BBF7D0]">{t.cta.bullet4}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={joinHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-8 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                {t.hero.btnJoin} <ArrowRight size={20} />
              </Link>
              <Link href="/youth-front/login" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-[#04330B] shadow-xl shadow-black/10">
                {t.hero.btnLogin} <LogIn size={20} />
              </Link>
              <Link href="/youth-front/report-issue" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black text-white">
                {t.hero.btnReport} <AlertTriangle size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Positioning line */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <div className="rounded-[32px] bg-[#DCFCE7] border border-[#BBF7D0] p-8 lg:p-12 text-center">
            <p className="text-xl lg:text-2xl font-black text-[#04330B] leading-8">
              {t.cta.notice}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
