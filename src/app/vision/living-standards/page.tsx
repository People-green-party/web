"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Heart, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Living Standards
const theme = {
    primary: "bg-pink-800",
    secondary: "bg-pink-50",
    accent: "text-pink-700",
    gradient: "from-pink-800 to-rose-900",
    button: "bg-pink-700 hover:bg-pink-800",
    iconBg: "bg-pink-100",
};

// Data for Living Standards
const pageData = {
    en: {
        title: "World-Class Living Standards",
        subtitle: "Guarantee of Education, Health & Dignified Life",
        missionTitle: "Human-Centric Governance",
        description: "The real wealth of a nation is its human resources. We are committed to investing in people to build a strong nation. Every citizen deserves a quality of life that allows them to thrive, not just survive.",
        image: "/party-images/DSC_0085.JPG",
        icon: Heart,
        strategyTitle: "Our Strategy",
        points: [
            "Guarantee of high-quality school education for all and necessary support and opportunities for higher education. Schools should provide quality education beyond the 25% RTE scope.",
            "There is a need for decentralization of the state education system, ensuring the participation of local bodies, subject experts, and social organizations in its management.",
            "A comprehensive system with accessible, free, and cashless health services must be developed for all citizens.",
            "While decentralizing government health services, the participation of local institutions, experts, and social organizations in their management will be ensured.",
            "Food security and adequate nutrition will be ensured for every citizen.",
            "The traffic system will be completely modernized and organized.",
            "Sanitation will be developed to international standards, and strict measures will be taken for pollution control.",
            "City infrastructure will be genuinely developed to create Smart Cities.",
            "The entire infrastructure must be restructured with a focus on making tourism a significant commercial sector."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "State-of-the-art living for every citizen. Closing the gap between the rich and poor through shared public excellence.",
            "A healthy, educated, and digitally connected population ready for the challenges of the 21st century.",
            "Clean, green, and vibrant communities that promote physical and mental well-being."
        ]
    },
    hi: {
        title: "विश्व स्तरीय जीवन स्तर",
        subtitle: "समान सुविधाएं, श्रेष्ठ जीवन",
        missionTitle: "हमारा संकल्प",
        description: "जीवन स्तर केवल अमीरों के लिए नहीं, सबके लिए होना चाहिए। पीपल्स ग्रीन पार्टी हर नागरिक को वे सुविधाएं देने के लिए प्रतिबद्ध है जो एक विकसित राष्ट्र के नागरिक को मिलनी चाहिए। हम बुनियादी ढांचे को विश्व स्तरीय बनाएंगे।",
        image: "/party-images/DSC_0085.JPG",
        icon: Heart,
        strategyTitle: "हमारी रणनीति",
        points: [
            "सभी के लिए गुणवत्तापूर्ण स्कूली शिक्षा की गारंटी तथा उच्च शिक्षा के लिए आवश्यक सहायता और अवसर। स्कूल आरटीई के 25% दायरे से अधिक विद्यार्थी लेकर गुणवत्ता पूर्ण शिक्षा प्रदान करें।",
            "राजकीय शिक्षा प्रणाली के विकेन्द्रीकरण की आवश्यकता है और प्रबन्ध के लिए स्थानीय निकायों, विषय विशेषज्ञों और सामाजिक संस्थाओं की भागीदारी सुनिश्चित होनी चाहिए।",
            "सभी नागरिकों को सुलभ, निःशुल्क और कैशलेस स्वास्थ्य सेवाओं के लिए व्यापक व्यवस्था विकसित की जानी चाहिए।",
            "सरकारी स्वास्थ्य सेवाओं का विकेन्द्रीकरण करते हुए उनके प्रबंध में स्थानीय संस्थाओं, विशेषज्ञों और सामाजिक संगठनों की भागीदारी सुनिश्चित की जाएगी।",
            "प्रत्येक नागरिक को खाद्य सुरक्षा और पर्याप्त पोषण सुनिश्चित किया जाएगा।",
            "ट्रैफिक व्यवस्था का पूर्ण आधुनिकरण और व्यवस्थीकरण किया जाना है।",
            "स्वच्छता को अंतरराष्ट्रीय स्तर पर विकसित किया जाएगा, प्रदूषण नियंत्रण के लिए सख्त कदम उठाए जाएँगे।",
            "शहरों के इंफ्रास्ट्रक्चर को सही मायने स्मार्ट सिटी के रूप में विकसित करेंगे।",
            "पर्यटन को महत्वपूर्ण व्यावसायिक क्षेत्र बनाने की दृष्टि से पूरे इंफ्रास्ट्रक्चर को रीस्ट्रक्चर किया जाना चाहिए।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "HDI सुधार: मानव विकास सूचकांक (HDI) में तेज़ सुधार। हमारी नीतियों का उद्देश्य स्वास्थ्य, शिक्षा और जीवन स्तर के संकेतकों के मामले में भारत को शीर्ष राष्ट्रों की श्रेणी में लाना है।",
            "स्वस्थ समाज: एक स्वस्थ, शिक्षित और समृद्ध समाज। जीवन की मूलभूत आवश्यकताओं को सुरक्षित करके, हम नागरिकों को रचनात्मकता, नवाचार और राष्ट्र निर्माण पर ध्यान केंद्रित करने में सक्षम बनाते हैं।",
            "सामाजिक सुरक्षा: एक व्यापक सामाजिक सुरक्षा जाल जो नागरिकों को अप्रत्याशित जीवन घटनाओं, बेरोजगारी और बुढ़ापे से बचाता है, जिससे मन की शांति सुनिश्चित होती है।"
        ]
    }
};

export default function LivingStandardsPage() {
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
