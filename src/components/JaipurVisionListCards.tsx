import React from 'react';
import Link from 'next/link';
import {
    Building2, MapPin, Tent, Music, ShoppingBag, Palette,
    Drama, Film, Scissors, BookOpen, Gem, GraduationCap,
    Lightbulb, Rocket, ShieldCheck, Wifi, Leaf, Trees,
    Droplets, Waves
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// Reusing same points for demonstration of list
const CARD_DATA = [
    {
        title: "Urban & Cultural Core",
        subtitle: "Ideas 1-10",
        color: "bg-green-50",
        iconColor: "text-[#0D5229]",
        borderColor: "border-[#E4F2EA]",
        url: "/vision/jaipur-2040",
        points: [
            "1. Clean City (क्लीन सिटी)",
            "2. Heritage City (हैरिटेज सिटी)",
            "3. Tourism City (टूरिज्म सिटी)",
            "4. Festival City (फेस्टिवल सिटी)",
            "5. Handicraft & Haat City",
            "6. Art & Culture City",
            "7. Theatre City (थियेटर सिटी)",
            "8. Film City (फ़िल्म सिटी)",
            "9. Fashion City (फैशन सिटी)",
            "10. Literature City"
        ]
    },
    {
        title: "Innovation & Growth",
        subtitle: "Ideas 11-20",
        color: "bg-green-50",
        iconColor: "text-[#0D5229]",
        borderColor: "border-[#E4F2EA]",
        url: "/vision/jaipur-2040",
        points: [
            "11. Jewellery City (ज्वेलरी सिटी)",
            "12. Knowledge City (नॉलेज सिटी)",
            "13. Innovation City",
            "14. Startup City (स्टार्टअप सिटी)",
            "15. Cyber City (साइबर सिटी)",
            "16. Smart City (स्मार्ट सिटी)",
            "17. Green City (ग्रीन सिटी)",
            "18. Forest City (फॉरेस्ट सिटी)",
            "19. Lake & Riverfront City",
            "20. Water Recharge City"
        ]
    },
    {
        title: "Social Wellbeing",
        subtitle: "Ideas 21-30",
        color: "bg-green-50",
        iconColor: "text-[#0D5229]",
        borderColor: "border-[#E4F2EA]",
        url: "/vision/jaipur-2040",
        points: [
            "21. Solar City (सोलर सिटी)",
            "22. Healthy City (हेल्थी सिटी)",
            "23. Sports City (स्पोर्ट्स सिटी)",
            "24. Safe City (सेफ सिटी)",
            "25. Happy City (हैप्पी सिटी)",
            "26. Metro City (मेट्रो सिटी)",
            "27. Transparent City",
            "28. Just City (न्याय सिटी)",
            "29. Housing City (आवास सिटी)",
            "30. Global City (ग्लोबल सिटी)"
        ]
    },
    {
        title: "Future Infrastructure",
        subtitle: "Ideas 31-40",
        color: "bg-green-50",
        iconColor: "text-[#0D5229]",
        borderColor: "border-[#E4F2EA]",
        url: "/vision/jaipur-2040",
        points: [
            "31. Electric City (इलेक्ट्रिक सिटी)",
            "32. Drone City (ड्रोन सिटी)",
            "33. Zero-Waste City",
            "34. Accessible City (सुगम्य सिटी)",
            "35. Youth City (युवा सिटी)",
            "36. Senior Friendly City",
            "37. Child Friendly City",
            "38. Pet Friendly City",
            "39. Yoga City (योग सिटी)",
            "40. Spiritual City (आध्यात्मिक सिटी)"
        ]
    },
    {
        title: "Global Leadership",
        subtitle: "Ideas 41-50",
        color: "bg-green-50",
        iconColor: "text-[#0D5229]",
        borderColor: "border-[#E4F2EA]",
        url: "/vision/jaipur-2040",
        points: [
            "41. Peace City (शांति सिटी)",
            "42. Science City (विज्ञान सिटी)",
            "43. Space City (अंतरिक्ष सिटी)",
            "44. Bio-Tech City",
            "45. Robot City (रोबोट सिटी)",
            "46. AI City (एआई सिटी)",
            "47. Future City (भविष्य सिटी)",
            "48. Eternal City (अनंत सिटी)",
            "49. Love City (प्रेम सिटी)",
            "50. One World City"
        ]
    }
];

export default function JaipurVisionListCards() {
    return (
        <section className="bg-white py-20 px-4 w-full flex justify-center border-t border-gray-100">
            <div className="w-full max-w-[1320px] flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12 max-w-[900px]">
                    <ScrollReveal animation="fade-up">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-5xl text-[#04330B] mb-4 tracking-tight">
                            VISION JAIPUR 2040
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal animation="fade-up" delay={200}>
                        <p className="font-['Familjen_Grotesk'] text-xl text-[#587E67] font-medium">
                            50 Transformative Ideas for a Sustainable Future.
                        </p>
                    </ScrollReveal>
                </div>

                {/* 5 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
                    {CARD_DATA.map((card, index) => (
                        <ScrollReveal
                            key={index}
                            animation="fade-up"
                            delay={index * 100}
                            className="h-full"
                        >
                            <Link href={card.url} className="block h-full group">
                                <div className={`h-full rounded-2xl border ${card.borderColor} bg-white hover:bg-gray-50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col`}>

                                    {/* Card Header */}
                                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <span className={`font-bold text-lg ${card.iconColor}`}>{index + 1}</span>
                                    </div>

                                    <h3 className="font-['Familjen_Grotesk'] font-bold text-xl text-gray-900 mb-1 group-hover:text-[#0D5229] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                                        {card.subtitle}
                                    </p>

                                    {/* List */}
                                    <ul className="flex flex-col gap-3 mb-6 flex-grow">
                                        {card.points.map((point, i) => (
                                            <li key={i} className="text-[13px] md:text-[14px] text-[#587E67] font-medium border-b border-dashed border-gray-100 pb-1 last:border-0 hover:text-[#0D5229] transition-colors truncate">
                                                {point}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                                        <span className="text-sm font-bold text-[#0D5229] group-hover:underline decoration-2 underline-offset-4">
                                            View All Details →
                                        </span>
                                    </div>

                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

            </div>
        </section>
    );
}
