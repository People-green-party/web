"use client";

import React from 'react';
import { MissionLayout } from '@/components/MissionLayout';
import { Leaf, Globe, Sun, Zap, Droplets, Heart } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function NatureConservationPage() {
    const { language } = useLanguage();

    const content = language === 'hi'
        ? "प्रकृति का संरक्षण हमारे लिए केवल एक नीति नहीं, बल्कि हमारी मानवता की रक्षा की लड़ाई है। हम राजस्थान के पर्यावरण को पुनर्जीवित करने के लिए प्रतिबद्ध हैं, ताकि आने वाली पीढ़ियों को स्वच्छ जल, शुद्ध हवा और समृद्ध जैव विविधता विरासत में मिल सके।"
        : "The conservation of nature is not just a policy for us, but a battle for the protection of our humanity. We are committed to rejuvenating Rajasthan's environment so that future generations can inherit clean water, pure air, and rich biodiversity.";

    const initiatives = [
        {
            title: language === 'hi' ? "वृहत वृक्षारोपण अभियान" : "Mass Afforestation",
            description: language === 'hi'
                ? "राजस्थान को हरा-भरा बनाने के लिए करोड़ों स्थानीय पेड़ों का रोपण और उनका रखरखाव।"
                : "Planting and maintaining millions of indigenous trees to make Rajasthan green again.",
            icon: Leaf
        },
        {
            title: language === 'hi' ? "सतत जल प्रबंधन" : "Water Conservation",
            description: language === 'hi'
                ? "पारंपरिक जल स्रोतों का पुनरुद्धार और आधुनिक वर्षा जल संचयन प्रणालियों का कार्यान्वयन।"
                : "Reviving traditional water sources and implementing modern rainwater harvesting systems.",
            icon: Droplets
        },
        {
            title: language === 'hi' ? "सौर ऊर्जा क्रांति" : "Solar Revolution",
            description: language === 'hi'
                ? "हर घर और कृषि क्षेत्र को किफायती और स्वच्छ सौर ऊर्जा से जोड़ना।"
                : "Connecting every household and farm with affordable and clean solar energy.",
            icon: Sun
        },
        {
            title: language === 'hi' ? "पर्यावरण-अनुकूल खेती" : "Eco-Friendly Farming",
            description: language === 'hi'
                ? "प्राकृतिक और जैविक खेती को बढ़ावा देना ताकि भूमि की उर्वरता बनी रहे।"
                : "Promoting natural and organic farming to preserve soil fertility and health.",
            icon: Heart
        },
        {
            title: language === 'hi' ? "प्रदूषण नियंत्रण" : "Pollution Control",
            description: language === 'hi'
                ? "औद्योगिक उत्सर्जन और प्लास्टिक कचरे के खिलाफ सख्त कानून और उनका कड़ाई से पालन।"
                : "Stricter laws against industrial emissions and plastic waste, with rigorous enforcement.",
            icon: Zap
        },
        {
            title: language === 'hi' ? "जैव विविधता संरक्षण" : "Biodiversity Shield",
            description: language === 'hi'
                ? "वन्यजीवों के आवासों का संरक्षण और राज्य के लुप्तप्राय प्रजातियों की रक्षा।"
                : "Protecting wildlife habitats and safeguarding the state's endangered species.",
            icon: Globe
        }
    ];

    return (
        <MissionLayout
            title={language === 'hi' ? "प्रकृति और मानवता संरक्षण" : "Nature & Humanity Conservation"}
            subtitle={language === 'hi' ? "आज का संरक्षण, कल की सुरक्षा। प्रकृति बचेगी, तभी भविष्य बचेगा।" : "Today's conservation, tomorrow's security. Only if nature survives, the future survives."}
            heroImage="/herosection/6.jpg"
            content={content}
            initiatives={initiatives}
            secondaryTitle={language === 'hi' ? "आने वाली पीढ़ियों के लिए हमारी विरासत" : "Our Legacy for Future Generations"}
        />
    );
}
