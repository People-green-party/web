"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Leaf, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Nature
const theme = {
    primary: "bg-green-800",
    secondary: "bg-green-50",
    accent: "text-green-700",
    gradient: "from-green-800 to-emerald-900",
    button: "bg-green-700 hover:bg-green-800",
    iconBg: "bg-green-100",
};

// Data for Nature
const pageData = {
    en: {
        title: "Nature Conservation and Sustainable Development",
        subtitle: "Sustainable Development, Secure Future",
        missionTitle: "Environmental Responsibility",
        description: "We are merely trustees of this planet for future generations. Our development model must respect the delicate balance of nature. We advocate for policies that prioritize long-term sustainability over short-term gains.",
        image: "/party-images/DSC_0091.JPG",
        icon: Leaf,
        strategyTitle: "Our Strategy",
        points: [
            "Complete legal protection and restoration work for mountains, rivers, forests, and other sensitive ecological zones.",
            "A comprehensive policy for water conservation, rainwater harvesting, and water management will be implemented, and a national water grid will be developed.",
            "Special programs will be run for the conservation of biodiversity, livestock, and wildlife.",
            "A target of increasing green cover (forests) by a minimum of 1% every year will be set, and carbon credit-based business activities will be promoted.",
            "Production and storage capacity of renewable energy (solar, wind, hydrogen, etc.) will be increased.",
            "Dependence on fossil fuels and greenhouse gases will be reduced by one percent every year.",
            "Recycling, circular economy, and waste management will be prioritized.",
            "Awareness and policies will be implemented to bring the population growth rate down below the balanced level (approximately 2.1).",
            "Concrete steps need to be taken to ensure long-term environmental balance and sustainable development, keeping the interests of future generations in mind."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "A clean, green, and sustainable future for our children.",
            "Resilient ecosystems that provide clean air, water, and fertile soil for generations to come.",
            "Global leadership in sustainable development and climate action."
        ]
    },
    hi: {
        title: "प्रकृति संरक्षण और सतत विकास",
        subtitle: "हरा-भरा भारत, सुरक्षित भविष्य",
        missionTitle: "हमारा दर्शन",
        description: "प्रकृति कोई वस्तु नहीं, जीवन का आधार है। पीपल्स ग्रीन पार्टी मानती है कि विकास तभी सार्थक है जब वह प्रकृति के साथ सामंजस्य में हो। हम आने वाली पीढ़ियों के लिए एक स्वस्थ और स्वच्छ पृथ्वी छोड़ने के लिए प्रतिबद्ध हैं।",
        image: "/party-images/DSC_0091.JPG",
        icon: Leaf,
        strategyTitle: "हमारी रणनीति",
        points: [
            "पर्वतों, नदियों, वनों और अन्य संवेदनशील पारिस्थितिक क्षेत्रों को पूर्ण कानूनी संरक्षण और पुनर्स्थापन पर कार्य।",
            "जल संरक्षण, वर्षा जल संचयन और जल प्रबंधन की व्यापक नीति लागू की जाएगी तथा राष्ट्रीय जल ग्रिड विकसित किया जाएगा।",
            "जैव विविधता, पशुधन और वन्यजीवों के संरक्षण के लिए विशेष कार्यक्रम चलाए जाएँगे।",
            "हर वर्ष न्यूनतम 1% हरित क्षेत्र यानी वन बढ़ाने का लक्ष्य रखा जाएगा और कार्बन क्रेडिट आधारित व्यापारिक गतिविधियों को बढ़ावा दिया जाएगा।",
            "नवीकरणीय ऊर्जा (सोलर, विंड, हाइड्रोजन आदि) उत्पादन और स्टोरेज क्षमता में वृद्धि की जाएगी।",
            "फॉसिल फ्यूल और ग्रीन हाउस गैस पर निर्भरता को एक प्रतिशत प्रति वर्ष कम किया जाएगा।",
            "रीसाइक्लिंग, सर्कुलर इकॉनमी और वेस्ट मैनेजमेंट को प्राथमिकता दी जाएगी।",
            "जनसंख्या वृद्धि दर को संतुलित स्तर (लगभग 2.1) से नीचे लाने के लिए जागरूकता और नीतियाँ लागू की जाएँगी।",
            "आने वाली पीढ़ियों के हितों को ध्यान में रखते हुए दीर्घकालिक पर्यावरणीय संतुलन और सतत विकास सुनिश्चित हो, इसके लिए ठोस कदम उठाने की जरूरत है।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "भविष्य सुरक्षित: वर्तमान पीढ़ी के साथ-साथ आने वाली पीढ़ियों के अधिकारों को सुरक्षित करना। आज प्रकृति के जिम्मेदार संरक्षक के रूप में कार्य करके, हम यह सुनिश्चित करते हैं कि हमारे बच्चों को एक ऐसा ग्रह विरासत में मिले जो रहने योग्य और समृद्ध हो।",
            "पारिस्थितिक संतुलन: एक स्वस्थ ग्रह के लिए पारिस्थितिक संतुलन बहाल करना। हमारी पहल का उद्देश्य पारिस्थितिक तंत्र को हुए नुकसान को उलट देना, जैव विविधता को वापस लाना और सभी के लिए स्वच्छ हवा और पानी सुनिश्चित करना है।",
            "जलवायु लचीलापन: जलवायु परिवर्तन के प्रभावों के प्रति लचीला राष्ट्र बनाना, जहां शहर और गांव स्मार्ट योजना के माध्यम से चरम मौसम की घटनाओं का सामना करने में सक्षम हों।"
        ]
    }
};

export default function NaturePage() {
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
