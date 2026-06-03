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
    youtubeId?: string;
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
        subtitle: "हमारे नवीनतम मील के पत्थर, प्रेस कवरेज और आधिकारिक बयान।",
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
                title: "Kindly Vote and Support Peoples Green Party (#pgp #green)",
                date: "April 18, 2026",
                duration: "0:45",
                image: "https://img.youtube.com/vi/KqP0OFKey1w/hqdefault.jpg",
                type: "Shorts",
                youtubeId: "KqP0OFKey1w",
                desc: "Official campaign appeal for the Peoples Green Party in Rajasthan. Support and vote for the Handi (pot) symbol to bring honest, transparent, and green governance to the state."
            },
            {
                id: 2,
                title: "Peoples Green Party Raises Serious Allegations of Mismanagement",
                date: "March 15, 2026",
                duration: "3:12",
                image: "https://img.youtube.com/vi/CHOhnvTJgTw/hqdefault.jpg",
                type: "Press Conference",
                youtubeId: "CHOhnvTJgTw",
                desc: "During a press briefing, representatives of the Peoples Green Party raised concerns over current administration policies and highlighted allegations of corruption."
            },
            {
                id: 3,
                title: "Dr. Sudhanshu’s Monologue: Addressing PGP Volunteers & Workers",
                date: "March 01, 2026",
                duration: "10:34",
                image: "https://img.youtube.com/vi/uXHM70zcksk/hqdefault.jpg",
                type: "Address",
                youtubeId: "uXHM70zcksk",
                desc: "National President Dr. Sudhanshu Sharma delivers a comprehensive address to PGP workers, discussing grassroots strategy and organizational expansion plans."
            },
            {
                id: 4,
                title: "Social and Economic Status of Nomadic Tribes in Modern India",
                date: "February 22, 2026",
                duration: "12:15",
                image: "https://img.youtube.com/vi/B_gimhjRWxY/hqdefault.jpg",
                type: "Documentary",
                youtubeId: "B_gimhjRWxY",
                desc: "An in-depth analysis of the issues faced by nomadic communities in India and the Peoples Green Party's proposed welfare policies for their integration and upliftment."
            },
            {
                id: 5,
                title: "PGP Preamble: Why You Should Join the Green Movement",
                date: "February 12, 2026",
                duration: "2:50",
                image: "https://img.youtube.com/vi/850TTnmrmD4/hqdefault.jpg",
                type: "Introduction",
                youtubeId: "850TTnmrmD4",
                desc: "A brief introductory video outlining the core values, ethics, and democratic goals of the Peoples Green Party. Discover why citizens are joining PGP."
            },
            {
                id: 6,
                title: "PGP's Vision for a Great and Prosperous Rajasthan",
                date: "January 28, 2026",
                duration: "5:40",
                image: "https://img.youtube.com/vi/9Bieb6xW2QM/hqdefault.jpg",
                type: "Campaign Video",
                youtubeId: "9Bieb6xW2QM",
                desc: "An educational campaign briefing outlining PGP's first-phase development targets in Rajasthan to establish quality schools, clean water, and local jobs."
            },
            {
                id: 7,
                title: "Ground Report: Investigative Summary of the Tonk Sarpanch Case",
                date: "January 14, 2026",
                duration: "8:20",
                image: "https://img.youtube.com/vi/Oof5Z2wayfc/hqdefault.jpg",
                type: "Special Report",
                youtubeId: "Oof5Z2wayfc",
                desc: "A public query and report highlighting the suspicion around the Tonk Sarpanch Mahendra Meena death case, demanding transparency and accountability."
            },
            {
                id: 8,
                title: "Jaipur Lockdown Report: Ramganj Ground Realities Check",
                date: "December 20, 2025",
                duration: "6:15",
                image: "https://img.youtube.com/vi/kWulUyLGW1c/hqdefault.jpg",
                type: "Ground Report",
                youtubeId: "kWulUyLGW1c",
                desc: "A grassroots report capturing interviews and local testimonies of residents from the Ramganj area in Jaipur detailing their experience during lockdown restrictions."
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
                title: "कृपया पीपल्स ग्रीन पार्टी को वोट दें और समर्थन करें (चुनाव चिह्न: हांडी)",
                date: "April 18, 2026",
                duration: "0:45",
                image: "https://img.youtube.com/vi/KqP0OFKey1w/hqdefault.jpg",
                type: "लघु वीडियो",
                youtubeId: "KqP0OFKey1w",
                desc: "राजस्थान में पीपल्स ग्रीन पार्टी के लिए आधिकारिक चुनाव प्रचार संदेश। स्वच्छ, पारदर्शी और जन-हितैषी शासन के लिए हांडी (घड़ा) चुनाव चिह्न का समर्थन करें।"
            },
            {
                id: 2,
                title: "पीपल्स ग्रीन पार्टी ने शासन व्यवस्था और अधिकारियों पर लगाए गंभीर आरोप",
                date: "March 15, 2026",
                duration: "3:12",
                image: "https://img.youtube.com/vi/CHOhnvTJgTw/hqdefault.jpg",
                type: "प्रेस वार्ता",
                youtubeId: "CHOhnvTJgTw",
                desc: "प्रेस कॉन्फ्रेंस के दौरान पीपल्स ग्रीन पार्टी के प्रवक्ताओं ने वर्तमान नीतियों पर सवाल उठाए और प्रशासनिक भ्रष्टाचार के आरोपों पर अपनी बात रखी।"
            },
            {
                id: 3,
                title: "डॉ. सुधांशु का विशेष उद्बोधन: पीपल्स ग्रीन पार्टी कार्यकर्ताओं के नाम संदेश",
                date: "March 01, 2026",
                duration: "10:34",
                image: "https://img.youtube.com/vi/uXHM70zcksk/hqdefault.jpg",
                type: "संबोधन",
                youtubeId: "uXHM70zcksk",
                desc: "राष्ट्रीय अध्यक्ष डॉ. सुधांशु शर्मा का पार्टी कार्यकर्ताओं के लिए विस्तृत संदेश, जिसमें ब्लॉक-स्तरीय रणनीतियों और संगठन विस्तार की चर्चा की गई।"
            },
            {
                id: 4,
                title: "कैसी है घुमंतू जनजातियों की स्थिति? जानिए भारत में खानाबदोश समाज का सच",
                date: "February 22, 2026",
                duration: "12:15",
                image: "https://img.youtube.com/vi/B_gimhjRWxY/hqdefault.jpg",
                type: "दस्तावेजी वीडियो",
                youtubeId: "B_gimhjRWxY",
                desc: "भारत में घुमंतू और खानाबदोश समुदायों के सामने आने वाली बुनियादी समस्याओं का सामाजिक-आर्थिक विश्लेषण और पीजीपी की कल्याणकारी नीतियां।"
            },
            {
                id: 5,
                title: "पार्टी प्रस्तावना: जानिए क्यों आपको पीपल्स ग्रीन पार्टी से जुड़ना चाहिए!",
                date: "February 12, 2026",
                duration: "2:50",
                image: "https://img.youtube.com/vi/850TTnmrmD4/hqdefault.jpg",
                type: "प्रस्तावना",
                youtubeId: "850TTnmrmD4",
                desc: "पीपल्स ग्रीन पार्टी के सिद्धांतों, ईमानदारी और नैतिक राजनीति के सिद्धांतों को दर्शाने वाला एक संक्षिप्त परिचय।"
            },
            {
                id: 6,
                title: "पीपल्स ग्रीन पार्टी पहले राजस्थान को श्रेष्ठ बनाएगी - Join Now",
                date: "January 28, 2026",
                duration: "5:40",
                image: "https://img.youtube.com/vi/9Bieb6xW2QM/hqdefault.jpg",
                type: "चुनावी अभियान",
                youtubeId: "9Bieb6xW2QM",
                desc: "राजस्थान के चहुंमुखी विकास के लिए पीजीपी के संकल्प पत्र और पहले चरण की प्राथमिकताओं की विस्तृत व्याख्या।"
            },
            {
                id: 7,
                title: "सरपंच महेंद्र मीणा हत्याकांड: टोंक पुलिस की भूमिका पर उठे गंभीर सवाल",
                date: "January 14, 2026",
                duration: "8:20",
                image: "https://img.youtube.com/vi/Oof5Z2wayfc/hqdefault.jpg",
                type: "विशेष रिपोर्ट",
                youtubeId: "Oof5Z2wayfc",
                desc: "टोंक जिले में सरपंच महेंद्र मीणा की संदिग्ध मृत्यु पर सवाल उठाते हुए मामले की निष्पक्ष उच्च-स्तरीय जांच कराने की मांग।"
            },
            {
                id: 8,
                title: "लॉकडाउन पर रामगंज जयपुर की ग्राउंड रिपोर्ट: स्थानीय युवाओं की जुबानी",
                date: "December 20, 2025",
                duration: "6:15",
                image: "https://img.youtube.com/vi/kWulUyLGW1c/hqdefault.jpg",
                type: "विशेष कवरेज",
                youtubeId: "kWulUyLGW1c",
                desc: "महामारी के दौरान लॉकडाउन के बीच जयपुर के रामगंज क्षेत्र की वास्तविक स्थिति और स्थानीय लोगों की दैनिक समस्याओं पर ग्राउंड रिपोर्ट।"
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
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsPlaying(false);
    }, [selectedVideo]);

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
                            {isPlaying && selectedVideo.youtubeId ? (
                                <div className="relative w-full aspect-video bg-black shrink-0 border-b border-gray-200">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                                        title={selectedVideo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div 
                                    className="relative w-full aspect-video bg-black flex items-center justify-center shrink-0 border-b border-gray-200 group cursor-pointer"
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <img src={selectedVideo.image} alt={selectedVideo.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

                                    <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-[#A2E6B4] transition-all duration-300 shadow-xl">
                                        <Play fill="currentColor" size={40} className="text-white group-hover:text-[#04330B] ml-2" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
                                        <div className="h-full bg-[#A2E6B4] w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                                    </div>
                                </div>
                            )}

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
                                            <button 
                                                className="flex items-center gap-2 text-white hover:text-white font-medium transition-colors bg-[#0D5229] hover:bg-[#04330B] px-6 py-3 rounded-xl shadow-md"
                                                onClick={() => setIsPlaying(true)}
                                            >
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
