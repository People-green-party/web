"use client";

import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../components/LanguageContext";
import ScrollReveal from '../../components/ScrollReveal';
import { Newspaper, Calendar, ArrowRight, X, Clock, MapPin, Share2 } from "lucide-react";

interface NewsItem {
    id: number;
    title: string;
    date: string;
    source: string;
    image: string;
    desc: string;
    content: string[];
}

const newsData = {
    en: {
        title: "News & Publications",
        subtitle: "Stay updated with our latest milestones, press coverages, and official statements.",
        readMore: "Read Full Article",
        close: "Close",
        items: [
            {
                id: 1,
                title: "Green Party Announces New Educational Reforms for Rural Areas",
                date: "March 15, 2026",
                source: "Daily Times",
                image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80",
                desc: "The Peoples Green Party has laid out a comprehensive plan to reform the state's education system, focusing on rural empowerment.",
                content: [
                    "In a landmark press conference today, the Peoples Green Party leadership detailed an ambitious roadmap aimed at transforming the educational landscape across the state's rural districts.",
                    "The plan includes the immediate allocation of funds to upgrade infrastructure in over 500 village schools, the introduction of digital literacy programs, and the deployment of modern teaching aids.",
                    "Furthermore, the party highlighted a new scholarship scheme designed to support talented students from underprivileged backgrounds, ensuring they have the necessary resources to pursue higher education.",
                    "'Education is the cornerstone of a prosperous society,' stated the party president. 'By investing in our youth today, we are securing a brighter, greener future for everyone.'"
                ]
            },
            {
                id: 2,
                title: "Massive Rally Held in Jaipur Advocating Clean Energy Transition",
                date: "March 10, 2026",
                source: "The Morning Post",
                image: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=1200&q=80",
                desc: "Thousands gathered today at the heart of Jaipur to support the green energy initiative led by the party leadership.",
                content: [
                    "Jaipur witnessed an unprecedented gathering today as over 50,000 supporters and citizens joined the Peoples Green Party's 'Clean Energy Now' rally.",
                    "The peaceful demonstration stretched across the main avenues, echoing slogans for sustainable development and an immediate halt to fossil fuel dependency.",
                    "Party leaders addressed the massive crowd, outlining their actionable plan to transition the state to 100% renewable energy by 2035. The proposal includes significant investments in solar and wind power infrastructure, creating thousands of green jobs in the process.",
                    "Citizens from all walks of life participated, emphasizing that the fight against climate change requires immediate, unified political action."
                ]
            },
            {
                id: 3,
                title: "Groundbreaking Employment Scheme Unveiled Targeting Youth",
                date: "March 05, 2026",
                source: "National Express",
                image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
                desc: "A bold new initiative to create 1 million jobs over the next five years was announced, prioritizing youth and women entrepreneurs.",
                content: [
                    "Tackling the pressing issue of unemployment, the Peoples Green Party has launched its 'Youth Enterprise & Employment' scheme.",
                    "The comprehensive package aims to generate one million sustainable jobs over the next five years. A major component of the scheme involves providing zero-interest loans and incubation support for youth and women-led startups.",
                    "The party envisions establishing localized 'Small Economic Zones' to decentralize industrial growth and bring opportunities directly to the grassroots level.",
                    "By empowering the middle and lower-income classes through entrepreneurship, the initiative seeks to bridge the economic divide and foster a culture of self-reliance."
                ]
            },
            {
                id: 4,
                title: "Major Push for Healthcare Infrastructure in Rajasthan",
                date: "February 28, 2026",
                source: "State Tribune",
                image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=1200&q=80",
                desc: "The party's action committee has proposed a massive budget allocation dedicated to building state-of-the-art medical facilities.",
                content: [
                    "Addressing the critical gaps in the state's healthcare system, the Peoples Green Party has proposed a revolutionary healthcare reform bill.",
                    "The bill mandates the construction of multi-specialty hospitals in every district and ensures that essential medical services are accessible to the most remote villages via mobile clinics.",
                    "Additionally, the party plans to introduce a comprehensive health insurance plan that covers major surgeries and treatments for all citizens below the poverty line.",
                    "Party representatives stressed that health is a fundamental right, not a privilege, and their proposed budget reflects a solid commitment to this principle."
                ]
            }
        ]
    },
    hi: {
        title: "समाचार और प्रकाशन",
        subtitle: "हमारे नवीनतम मील के पत्थर, प्रेस कवरेज और आधिकारिक बयानों से अपडेट रहें।",
        readMore: "पूरा लेख पढ़ें",
        close: "बंद करें",
        items: [
            {
                id: 1,
                title: "ग्रीन पार्टी ने ग्रामीण क्षेत्रों के लिए नए शैक्षिक सुधारों की घोषणा की",
                date: "15 मार्च, 2026",
                source: "दैनिक टाइम्स",
                image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80",
                desc: "पीपल्स ग्रीन पार्टी ने राज्य की शिक्षा प्रणाली में सुधार के लिए एक व्यापक योजना तैयार की है, जिसमें ग्रामीण सशक्तिकरण पर ध्यान केंद्रित किया गया है।",
                content: [
                    "आज एक ऐतिहासिक प्रेस कॉन्फ्रेंस में, पीपल्स ग्रीन पार्टी के नेतृत्व ने राज्य के ग्रामीण जिलों में शैक्षिक परिदृश्य को बदलने के उद्देश्य से एक महत्वाकांक्षी रोडमैप का विवरण दिया।",
                    "योजना में 500 से अधिक ग्रामीण स्कूलों में बुनियादी ढांचे के उन्नयन के लिए तत्काल धन का आवंटन, डिजिटल साक्षरता कार्यक्रमों की शुरुआत और आधुनिक शिक्षण सामग्री की तैनाती शामिल है।",
                    "इसके अलावा, पार्टी ने वंचित पृष्ठभूमि के प्रतिभाशाली छात्रों का समर्थन करने के लिए डिज़ाइन की गई एक नई छात्रवृत्ति योजना पर प्रकाश डाला, ताकि यह सुनिश्चित हो सके कि उनके पास उच्च शिक्षा प्राप्त करने के लिए आवश्यक संसाधन हैं।",
                    "पार्टी अध्यक्ष ने कहा, 'शिक्षा एक समृद्ध समाज की आधारशिला है। आज हमारे युवाओं में निवेश करके, हम सभी के लिए एक उज्जवल, हरित भविष्य सुरक्षित कर रहे हैं।'"
                ]
            },
            {
                id: 2,
                title: "स्वच्छ ऊर्जा परिवर्तन की वकालत करते हुए जयपुर में विशाल रैली",
                date: "10 मार्च, 2026",
                source: "द मॉर्निंग पोस्ट",
                image: "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=1200&q=80",
                desc: "पार्टी नेतृत्व द्वारा संचालित हरित ऊर्जा पहल का समर्थन करने के लिए आज जयपुर के मध्य में हजारों लोग एकत्र हुए।",
                content: [
                    "जयपुर में आज एक अभूतपूर्व सभा देखी गई, जहां 50,000 से अधिक समर्थकों और नागरिकों ने पीपल्स ग्रीन पार्टी की 'क्लीन एनर्जी नाउ' रैली में भाग लिया।",
                    "शांतिपूर्ण प्रदर्शन मुख्य मार्गों तक फैला हुआ था, जो सतत विकास और जीवाश्म ईंधन पर निर्भरता पर तत्काल रोक लगाने के लिए नारे लगा रहा था।",
                    "पार्टी के नेताओं ने विशाल भीड़ को संबोधित करते हुए, 2035 तक राज्य को 100% नवीकरणीय ऊर्जा में बदलने की अपनी कार्ययोजना की रूपरेखा तैयार की। प्रस्ताव में सौर और पवन ऊर्जा बुनियादी ढांचे में महत्वपूर्ण निवेश शामिल है, जिससे इस प्रक्रिया में हजारों हरित रोजगार पैदा होंगे।",
                    "जीवन के सभी क्षेत्रों के नागरिकों ने भाग लिया, इस बात पर जोर देते हुए कि जलवायु परिवर्तन के खिलाफ लड़ाई में तत्काल, एकजुट राजनीतिक कार्रवाई की आवश्यकता है।"
                ]
            },
            {
                id: 3,
                title: "युवाओं को लक्षित अभूतपूर्व रोजगार योजना का अनावरण",
                date: "05 मार्च, 2026",
                source: "नेशनल एक्सप्रेस",
                image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
                desc: "युवाओं और महिला उद्यमियों को प्राथमिकता देते हुए अगले पांच वर्षों में 10 लाख रोजगार पैदा करने की एक साहसिक नई पहल की घोषणा की गई।",
                content: [
                    "बेरोजगारी के ज्वलंत मुद्दे से निपटने के लिए, पीपल्स ग्रीन पार्टी ने अपनी 'युवा उद्यम और रोजगार' योजना शुरू की है।",
                    "व्यापक पैकेज का लक्ष्य अगले पांच वर्षों में दस लाख स्थायी रोजगार पैदा करना है। योजना के एक प्रमुख घटक में युवाओं और महिलाओं के नेतृत्व वाले स्टार्टअप के लिए शून्य-ब्याज ऋण और ऊष्मायन सहायता प्रदान करना शामिल है।",
                    "पार्टी औद्योगिक विकास के विकेंद्रीकरण और अवसरों को सीधे जमीनी स्तर पर लाने के लिए स्थानीयकृत 'लघु आर्थिक क्षेत्र' स्थापित करने की परिकल्पना करती है।",
                    "उद्यमिता के माध्यम से मध्यम और निम्न-आय वर्गों को सशक्त बनाकर, यह पहल आर्थिक विभाजन को पाटने और आत्मनिर्भरता की संस्कृति को बढ़ावा देने का प्रयास करती है।"
                ]
            },
            {
                id: 4,
                title: "राजस्थान में स्वास्थ्य सेवा के बुनियादी ढांचे के लिए बड़ा कदम",
                date: "28 फरवरी, 2026",
                source: "स्टेट ट्रिब्यून",
                image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=1200&q=80",
                desc: "पार्टी की कार्य समिति ने अत्याधुनिक चिकित्सा सुविधाओं के निर्माण के लिए समर्पित बड़े बजट आवंटन का प्रस्ताव रखा है।",
                content: [
                    "राज्य की स्वास्थ्य प्रणाली में महत्वपूर्ण कमियों को संबोधित करते हुए, पीपल्स ग्रीन पार्टी ने एक क्रांतिकारी स्वास्थ्य देखभाल सुधार विधेयक का प्रस्ताव दिया है।",
                    "विधेयक हर जिले में मल्टी-स्पेशियलिटी अस्पतालों के निर्माण को अनिवार्य करता है और यह सुनिश्चित करता है कि आवश्यक चिकित्सा सेवाएं मोबाइल क्लीनिकों के माध्यम से सबसे दूरदराज के गांवों तक पहुंच सकें।",
                    "इसके अतिरिक्त, पार्टी एक व्यापक स्वास्थ्य बीमा योजना शुरू करने की योजना बना रही है जो गरीबी रेखा से नीचे के सभी नागरिकों के लिए प्रमुख सर्जरी और उपचार को कवर करती है।",
                    "पार्टी प्रतिनिधियों ने जोर दिया कि स्वास्थ्य एक मौलिक अधिकार है, विशेषाधिकार नहीं, और उनका प्रस्तावित बजट इस सिद्धांत के प्रति एक ठोस प्रतिबद्धता को दर्शाता है।"
                ]
            }
        ]
    }
};

