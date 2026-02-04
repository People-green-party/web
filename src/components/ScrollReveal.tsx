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
    duration = 800,
    delay = 0,
    distance = 30, // subtle movement
    className = '',
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, once]);

    // Base styles for transitions
    const transitionStyles: React.CSSProperties = {
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Smooth ease-out
    };

    // Calculate transform and opacity based on state
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
                return { opacity: 0, transform: 'scale(0.95)' };
            case 'fade-in':
            default:
                return { opacity: 0, transform: 'none' };
        }
    };

    const getFinalStyle = () => {
        return { opacity: 1, transform: 'none' }; // Reset transform
    };

    const currentStyle = isVisible ? getFinalStyle() : getInitialStyle();

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
