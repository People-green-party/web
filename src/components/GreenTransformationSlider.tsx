"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal, Sparkles, Trees, CloudSun } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const GreenTransformationSlider = () => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging && e.type !== 'mousemove') return; // Allow mouse move only if dragging, but touch always? No, let's use a flag.

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const position = ((x - rect.left) / rect.width) * 100;

        setSliderPos(Math.max(0, Math.min(100, position)));
    };

    // Auto-animate on first load to show it's interactive
    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 50;
            let end = 40;
            let step = 0.5;
            const animate = () => {
                if (start > end) {
                    start -= step;
                    setSliderPos(start);
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-[120px] lg:py-[200px] bg-white flex justify-center overflow-hidden">
            <div className="w-full max-w-[1400px] px-4 lg:px-8">

                <div className="flex flex-col items-center text-center mb-16 px-4">
                    <ScrollReveal animation="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF7EE] text-[#0D5229] font-bold text-xs uppercase tracking-widest mb-6">
                            <Sparkles size={14} /> The Big Shift
                        </div>
                        <h2 className="text-[40px] md:text-[60px] lg:text-[80px] font-bold text-[#04330B] tracking-tighter leading-none mb-8">
                            Experience the <br /> <span className="text-[#E85C2F]">Transformation</span>
                        </h2>
                        <p className="text-[#587E67] text-lg lg:text-2xl max-w-[800px] font-medium leading-relaxed">
                            Slide to see how PGP's policies will turn the tide from resource depletion to a flourishing, sustainable Rajasthan.
                        </p>
                    </ScrollReveal>
                </div>

                {/* THE SLIDER CONTAINER */}
                <div
                    ref={containerRef}
                    className="relative w-full h-[400px] md:h-[600px] lg:h-[750px] rounded-[40px] lg:rounded-[60px] overflow-hidden shadow-2xl cursor-ew-resize select-none border-[8px] border-white"
                    onMouseMove={handleMove}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onTouchMove={handleMove}
                >
                    {/* Background: The "After" (Green Vision) */}
                    <div className="absolute inset-0">
                        <img
                            src="/herosection/6.jpg"
                            alt="Green Vision"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-white font-bold flex items-center gap-3">
                            <Trees size={24} /> PGP VISION 2040
                        </div>
                    </div>

                    {/* Foreground: The "Before" (Current/Desert) */}
                    <div
                        className="absolute inset-0 z-10 overflow-hidden"
                        style={{ width: `${sliderPos}%` }}
                    >
                        <img
                            src="/herosection/4.jpg"
                            alt="Current State"
                            className="absolute inset-0 w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover max-w-none"
                            style={{ width: '1400px' }} // Match container max-width or slightly more
                        />
                        <div className="absolute top-10 left-10 bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white font-bold flex items-center gap-3 whitespace-nowrap">
                            <CloudSun size={24} /> CURRENT CHALLENGES
                        </div>
                    </div>

                    {/* The Handle Bar */}
                    <div
                        className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                        style={{ left: `${sliderPos}%` }}
                    >
                        {/* The Handle Circle */}
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border-[6px] border-[#04330B] group active:scale-90 transition-transform">
                            <div className="flex flex-col items-center gap-0.5 text-[#04330B]">
                                <MoveHorizontal size={24} className="animate-pulse" />
                            </div>
                        </div>

                        {/* Arrows indicators */}
                        <div className={`absolute left-[-100px] pointer-events-none transition-opacity duration-500 ${sliderPos > 20 ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="text-white font-bold text-sm tracking-widest uppercase bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full">Slide Right</p>
                        </div>
                    </div>

                    {/* Gradient Overlay for bottom text */}
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-30" />

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 text-center w-full px-8 pointer-events-none">
                        <p className="text-white text-2xl lg:text-4xl font-bold tracking-tight drop-shadow-lg">
                            {sliderPos > 50 ? "Restoring Nature's Balance" : "Building Sustainable Future"}
                        </p>
                        <p className="text-white/70 font-medium mt-2">Interact to reveal the PGP Green Blueprint</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
