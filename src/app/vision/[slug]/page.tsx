"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { ArrowLeft, CheckCircle2, Leaf, ShieldCheck, Users, Zap, BookOpen, HeartPulse, Scale, Sprout } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../components/LanguageContext";
import ScrollReveal from '../../../components/ScrollReveal';

// Data for each vision page
const visionData: any = {
    agriculture: {
        en: {
            title: "Empowered Farmers, New Agriculture",
            subtitle: "Revolutionizing farming with technology and fair policies.",
            description: "Our goal is to transform the agricultural sector by empowering farmers with modern technology, fair pricing models, and sustainable farming practices. We believe in 'New Farming Capable Farmer' - ensuring that those who feed the nation lead a life of dignity and prosperity.",
            image: "/herosection/hero1.svg",
            icon: Sprout,
            points: [
                "Minimum Support Price (MSP) Guarantee for all crops.",
                "Subsidized modern farming equipment and seeds.",
                "Implementation of organic farming zones.",
                "Farmer pension and insurance schemes."
            ]
        },
        hi: {
            title: "सशक्त किसान, नई कृषि",
            subtitle: "प्रौद्योगिकी और निष्पक्ष नीतियों के साथ खेती में क्रांति।",
            description: "हमारा लक्ष्य आधुनिक तकनीक, उचित मूल्य निर्धारण मॉडल और टिकाऊ कृषि प्रथाओं के साथ किसानों को सशक्त बनाकर कृषि क्षेत्र को बदलना है। हम 'नई खेती सक्षम किसान' में विश्वास करते हैं - यह सुनिश्चित करना कि जो देश को खिलाते हैं वे गरिमा और समृद्धि का जीवन व्यतीत करें।",
            image: "/herosection/hero1.svg",
            icon: Sprout,
            points: [
                "सभी फसलों के लिए न्यूनतम समर्थन मूल्य (MSP) की गारंटी।",
                "सब्सिडी वाले आधुनिक कृषि उपकरण और बीज।",
                "जैविक खेती क्षेत्रों का कार्यान्वयन।",
                "किसान पेंशन और बीमा योजनाएं।"
            ]
        }
    },
    conservation: {
        en: {
            title: "Sustainable Use & Conservation",
            subtitle: "Protecting our planet for future generations.",
            description: "We advocate for a balanced approach to development that prioritizes environmental health. From water conservation to protecting biodiversity, our policies are designed to ensure that natural resources are used efficiently and preserved for the future.",
            image: "/herosection/hero2.svg",
            icon: Leaf,
            points: [
                "Strict penalties for industrial pollution.",
                "Reforestation drives in urban and rural areas.",
                "Water harvesting mandates for new constructions.",
                "Protection of wildlife corridors and habitats."
            ]
        },
        hi: {
            title: "सतत उपयोग और संरक्षण",
            subtitle: "भविष्य की पीढ़ियों के लिए हमारे ग्रह की रक्षा करना।",
            description: "हम विकास के लिए एक संतुलित दृष्टिकोण की वकालत करते हैं जो पर्यावरणीय स्वास्थ्य को प्राथमिकता देता है। जल संरक्षण से लेकर जैव विविधता की रक्षा तक, हमारी नीतियां यह सुनिश्चित करने के लिए डिज़ाइन की गई हैं कि प्राकृतिक संसाधनों का कुशलतापूर्वक उपयोग किया जाए और भविष्य के लिए संरक्षित किया जाए।",
            image: "/herosection/hero2.svg",
            icon: Leaf,
            points: [
                "औद्योगिक प्रदूषण के लिए सख्त दंड।",
                "शहरी और ग्रामीण क्षेत्रों में वनीकरण अभियान।",
                "नए निर्माणों के लिए जल संचयन अनिवार्य।",
                "वन्यजीव गलियारों और आवासों का संरक्षण।"
            ]
        }
    },
    population: {
        en: {
            title: "Population Control & Balance",
            subtitle: "Ensuring resources for everyone through manageable growth.",
            description: "A sustainable future requires a balanced population. We promote awareness, education, and voluntary measures to manage population growth, ensuring that every citizen has access to adequate resources, healthcare, and opportunities.",
            image: "/ourvision/VisionImage.svg",
            icon: Users,
            points: [
                "Nationwide awareness campaigns on family planning.",
                "Incentives for small families.",
                "Better access to reproductive healthcare.",
                "Focus on women's education as a key driver."
            ]
        },
        hi: {
            title: "जनसंख्या नियंत्रण और संतुलन",
            subtitle: "प्रबंधित विकास के माध्यम से सभी के लिए संसाधन सुनिश्चित करना।",
            description: "एक स्थायी भविष्य के लिए संतुलित जनसंख्या की आवश्यकता होती है। हम जनसंख्या वृद्धि को प्रबंधित करने के लिए जागरूकता, शिक्षा और स्वैच्छिक उपायों को बढ़ावा देते हैं, यह सुनिश्चित करते हुए कि प्रत्येक नागरिक के पास पर्याप्त संसाधनों, स्वास्थ्य सेवा और अवसरों तक पहुंच हो।",
            image: "/ourvision/VisionImage.svg",
            icon: Users,
            points: [
                "परिवार नियोजन पर देशव्यापी जागरूकता अभियान।",
                "छोटे परिवारों के लिए प्रोत्साहन।",
                "प्रजनन स्वास्थ्य सेवा तक बेहतर पहुंच।",
                "मुख्य चालक के रूप में महिलाओं की शिक्षा पर ध्यान।"
            ]
        }
    },
    education: {
        en: {
            title: "Quality Education for All",
            subtitle: "Empowering minds to build a stronger nation.",
            description: "Education is the foundation of progress. We are committed to providing free, high-quality education to every child, regardless of their background. Our vision includes modernizing curriculum, upgrading school infrastructure, and valuing teachers.",
            image: "/herosection/hero4.svg",
            icon: BookOpen,
            points: [
                "Smart classrooms in every government school.",
                "Vocational training integrated into the syllabus.",
                "Scholarships for higher education.",
                "Regular teacher training and fair pay."
            ]
        },
        hi: {
            title: "सभी के लिए गुणवत्तापूर्ण शिक्षा",
            subtitle: "एक मजबूत राष्ट्र के निर्माण के लिए दिमाग को सशक्त बनाना।",
            description: "शिक्षा प्रगति की नींव है। हम हर बच्चे को, चाहे उनकी पृष्ठभूमि कुछ भी हो, मुफ्त, उच्च गुणवत्ता वाली शिक्षा प्रदान करने के लिए प्रतिबद्ध हैं। हमारे दृष्टिकोण में पाठ्यक्रम का आधुनिकीकरण, स्कूल के बुनियादी ढांचे का उन्नयन और शिक्षकों का सम्मान करना शामिल है।",
            image: "/herosection/hero4.svg",
            icon: BookOpen,
            points: [
                "हर सरकारी स्कूल में स्मार्ट कक्षाएं।",
                "पाठ्यक्रम में एकीकृत व्यावसायिक प्रशिक्षण।",
                "उच्च शिक्षा के लिए छात्रवृत्ति।",
                "नियमित शिक्षक प्रशिक्षण और उचित वेतन।"
            ]
        }
    },
    energy: {
        en: {
            title: "Green Energy Revolution",
            subtitle: "Transitioning to clean, renewable power.",
            description: "To combat climate change, we must reduce our dependence on fossil fuels. We plan to lead a revolution in green energy by exponentially increasing solar and wind power generation, making clean energy affordable and accessible to all.",
            image: "/herosection/hero5.svg",
            icon: Zap,
            points: [
                "Solar panels on every government building.",
                "Subsidies for electric vehicles (EVs).",
                "Investment in wind and hydro power projects.",
                "Grid modernization for better efficiency."
            ]
        },
        hi: {
            title: "हरित ऊर्जा क्रांति",
            subtitle: "स्वच्छ, नवीकरणीय ऊर्जा में संक्रमण।",
            description: "जलवायु परिवर्तन से निपटने के लिए, हमें जीवाश्म ईंधन पर अपनी निर्भरता कम करनी चाहिए। हम सौर और पवन ऊर्जा उत्पादन में तेजी से वृद्धि करके, स्वच्छ ऊर्जा को सभी के लिए किफायती और सुलभ बनाकर हरित ऊर्जा में क्रांति का नेतृत्व करने की योजना बना रहे हैं।",
            image: "/herosection/hero5.svg",
            icon: Zap,
            points: [
                "हर सरकारी इमारत पर सोलर पैनल।",
                "इलेक्ट्रिक वाहनों (EVs) के लिए सब्सिडी।",
                "पवन और पनबिजली परियोजनाओं में निवेश।",
                "बेहतर दक्षता के लिए ग्रिड आधुनिकीकरण।"
            ]
        }
    },
    women: {
        en: {
            title: "Women Empowerment",
            subtitle: "Equal rights, equal opportunities, safer society.",
            description: "A society cannot prosper if half its population is left behind. We are dedicated to ensuring safety, equality, and financial independence for women through strict laws, educational incentives, and support for women entrepreneurs.",
            image: "/herosection/hero3.svg",
            icon: ShieldCheck,
            points: [
                "33% reservation in government jobs.",
                "Fast-track courts for crimes against women.",
                "Interest-free loans for women-led startups.",
                "Self-defense training in schools."
            ]
        },
        hi: {
            title: "महिला सशक्तिकरण",
            subtitle: "समान अधिकार, समान अवसर, सुरक्षित समाज।",
            description: "यदि आधी आबादी पीछे छूट जाए तो समाज समृद्ध नहीं हो सकता। हम सख्त कानूनों, शैक्षिक प्रोत्साहनों और महिला उद्यमियों के लिए समर्थन के माध्यम से महिलाओं के लिए सुरक्षा, समानता और वित्तीय स्वतंत्रता सुनिश्चित करने के लिए समर्पित हैं।",
            image: "/herosection/hero3.svg",
            icon: ShieldCheck,
            points: [
                "सरकारी नौकरियों में 33% आरक्षण।",
                "महिलाओं के खिलाफ अपराधों के लिए फास्ट-ट्रैक कोर्ट।",
                "महिला नेतृत्व वाले स्टार्टअप के लिए ब्याज मुक्त ऋण।",
                "स्कूलों में आत्मरक्षा प्रशिक्षण।"
            ]
        }
    },
    youth: {
        en: {
            title: "Youth Employment",
            subtitle: "Channeling the power of youth into nation building.",
            description: "Unemployment is a major crisis. We strive to create a vibrant economy that generates ample job opportunities. Our focus is on skill development, entrepreneurship, and filling vacant government posts to ensure our youth have a bright future.",
            image: "/ourvision/VisionImage.svg",
            icon: Scale, // Representing balance/justice in opportunity
            points: [
                "Filling all vacant government posts within 1 year.",
                "Startup incubators in every district.",
                "Skill India centers with placement guarantee.",
                "Unemployment allowance for job seekers."
            ]
        },
        hi: {
            title: "युवा रोजगार",
            subtitle: "राष्ट्र निर्माण में युवाओं की शक्ति को दिशा देना।",
            description: "बेरोजगारी एक बड़ा संकट है। हम एक जीवंत अर्थव्यवस्था बनाने का प्रयास करते हैं जो पर्याप्त नौकरी के अवसर पैदा करे। हमारा ध्यान कौशल विकास, उद्यमिता और रिक्त सरकारी पदों को भरने पर है ताकि हमारे युवाओं का भविष्य उज्ज्वल हो सके।",
            image: "/ourvision/VisionImage.svg",
            icon: Scale,
            points: [
                "1 साल के भीतर सभी रिक्त सरकारी पदों को भरना।",
                "हर जिले में स्टार्टअप इनक्यूबेटर।",
                "प्लेसमेंट गारंटी के साथ स्किल इंडिया केंद्र।",
                "नौकरी चाहने वालों के लिए बेरोजगारी भत्ता।"
            ]
        }
    },
    health: {
        en: {
            title: "Healthcare for Everyone",
            subtitle: "Health is a right, not a privilege.",
            description: "We are committed to building a robust public healthcare system where quality treatment is accessible to the poorest of the poor. From upgrading primary health centers to capping medicine prices, our vision is a healthy Rajasthan.",
            image: "/herosection/hero2.svg",
            icon: HeartPulse,
            points: [
                "Free medical treatment in government hospitals.",
                "Mohalla clinics in every ward.",
                "Mobile medical units for remote villages.",
                "Strict regulation of private hospital charges."
            ]
        },
        hi: {
            title: "सभी के लिए स्वास्थ्य सेवा",
            subtitle: "स्वास्थ्य एक अधिकार है, विशेषाधिकार नहीं।",
            description: "हम एक मजबूत सार्वजनिक स्वास्थ्य प्रणाली बनाने के लिए प्रतिबद्ध हैं जहां सबसे गरीबों को भी गुणवत्तापूर्ण इलाज मिल सके। प्राथमिक स्वास्थ्य केंद्रों के उन्नयन से लेकर दवा की कीमतों को सीमित करने तक, हमारा दृष्टिकोण एक स्वस्थ राजस्थान है।",
            image: "/herosection/hero2.svg",
            icon: HeartPulse,
            points: [
                "सरकारी अस्पतालों में मुफ्त इलाज।",
                "हर वार्ड में मोहल्ला क्लीनिक।",
                "दूरदराज के गांवों के लिए मोबाइल मेडिकल यूनिट।",
                "निजी अस्पताल शुल्क का सख्त विनियमन।"
            ]
        }
    }
};

