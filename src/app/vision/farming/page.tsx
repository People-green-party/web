"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Sprout, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';

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
            "Smart Irrigation: Promoting smart irrigation and drip systems for higher yields with less water. This ensures that even in water-scarce regions, farmers can grow high-value crops and reduce their dependency on monsoons.",
            "Integrated Farming: Combining agriculture with animal husbandry, dairy, and organic farming creates a cycle where waste from one becomes input for another, reducing costs and ensuring year-round income for the farmer.",
            "Initial Support: Providing initial assistance to new farmers in developing Integrated Farms and Animal Centers. The party will offer startup capital and technical know-how to modernize their traditional farming setups.",
            "Branding & Exports: Special emphasis on branding, processing, and exporting farmer products. We will set up local processing units so farmers sell finished goods (like ketchup instead of tomatoes) and earn higher profits."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Farmer to Entrepreneur: Transforming farmers from mere providers to entrepreneurs. They will dictate the price of their produce and manage their farms like profitable businesses.",
            "Self-reliant Villages: Making every rural unit economically self-reliant. Local wealth creation will reduce the need for migration and restore the prosperity of Indian villages.",
            "Sustainable Eco-system: Creating a chemical-free, sustainable ecosystem where soil health is restored and biodiversity thrives alongside agriculture."
        ]
    },
    hi: {
        title: "नई खेती – समर्थ किसान कार्यक्रम",
        subtitle: "आधुनिक कृषि, कम पानी, अधिक आय",
        missionTitle: "समस्या की जड़",
        description: "आज का किसान मेहनती है, लेकिन तकनीक, बाज़ार और सुरक्षा से वंचित है। पानी की कमी और बढ़ती लागत ने खेती को घाटे का सौदा बना दिया है। हम इसे आधुनिक तकनीक और निष्पक्ष बाज़ार व्यवस्था के माध्यम से बदलना चाहते हैं।",
        image: "/party-images/DSC_0035.JPG",
        icon: Sprout,
        strategyTitle: "हमारी रणनीति",
        points: [
            "स्मार्ट इरिगेशन: कम पानी में अधिक उत्पादन के लिए स्मार्ट इरिगेशन और ड्रिप सिस्टम को बढ़ावा देना। इससे सूखे क्षेत्रों में भी किसान मूल्यवान फसलें उगा सकेंगे और मानसून पर उनकी निर्भरता कम होगी।",
            "इंटीग्रेटेड फार्मिंग: खेती के साथ पशुपालन, डेयरी और ऑर्गेनिक खेती को जोड़ना। इससे एक का अपशिष्ट दूसरे के लिए खाद बनता है, जिससे लागत कम होती है और किसान को साल भर आमदनी मिलती रहती है।",
            "शुरुआती सहायता: नए किसानों को इंटीग्रेटेड फार्म और एनिमल सेंटर विकसित करने में शुरुआती आर्थिक और तकनीकी सहायता प्रदान करना ताकि वे अपनी पारंपरिक खेती को आधुनिक व्यवसाय में बदल सकें।",
            "ब्रांडिंग और निर्यात: किसान उत्पादों की ब्रांडिंग, प्रोसेसिंग और निर्यात पर विशेष बल। हम स्थानीय स्तर पर प्रोसेसिंग यूनिट्स लगाएंगे ताकि किसान कच्चा माल बेचने के बजाय तैयार उत्पाद (जैसे टमाटर के बजाय सॉस) बेच सकें और अधिक मुनाफा कमाएं।"
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
            <div className={`relative w-full min-h-[85vh] lg:h-[85vh] flex items-center overflow-hidden mt-[70px] lg:mt-[90px] pb-16 lg:pb-0`}>
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
                            <h1 className="font-['Familjen_Grotesk'] font-bold text-[36px] md:text-[56px] lg:text-[64px] leading-[1.1] mb-6 drop-shadow-md">
                                {content.title}
                            </h1>
                            <p className="font-['Familjen_Grotesk'] text-[18px] lg:text-[24px] text-white/90 font-light tracking-wide max-w-xl leading-relaxed">
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
                    <ScrollReveal animation="fade-up" delay={300}>
                        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">

                            {/* Left: Image Side (Desktop) */}
                            <div className="lg:w-2/5 h-[300px] lg:h-auto relative">
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
                                <h3 className="font-['Familjen_Grotesk'] text-3xl font-bold text-gray-900 mb-6">
                                    {content.subtitle}
                                </h3>
                                <p className="font-['Familjen_Grotesk'] text-lg text-gray-600 leading-[1.8] text-justify">
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
                        {[
                            { title: currentLang === 'hi' ? "आन्त्रेप्रेन्योर क्रांति" : "Entrepreneurial Revolution", image: "/herosection/2.png", link: "/vision/entrepreneurship" },
                            { title: currentLang === 'hi' ? "नई खेती – समर्थ किसान" : "New Farming – Capable Farmer", image: "/herosection/5.jpg", link: "/vision/farming" },
                            { title: currentLang === 'hi' ? "कमजोर वर्ग का सशक्तिकरण" : "Empowerment of Vulnerable Groups", image: "/herosection/9.jpg", link: "/vision/empowerment" },
                            { title: currentLang === 'hi' ? "शहरी–ग्रामीण समग्र विकास" : "Holistic Urban-Rural Development", image: "/herosection/1.png", link: "/vision/urban-rural" },
                            { title: currentLang === 'hi' ? "नागरिक स्वतंत्रता और संस्कृति" : "Civil Liberties and Culture", image: "/herosection/6.jpg", link: "/vision/civil-liberties" },
                            { title: currentLang === 'hi' ? "खुली अर्थव्यवस्था" : "Open Economy", image: "/herosection/8.jpg", link: "/vision/open-economy" },
                            { title: currentLang === 'hi' ? "विश्व स्तरीय जीवन स्तर" : "World-Class Standard of Living", image: "/herosection/10.jpg", link: "/vision/living-standards" },
                            { title: currentLang === 'hi' ? "प्रकृति संरक्षण" : "Nature Conservation", image: "/herosection/4.jpg", link: "/vision/nature" }
                        ].map((card, idx) => (
                            <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
                                <Link href={card.link} className="block group h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className={`absolute inset-0 ${theme.primary} opacity-0 group-hover:opacity-20 transition-opacity z-10`} />
                                        <img src={card.image} alt={card.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-['Familjen_Grotesk'] font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                                            {card.title}
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
