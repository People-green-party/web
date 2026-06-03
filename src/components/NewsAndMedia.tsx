"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLanguage } from "./LanguageContext";
import ScrollReveal from "./ScrollReveal";
import { Newspaper, Calendar, ArrowRight, X, Clock, MapPin, Share2, Mic, Play, Info } from "lucide-react";
import { ShareDialog } from "./ShareDialog";

interface NewsItem {
    id: number;
    title: string;
    date: string;
    source: string;
    image: string;
    desc: string;
    content: string[];
}

interface PressItem {
    id: number;
    title: string;
    date: string;
    duration: string;
    image: string;
    type: string;
    desc: string;
}

import rawNewsItems from "../data/news_items.json";

const newsItemsEn = rawNewsItems.map(item => ({
    id: item.id,
    title: item.title_en,
    date: item.date,
    source: item.source,
    image: item.image,
    desc: item.desc_en,
    content: item.content_en
}));

const newsItemsHi = rawNewsItems.map(item => ({
    id: item.id,
    title: item.title_hi,
    date: item.date,
    source: item.source,
    image: item.image,
    desc: item.desc_hi,
    content: item.content_hi
}));

const newsData = {
    en: {
        title: "News & Publications",
        subtitle: "Stay updated with our latest milestones, press coverages, and official statements.",
        readMore: "Read Full Article",
        close: "Close",
        items: newsItemsEn
    },
    hi: {
        title: "समाचार और प्रकाशन",
        subtitle: "हमारे नवीनतम मील के पत्थर, प्रेस कवरेज और आधिकारिक बयानों से अपडेट रहें।",
        readMore: "पूरा लेख पढ़ें",
        close: "बंद करें",
        items: newsItemsHi
    }
};