export default function VisionDetailsPage() {
    const { slug } = useParams();
    const { language } = useLanguage();

    const currentLang = language === 'hi' ? 'hi' : 'en';

    // Ensure slug is a string
    const slugStr = (Array.isArray(slug) ? slug[0] : slug) || '';

    const data = visionData[slugStr];

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-400">Vision Page Not Found</h1>
            </div>
        );
    }

    const content = data[currentLang];
    const Icon = data[currentLang].icon || Leaf;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative w-full h-[50vh] lg:h-[60vh] overflow-hidden mt-[70px] lg:mt-[90px]">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={content.image}
                    alt={content.title}
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000 scale-105"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full mb-6 border border-white/20">
                        <Icon size={48} className="text-white" />
                    </div>
                    <h1 className="font-['Familjen_Grotesk'] font-bold text-[36px] md:text-[56px] lg:text-[72px] text-white leading-[1.1] mb-4 text-shadow-lg">
                        {content.title}
                    </h1>
                    <p className="font-['Familjen_Grotesk'] text-[18px] lg:text-[24px] text-white/90 max-w-2xl font-light">
                        {content.subtitle}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-[1320px] mx-auto px-4 lg:px-8 py-[60px] lg:py-[100px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] lg:gap-[80px] items-start">

                    {/* Left: Description */}
                    <ScrollReveal animation="slide-right" duration={1000} delay={300}>
                        <Link href="/#vision" className="inline-flex items-center gap-2 text-[#587E67] hover:text-[#0D5229] transition-colors mb-6 font-semibold">
                            <ArrowLeft size={20} />
                            {currentLang === 'hi' ? 'वापस' : 'Back to Vision'}
                        </Link>
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-[32px] lg:text-[40px] text-[#04330B] mb-6">
                            {currentLang === 'hi' ? 'हमारा मिशन' : 'Our Mission'}
                        </h2>
                        <p className="font-['Familjen_Grotesk'] text-[18px] lg:text-[20px] text-[#587E67] leading-[1.6] mb-8">
                            {content.description}
                        </p>

                        <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl group">
                            <img src={content.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-[#04330B]/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                    </ScrollReveal>

                    {/* Right: Key Points */}
                    <ScrollReveal animation="slide-left" duration={1000} delay={500} className="bg-[#F3F9F6] p-[32px] lg:p-[48px] rounded-[24px] border border-[#E4F2EA]">
                        <h3 className="font-['Familjen_Grotesk'] font-bold text-[24px] lg:text-[32px] text-[#04330B] mb-8 flex items-center gap-3">
                            <CheckCircle2 className="text-[#0D5229]" />
                            {currentLang === 'hi' ? 'मुख्य पहल' : 'Key Initiatives'}
                        </h3>
                        <div className="flex flex-col gap-6">
                            {content.points.map((point: string, idx: number) => (
                                <ScrollReveal key={idx} animation="fade-up" delay={idx * 100} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#B9D3C4] transition-all hover:translate-x-2 duration-300">
                                    <div className="w-8 h-8 rounded-full bg-[#EAF7EE] flex items-center justify-center shrink-0 mt-1">
                                        <Leaf size={16} className="text-[#0D5229]" />
                                    </div>
                                    <p className="font-['Familjen_Grotesk'] text-[16px] lg:text-[18px] text-[#04330B] leading-snug font-medium">
                                        {point}
                                    </p>
                                </ScrollReveal>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-[#B9D3C4]">
                            <p className="text-[#587E67] text-sm mb-4 font-semibold uppercase tracking-wider">
                                {currentLang === 'hi' ? 'परिवर्तन का हिस्सा बनें' : 'Be Part of the Change'}
                            </p>
                            <Link href="/join" className="block w-full text-center py-4 bg-[#0D5229] text-white rounded-xl font-bold hover:bg-[#04330B] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                {currentLang === 'hi' ? 'आज ही जुड़ें' : 'Join Us Today'}
                            </Link>
                        </div>
                    </ScrollReveal>

                </div>
            </div>

            <Footer />
        </div>
    );
}
