"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-down' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';
    duration?: number; // in ms
    delay?: number; // in ms
    distance?: number; // in px for slides
    className?: string;
    threshold?: number; // 0 to 1
    once?: boolean; // trigger only once?
}

export default function ScrollReveal({
    children,
    animation = 'fade-up',
    duration = 500,
    delay = 0,
    distance = 20,
    className = '',
    threshold = 0.08,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Prefer instant paint for above-the-fold / nearby content
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 120) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                // Reveal earlier so content doesn't feel late
                rootMargin: '120px 0px 0px 0px',
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    const transitionStyles: React.CSSProperties = {
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    };

    const getInitialStyle = () => {
        switch (animation) {
            case 'fade-up':
                return { opacity: 0, transform: `translateY(${distance}px)` };
            case 'fade-down':
                return { opacity: 0, transform: `translateY(-${distance}px)` };
            case 'slide-left':
                return { opacity: 0, transform: `translateX(${distance}px)` };
            case 'slide-right':
                return { opacity: 0, transform: `translateX(-${distance}px)` };
            case 'scale-up':
                return { opacity: 0, transform: 'scale(0.97)' };
            case 'fade-in':
            default:
                return { opacity: 0, transform: 'none' };
        }
    };

    const currentStyle = isVisible
        ? { opacity: 1, transform: 'none' }
        : getInitialStyle();

    return (
        <div
            ref={ref}
            className={className}
            style={{ ...transitionStyles, ...currentStyle }}
        >
            {children}
        </div>
    );
}
