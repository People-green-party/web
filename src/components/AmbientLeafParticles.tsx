"use client";

import React, { useEffect, useState } from 'react';

export const AmbientLeafParticles = () => {
    const [leaves, setLeaves] = useState<{ id: number; left: string; delay: string; duration: string; size: number; rotation: number }[]>([]);

    useEffect(() => {
        const leafCount = 15;
        const newLeaves = Array.from({ length: leafCount }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 20}s`,
            duration: `${15 + Math.random() * 20}s`,
            size: 10 + Math.random() * 20,
            rotation: Math.random() * 360,
        }));
        setLeaves(newLeaves);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
            <style jsx>{`
                @keyframes floatLeaf {
                    0% {
                        transform: translateY(-10%) translateX(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.3;
                    }
                    90% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(110%) translateX(100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="absolute top-0 opacity-0"
                    style={{
                        left: leaf.left,
                        animation: `floatLeaf ${leaf.duration} linear infinite`,
                        animationDelay: leaf.delay,
                    }}
                >
                    <svg
                        width={leaf.size}
                        height={leaf.size}
                        viewBox="0 0 24 24"
                        fill="#10B981"
                        style={{ transform: `rotate(${leaf.rotation}deg)`, opacity: 0.2 }}
                    >
                        <path d="M12 2C12 2 12 5 12 12C12 19 12 22 12 22C12 22 9 19 6 12C3 5 5 2 12 2Z" />
                        <path d="M12 2C12 2 12 5 12 12C12 19 12 22 12 22C12 22 15 19 18 12C21 5 19 2 12 2Z" />
                    </svg>
                </div>
            ))}
        </div>
    );
};
