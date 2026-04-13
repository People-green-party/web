"use client";

import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Users, ChevronRight, Trophy } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';
import { visionCards } from "@/data/visionData";

// Theme for Empowerment
const theme = {
    primary: "bg-purple-900",
    secondary: "bg-purple-50",
    accent: "text-purple-700",
    gradient: "from-purple-900 to-indigo-900",
    button: "bg-purple-700 hover:bg-purple-800",
    iconBg: "bg-purple-100",
};

// Data for Empowerment
const pageData = {
    en: {
        title: "Empowerment of Every Section of Society",
        subtitle: "Equality, Dignity, and Social Justice",
        missionTitle: "Our Perspective",
        description: "Equality is not just a slogan, but a matter of policy and structure. Society cannot progress until the weakest individual is empowered. We demand a systemic change where justice is accessible to all, irrespective of caste, gender, or economic status.",
        image: "/party-images/DSC_0037.JPG",
        icon: Users,
        strategyTitle: "Our Strategy",
        points: [
            "Complete elimination of discrimination based on caste, religion, sect, or region, ensuring empowerment at social, economic, and political levels.",
            "Women's empowerment is our top priority. We need to work constructively to bring women structurally to the center of all local politics, democracy, and governance.",
            "Instead of focusing on reservations solely for government jobs, Dalits, backward classes, poor, women, and marginalized groups must be empowered economically to become a strong foundational backbone of the economy.",
            "Local level self-employment opportunities and comprehensive local growth models should be established.",
            "Complete transformation of policies and resources towards health and basic amenities to make them world-class for every section of society."
        ],
        outcomeTitle: "Expected Outcomes",
        outcomes: [
            "Equality is not just a promise, it's a system. Women, Dalits, and vulnerable groups at the center of power.",
            "Empowering every citizen to lead a dignified life with equal access to opportunities and governance.",
            "Fostering a society based on justice, inclusivity, and communal harmony."
        ]
    },
    hi: {
        title: "समाज के हर वर्ग का सशक्तिकरण",
        subtitle: "समानता, न्याय और सम्मान का अधिकार",
        missionTitle: "हमारा संकल्प",
        description: "बराबरी सिर्फ वादा नहीं, व्यवस्था होगी। पीपल्स ग्रीन पार्टी मानती है कि जब तक समाज का अंतिम व्यक्ति सशक्त नहीं होता, तब तक लोकतंत्र अधूरा है। हमारा लक्ष्य एक ऐसा भारत बनाना है जहाँ जाति, धर्म और लिंग के आधार पर कोई भेदभाव न हो।",
        image: "/party-images/DSC_0037.JPG",
        icon: Users,
        strategyTitle: "हमारी रणनीति",
        points: [
            "भारतीय समाज को जातिविहीन बनाने के स्वप्न पर काम करना होगा।",
            "शासन किसी भी साम्प्रदायिक धर्म का अनुगामी नहीं हो और राज व्यवस्था को पूर्णतः गैर-सांप्रदायिक और समान नागरिक सिद्धांतों पर आधारित बनाया जाएगा।",
            "महिलाओं को शासन, प्रशासन, राजनीति और सार्वजनिक जीवन में लगभग 50 प्रतिशत भागीदारी सुनिश्चित करने के लिए आवश्यक नीतियाँ लागू की जाएँगी।",
            "दलित, आदिवासी और सामाजिक रूप से वंचित वर्गों को आबादी के अनुपात में उचित प्रतिनिधित्व और अवसर सुनिश्चित किए जाएँगे। छोटे वर्गों को आरक्षण का लाभ देने का प्रावधान किया जाएगा।",
            "समाज के अंतिम 10 प्रतिशत आर्थिक रूप से कमजोर परिवारों को न्यूनतम बुनियादी आय के रूप में प्रति माह ₹5000 के सहायता कूपन दिए जाएँगे, जिनका उपयोग ग्रीन स्वराज से जुड़े नव उद्यमियों के उत्पाद खरीदने में ही किया जा सकेगा।",
            "प्रत्येक परिवार को सम्मानजनक और किफायती और नीचे के दस प्रतिशत को निशुल्क आवास तथा आवश्यक बुनियादी सुविधाएँ उपलब्ध हो।",
            "बुजुर्ग, दिव्यांग और बीमार व्यक्तियों के लिए स्पेशल केयर फंड और सपोर्ट सिस्टम की स्थापना होनी चाहिए।",
            "शासन और समाज में व्याप्त वीआईपी संस्कृति को पूरी तरह से समाप्त करेंगे और प्रत्येक नागरिक के साथ गरिमापूर्ण और समान व्यवहार सुनिश्चित किया जाएगा। किसी को भी वीआईपी ट्रीट नहीं किया जा सकेगा।"
        ],
        outcomeTitle: "अपेक्षित परिणाम",
        outcomes: [
            "गरिमापूर्ण जीवन: सभी नागरिकों के लिए गरिमापूर्ण जीवन सुनिश्चित करना जहां वे भेदभाव और शोषण से मुक्त हों। सामाजिक न्याय केवल एक अवधारणा नहीं बल्कि हर भारतीय की हकीकत होगी।",
            "गरीबी उन्मूलन: लक्षित आर्थिक हस्तक्षेपों के माध्यम से समाज से गरीबी का पूर्ण उन्मूलन। सबसे गरीब लोगों के जीवन स्तर को ऊपर उठाकर, हम सभी के लिए एक मजबूत और लचीली अर्थव्यवस्था का निर्माण करेंगे।",
            "समावेशी नेतृत्व: समाज के सभी वर्गों से ऐसे नेताओं का उदय जो विविध दृष्टिकोणों और जमीनी समझ के साथ राष्ट्र का मार्गदर्शन करेंगे।"
        ]
    }
};

export default function EmpowermentPage() {
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