const pressData = {
    en: {
        title: "Press & Media",
        subtitle: "Watch the latest statements, briefings, and media interactions from the party leadership.",
        watchNow: "Watch Video",
        close: "Close",
        items: [
            {
                id: 1,
                title: "Live Address: The Jaipur Vision 2040 Blueprint Unveiled",
                date: "March 20, 2026",
                duration: "45:00",
                image: "/herosection/hero-1.jpg",
                type: "Press Conference",
                desc: "In this comprehensive press conference, the leadership outlines the long-term vision for Jaipur 2040. The discussion covers urban development, green mobility, and heritage conservation. The interactive session also addresses key questions from leading journalists."
            },
            {
                id: 2,
                title: "Exclusive Interview with National News Network",
                date: "March 12, 2026",
                duration: "28:15",
                image: "/herosection/hero-2.jpg",
                type: "TV Interview",
                desc: "A one-on-one exclusive interview detailing the core ideology of the Peoples Green Party. The leader discusses economic strategies, rural empowerment, and answers tough questions on political challenges ahead."
            },
            {
                id: 3,
                title: "Panel Discussion on Green Energy Policies",
                date: "February 25, 2026",
                duration: "1:15:00",
                image: "/herosection/hero-3.jpg",
                type: "Panel Discussion",
                desc: "Environmental experts and party representatives engage in a robust debate regarding the feasibility of transitioning to 100% renewable energy in the state within the next decade."
            },
            {
                id: 4,
                title: "Media Briefing: Electoral Promises & Youth Employment",
                date: "February 10, 2026",
                duration: "30:00",
                image: "/herosection/hero-4.jpg",
                type: "Media Briefing",
                desc: "An official media briefing focusing strictly on the party's roadmap for generating 1 million new jobs for the youth and fostering an ecosystem of entrepreneurship."
            },
            {
                id: 5,
                title: "Discussion on Civil Liberties and Rights",
                date: "January 28, 2026",
                duration: "40:20",
                image: "/herosection/hero-5.jpg",
                type: "Press Interview",
                desc: "A deep dive into the party's stance on fundamental rights, judicial independence, and safeguarding democratic values against modern challenges."
            },
            {
                id: 6,
                title: "Townhall Meeting with Farmers",
                date: "January 15, 2026",
                duration: "1:45:00",
                image: "/herosection/10.jpg",
                type: "Townhall",
                desc: "A direct interaction with agricultural communities discussing the new farming bills, water conservation strategies, and market accessibility for farmers."
            }
        ]
    },
    hi: {
        title: "प्रेस और मीडिया",
        subtitle: "पार्टी नेतृत्व के नवीनतम बयान, ब्रीफिंग और मीडिया बातचीत देखें।",
        watchNow: "वीडियो देखें",
        close: "बंद करें",
        items: [
            {
                id: 1,
                title: "लाइव संबोधन: जयपुर विजन 2040 ब्लूप्रिंट का अनावरण",
                date: "20 मार्च, 2026",
                duration: "45:00",
                image: "/herosection/hero-1.jpg",
                type: "प्रेस कॉन्फ्रेंस",
                desc: "इस व्यापक प्रेस कॉन्फ्रेंस में, नेतृत्व ने जयपुर 2040 के लिए दीर्घकालिक दृष्टिकोण की रूपरेखा तैयार की है। चर्चा में शहरी विकास, हरित गतिशीलता और विरासत संरक्षण शामिल हैं।"
            },
            {
                id: 2,
                title: "नेशनल न्यूज़ नेटवर्क के साथ विशेष साक्षात्कार",
                date: "12 मार्च, 2026",
                duration: "28:15",
                image: "/herosection/hero-2.jpg",
                type: "टीवी साक्षात्कार",
                desc: "पीपल्स ग्रीन पार्टी की मूल विचारधारा का विवरण देने वाला एक-पर-एक विशेष साक्षात्कार। नेता आर्थिक रणनीतियों, ग्रामीण सशक्तिकरण पर चर्चा करते हैं और राजनीतिक चुनौतियों पर कड़े सवालों के जवाब देते हैं।"
            },
            {
                id: 3,
                title: "हरित ऊर्जा नीतियों पर पैनल चर्चा",
                date: "25 फरवरी, 2026",
                duration: "1:15:00",
                image: "/herosection/hero-3.jpg",
                type: "पैनल चर्चा",
                desc: "पर्यावरण विशेषज्ञ और पार्टी प्रतिनिधि अगले एक दशक के भीतर राज्य में 100% नवीकरणीय ऊर्जा में परिवर्तित होने की व्यवहार्यता के संबंध में एक मजबूत बहस में शामिल होते हैं।"
            },
            {
                id: 4,
                title: "मीडिया ब्रीफिंग: चुनावी वादे और युवा रोजगार",
                date: "10 फरवरी, 2026",
                duration: "30:00",
                image: "/herosection/hero-4.jpg",
                type: "मीडिया ब्रीफिंग",
                desc: "युवाओं के लिए 10 लाख नए रोजगार पैदा करने और उद्यमिता के पारिस्थितिकी तंत्र को बढ़ावा देने के लिए पार्टी के रोडमैप पर कड़ाई से ध्यान केंद्रित करने वाली एक आधिकारिक मीडिया ब्रीफिंग।"
            },
            {
                id: 5,
                title: "नागरिक स्वतंत्रता और अधिकारों पर चर्चा",
                date: "28 जनवरी, 2026",
                duration: "40:20",
                image: "/herosection/hero-5.jpg",
                type: "प्रेस साक्षात्कार",
                desc: "मौलिक अधिकारों, न्यायिक स्वतंत्रता और आधुनिक चुनौतियों के खिलाफ लोकतांत्रिक मूल्यों की रक्षा पर पार्टी के रुख पर गहराई से विचार।"
            },
            {
                id: 6,
                title: "किसानों के साथ टाउनहॉल मीटिंग",
                date: "15 जनवरी, 2026",
                duration: "1:45:00",
                image: "/herosection/10.jpg",
                type: "टाउनहॉल",
                desc: "नए कृषि बिलों, जल संरक्षण रणनीतियों और किसानों के लिए बाजार पहुंच पर चर्चा करने वाले कृषि समुदायों के साथ सीधा संवाद।"
            }
        ]
    }
};

