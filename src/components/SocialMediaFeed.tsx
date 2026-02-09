"use client";

import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, X, Youtube, ArrowUpRight, Heart, MessageCircle, Share2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

// --- DATA STRUCTURE (EXACT SAME AS YOURS) ---
const SOCIAL_DATA = {
    facebook: {
        id: 'fb',
        icon: Facebook,
        color: "text-[#1877F2]",
        brandBg: "bg-[#1877F2]/10",
        handle: "@peoplesgreen",
        link: "https://www.facebook.com/peoplesgreen/",
        posts: [
            { text: "Building a cleaner, greener future for everyone. Watch our latest updates! 🌿", img: "/herosection/1.png", link: "https://www.facebook.com/reel/1555076775720311/" },
            { text: "Community engagement is at the heart of our mission.", img: "/herosection/8.jpg", link: "https://www.facebook.com/peoplesgreen/" },
            { text: "Every small step counts towards a sustainable world.", img: "/herosection/team.jpg", link: "https://www.facebook.com/peoplesgreen/" },
        ]
    },
    instagram: {
        id: 'insta',
        icon: Instagram,
        color: "text-[#E4405F]",
        brandBg: "bg-[#E4405F]/10",
        handle: "@drsudhanshu_green",
        link: "https://www.instagram.com/drsudhanshu_green/",
        posts: [
            { text: "Transforming the Pink City with green initiatives. 🌸 #Jaipur", img: "/herosection/9.jpg", link: "https://www.instagram.com/drsudhanshu_green/reel/DUdKMRXkb25/" },
            { text: "Empowering the youth for a better tomorrow. ✊ #FutureIsGreen", img: "/herosection/10.jpg", link: "https://www.instagram.com/drsudhanshu_green/" },
            { text: "Behind the scenes: Planning our next big campaign.", img: "/herosection/7.jpg", link: "https://www.instagram.com/drsudhanshu_green/" },
        ]
    },
    twitter: {
        id: 'x',
        icon: X,
        color: "text-black",
        brandBg: "bg-black/10",
        handle: "@ipgpaction",
        link: "https://x.com/ipgpaction",
        posts: [
            { text: "Stay updated with PGP on X. Policy changes and ground-level activism. 👇", img: "/herosection/4.jpg", link: "https://x.com/ipgpaction" },
            { text: "Water conservation remains our top priority. #SaveWater", img: "/herosection/team.jpg", link: "https://x.com/ipgpaction" },
            { text: "Connecting with the people of Rajasthan. Join the conversation.", img: "/herosection/8.jpg", link: "https://x.com/ipgpaction" },
        ]
    },
    youtube: {
        id: 'yt',
        icon: Youtube,
        color: "text-[#FF0000]",
        brandBg: "bg-[#FF0000]/10",
        handle: "Peoples Green Party",
        link: "https://www.youtube.com/@PeoplesGreenParty",
        posts: [
            { text: "Let's make new Rajasthan together! आईये साथ मिलकर बनाते हैं नया राजस्थान. 🎥", img: "https://img.youtube.com/vi/MXKV-7QKU_k/hqdefault.jpg", link: "https://youtu.be/MXKV-7QKU_k" },
            { text: "Experience the change with PGP. Our latest updates from the ground.", img: "https://img.youtube.com/vi/StBeN01oI_8/hqdefault.jpg", link: "https://www.youtube.com/watch?v=StBeN01oI_8" },
            { text: "Game of Nakal Mafiya & Govt Jobs. Stopping the corruption! #Justice", img: "https://img.youtube.com/vi/ug9kewiVkOQ/hqdefault.jpg", link: "https://www.youtube.com/watch?v=ug9kewiVkOQ" },
        ]
    }
};

const SocialCard = ({ platform, data }: { platform: string, data: any }) => {
    const [index, setIndex] = useState(0);
    const Icon = data.icon;

    // Logic: Same rotation timer
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % data.posts.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [data.posts.length]);

    const currentPost = data.posts[index];

    return (
        <a
            href={currentPost.link || data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-[520px] rounded-[32px] overflow-hidden bg-white shadow-lg group transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-[#0D5229]/30 hover:shadow-2xl hover:shadow-[#0D5229]/10"
        >
            {/* 1. Header (Top) */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[12px] bg-white border border-[#E4F2EA] flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#EAF7EE]">
                        <Icon size={24} strokeWidth={1.5} className="text-[#04330B]" />
                    </div>
                    <div>
                        <h3 className="font-['Familjen_Grotesk'] font-bold text-[#04330B] text-lg capitalize">
                            {platform === 'twitter' ? 'X (Twitter)' : platform}
                        </h3>
                        <p className="font-['Familjen_Grotesk'] text-[#587E67] text-xs font-medium text-left text-nowrap">
                            {data.handle}
                        </p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#E4F2EA] flex items-center justify-center text-[#0D5229] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            {/* 2. Visual Content (Center) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-12">
                {data.posts.map((p: any, i: number) => (
                    <div
                        key={i}
                        className={`absolute inset-x-6 top-[80px] aspect-square rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-1000 ${i === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
                    >
                        <img
                            src={p.img}
                            alt="Social Post"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* 3. Bottom Content (Text & Progress) */}
            <div className="absolute bottom-4 left-0 w-full px-6 z-20">
                <div className="bg-[#F8FBF9] border border-gray-100 rounded-[24px] p-5 transition-all duration-300 group-hover:bg-[#EAF7EE]">

                    {/* Animated Text */}
                    <div className="relative h-[85px] w-full">
                        {data.posts.map((p: any, i: number) => (
                            <div
                                key={i}
                                className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out ${i === index
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4 pointer-events-none'
                                    }`}
                            >
                                <p className="font-['Familjen_Grotesk'] font-medium text-[#04330B] text-[16px] md:text-[17px] leading-snug line-clamp-3 text-left">
                                    {p.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots (Replaced Progress Bar) */}
                    <div className="flex justify-center items-center gap-1.5 mt-5">
                        {data.posts.map((_: any, i: number) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === index
                                    ? 'w-6 bg-[#0D5229]'
                                    : 'w-1.5 bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default function SocialMediaFeed({ language }: { language: string }) {
    const titles = {
        en: { title: "Connect With Us", sub: "Follow our latest activities across all platforms" },
        hi: { title: "हमसे जुड़ें", sub: "सभी प्लेटफार्मों पर हमारी नवीनतम गतिविधियों का अनुसरण करें" }
    };

    const t = titles[language as keyof typeof titles] || titles.en;

    return (
        <section className="bg-white mt-[5px] lg:mt-[10px] w-full py-16 lg:py-24 relative overflow-hidden">

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <ScrollReveal animation="fade-up" delay={100}>
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-4xl md:text-6xl text-[#04330B] mb-4">
                            {t.title}
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal animation="fade-up" delay={200}>
                        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                            {t.sub}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Grid - FIX: Added w-full to wrapper divs to prevent collapse */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {['facebook', 'instagram', 'twitter', 'youtube'].map((platform, i) => (
                        <div key={platform} className="w-full">
                            <ScrollReveal animation="fade-up" delay={i * 100} className="w-full h-full">
                                <SocialCard
                                    platform={platform}
                                    data={SOCIAL_DATA[platform as keyof typeof SOCIAL_DATA]}
                                />
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}