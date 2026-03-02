"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Building2, MapPin, Tent, Music, ShoppingBag,
    Palette, Drama, Film, Scissors, BookOpen,
    Plus, GripVertical
} from 'lucide-react';

const VISION_POINTS = [
    { id: "01", title: "CLEAN CITY", sub: "DOCUMENTATION", label: "URBAN", color: "#1e293b", icon: Building2, desc: "Swachh Jaipur initiative", detail: "Waste management & civic culture." },
    { id: "02", title: "HERITAGE", sub: "PRESERVATION", label: "CULTURE", color: "#BE1E2D", icon: MapPin, desc: "Pink City conservation", detail: "Restoring ancient walls & havelis." },
    { id: "03", title: "TOURISM", sub: "HOSPITALITY", label: "ECONOMY", color: "#065f46", icon: Tent, desc: "Global travel hub", detail: "24/7 tourist friendly circuits." },
    { id: "04", title: "FESTIVALS", sub: "CELEBRATION", label: "ARTS", color: "#581c87", icon: Music, desc: "Cultural vibrancy", detail: "Every day is a celebration." },
    { id: "05", title: "HANDICRAFT", sub: "ARTISANS", label: "DESIGN", color: "#9a3412", icon: ShoppingBag, desc: "Global branding", detail: "Empowering local craftsmen." },
    { id: "06", title: "ART & HUB", sub: "EXPRESSION", label: "SOCIETY", color: "#0f172a", icon: Palette, desc: "Public art murals", detail: "Wall paintings & ward sculptures." },
    { id: "07", title: "THEATRE", sub: "PERFORMANCE", label: "DRAMA", color: "#14532d", icon: Drama, desc: "Performing arts", detail: "Mini theaters in every zone." },
    { id: "08", title: "FILM CITY", sub: "PRODUCTION", label: "CINEMA", color: "#04330B", icon: Film, desc: "Shooting studios", detail: "Jobs & international branding." },
    { id: "09", title: "FASHION", sub: "STYLING", label: "APPAREL", color: "#7f1d1d", icon: Scissors, desc: "Modern heritage", detail: "Traditional art in modern design." },
    { id: "10", title: "LITERATURE", sub: "DIALOGUE", label: "BOOKS", color: "#1e3a8a", icon: BookOpen, desc: "Knowledge city", detail: "Modernizing libraries & clubs." },
];

export default function SmoothVisionSlider() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // "Slow and Heavy" फील के लिए Damping बढ़ा दी है
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 24,
        restDelta: 0.001
    });

    // Track movement
    const x = useTransform(smoothProgress, [0, 1], ["30%", "-75%"]);

    return (
        <section ref={sectionRef} className="relative h-[800vh] bg-[#F0F0F0]">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-12 overflow-hidden">

                {/* Header */}
                <div className="container mx-auto px-12 lg:px-24">
                    <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">
                        Vision Jaipur 2040 <br />
                        <span className="text-black/10">The Synergy Engine</span>
                    </h2>
                </div>

                {/* Horizontal Track */}
                <div className="relative w-full flex items-center h-[600px]">
                    <motion.div style={{ x }} className="flex gap-12 items-center">
                        {VISION_POINTS.map((point, i) => {
                            const Icon = point.icon;
                            const step = 1 / VISION_POINTS.length;
                            const center = i * step;

                            // --- SMOOTH TRANSITION LOGIC ---

                            // 1. "Pura niche jaye" - Card drops down when leaving center
                            const y = useTransform(smoothProgress,
                                [center - 0.1, center, center + 0.1],
                                [100, 0, 100] // 100px niche jayega side me jate hi
                            );

                            // 2. Scale up smoothly
                            const scale = useTransform(smoothProgress,
                                [center - 0.1, center, center + 0.1],
                                [0.8, 1.1, 0.8]
                            );

                            // 3. Color Fade - No glitchy jumps
                            const bgColor = useTransform(smoothProgress,
                                [center - 0.1, center, center + 0.1],
                                ["#ffffff", point.color, "#ffffff"]
                            );

                            // 4. Blur Effect - To hide transitions glitches
                            const blur = useTransform(smoothProgress,
                                [center - 0.08, center, center + 0.08],
                                ["blur(4px)", "blur(0px)", "blur(4px)"]
                            );

                            const opacity = useTransform(smoothProgress,
                                [center - 0.12, center, center + 0.12],
                                [0.3, 1, 0.3]
                            );

                            return (
                                <motion.div
                                    key={point.id}
                                    style={{
                                        y,
                                        scale,
                                        backgroundColor: bgColor,
                                        filter: blur,
                                        opacity,
                                        zIndex: i === Math.round(smoothProgress.get() * VISION_POINTS.length) ? 10 : 1
                                    }}
                                    className="relative flex-shrink-0 w-[320px] md:w-[450px] h-[400px] md:h-[520px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rounded-sm flex flex-col justify-between p-12 overflow-hidden"
                                >
                                    {/* Geometric BG */}
                                    <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-black to-transparent" />

                                    {/* Labels */}
                                    <div className="absolute left-4 top-0 bottom-0 flex items-center">
                                        <p className="rotate-[-90deg] text-[9px] font-bold tracking-[0.4em] uppercase text-current opacity-30">
                                            {point.sub}
                                        </p>
                                    </div>
                                    <div className="absolute right-4 top-0 bottom-0 flex items-center">
                                        <p className="rotate-[90deg] text-[9px] font-bold tracking-[0.4em] uppercase text-current opacity-30">
                                            {point.label}
                                        </p>
                                    </div>

                                    {/* Content */}
                                    <div className="z-10 transition-colors duration-500">
                                        <span className="text-xs font-bold tracking-widest opacity-40 mb-2 block">{point.id}</span>
                                        <h3 className="text-3xl md:text-5xl font-black leading-none uppercase tracking-tighter italic">
                                            {point.title}
                                        </h3>
                                    </div>

                                    <div className="z-10 flex items-end justify-between transition-colors duration-500">
                                        <div className="flex flex-col gap-8">
                                            <Plus size={28} strokeWidth={3} />
                                            <Icon size={64} strokeWidth={1} />
                                        </div>
                                        <GripVertical size={28} className="opacity-20" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Bottom Synced Nav */}
                <div className="container mx-auto px-12 lg:px-24">
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 border-t border-black/10 pt-8">
                        {VISION_POINTS.map((point, i) => {
                            const step = 1 / VISION_POINTS.length;
                            const center = i * step;
                            const active = useTransform(smoothProgress, [center - 0.05, center, center + 0.05], [0.1, 1, 0.1]);

                            return (
                                <motion.div key={point.id} style={{ opacity: active }} className="flex flex-col items-center gap-1">
                                    <div className="w-1 h-1 bg-black rounded-full mb-2" />
                                    <span className="text-[8px] font-black uppercase text-black truncate w-full text-center">{point.title}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}