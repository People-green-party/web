"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, TrendingUp, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Open Economy
const theme = {
    primary: "bg-teal-800",
    secondary: "bg-teal-50",
    accent: "text-teal-700",
    gradient: "from-teal-800 to-emerald-900",
    button: "bg-teal-700 hover:bg-teal-800",
    iconBg: "bg-teal-100",
};

// Data for Open Economy
const pageData = {
    en: {
        title: "Open Economy & Minimum Government",
        subtitle: "Individual Freedom, Faster Growth",
        missionTitle: "Our Economic Philosophy",
        description: "The role of the state should be that of a facilitator, not a controller. We believe in liberal economic policies and minimum government interference to unleash the true potential of Indian enterprise.",
        image: "/party-images/DSC_0081.JPG",
        icon: TrendingUp,
        strategyTitle: "Our Strategy",
        points: [
            "Private Property: Respect for private property and individual liberty. We believe that secure property rights are the bedrock of economic prosperity, encouraging citizens to invest, innovate, and build long-term wealth without fear of arbitrary state seizure.",
            "End of License Raj: End of license-raj and unnecessary regulations. We will dismantle the complex web of bureaucratic red tape that stifles entrepreneurship, making it easier to start, run, and grow a business in India.",
            "Minimum Interference: Minimum government interference in business. The government's role should be that of a neutral referee and facilitator, not a player or controller. We support free markets driven by competition and consumer choice.",
            "Globalization: Accelerating Liberalization, Privatization, and Globalization. By integrating deeply with the global economy, we aim to attract foreign investment, access cutting-edge technology, and open new markets for Indian products and services."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Rapid Growth: Rapid economic growth driven by private initiative. By unleashing the animal spirits of Indian entrepreneurs, we target double-digit GDP growth that will transform India into a developed nation.",
            "Equal Opportunities: Social mobility and equality of opportunity. An open economy rewards talent and hard work over lineage, creating a meritocratic society where everyone has a fair shot at success.",
            "Global Innovation Hub: India emerging as a global hub for innovation and startups, attracting the best talent and capital from around the world."
        ]
    },
    hi: {
        title: "खुली अर्थव्यवस्था और न्यून सरकार",
        subtitle: "व्यक्ति की आज़ादी, तेज़ विकास",
        missionTitle: "हमारी आर्थिक सोच",
        description: "राज्य का काम नियंत्रक नहीं, सुविधाकर्ता होना चाहिए। पीपल्स ग्रीन पार्टी उदार आर्थिक नीति और न्यूनतम सरकारी हस्तक्षेप में विश्वास रखती है ताकि भारतीय उद्यम की वास्तविक क्षमता को मुक्त किया जा सके।",
        image: "/party-images/DSC_0081.JPG",
        icon: TrendingUp,
        strategyTitle: "हमारी रणनीति",
        points: [
            "निजी संपत्ति: निजी संपत्ति और व्यक्तिगत स्वतंत्रता का सम्मान। हमारा मानना है कि सुरक्षित संपत्ति अधिकार आर्थिक समृद्धि की आधारशिला हैं, जो नागरिकों को निवेश करने, नवाचार करने और राज्य की मनमानी जब्ती के डर के बिना दीर्घकालिक धन बनाने के लिए प्रोत्साहित करते हैं।",
            "लाइसेंस-राज का अंत: लाइसेंस-राज और अनावश्यक नियमों का अंत। हम नौकरशाही लालफीताशाही के उस जटिल जाल को खत्म करेंगे जो उद्यमिता का गला घोंटता है, जिससे भारत में व्यवसाय शुरू करना, चलाना और बढ़ाना आसान हो जाएगा।",
            "न्यूनतम हस्तक्षेप: व्यापार में न्यूनतम सरकारी हस्तक्षेप। सरकार की भूमिका एक तटस्थ रेफरी और सुविधाप्रदाता की होनी चाहिए, न कि एक खिलाड़ी या नियंत्रक की। हम प्रतिस्पर्धा और उपभोक्ता पसंद से संचालित मुक्त बाजारों का समर्थन करते हैं।",
            "वैश्वीकरण: उदारीकरण, निजीकरण और वैश्वीकरण में तेजी लाना। वैश्विक अर्थव्यवस्था के साथ गहराई से जुड़कर, हमारा लक्ष्य विदेशी निवेश को आकर्षित करना, अत्याधुनिक तकनीक तक पहुंच बनाना और भारतीय उत्पादों और सेवाओं के लिए नए बाजार खोलना है।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "तेज़ विकास: निजी पहल से प्रेरित तेज़ आर्थिक विकास। भारतीय उद्यमियों की ऊर्जा को मुक्त करके, हमारा लक्ष्य दोहरे अंकों की जीडीपी वृद्धि हासिल करना है जो भारत को एक विकसित राष्ट्र में बदल देगी।",
            "अवसरों की समानता: सामाजिक गतिशीलता और अवसरों की समानता। एक खुली अर्थव्यवस्था वंश के बजाय प्रतिभा और कड़ी मेहनत को पुरस्कृत करती है, जिससे एक योग्यता-आधारित समाज का निर्माण होता है जहां सभी को सफलता का उचित मौका मिलता है।",
            "वैश्विक नवाचार केंद्र: भारत का नवाचार और स्टार्टअप्स के लिए एक वैश्विक केंद्र के रूप में उभरना, जो दुनिया भर से बेहतरीन प्रतिभा और पूंजी को आकर्षित करेगा।"
        ]
    }
};

