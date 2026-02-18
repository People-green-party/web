"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Leaf, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';

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
        title: "Nature Conservation",
        subtitle: "Sustainable Development, Secure Future",
        missionTitle: "Environmental Responsibility",
        description: "We are merely trustees of this planet for future generations. Our development model must respect the delicate balance of nature. We advocate for policies that prioritize long-term sustainability over short-term gains.",
        image: "/party-images/DSC_0035.JPG",
        icon: Leaf,
        strategyTitle: "Our Strategy",
        points: [
            "Sustainable Use: Long-term and prudent use of natural resources. We advocate for a circular economy where waste is minimized, and resources are recycled, ensuring that economic growth does not come at the cost of environmental degradation.",
            "Resource Conservation: Conservation of mining, water, forests, and land resources. Stringent laws will be enacted to protect our rivers from pollution, stop illegal mining, and expand our forest cover to combat climate change.",
            "Population Control: Aware policy on population control to maintain environmental balance. We will launch educational campaigns and incentive-based programs to encourage smaller families, reducing the strain on our finite natural resources.",
            "Green Energy Transition: Aggressively shifting towards renewable energy sources like solar, wind, and green hydrogen to reduce carbon footprint and achieve energy independence."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Secure Future: Securing the rights of future generations along with the present generation. By acting as responsible stewards of nature today, we ensure that our children inherit a planet that is habitable and bountiful.",
            "Ecological Balance: Restoring the ecological balance for a healthier planet. Our initiatives aims to reverse the damage done to ecosystems, bringing back biodiversity and ensuring clean air and water for all.",
            "Climate Resilience: Building a nation resilient to climate change impacts, with cities and villages capable of withstanding extreme weather events through smart planning."
        ]
    },
    hi: {
        title: "प्रकृति संरक्षण",
        subtitle: "सतत विकास, सुरक्षित भविष्य",
        missionTitle: "पर्यावरण की जिम्मेदारी",
        description: "हम आने वाली पीढ़ियों के लिए इस ग्रह के केवल ट्रस्टी हैं। हमारे विकास मॉडल को प्रकृति के नाजुक संतुलन का सम्मान करना चाहिए। हम उन नीतियों की वकालत करते हैं जो अल्पकालिक लाभों पर दीर्घकालिक स्थिरता को प्राथमिकता देती हैं।",
        image: "/herosection/hero2.svg",
        icon: Leaf,
        strategyTitle: "हमारी रणनीति",
        points: [
            "विवेकपूर्ण उपयोग: प्राकृतिक संसाधनों का दीर्घकालिक और विवेकपूर्ण उपयोग। हम एक सर्कुलर इकोनॉमी की वकालत करते हैं जहां अपशिष्ट को कम किया जाता है और संसाधनों को पुनर्चक्रित किया जाता है, यह सुनिश्चित करते हुए कि आर्थिक विकास पर्यावरण क्षरण की कीमत पर न आए।",
            "संसाधन संरक्षण: खनन, जल, वन और भूमि संसाधनों का संरक्षण। हमारी नदियों को प्रदूषण से बचाने, अवैध खनन को रोकने और जलवायु परिवर्तन से निपटने के लिए वन आवरण का विस्तार करने के लिए कड़े कानून बनाए जाएंगे।",
            "जनसंख्या नियंत्रण: पर्यावरणीय संतुलन बनाए रखने के लिए जनसंख्या नियंत्रण पर जागरूक नीति। हम छोटे परिवारों को प्रोत्साहित करने के लिए शैक्षिक अभियान और प्रोत्साहन-आधारित कार्यक्रम शुरू करेंगे, जिससे हमारे सीमित प्राकृतिक संसाधनों पर दबाव कम होगा।",
            "हरित ऊर्जा संक्रमण: कार्बन फुटप्रिंट को कम करने और ऊर्जा स्वतंत्रता प्राप्त करने के लिए सौर, पवन और हरित हाइड्रोजन जैसे नवीकरणीय ऊर्जा स्रोतों की ओर आक्रामक रूप से बढ़ना।"
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