interface NewsAndMediaProps {
    defaultTab?: "news" | "press";
}

export default function NewsAndMedia({ defaultTab = "news" }: NewsAndMediaProps) {
    const { language } = useLanguage();
    const currentLang = language === "hi" ? "hi" : "en";

    const [activeTab, setActiveTab] = useState<"news" | "press">(defaultTab);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<PressItem | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shareType, setShareType] = useState<"news" | "video">("news");

    // Dynamic Hero contents based on tab and language
    const heroContent = {
        news: {
            tag: language === "hi" ? "आधिकारिक समाचार" : "OFFICIAL NEWS",
            title: newsData[currentLang].title,
            subtitle: newsData[currentLang].subtitle
        },
        press: {
            tag: language === "hi" ? "प्रेस और मीडिया केंद्र" : "PRESS & MEDIA CENTER",
            title: pressData[currentLang].title,
            subtitle: pressData[currentLang].subtitle
        }
    };

    // Initialize from URL parameters (active tab + deep linking)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get("tab");
            if (tabParam === "press" || tabParam === "news") {
                setActiveTab(tabParam);
            } else {
                setActiveTab(defaultTab);
            }

            const idParam = params.get("id");
            if (idParam) {
                const id = parseInt(idParam, 10);
                const activeTabResolved = tabParam || defaultTab;
                if (activeTabResolved === "press") {
                    const foundItem = pressData.en.items.find(item => item.id === id) ||
                                      pressData.hi.items.find(item => item.id === id);
                    if (foundItem) {
                        setSelectedVideo(foundItem as PressItem);
                    }
                } else {
                    const foundItem = newsData.en.items.find(item => item.id === id) ||
                                      newsData.hi.items.find(item => item.id === id);
                    if (foundItem) {
                        setSelectedNews(foundItem as NewsItem);
                    }
                }
            }
        }
    }, [defaultTab]);

    // Update URL when selected news changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            params.set("tab", activeTab);
            if (selectedNews) {
                params.set("id", selectedNews.id.toString());
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState(null, "", newUrl);
            } else if (!selectedVideo) {
                params.delete("id");
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState(null, "", newUrl);
            }
        }
    }, [selectedNews, activeTab, selectedVideo]);

    // Update URL when selected video changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            params.set("tab", activeTab);
            if (selectedVideo) {
                params.set("id", selectedVideo.id.toString());
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState(null, "", newUrl);
            } else if (!selectedNews) {
                params.delete("id");
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                window.history.pushState(null, "", newUrl);
            }
        }
    }, [selectedVideo, activeTab, selectedNews]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedNews || selectedVideo) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedNews, selectedVideo]);

    // Tab Change handler
    const handleTabChange = (tab: "news" | "press") => {
        setActiveTab(tab);
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            params.set("tab", tab);
            params.delete("id"); // clear selected item on tab change
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState(null, "", newUrl);
        }
        setSelectedNews(null);
        setSelectedVideo(null);
    };

    const handleShareClick = (type: "news" | "video") => {
        setShareType(type);
        setIsShareOpen(true);
    };

    return (
        <div className="bg-[#F4F7F5] min-h-screen font-sans relative">
            <Navbar />

            {/* Spacer */}
            <div className="h-[70px] lg:h-[90px]"></div>

            {/* Premium Dynamic Hero Banner */}
            <div className="bg-[#04330B] text-white pt-24 pb-20 px-4 relative overflow-hidden flex items-center min-h-[50vh] lg:min-h-[60vh]">
                {/* Background transitions */}
                <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: activeTab === "news" ? 0.4 : 0 }}>
                    <img src="/News&publication.png" alt="News Background" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: activeTab === "press" ? 0.4 : 0 }}>
                    <img src="/Press & Confrence.jpg" alt="Press Background" className="w-full h-full object-cover object-center" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#04330B] via-[#04330B]/90 to-transparent z-0"></div>

                <div className="max-w-[1320px] mx-auto w-full relative z-10 flex flex-col items-start text-left">
                    <ScrollReveal animation="slide-right" key={activeTab}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-1 bg-[#A2E6B4]"></div>
                            <span className="text-[#A2E6B4] font-bold tracking-widest uppercase text-sm">
                                {heroContent[activeTab].tag}
                            </span>
                        </div>
                        <h1 className="font-['Familjen_Grotesk'] font-bold text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl leading-tight drop-shadow-lg">
                            {heroContent[activeTab].title}
                        </h1>
                        <p className="font-['Familjen_Grotesk'] text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl font-light tracking-wide border-l-2 border-[#A2E6B4] pl-6 py-2">
                            {heroContent[activeTab].subtitle}
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            {/* Unified Page Content Area */}
            <section className="py-24 px-4 relative z-10 -mt-10">
                <div className="max-w-[1320px] mx-auto">
                    
                    {/* Glassmorphic sliding tab control */}
                    <div className="flex justify-center mb-16">
                        <div className="bg-white/70 backdrop-blur-md p-1.5 rounded-full inline-flex relative border border-gray-200/50 shadow-md">
                            {/* Sliding active pill indicator */}
                            <div 
                                className="absolute top-1.5 bottom-1.5 rounded-full bg-[#0D5229] transition-all duration-300 ease-out shadow-sm"
                                style={{
                                    width: "calc(50% - 6px)",
                                    left: activeTab === "news" ? "6px" : "calc(50%)",
                                }}
                            />
                            <button
                                onClick={() => handleTabChange("news")}
                                className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-['Familjen_Grotesk'] font-bold relative z-10 transition-colors duration-300 ${
                                    activeTab === "news" ? "text-white" : "text-[#587E67] hover:text-[#04330B]"
                                }`}
                            >
                                <Newspaper size={18} />
                                {language === "hi" ? "समाचार और प्रकाशन" : "News & Publications"}
                            </button>
                            <button
                                onClick={() => handleTabChange("press")}
                                className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-['Familjen_Grotesk'] font-bold relative z-10 transition-colors duration-300 ${
                                    activeTab === "press" ? "text-white" : "text-[#587E67] hover:text-[#04330B]"
                                }`}
                            >
                                <Mic size={18} />
                                {language === "hi" ? "प्रेस और मीडिया" : "Press & Media"}
                            </button>
                        </div>
                    </div>

                    {/* Conditional rendering of active tab content */}
                    {activeTab === "news" ? (
                        /* News Tab Content */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                            {newsData[currentLang].items.map((item, index) => (
                                <ScrollReveal key={item.id} animation="fade-up" delay={index * 100}>
                                    <div
                                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col cursor-pointer border border-gray-100 h-full transform hover:-translate-y-2"
                                        onClick={() => setSelectedNews(item as NewsItem)}
                                    >
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
                                                {newsData[currentLang].readMore}
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        /* Press Tab Content */
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                            {pressData[currentLang].items.map((item, index) => (
                                <ScrollReveal key={item.id} animation="fade-up" delay={index * 100}>
                                    <div
                                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 group cursor-pointer h-full flex flex-col transform hover:-translate-y-2"
                                        onClick={() => setSelectedVideo(item as PressItem)}
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />

                                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:bg-[#A2E6B4] transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-[#A2E6B4]/50">
                                                    <Play fill="currentColor" size={28} className="text-white group-hover:text-[#04330B] ml-1" />
                                                </div>
                                            </div>

                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="bg-[#A2E6B4] text-[#04330B] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    {item.type}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                                                <Clock size={14} className="text-[#A2E6B4]" />
                                                {item.duration}
                                            </div>
                                        </div>

                                        <div className="p-8 flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center text-gray-500 gap-2 mb-4 text-sm font-medium">
                                                    <Calendar size={16} />
                                                    <span>{item.date}</span>
                                                </div>
                                                <h3 className="font-['Familjen_Grotesk'] font-bold text-2xl text-gray-900 leading-tight group-hover:text-[#0D5229] transition-colors line-clamp-2 mb-4">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 line-clamp-2 text-md font-light">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* News Item Modal Overlay */}
            {selectedNews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                        onClick={() => setSelectedNews(null)}
                    ></div>

                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
                        <button
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                            onClick={() => setSelectedNews(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="overflow-y-auto w-full custom-scrollbar">
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

                            <div className="p-8 lg:p-12 bg-white">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        <span className="font-medium">Rajasthan, India</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <button 
                                        className="flex items-center gap-2 hover:text-[#0D5229] transition-colors ml-auto font-medium"
                                        onClick={() => handleShareClick("news")}
                                    >
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

            {/* Video Press Item Modal Overlay */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={() => setSelectedVideo(null)}
                    ></div>

                    <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
                        <button
                            className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="overflow-y-auto w-full custom-scrollbar">
                            <div className="relative w-full aspect-video bg-black flex items-center justify-center shrink-0 border-b border-gray-200 group cursor-pointer">
                                <img src={selectedVideo.image} alt={selectedVideo.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

                                <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-[#A2E6B4] transition-all duration-300 shadow-xl">
                                    <Play fill="currentColor" size={40} className="text-white group-hover:text-[#04330B] ml-2" />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
                                    <div className="h-full bg-[#A2E6B4] w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                                </div>
                            </div>

                            <div className="p-8 lg:p-12 bg-white">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="bg-[#A2E6B4] text-[#04330B] text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                                        {selectedVideo.type}
                                    </span>
                                    <span className="text-gray-500 font-medium flex items-center gap-2 px-2">
                                        <Calendar size={18} />
                                        {selectedVideo.date}
                                    </span>
                                    <span className="text-gray-500 font-medium flex items-center gap-2 px-2 border-l border-gray-300">
                                        <Clock size={18} />
                                        {selectedVideo.duration}
                                    </span>
                                </div>

                                <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-8">
                                    {selectedVideo.title}
                                </h2>

                                <div className="bg-[#F4F7F5] border border-gray-100 rounded-2xl p-6 lg:p-8 flex gap-6">
                                    <div className="shrink-0 hidden sm:block">
                                        <Info size={32} className="text-[#0D5229]" />
                                    </div>
                                    <div>
                                        <p className="text-lg text-gray-700 leading-relaxed font-light">
                                            {selectedVideo.desc}
                                        </p>
                                        <div className="mt-8 flex gap-4">
                                            <button className="flex items-center gap-2 text-white hover:text-white font-medium transition-colors bg-[#0D5229] hover:bg-[#04330B] px-6 py-3 rounded-xl shadow-md">
                                                <Play size={18} fill="currentColor" />
                                                Play Full Video
                                            </button>
                                            <button 
                                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors bg-white hover:bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 shadow-sm"
                                                onClick={() => handleShareClick("video")}
                                            >
                                                <Share2 size={18} />
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Consolidated Share Dialog */}
            {isShareOpen && (
                <ShareDialog
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    url={
                        typeof window !== "undefined"
                            ? shareType === "news" && selectedNews
                                ? `${window.location.origin}/news?tab=news&id=${selectedNews.id}`
                                : selectedVideo
                                ? `${window.location.origin}/news?tab=press&id=${selectedVideo.id}`
                                : ""
                            : ""
                    }
                    title={shareType === "news" ? selectedNews?.title || "" : selectedVideo?.title || ""}
                    image={shareType === "news" ? selectedNews?.image : selectedVideo?.image}
                    description={shareType === "news" ? selectedNews?.desc : selectedVideo?.desc}
                    type={shareType}
                    language={currentLang}
                />
            )}

            <Footer />
        </div>
    );
}
