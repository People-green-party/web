"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Sprout, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Farming
const theme = {
    primary: "bg-[#0D5229]", // PGP Green
    secondary: "bg-[#F3F9F5]",
    accent: "text-[#0D5229]",
    gradient: "from-[#0D5229] to-[#04330B]",
    button: "bg-[#0D5229] hover:bg-[#04330B]",
    iconBg: "bg-[#EAF7EE]",
};

// Data for Farming
const pageData = {
    en: {
        title: "New Farming – Capable Farmer",
        subtitle: "Modern Agriculture, Less Water, More Income",
        missionTitle: "The Root of the Problem",
        description: "Today's farmer is hardworking but deprived of technology, markets, and security. Water scarcity and rising costs have made farming a losing proposition. We aim to transform this by introducing modern techniques and fair market access.",
        image: "/party-images/DSC_0035.JPG",
        icon: Sprout,
        strategyTitle: "Our Strategy",
        points: [
            "We will work towards a goal where a maximum of 10 percent of the population is dependent on the agriculture-related economy, which will ensure farmers receive fair prices.",
            "Farming will be recognized as a business, and farmers as businessmen. A massive awareness campaign will be launched emphasizing that 'Farming is a profitable business'.",
            "Special incentives will be provided to farmers for producing organic yields without the use of dangerous pesticides and chemicals.",
            "Instead of depending solely on minimum support prices (MSP), a comprehensive free market system will be developed in agriculture, allowing farmers to independently set prices for their produce.",
            "Significant expansion and widespread availability of food processing infrastructure are required.",
            "A comprehensive policy needs to be formulated to improve farmers' access to modern technologies and better farming resources."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Farmer to Entrepreneur: Transforming farmers from mere providers to entrepreneurs. They will dictate the price of their produce and manage their farms like profitable businesses.",
            "Self-reliant Villages: Making every rural unit economically self-reliant. Local wealth creation will reduce the need for migration and restore the prosperity of Indian villages.",
            "Sustainable Eco-system: Creating a chemical-free, sustainable ecosystem where soil health is restored and biodiversity thrives alongside agriculture."
        ]
    },
    hi: {
        title: "नई खेती – समर्थ किसान",
        subtitle: "आधुनिक कृषि, कम पानी, अधिक आय",
        missionTitle: "समस्या की जड़",
        description: "आज का किसान मेहनती है, लेकिन तकनीक, बाज़ार और सुरक्षा से वंचित है। पानी की कमी और बढ़ती लागत ने खेती को घाटे का सौदा बना दिया है। हम इसे आधुनिक तकनीक और निष्पक्ष बाज़ार व्यवस्था के माध्यम से बदलना चाहते हैं।",
        image: "/party-images/DSC_0035.JPG",
        icon: Sprout,
        strategyTitle: "हमारी रणनीति",
        points: [
            "कृषि से जुड़ी अर्थव्यवस्था में अधिकतम दस प्रतिशत आबादी ही निर्भर हो, तब किसान को उसका सही मूल्य हासिल होगा, इस लक्ष्य पर कार्य करेंगे।",
            "प्रशिक्षित युवा कृषि वैज्ञानिकों की सहायता से हर ग्राम पंचायत पर फोकस करेंगे और उन्हें एक स्वावलंबी आर्थिक इकाई बनाया जाएगा।",
            "किसानों को नकद अनुदान के साथ साथ उच्च गुणवत्ता के संवर्धित बीज और आर्गेनिक उर्वरक निशुल्क उपलब्ध करानी होगी तथा उनके सही उपयोग के लिए प्रशिक्षण दिया जाएगा।",
            "आधुनिक कृषि तकनीक को विकसित किया जाएगा और कम पानी में अधिक उत्पादन के लिए विभिन्न आधुनिक सिंचाई प्रणाली को व्यापक रूप से लागू किया जाएगा।",
            "किसानों को इंटीग्रेटेड फार्मिंग मॉडल अपनाने के लिए प्रोत्साहित किया जाएगा, जिसमें खेती, पशुपालन, डेयरी और अन्य सहायक गतिविधियाँ शामिल होंगी।",
            "पशुपालन और डेयरी को कृषि के समान महत्व देते हुए आधुनिक डेयरी तकनीक को विकसित किया जाएगा।",
            "हर ग्राम पंचायत में कम से कम एक FPO (Farm Produce Organization) और एक OFPO (Off-Farm Produce Organization) की स्थापना की जाएगी।",
            "छोटे और सीमांत किसानों के लिए सहकारी उत्पादन और साझा संसाधन मॉडल विकसित किया जाएगा।",
            "ऑर्गेनिक और प्राकृतिक खेती को प्रोत्साहित कर स्वास्थ्यवर्धक और टिकाऊ कृषि प्रणाली को बढ़ावा दिया जाएगा।",
            "कृषि और ग्रामीण उत्पादों के लिए स्थानीय स्तर पर मार्केट प्लेस विकसित किए जाएंगे तथा उत्पादों की ब्रांडिंग और निर्यात को प्रोत्साहित किया जाएगा।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "उद्यमी किसान: किसान को अन्नदाता से उद्यमी बनाना। वे अपनी उपज की कीमत खुद तय करेंगे और अपने खेतों को किसी व्यापार की तरह मुनाफे के लिए चलाएंगे।",
            "स्वावलंबी गाँव: हर ग्रामीण इकाई को आर्थिक रूप से स्वावलंबी बनाना। स्थानीय स्तर पर धन सृजन होने से पलायन रुकेगा और भारतीय गाँवों की खुशहाली वापस लौटेगी।",
            "सतत पारिस्थितिकी तंत्र: एक रसायन मुक्त, सतत पारिस्थितिकी तंत्र का निर्माण जहां मिट्टी की सेहत बहाल हो और कृषि के साथ-साथ जैव विविधता भी पनपे।"
        ]
    }
};

export default function FarmingPage() {
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
