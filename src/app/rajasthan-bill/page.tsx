"use client";

import React from 'react';
import { MissionLayout } from '@/components/MissionLayout';
import { Landmark, Scale, Briefcase, Users, GraduationCap, Building2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function RajasthanBillPage() {
    const { language } = useLanguage();

    const content = language === 'hi'
        ? "हमारा नया राजस्थान बिल एक ऐतिहासिक विधायी पहल है जिसे शासन के ढांचे को बदलने के लिए डिज़ाइन किया गया है। यह राज्य की वास्तविक शक्ति को लोगों के हाथों में वापस लाने, आर्थिक स्वतंत्रता सुनिश्चित करने और प्रशासनिक बाधाओं को दूर करने का एक ब्लूप्रिंट है।"
        : "Our New Rajasthan Bill is a landmark legislative initiative designed to transform the framework of governance. It is a blueprint for bringing the true power of the state back into the hands of the people, ensuring economic freedom, and dismantling administrative hurdles.";

    const initiatives = [
        {
            title: language === 'hi' ? "प्रशासनिक पारदर्शिता" : "Governance Transparency",
            description: language === 'hi'
                ? "हर सरकारी प्रक्रिया को जनता के देखने के लिए खुला और पारदर्शी बनाया जाएगा।"
                : "Making every government process open and transparent for the public eye.",
            icon: Scale
        },
        {
            title: language === 'hi' ? "आर्थिक स्वायत्तता" : "Economic Autonomy",
            description: language === 'hi'
                ? "स्थानीय व्यवसायों और उद्यमियों के लिए सरल नियम और आर्थिक प्रोत्साहन।"
                : "Simple regulations and economic incentives for local businesses and entrepreneurs.",
            icon: Briefcase
        },
        {
            title: language === 'hi' ? "विकेंद्रीकृत सत्ता" : "Decentralized Power",
            description: language === 'hi'
                ? "पंचायतों और स्थानीय निकायों को सीधे निर्णय लेने की शक्ति देना।"
                : "Empowering Panchayats and local units with direct decision-making power.",
            icon: Landmark
        },
        {
            title: language === 'hi' ? "सतत रोजगार" : "Sustainable Jobs",
            description: language === 'hi'
                ? "हर ब्लॉक में नई औद्योगिक इकाइयों के साथ रोजगार के अवसर पैदा करना।"
                : "Creating employment opportunities with new industrial units in every block.",
            icon: Users
        },
        {
            title: language === 'hi' ? "गुणवत्तापूर्ण शिक्षा" : "Quality Education",
            description: language === 'hi'
                ? "आधुनिक बुनियादी ढांचे के साथ विश्व स्तरीय शिक्षा प्रणाली की स्थापना।"
                : "Establishing a world-class education system with modern infrastructure.",
            icon: GraduationCap
        },
        {
            title: language === 'hi' ? "डिजिटल इंफ्रास्ट्रक्चर" : "Digital Infrastructure",
            description: language === 'hi'
                ? "राज्य के हर गांव को हाई-स्पीड इंटरनेट और डिजिटल सेवाओं से जोड़ना।"
                : "Connecting every village in the state with high-speed internet and digital services.",
            icon: Building2
        }
    ];

    return (
        <MissionLayout
            title={language === 'hi' ? "राजस्थान विकास विधेयक" : "Rajasthan Development Bill"}
            subtitle={language === 'hi' ? "राजस्थान के उज्ज्वल भविष्य के लिए एक व्यापक कानूनी ढांचा।" : "A comprehensive legislative framework for a brighter Rajasthan."}
            heroImage="/herosection/1.png"
            content={content}
            initiatives={initiatives}
            secondaryTitle={language === 'hi' ? "लोगों का बिल, लोगों के लिए" : "The People's Bill, For The People"}
        />
    );
}
