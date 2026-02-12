"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe, Shield, Users, Leaf, Sparkles } from 'lucide-react';

export const InteractiveHologramNews = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const steps = [
        {
            id: "01",
            title: "Digital Democracy",
            desc: "Blockchain-based transparent voting and decision making for every citizen.",
            icon: Shield,
            color: "#10B981"
        },
        {
            id: "02",
            title: "Eco-Grid 2040",
            desc: "AI-managed renewable energy network providing free electricity to villages.",
            icon: Leaf,
            color: "#3B82F6"
        },
        {
            id: "03",
            title: "Smart Units",
            desc: "Hyper-local administrative units with direct budgetary control.",
            icon: Globe,
            color: "#E85C2F"
        },
        {
            id: "04",
            title: "Citizen Wealth",
            desc: "Direct profit sharing from state resources back to the people.",
            icon: Users,
            color: "#8B5CF6"
        }
    ];

    return (
        <section className="py-[150px] lg:py-[200px] bg-[#04330b] relative overflow-hidden flex justify-center perspective-[1000px]">
            {/* Holographic Grid Background */}

            {/* Glowing Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none" />

            <div className="w-full max-w-[1400px] px-4 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/5 backdrop-blur-xl mb-6">
                        <Sparkles size={16} className="text-[#10B981] animate-pulse" />
                        <span className="text-[#10B981] font-bold text-xs uppercase tracking-[0.4em]">Future of Rajasthan</span>
                    </div>
                    <h2 className="text-[40px] md:text-[60px] lg:text-[80px] font-bold text-white tracking-tighter leading-none">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-blue-400 to-[#10B981] animate-shimmer">Hyper-Transparent</span> <br />Governance Engine
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" ref={containerRef}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`group relative h-[450px] transition-all duration-700 ease-out border border-white/5 bg-white/[0.02] rounded-[40px] overflow-hidden cursor-crosshair
                                ${hoveredIndex !== null && hoveredIndex !== i ? 'blur-[2px] opacity-40 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}
                                ${hoveredIndex === i ? 'bg-white/[0.05] border-white/20' : ''}`}
                        >
                            {/* Animated Scanner Effect */}
                            {hoveredIndex === i && (
                                <div className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent z-20 animate-scan pointer-events-none" />
                            )}

                            {/* Card Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                {/* Top: ID & Label */}
                                <div className="flex justify-between items-start">
                                    <span className="text-5xl font-bold text-white/10 group-hover:text-[#10B981]/20 transition-colors duration-500 font-serif italic">
                                        {step.id}
                                    </span>
                                    <div className={`p-4 rounded-2xl transition-all duration-500 transform group-hover:rotate-[360deg]
                                        ${hoveredIndex === i ? 'bg-[#10B981] text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-white/40'}`}>
                                        <step.icon size={28} />
                                    </div>
                                </div>

                                {/* Bottom: Text content */}
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#10B981] transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/40 text-lg leading-relaxed group-hover:text-white/70 transition-colors duration-500 line-clamp-3">
                                        {step.desc}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-[#10B981] font-bold text-sm tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                        INITIATING PROTOCOL <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Hologram Lines Visual Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none overflow-hidden">
                                {Array.from({ length: 20 }).map((_, j) => (
                                    <div key={j} className="h-[1px] w-full bg-[#10B981] mb-2 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                                        style={{ transitionDelay: `${j * 30}ms` }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative CTA for the section */}
                <div className="mt-20 flex justify-center">
                    <button className="group relative px-10 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:pr-14 active:scale-95">
                        <span className="relative z-10 flex items-center gap-2">
                            EXPLORE ENGINE REAL-TIME <Sparkles size={18} />
                        </span>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowUpRight size={20} />
                        </div>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    background-size: 200% auto;
                    animation: shimmer 6s linear infinite;
                }
            `}</style>
        </section>
    );
};