export default function NewsPage() {
    const { language } = useLanguage();
    const currentLang = language === 'hi' ? 'hi' : 'en';
    const content = newsData[currentLang];

    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (selectedNews) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [selectedNews]);

    return (
        <div className="bg-[#F4F7F5] min-h-screen font-sans relative">
            <Navbar />

            {/* Spacer */}
            <div className="h-[70px] lg:h-[90px]"></div>

            {/* Hero Banner */}
            <div className="bg-[#04330B] text-white pt-24 pb-20 px-4 relative overflow-hidden flex items-center min-h-[50vh] lg:min-h-[60vh]">
                <div className="absolute inset-0">
                    <img src="/News&publication.png" alt="News Background" className="w-full h-full object-cover object-top opacity-40" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#04330B] via-[#04330B]/90 to-transparent z-0"></div>

                <div className="max-w-[1320px] mx-auto w-full relative z-10 flex flex-col items-start text-left">
                    <ScrollReveal animation="fade-right">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-1 bg-[#A2E6B4]"></div>
                            <span className="text-[#A2E6B4] font-bold tracking-widest uppercase text-sm">
                                {language === 'hi' ? 'आधिकारिक समाचार' : 'OFFICIAL NEWS'}
                            </span>
                        </div>
                        <h1 className="font-['Familjen_Grotesk'] font-bold text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl leading-tight drop-shadow-lg">
                            {content.title}
                        </h1>
                        <p className="font-['Familjen_Grotesk'] text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl font-light tracking-wide border-l-2 border-[#A2E6B4] pl-6 py-2">
                            {content.subtitle}
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            {/* News Grid Section */}
            <section className="py-24 px-4 relative z-10 -mt-10">
                <div className="max-w-[1320px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        {content.items.map((item, index) => (
                            <ScrollReveal key={item.id} animation="fade-up" delay={index * 100}>
                                <div
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col cursor-pointer border border-gray-100 h-full transform hover:-translate-y-2"
                                    onClick={() => setSelectedNews(item as NewsItem)}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-72 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
                                            <span className="bg-[#A2E6B4] text-[#04330B] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                {item.source}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-8 flex flex-col flex-grow justify-between">
                                        <div>
                                            <div className="flex items-center text-gray-400 gap-2 mb-4 text-sm font-medium">
                                                <Calendar size={16} />
                                                <span>{item.date}</span>
                                            </div>
                                            <h3 className="font-['Familjen_Grotesk'] font-bold text-2xl lg:text-3xl text-gray-900 mb-4 leading-tight group-hover:text-[#0D5229] transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-3 text-lg mb-8 font-light">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0D5229] font-bold text-lg group-hover:gap-4 transition-all duration-300 w-fit pb-1 border-b-2 border-transparent group-hover:border-[#0D5229]">
                                            {content.readMore}
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal Overlay */}
            {selectedNews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setSelectedNews(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">

                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                            onClick={() => setSelectedNews(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="overflow-y-auto w-full custom-scrollbar">
                            {/* Modal Header Image */}
                            <div className="relative h-[40vh] min-h-[300px] w-full shrink-0">
                                <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12">
                                    <div className="flex gap-3 mb-4">
                                        <span className="bg-[#A2E6B4] text-[#04330B] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                            {selectedNews.source}
                                        </span>
                                        <span className="bg-white/20 text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {selectedNews.date}
                                        </span>
                                    </div>
                                    <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                                        {selectedNews.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 lg:p-12 bg-white">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        <span className="font-medium">Rajasthan, India</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <button className="flex items-center gap-2 hover:text-[#0D5229] transition-colors ml-auto font-medium">
                                        <Share2 size={18} />
                                        Share
                                    </button>
                                </div>

                                <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 space-y-6">
                                    <p className="text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed border-l-4 border-[#0D5229] pl-6 mb-8">
                                        {selectedNews.desc}
                                    </p>

                                    {selectedNews.content.map((paragraph, idx) => (
                                        <p key={idx} className="leading-relaxed font-light">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