export default function OpenEconomyPage() {
    const { language } = useLanguage();
    const currentLang = language === 'hi' ? 'hi' : 'en';
    const content = pageData[currentLang];
    const Icon = content.icon;

    return (
        <div className={`bg-white min-h-screen font-sans selection:${theme.primary} selection:text-white`}>
            <Navbar />

            {/* 1. IMMERSIVE HERO SECTION WITH THEME GRADIENT */}
            <div className={`relative w-full min-h-[600px] lg:min-h-[85vh] flex flex-col justify-center mt-[70px] lg:mt-[90px] py-24 lg:py-32 overflow-visible`}>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Themed Overlay */}
                <div className={`absolute inset-0 z-10 opacity-90 bg-gradient-to-r ${theme.gradient}`} />

                {/* Content */}
                <div className="relative z-20 w-full max-w-[1320px] mx-auto px-4 lg:px-8 pt-10">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <Link
                            href="/#vision"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium group px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm w-fit border border-white/10"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            {currentLang === 'hi' ? 'सभी विज़न देखें' : 'View All Visions'}
                        </Link>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal animation="slide-right" delay={200} className="text-white">
                            <div className={`w-16 h-16 rounded-2xl ${theme.button} flex items-center justify-center mb-8 shadow-lg shadow-black/20 border border-white/20`}>
                                <Icon size={32} className="text-white" />
                            </div>
                            <h1 className="font-['Familjen_Grotesk'] font-bold text-[40px] md:text-[56px] lg:text-[72px] leading-[1.2] mb-8 drop-shadow-lg break-words overflow-visible">
                                {content.title}
                            </h1>
                            <p className="font-['Familjen_Grotesk'] text-[20px] lg:text-[26px] text-white/90 font-light tracking-wide max-w-2xl leading-relaxed whitespace-normal h-auto overflow-visible">
                                {content.subtitle}
                            </p>
                        </ScrollReveal>

                        {/* Decorative Graphic Element based on Theme */}
                        <ScrollReveal animation="fade-in" delay={400} className="hidden lg:flex justify-center opacity-60">
                            <div className={`w-[400px] h-[400px] rounded-full border-2 border-white/20 flex items-center justify-center relative`}>
                                <div className="absolute inset-0 rounded-full border border-white/10 scale-125 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border border-white/5 scale-150" />
                                <Icon size={200} className="text-white/20" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* 2. OVERLAP CONTENT CARD SECTION */}
            <div className={`relative z-30 -mt-12 lg:-mt-32 px-4 pb-20`}>
                <div className="max-w-[1320px] mx-auto">
                    <ScrollReveal animation="fade-up" delay={300} className="overflow-visible">
                        <div className="bg-white rounded-[32px] shadow-2xl flex flex-col lg:flex-row border border-gray-100 min-h-fit overflow-visible">

                            {/* Left: Image Side (Desktop) */}
                            <div className="lg:w-2/5 h-[300px] lg:h-auto relative overflow-hidden rounded-t-[32px] lg:rounded-l-[32px] lg:rounded-tr-none">
                                <img
                                    src={content.image}
                                    className="w-full h-full object-cover"
                                    alt="Vision Details"
                                />
                                <div className={`absolute inset-0 ${theme.primary} opacity-20 mix-blend-multiply`} />
                            </div>

                            {/* Right: Text Content */}
                            <div className="lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`h-[2px] w-12 ${theme.primary}`} />
                                    <span className={`font-bold uppercase tracking-wider text-sm ${theme.accent}`}>
                                        {content.missionTitle}
                                    </span>
                                </div>
                                <h3 className="font-['Familjen_Grotesk'] text-3xl font-bold text-gray-900 mb-6 drop-shadow-none">
                                    {content.subtitle}
                                </h3>
                                <p className="font-['Familjen_Grotesk'] text-lg text-gray-600 leading-[1.8] h-auto overflow-visible">
                                    {content.description}
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* 3. KEY INITIATIVES (STRATEGY) - STYLED GRID */}
            <div className={`w-full ${theme.secondary} py-20 px-4`}>
                <div className="max-w-[1320px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                            {content.strategyTitle}
                        </h2>
                        <div className={`w-20 h-1 ${theme.primary} mx-auto rounded-full`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
                        {content.points.map((point: string, idx: number) => {
                            const [title, ...rest] = point.split(':');
                            const description = rest.join(':');
                            return (
                                <ScrollReveal
                                    key={idx}
                                    animation="fade-up"
                                    delay={idx * 100}
                                    className={`group p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                                >
                                    <div className={`absolute top-0 left-0 w-2 h-full ${theme.primary} transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300`} />
                                    <div className="flex items-start gap-5">
                                        <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 text-${theme.accent}`}>
                                            <CheckCircle2 size={24} className={`${theme.accent}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-['Familjen_Grotesk'] font-bold text-lg text-gray-800 mb-2">
                                                {currentLang === 'hi' ? `रणनीति ${idx + 1}` : `Strategy ${idx + 1}`}
                                            </h4>
                                            <p className="font-['Familjen_Grotesk'] text-gray-600 leading-relaxed">
                                                {description ? (
                                                    <>
                                                        <span className="font-bold text-gray-900">{title}:</span> {description}
                                                    </>
                                                ) : (
                                                    point
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. EXPECTED OUTCOMES - STYLED GRID */}
            <div className={`w-full bg-white py-20 px-4`}>
                <div className="max-w-[1320px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                            {content.outcomeTitle}
                        </h2>
                        <div className={`w-20 h-1 ${theme.primary} mx-auto rounded-full`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {content.outcomes.map((outcome: string, idx: number) => {
                            const [title, ...rest] = outcome.split(':');
                            const description = rest.join(':');
                            return (
                                <ScrollReveal
                                    key={idx}
                                    animation="fade-up"
                                    delay={idx * 100}
                                    className={`group p-8 ${theme.secondary} rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden text-center`}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`w-14 h-14 rounded-full ${theme.button} flex items-center justify-center shrink-0 text-white shadow-lg`}>
                                            <Trophy size={28} />
                                        </div>
                                        <p className="font-['Familjen_Grotesk'] text-lg text-gray-600 leading-relaxed">
                                            {description ? (
                                                <>
                                                    <span className="block mb-2 font-bold text-xl text-gray-900">{title}</span>
                                                    {description}
                                                </>
                                            ) : (
                                                <span className="font-semibold text-gray-800">{outcome}</span>
                                            )}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 5. MORE VISIONS SECTION */}
            <div className="w-full bg-gray-50 py-20 px-4">
                <div className="max-w-[1320px] mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                            {currentLang === 'hi' ? 'अन्य विज़न' : "Our Vision's"}
                        </h2>
                        <div className={`w-20 h-1 ${theme.primary} mx-auto rounded-full`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visionCards.map((card: any, idx: number) => (
                            <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                                <Link href={card.link} className="block group h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className={`absolute inset-0 ${theme.primary} opacity-0 group-hover:opacity-20 transition-opacity z-10`} />
                                        <img src={card.image} alt={language === 'hi' ? card.hi.title : card.en.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-['Familjen_Grotesk'] font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                                            {language === 'hi' ? card.hi.title : card.en.title}
                                        </h3>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. CTA SECTION */}
            <div className="w-full py-20 px-4 bg-white">
                <div className="max-w-[1000px] mx-auto text-center">
                    <ScrollReveal animation="scale-up" className={`bg-gradient-to-br ${theme.gradient} rounded-[40px] p-10 lg:p-16 shadow-2xl text-white relative overflow-hidden`}>
                        {/* Background Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

                        <div className="relative z-10">
                            <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-5xl mb-6">
                                {currentLang === 'hi' ? 'परिवर्तन का हिस्सा बनें' : 'Join the Movement'}
                            </h2>
                            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                                {currentLang === 'hi'
                                    ? 'हम साथ मिलकर एक बेहतर, निष्पक्ष और अधिक समृद्ध भविष्य का निर्माण कर सकते हैं।'
                                    : 'Together we can build a better, fairer, and more prosperous future. Your voice matters.'}
                            </p>
                            <Link
                                href="/join"
                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                            >
                                {currentLang === 'hi' ? 'आज ही जुड़ें' : 'Join Us Today'}
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <Footer />
        </div>
    );
}
