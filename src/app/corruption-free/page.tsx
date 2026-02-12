"use client";

import React from 'react';
import { MissionLayout } from '@/components/MissionLayout';
import { Shield, Eye, Lock, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function CorruptionFreePage() {
    const { language } = useLanguage();

    const content = language === 'hi'
        ? "भ्रष्टाचार के खिलाफ हमारा युद्ध सिर्फ एक नारा नहीं है, बल्कि राजनीति से बेईमानी को जड़ से मिटाने की हमारी प्रतिबद्धता है। हम एक ऐसी प्रणाली का निर्माण कर रहे हैं जहाँ सरकारी सेवाओं के लिए किसी रिश्वत की आवश्यकता नहीं होगी और हर पैसा जनता के लाभ के लिए खर्च होगा।"
        : "Our war on corruption is not just a slogan, but our commitment to uprooting dishonesty from politics. We are building a system where government services require no bribes and every penny is spent for the benefit of the people.";

    const initiatives = [
        {
            title: language === 'hi' ? "शून्य सहिष्णुता नीति" : "Zero Tolerance Policy",
            description: language === 'hi'
                ? "भ्रष्टाचार के दोषी पाए जाने वाले अधिकारियों के खिलाफ सख्त और तत्काल कार्रवाई।"
                : "Strict and immediate action against officials found guilty of corruption.",
            icon: Shield,
            image: "/herosection/7.jpg"
        },
        {
            title: language === 'hi' ? "डिजिटल निविदा प्रणाली" : "Digital Tender System",
            description: language === 'hi'
                ? "सभी सरकारी ठेकों और निविदाओं के लिए पूरी तरह से पारदर्शी और ऑनलाइन प्रक्रिया।"
                : "Fully transparent and online process for all government contracts and tenders.",
            icon: Eye,
            image: "/herosection/hero1.svg"
        },
        {
            title: language === 'hi' ? "सुरक्षित भ्रष्टाचार रिपोर्टिंग" : "Secure Reporting",
            description: language === 'hi'
                ? "नागरिकों के लिए बिना किसी डर के भ्रष्टाचार की रिपोर्ट करने हेतु एक गुप्त और सुरक्षित प्लेटफार्म।"
                : "A confidential and secure platform for citizens to report corruption without fear.",
            icon: Lock,
            image: "/herosection/8.jpg"
        },
        {
            title: language === 'hi' ? "खुला ऑडिट सिस्टम" : "Open Audit System",
            description: language === 'hi'
                ? "हर सरकारी विभाग के खर्चों का जनता द्वारा सुलभ स्वतंत्र ऑडिट।"
                : "Independent audit of every government expense, accessible to the public.",
            icon: FileText,
            image: "/herosection/hero2.svg"
        },
        {
            title: language === 'hi' ? "त्वरित न्याय" : "Fast-Track Justice",
            description: language === 'hi'
                ? "भ्रष्टाचार से संबंधित मामलों के त्वरित निपटान के लिए विशेष अदालतों की स्थापना।"
                : "Establishment of special courts for the fast-track disposal of corruption cases.",
            icon: CheckCircle2,
            image: "/herosection/9.jpg"
        },
        {
            title: language === 'hi' ? "प्रत्यक्ष जवाबदेही" : "Direct Accountability",
            description: language === 'hi'
                ? "लोक सेवकों को सीधे जनता के प्रति जवाबदेह बनाने के लिए नियमित लोक संवाद।"
                : "Regular public dialogues to make public servants directly accountable.",
            icon: MessageSquare,
            image: "/herosection/team.jpg"
        }
    ];

    return (
        <MissionLayout
            title={language === 'hi' ? "भ्रष्टाचार मुक्त शासन" : "Corruption-Free Governance"}
            subtitle={language === 'hi' ? "एक ईमानदार सरकार, जहाँ हर नागरिक को न्याय और सम्मान मिले।" : "An honest government, where every citizen receives justice and respect."}
            heroImage="/herosection/hero3.svg"
            content={content}
            initiatives={initiatives}
            theme="blue"
            secondaryTitle={language === 'hi' ? "ईमानदारी ही हमारा आधार है" : "Honesty is Our Foundation"}
            tags={["INTEGRITY", "ZERO BRIBES", "ACCOUNTABILITY"]}
        />
    );
}
