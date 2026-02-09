"use client";

import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, X, Youtube, ArrowUpRight, Heart, MessageCircle, Share2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

// --- DATA STRUCTURE (EXACT SAME AS YOURS) ---
const SOCIAL_DATA = {
    facebook: {
        id: 'fb',
        icon: Facebook,
        color: "text-white",
        bgGradient: "from-[#0D5229]/60 to-transparent",
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
        color: "text-white",
        bgGradient: "from-[#0D5229]/60 to-transparent",
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
        color: "text-white",
        bgGradient: "from-[#0D5229]/60 to-transparent",
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
        color: "text-white",
        bgGradient: "from-[#0D5229]/60 to-transparent",
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
        // FIX: Ensure w-full is explicit and display is block
        <a
            href={currentPost.link || data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full h-[520px] rounded-[32px] overflow-hidden bg-black shadow-2xl group transition-transform duration-500 hover:-translate-y-2 border border-white/5"
        >
            {/* 1. Background Image Layer (Absolute) */}
            <div className="absolute inset-0 z-0 bg-[#041208]">
                {data.posts.map((p: any, i: number) => (
                    <div
                        key={i}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Blurred Background (Fills the frame) */}
                        <img
                            src={p.img}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-125 select-none"
                        />
                        {/* Main Image (YouTube Style Frame - Aspect Ratio 16:9) */}
                        <div className="relative w-full h-full flex items-center justify-center p-6 pb-32">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-700 group-hover:scale-105">
                                <img
                                    src={p.img}
                                    alt="Social Post"
                                    className="w-full h-full object-cover"
                                />
                                {/* Bottom Accent Line for Video Look */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0D5229]/80" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Heavy Gradient Overlay to ensure text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />

                {/* Brand Color Glow at bottom - intensified on hover */}
                <div className="absolute inset-0 bg-[#04330B]/0 group-hover:bg-[#04330B]/70 transition-colors duration-500 z-[1]" />

                {/* Brand Color Glow at bottom */}
                <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${data.bgGradient} opacity-60 z-[1]`} />
            </div>

            {/* 2. Top Content */}
            <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                        <Icon size={24} className={`${data.color} group-hover:text-[#0D5229] transition-colors duration-300`} />
                    </div>
                    <div>
                        <h3 className="font-['Familjen_Grotesk'] font-bold text-white text-lg capitalize drop-shadow-md">
                            {platform === 'twitter' ? 'X (Twitter)' : platform}
                        </h3>
                        <p className="font-['Familjen_Grotesk'] text-white/70 text-xs text-left">
                            {data.handle}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Content (Glass Panel) */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[28px] p-5 shadow-2xl group-hover:bg-black/50 transition-all duration-300">

                    {/* Animated Text */}
                    <div className="relative h-[110px] w-full">
                        {data.posts.map((p: any, i: number) => (
                            <div
                                key={i}
                                className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out ${i === index
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-4 pointer-events-none'
                                    }`}
                            >
                                <p className="font-['Familjen_Grotesk'] font-medium text-white text-[16px] md:text-[18px] leading-snug drop-shadow-lg line-clamp-3 text-left">
                                    {p.text}
                                </p>
                                <div className="flex justify-end mt-1">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#04330B] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 scale-90">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden relative">
                        {data.posts.map((_: any, i: number) => (
                            <div
                                key={i}
                                className="absolute top-0 h-full bg-white transition-all duration-[4000ms] ease-linear"
                                style={{
                                    left: `${(i * 100) / data.posts.length}%`,
                                    width: `${100 / data.posts.length}%`,
                                    opacity: i === index ? 1 : 0
                                }}
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
        en: { title: "Social Media Hub", sub: "Follow our latest activities across all platforms" },
        hi: { title: "सोशल मीडिया अपडेट", sub: "सभी प्लेटफार्मों पर हमारी नवीनतम गतिविधियों का अनुसरण करें" }
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