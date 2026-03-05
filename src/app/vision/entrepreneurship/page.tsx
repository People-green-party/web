"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Briefcase, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Entrepreneurship
const theme = {
    primary: "bg-blue-900",
    secondary: "bg-blue-50",
    accent: "text-blue-600",
    gradient: "from-blue-900 to-slate-900",
    button: "bg-blue-700 hover:bg-blue-800",
    iconBg: "bg-blue-100",
};

// Data for Entrepreneurship
const pageData = {
    en: {
        title: "Entrepreneurship Revolution",
        subtitle: "Foundation of Middle Class Empowerment & Economic Freedom",
        missionTitle: "Why is it Important?",
        description: "India's biggest challenge is not unemployment, but lack of opportunities. The People's Green Party believes that sustainable employment is not created by the government, but by citizens themselves — provided they get the right skills, capital, and freedom.",
        image: "/party-images/DSC_0030.JPG",
        icon: Briefcase,
        strategyTitle: "Our Strategy",
        points: [
            "Identifying Youth Talent: Identifying at least 100 ambitious youths in every Gram Panchayat and Urban Ward through door-to-door surveys who aspire to start their own ventures based on their aptitude and interest.",
            "One Person = One Skill Model: Providing specialized training to each selected individual in sectors like Technical (e.g., solar repair), Service (e.g., tourism), Agri-based (e.g., food processing), or Digital (e.g., digital marketing).",
            "Comprehensive Business Training: Beyond vocational skills, we will instill a 'Business Mindset' and 'Financial Literacy'. They will learn bookkeeping, digital payments, customer management, and profit/loss analysis to turn skills into successful enterprises.",
            "Complete Ecosystem Support: Facilitating easy access to low-interest loans for starting Micro and Small Startups. This includes ongoing mentorship from industry experts and ensuring market access for their products and services."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Millions of New Entrepreneurs: Over the next five years, we aim to create crores of new 'First-Generation Entrepreneurs' at the grassroots level, transforming job seekers into job creators.",
            "Rapid Expansion of Middle Class: As low-income individuals increase their earnings and start small businesses, the middle class will expand rapidly, reducing economic inequality and improving living standards.",
            "Economic Superpower: Increased grassroots production and services will lead to double GDP growth. A wider tax base generated from new earners will provide the government with more revenue for public welfare schemes like health and education."
        ]
    },
    hi: {
        title: "आन्त्रेप्रेन्योर क्रांति (Entrepreneurship Revolution)",
        subtitle: "मध्यम वर्ग सशक्तिकरण और आर्थिक स्वतंत्रता का आधार",
        missionTitle: "क्यों ज़रूरी है?",
        description: "पीपल्स ग्रीन पार्टी का पहला और सबसे महत्वपूर्ण सूत्र आन्त्रेप्रेन्योर क्रांति है। इसका उद्देश्य मध्यम आर्थिक वर्ग को सशक्त बनाकर उसकी आर्थिक कठिनाइयों को समाप्त करना है। भारत की सबसे बड़ी चुनौती बेरोज़गारी नहीं, बल्कि अवसरों की कमी है। पीपल्स ग्रीन पार्टी मानती है कि स्थायी रोज़गार सरकार नहीं, बल्कि नागरिक स्वयं पैदा करते हैं — यदि उन्हें सही स्किल, पूंजी और आज़ादी मिले।",
        image: "/party-images/DSC_0030.JPG",
        icon: Briefcase,
        strategyTitle: "हमारी रणनीति",
        points: [
            "युवा प्रतिभा की पहचान: हर ग्राम पंचायत और शहरी वार्ड में घर-घर जाकर सर्वेक्षण के माध्यम से न्यूनतम 100 ऐसे महत्वाकांक्षी युवाओं की पहचान करना जो अपना व्यवसाय शुरू करना चाहते हैं। हम उनकी रुचि और क्षमता के आधार पर उन्हें शॉर्टलिस्ट करेंगे।",
            "एक व्यक्ति = एक स्किल मॉडल: प्रत्येक चयनित युवा को एक विशिष्ट क्षेत्र में महारत हासिल करने के लिए ट्रेन किया जाएगा। यह 'टेक्निकल', 'सर्विस', 'एग्री-बेस्ड', या 'डिजिटल' क्षेत्र हो सकता है।",
            "समग्र प्रशिक्षण: केवल हुनर ही नहीं, हम उन्हें 'बिज़नेस माइंडसेट' और 'फाइनेंशियल लिटरेसी' भी सिखाएंगे। उन्हें खाता बही मेंटेन करना, डिजिटल भुगतान और ग्राहक प्रबंधन सिखाया जाएगा ताकि वे अपने काम को एक सफल व्यवसाय में बदल सकें।",
            "सम्पूर्ण इकोसिस्टम सहयोग: प्रशिक्षण के बाद, हम उन्हें माइक्रो और स्मॉल स्टार्टअप शुरू करने के लिए कम ब्याज पर आसान लोन उपलब्ध कराएंगे। साथ ही, अनुभवी मेंटर्स का मार्गदर्शन और 'मार्केट एक्सेस' सुनिश्चित करेंगे।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "करोड़ों नए उद्यमी: अगले पाँच वर्षों में हम जमीनी स्तर पर करोड़ों नए 'प्रथम-स्तरीय आन्त्रेप्रेन्योर' तैयार करेंगे। ये वे लोग होंगे जो पहले नौकरी ढूंढ रहे थे, लेकिन अब दूसरों को भी रोजगार देने में सक्षम होंगे।",
            "सशक्त मध्यम वर्ग: जब निम्न-आय वर्ग के लोग अपनी आय बढ़ाएंगे और छोटा व्यवसाय शुरू करेंगे, तो मध्यम वर्ग का तेज़ विस्तार होगा। इससे समाज में आर्थिक असमानता कम होगी और लोगों का जीवन स्तर सुधरेगा।",
            "आर्थिक महाशक्ति: जमीनी स्तर पर उत्पादन और सेवाओं के बढ़ने से देश की GDP में दोगुनी वृद्धि होगी। अधिक लोग कमाने लगेंगे, जिससे एक व्यापक टैक्स बेस बनेगा और सरकार के पास जनकल्याणकारी योजनाओं पर खर्च करने के लिए अधिक राजस्व होगा।"
        ]
    }
};

export default function EntrepreneurshipPage() {
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
