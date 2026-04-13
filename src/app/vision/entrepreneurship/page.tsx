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
        title: "Green Swaraj (Entrepreneurship Mission)",
        subtitle: "Foundation of Middle Class Empowerment & Economic Freedom",
        missionTitle: "Why is it Important?",
        description: "India's biggest challenge is not unemployment, but lack of opportunities. The People's Green Party believes that sustainable employment is not created by the government, but by citizens themselves — provided they get the right skills, capital, and freedom.",
        image: "/party-images/DSC_0030.JPG",
        icon: Briefcase,
        strategyTitle: "Our Strategy",
        points: [
            "Economic Justice: Individual economic justice is the most important right for the empowerment of an individual or family; we will strive hard to ensure economic justice for all.",
            "Entrepreneurship as a Weapon: To achieve 'Economic Justice for All', entrepreneurship must be the greatest tool. We must work on a cycle to continuously turn 100 youth into entrepreneurs in every Gram Panchayat and urban ward.",
            "Training & Funding: Youth aspiring to start new ventures/startups should be provided with proper training, guidance, and seed funding up to five lakh rupees. Further, an easy and accessible loan system needs to be developed for the expansion of these startups and small enterprises.",
            "Small Economic Zones: Small Economic Zones must be established near youth residences to provide free infrastructure, shared production facilities, and buying-selling centers.",
            "Global Manufacturing: Efforts will be made to establish global manufacturing companies in these economic zones to maximize employment opportunities.",
            "Personal economic justice is the most important right for the empowerment of an individual or family. We will vigorously fight to ensure economic justice is achieved by all.",
            "To achieve 'Economic Justice for All', entrepreneurship must be made the biggest weapon. We need to establish a continuous cycle of developing 100 young entrepreneurs in every village panchayat and urban ward of the country.",
            "We will provide youth with enterprise training, easy access to credit and capital, tax exemptions, and market opportunities to foster entrepreneurship.",
            "We will transform our youth from job seekers into job creators, enabling them to utilize their capabilities and talents for the development of society and the country."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Millions of New Entrepreneurs: Over the next five years, we aim to create crores of new 'First-Generation Entrepreneurs' at the grassroots level, transforming job seekers into job creators.",
            "Rapid Expansion of Middle Class: As low-income individuals increase their earnings and start small businesses, the middle class will expand rapidly, reducing economic inequality and improving living standards.",
            "Economic Superpower: Increased grassroots production and services will lead to double GDP growth. A wider tax base generated from new earners will provide the government with more revenue for public welfare schemes like health and education."
        ]
    },
    hi: {
        title: "ग्रीन स्वराज (आन्त्रेप्रेन्योर मिशन)",
        subtitle: "मध्यम वर्ग सशक्तिकरण और आर्थिक स्वतंत्रता का आधार",
        missionTitle: "क्यों ज़रूरी है?",
        description: "पीपल्स ग्रीन पार्टी का पहला और सबसे महत्वपूर्ण सूत्र आन्त्रेप्रेन्योर क्रांति है। इसका उद्देश्य मध्यम आर्थिक वर्ग को सशक्त बनाकर उसकी आर्थिक कठिनाइयों को समाप्त करना है। भारत की सबसे बड़ी चुनौती बेरोज़गारी नहीं, बल्कि अवसरों की कमी है। पीपल्स ग्रीन पार्टी मानती है कि स्थायी रोज़गार सरकार नहीं, बल्कि नागरिक स्वयं पैदा करते हैं — यदि उन्हें सही स्किल, पूंजी और आज़ादी मिले।",
        image: "/party-images/DSC_0030.JPG",
        icon: Briefcase,
        strategyTitle: "हमारी रणनीति",
        points: [
            "एक व्यक्ति या परिवार के सशक्तिकरण के लिए व्यक्तिगत आर्थिक न्याय सबसे महत्वपूर्ण अधिकार है सभी को आर्थिक न्याय हासिल हो इसके लिए बड़ा संघर्ष करेंगे।",
            "‘सभी को आर्थिक न्याय’ के लिए उद्यमिता को सबसे बड़ा हथियार बनाना है हमें देश की हर ग्राम पंचायत और हर शहरी वार्ड में निरंतर एक 100 युवाओं को उद्यमी बनाने के एक चक्र पर कार्य करना होगा।",
            "नए उद्यम/स्टार्टअप शुरू करने के इच्छुक युवाओं को उचित प्रशिक्षण, मार्गदर्शन और पाँच लाख रुपये तक की सीड फंडिंग प्रदान की जानी चाहिए। आगे इन स्टार्टअप और छोटे उद्यमों के विस्तार के लिए आसान और सुलभ ऋण व्यवस्था विकसित करने की आवश्यकता है।",
            "युवाओं को उनके निवास के करीबी क्षेत्रों में स्मॉल इकोनॉमिक जोन स्थापित कर निशुल्क इंफ्रास्ट्रक्चर, साझा उत्पादन सुविधाएँ और क्रय विक्रय केंद्र उपलब्ध कराने होंगे।",
            "अधिकाधिक रोजगार के लिए इन इकोनॉमिक जोन में विश्व भर की मैनुफैक्चरिंग कंपनियों को स्थापित करने का प्रयास किया जाएगा।",
            "स्मॉल इकोनॉमिक जोन में विकसित नए उद्यमों को मार्केटिंग और सेल्स में सहायता के लिए विश्व की पहली अश्योर्ड सेल्स गारंटी योजना लांच करेंगे।",
            "सर्विस सेक्टर में कार्यरत असंगठित श्रमिकों, गिग वर्करों, हाट कारोबारियों और फ़ेरी वालो के लिये विशेष पैकेज और सपोर्ट सिस्टम खड़ा किया जाएगा।",
            "गृहणियों के श्रम और समर्पण को सही दिशा और पारितोष प्रदान किया जाएगा।",
            "उद्यमिता विकास के लिए अनुभवी उद्यमियों और नॉन गवर्नमेंट सेक्टर के विशेषज्ञों का नेटवर्क विकसित करेंगे और इसके माध्यम से इनक्यूबेशन और मेंटरिंग पिरामिड तैयार करेंगे।"
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
