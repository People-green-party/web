"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import {
    Building2, MapPin, Tent, Music, ShoppingBag, Palette,
    Drama, Film, Scissors, BookOpen, Gem, GraduationCap,
    Lightbulb, Rocket, ShieldCheck, Wifi, Leaf, Trees,
    Droplets, Waves, Sun, Sprout, Zap, Recycle, Bike,
    Stethoscope, Flower, Landmark, Dumbbell, Trophy, Award,
    Users, Accessibility, Home, Smile, Factory, Utensils,
    Paintbrush, Building, Siren, Briefcase, Globe, Bus,
    Moon, Gift, Handshake, Calendar, FileText, Sparkles
} from 'lucide-react';

export default function Page() {
    const { language } = useLanguage();

    const visionPoints = [
        {
            id: 1,
            icon: Building2,
            hi: {
                title: "1. क्लीन सिटी (Clean City)",
                desc: "स्वच्छ जयपुर का लक्ष्य केवल सफाई नहीं, बल्कि नागरिक संस्कृति का पुनर्जागरण है। “क्लीन सिटी जयपुर” का उद्देश्य शहर को धूल, धुआँ और कचरे से मुक्त करना है। हर वार्ड में डोर-टू-डोर कचरा संग्रहण, स्रोत पर कचरा पृथक्करण और स्थानीय स्तर पर कम्पोस्टिंग को अनिवार्य बनाया जाएगा। स्मार्ट डस्टबिन, स्वच्छता ऐप और नागरिक पुरस्कार प्रणाली से जनता को सक्रिय भागीदारी के लिए प्रेरित किया जाएगा। सड़कों की धुलाई प्रणाली विकसित की जाएगी। पर्यावरणीय अनुशासन और सफाई को जयपुर की नई पहचान बनाया जाएगा।"
            },
            en: {
                title: "1. Clean City",
                desc: "The goal of a Clean Jaipur is not just cleanliness, but a renaissance of civic culture. \"Clean City Jaipur\" aims to free the city from dust, smoke, and waste. Door-to-door waste collection, source segregation, and local composting will be mandatory in every ward. Smart dustbins and citizen reward systems will encourage active participation. Environmental discipline and cleanliness will become Jaipur's new identity."
            }
        },
        {
            id: 2,
            icon: MapPin,
            hi: {
                title: "2. हैरिटेज सिटी (Heritage City)",
                desc: "जयपुर विश्व धरोहर नगर है — “हैरिटेज सिटी जयपुर” का उद्देश्य इस गौरव को जीवंत रखना है। पुरानी दीवारों, चौकियों, हवेलियों, मंदिरों और चौक-गलियों का पुनरुद्धार किया जाएगा। भवन रंग, फसाद और स्थापत्य को पारंपरिक गुलाबी स्वरूप में संरक्षित किया जाएगा। पुरानी बाजार गलियों में तारों का भूमिगतकरण, स्वच्छता और रात्रि सौंदर्यीकरण से पर्यटन अनुभव सुधरेगा। हर हवेली में “लिविंग म्यूज़ियम” की अवधारणा लागू की जाएगी ताकि इतिहास केवल देखा नहीं, जिया जा सके।"
            },
            en: {
                title: "2. Heritage City",
                desc: "Jaipur is a World Heritage City—\"Heritage City Jaipur\" aims to keep this pride alive. Ancient walls, outposts, havelis, temples, and streets will be revitalized. Building colors and architecture will be preserved in the traditional pink style. Underground cabling and night beautification will enhance the tourism experience. A \"Living Museum\" concept will be applied in havelis so history is lived, not just seen."
            }
        },
        {
            id: 3,
            icon: Tent,
            hi: {
                title: "3. टूरिज्म सिटी (Tourism City)",
                desc: "जयपुर के लिए पर्यटन केवल उद्योग नहीं, संस्कृति की आत्मा है। “टूरिज्म सिटी जयपुर” योजना के अंतर्गत नगर को 24×7 पर्यटक-अनुकूल शहर के रूप में विकसित किया जाएगा। हेरिटेज सर्किट, डेज़र्ट ट्रेल, हैंडीक्राफ्ट विलेज और फूड ट्रेल जैसे नए अनुभवपरक मार्ग तैयार होंगे। नाइट टूरिज्म, लाइट एंड साउंड शो और लोक-संगीत गलियारे पर्यटकों को आकर्षित करेंगे। हर नागरिक को “सिटी एंबेसडर” बनाने का अभियान चलेगा ताकि अतिथि देवो भव: का भाव व्यवहार में दिखे।"
            },
            en: {
                title: "3. Tourism City",
                desc: "For Jaipur, tourism is the soul of culture. Under \"Tourism City Jaipur\", the city will be developed as a 24×7 tourist-friendly destination. Experiential routes like Heritage Circuits, Desert Trails, and Food Trails will be created. Night tourism and folk music corridors will attract visitors. A \"City Ambassador\" campaign will instill the spirit of \"Atithi Devo Bhava\" in every citizen."
            }
        },
        {
            id: 4,
            icon: Music,
            hi: {
                title: "4. फेस्टिवल सिटी (Festival City)",
                desc: "जयपुर को पूरे वर्ष जीवंत रखने के लिए “फेस्टिवल सिटी जयपुर” की अवधारणा विकसित की जाएगी। हर माह किसी न किसी सांस्कृतिक, साहित्यिक, संगीत या खाद्य उत्सव का आयोजन होगा — जैसे जयपुर आर्ट फेस्ट, हस्तशिल्प मेला, फूड कार्निवल, काव्य महोत्सव आदि। स्थानीय कलाकारों, शिल्पियों और युवाओं को मंच मिलेगा। उत्सव जयपुर की आत्मा हैं, और यह योजना उस आत्मा को वर्ष भर जगाए रखेगी। जयपुर होगा — “हर दिन एक उत्सव।”"
            },
            en: {
                title: "4. Festival City",
                desc: "To keep Jaipur vibrant year-round, the \"Festival City Jaipur\" concept will be developed. Every month will feature a cultural, literary, music, or food festival. Local artists, craftsmen, and youth will find a platform. Festivals are Jaipur's soul, and this plan keeps that soul alive year-round. Jaipur will be—\"Every day a celebration.\""
            }
        },
        {
            id: 5,
            icon: ShoppingBag,
            hi: {
                title: "5. हस्तशिल्पी व हाट सिटी (Handicraft & Haat City)",
                desc: "जयपुर की पहचान उसके शिल्पकारों से है। “हस्तशिल्पी व हाट सिटी जयपुर” का उद्देश्य पारंपरिक कारीगरों को आधुनिक अवसर देना है। शहर के हर कोने में हाट बाजार, डिज़ाइन क्लस्टर और शिल्प प्रशिक्षण केंद्र स्थापित किए जाएंगे। ग्रामीण कारीगरों को शहर के बाज़ारों से सीधे जोड़ने के लिए डिजिटल प्लेटफ़ॉर्म बनाया जाएगा। स्थानीय उत्पादों — ब्लॉक प्रिंटिंग, जरी, लाख, ज्वेलरी — को अंतरराष्ट्रीय ब्रांडिंग दी जाएगी। जयपुर का हर कोना एक जीवित क्राफ्ट गैलरी बनेगा।"
            },
            en: {
                title: "5. Handicraft & Haat City",
                desc: "Jaipur's identity lies with its artisans. \"Handicraft & Haat City Jaipur\" aims to give traditional craftsmen modern opportunities. Haat bazaars and design clusters will be established in every corner. A digital platform will connect rural artisans to city markets. Local products like Block Printing and Jewelry will get international branding. Every corner of Jaipur will become a living craft gallery."
            }
        },
        {
            id: 6,
            icon: Palette,
            hi: {
                title: "6. आर्ट एंड कल्चर सिटी (Art & Culture City)",
                desc: "जयपुर कला, संगीत और स्थापत्य का नगर है। “आर्ट एंड कल्चर सिटी” योजना के तहत हर वार्ड में “संस्कृति केंद्र” बनेगा। दीवारों पर भित्ति चित्र, सार्वजनिक स्थलों पर मूर्तियाँ और खुले मंचों पर लोक प्रदर्शन होंगे। स्थानीय कलाकारों को सरकारी भवनों और चौकों की सजावट में अवसर दिया जाएगा। वार्षिक “जयपुर आर्ट वीक” शहर की पहचान बनेगा। यह शहर केवल देखने योग्य नहीं, बल्कि अनुभव करने योग्य बनेगा — जहाँ हर दीवार, हर गली में रंग और राग होगा।"
            },
            en: {
                title: "6. Art & Culture City",
                desc: "Under \"Art & Culture City\", a \"Culture Center\" will be built in every ward. Murals on walls and folk performances on open stages will be common. Local artists will decorate government buildings. The annual \"Jaipur Art Week\" will become the city's identity. The city will be not just to be seen, but experienced—where every wall and street has color and melody."
            }
        },
        {
            id: 7,
            icon: Drama,
            hi: {
                title: "7. थियेटर सिटी (Theatre City)",
                desc: "“थियेटर सिटी जयपुर” का उद्देश्य नाट्यकला को पुनर्जीवित करना है। हर ज़ोन में एक मिनी थिएटर और एक ओपन-एयर मंच विकसित किया जाएगा। स्कूलों और कॉलेजों में नाट्यकला पाठ्यक्रम जोड़े जाएंगे। जयपुर नाट्य महोत्सव जैसे आयोजन देश के शीर्ष मंचों में होंगे। आधुनिक तकनीक और पारंपरिक कथानक का संगम होगा। स्थानीय कलाकारों को सम्मान और रोज़गार दोनों मिलेगा। जयपुर भारतीय रंगमंच का केंद्र बनेगा।"
            },
            en: {
                title: "7. Theatre City",
                desc: "\"Theatre City Jaipur\" aims to revive the dramatic arts. A mini-theater and open-air stage will be developed in every zone. Events like the Jaipur Theatre Festival will be among the country's top platforms. Modern technology will merge with traditional storytelling. Local artists will find both respect and employment. Jaipur will become a hub of Indian theatre."
            }
        },
        {
            id: 8,
            icon: Film,
            hi: {
                title: "8. फ़िल्म सिटी (Film City)",
                desc: "“फिल्म सिटी जयपुर” राजस्थान की छवि को अंतरराष्ट्रीय सिनेमा में विस्तार देगी। जयपुर की स्थापत्य भव्यता, हवेलियाँ, और प्राकृतिक सौंदर्य फिल्म शूटिंग के लिए पहले से लोकप्रिय हैं। अब एक संगठित फिल्म सिटी बनाई जाएगी जिसमें शूटिंग स्टूडियो, पोस्ट-प्रोडक्शन हाउस, फिल्म स्कूल और फिल्म बाजार शामिल होंगे। यह स्थानीय युवाओं को रोजगार देगा और पर्यटन को बढ़ावा देगा। जयपुर का नाम मुंबई के बाद भारत के प्रमुख फिल्म नगरों में शामिल होगा।"
            },
            en: {
                title: "8. Film City",
                desc: "\"Film City Jaipur\" will expand Rajasthan's image in international cinema. Now, an organized Film City with shooting studios, post-production houses, film schools, and film markets will be built. This will employ local youth and boost tourism. Jaipur will join Mumbai as one of India's premier film cities."
            }
        },
        {
            id: 9,
            icon: Scissors,
            hi: {
                title: "9. फैशन सिटी (Fashion City)",
                desc: "जयपुर सदियों से रंग, वस्त्र और सौंदर्य का नगर रहा है। “फैशन सिटी जयपुर” में पारंपरिक ब्लॉक प्रिंटिंग, बंधनी, जरी, और जेम्स आर्ट को आधुनिक फैशन डिज़ाइन से जोड़ा जाएगा। डिज़ाइन संस्थानों और अंतरराष्ट्रीय ब्रांडों के सहयोग से “जयपुर फैशन हब” बनेगा। वार्षिक “जयपुर फैशन वीक” आयोजित किया जाएगा जिसमें स्थानीय डिजाइनर वैश्विक मंच पाएँगे। जयपुर को भारत की “सस्टेनेबल फैशन कैपिटल” के रूप में प्रतिष्ठा मिलेगी।"
            },
            en: {
                title: "9. Fashion City",
                desc: "In \"Fashion City Jaipur\", traditional block printing, bandhani, and gems art will merge with modern fashion design. A \"Jaipur Fashion Hub\" will be formed with design institutes. An annual \"Jaipur Fashion Week\" will give local designers a global stage. Jaipur will gain prestige as India's \"Sustainable Fashion Capital\"."
            }
        },
        {
            id: 10,
            icon: BookOpen,
            hi: {
                title: "10. लिटरेचर सिटी (Literature City)",
                desc: "जयपुर पहले से साहित्यिक चेतना का केंद्र है, और “लिटरेचर सिटी जयपुर” उस परंपरा को और गहराई देगा। जयपुर लिटरेचर फेस्टिवल विश्व स्तर पर प्रसिद्ध है; इसे शहर के हर भाग तक पहुँचाया जाएगा। पुस्तकालयों का आधुनिकीकरण, सार्वजनिक पठन स्थल, मोबाइल लाइब्रेरी और युवाओं के लिए राइटिंग क्लब बनाए जाएँगे। जयपुर साहित्य, संवाद और विचार की राजधानी बनेगा — जहाँ शब्द केवल लिखे नहीं, जिए जाएँगे।"
            },
            en: {
                title: "10. Literature City",
                desc: "\"Literature City Jaipur\" will deepen the city's literary tradition. The Jaipur Literature Festival will reach every part of the city. Modernization of libraries, public reading spaces, mobile libraries, and writing clubs for youth will be created. Jaipur will be the capital of literature, dialogue, and thought—where words are not just written, but lived."
            }
        },
        {
            id: 11,
            icon: Gem,
            hi: {
                title: "11. ज्वेलरी सिटी (Jewellery City)",
                desc: "जयपुर विश्व स्तर पर रत्न और आभूषण निर्माण की राजधानी है। “ज्वेलरी सिटी जयपुर” योजना का उद्देश्य इस परंपरा को आधुनिकता से जोड़ना है। शहर में अत्याधुनिक “जेम एंड ज्वेलरी पार्क” स्थापित किए जाएंगे, जहाँ कारीगरों को तकनीकी प्रशिक्षण, आधुनिक उपकरण और वैश्विक विपणन सहायता मिलेगी। पारंपरिक कारीगरी को संरक्षित करते हुए डिज़ाइन नवाचार को बढ़ावा दिया जाएगा। जयपुर को “ग्लोबल जेम एक्सपोर्ट हब” बनाने का लक्ष्य है।"
            },
            en: {
                title: "11. Jewellery City",
                desc: "\"Jewellery City Jaipur\" aims to connect this tradition with modernity. \"Gem & Jewelry Parks\" will be established, offering artisans technical training and global marketing support. Traditional craftsmanship will be preserved while promoting design innovation. The goal is to make Jaipur a \"Global Gem Export Hub\"."
            }
        },
        {
            id: 12,
            icon: GraduationCap,
            hi: {
                title: "12. नॉलेज सिटी (Knowledge City)",
                desc: "“नॉलेज सिटी जयपुर” का उद्देश्य ज्ञान, शिक्षा और अनुसंधान को शहर के विकास का केंद्र बनाना है। विश्वविद्यालयों, स्कूलों, पुस्तकालयों और शोध संस्थानों को एक साझा नेटवर्क से जोड़ा जाएगा। ज्ञान-केंद्रित अर्थव्यवस्था विकसित की जाएगी जहाँ शिक्षा ही निवेश बनेगी। शहर के हर क्षेत्र में “कम्युनिटी लर्निंग हब” स्थापित होंगे जहाँ नागरिक नई तकनीकें सीख सकेंगे। जयपुर को “ओपन यूनिवर्सिटी सिटी” के रूप में विकसित किया जाएगा।"
            },
            en: {
                title: "12. Knowledge City",
                desc: "\"Knowledge City Jaipur\" aims to make knowledge, education, and research the center of development. Universities and schools will be linked in a shared network. \"Community Learning Hubs\" will be established in every area. Jaipur will develop as an \"Open University City\" where every citizen is a lifelong learner."
            }
        },
        {
            id: 13,
            icon: Lightbulb,
            hi: {
                title: "13. इनोवेशन सिटी (Innovation City)",
                desc: "“इनोवेशन सिटी जयपुर” भविष्य की अर्थव्यवस्था का बीज है। शहर में “इनोवेशन डिस्ट्रिक्ट्स” स्थापित होंगे जहाँ विश्वविद्यालय, उद्योग और स्टार्टअप एक साथ मिलकर काम करेंगे। हर कॉलेज में इनक्यूबेशन सेंटर और नवाचार प्रयोगशालाएँ बनाई जाएँगी। नागरिक जीवन की समस्याओं — जैसे ट्रैफिक, प्रदूषण, जल — के समाधान स्थानीय नवाचारों से निकाले जाएँगे। जयपुर को भारत का “सिटी ऑफ आइडियाज़” बनाया जाएगा।"
            },
            en: {
                title: "13. Innovation City",
                desc: "\"Innovation City Jaipur\" will make Jaipur a hub for innovation and technology. \"Innovation Districts\" will be established where universities, industry, and startups work together. Solutions to civic problems like traffic and pollution will come from local innovations. Jaipur will be India's \"City of Ideas\"."
            }
        },
        {
            id: 14,
            icon: Rocket,
            hi: {
                title: "14. स्टार्टअप सिटी (Startup City)",
                desc: "“स्टार्टअप सिटी जयपुर” का उद्देश्य जयपुर को भारत के शीर्ष स्टार्टअप केंद्रों में शामिल करना है। विश्वविद्यालयों और निजी संगठनों में इनक्यूबेशन सेंटर स्थापित किए जाएंगे। सरकार सीड फंडिंग, कर छूट और मार्केट लिंकिंग की सुविधा देगी। जयपुर स्टार्टअप फेस्टिवल हर वर्ष आयोजित होगा। यह योजना जयपुर के युवाओं को “जॉब सीकर” से “जॉब क्रिएटर” बनाएगी।"
            },
            en: {
                title: "14. Startup City",
                desc: "\"Startup City Jaipur\" aims to include Jaipur among India's top startup hubs. Incubation centers, seed funding, and market linking will be provided. The Jaipur Startup Festival will be held annually. This plan transforms Jaipur's youth from \"Job Seekers\" to \"Job Creators\"."
            }
        },
        {
            id: 15,
            icon: ShieldCheck,
            hi: {
                title: "15. साइबर सिटी (Cyber City)",
                desc: "“साइबर सिटी जयपुर” डिजिटल सुरक्षा और आईटी नवाचार का केंद्र बनेगा। जयपुर में अत्याधुनिक आईटी पार्क, डेटा सेंटर और साइबर रिसर्च हब विकसित किए जाएंगे। साइबर सुरक्षा, कृत्रिम बुद्धिमत्ता, क्लाउड कंप्यूटिंग और ब्लॉकचेन के लिए विशेष प्रशिक्षण संस्थान खोले जाएंगे। यह शहर न केवल खुद डिजिटल रूप से सशक्त होगा बल्कि भारत के अन्य शहरों को भी साइबर समाधान प्रदान करेगा।"
            },
            en: {
                title: "15. Cyber City",
                desc: "\"Cyber City Jaipur\" will be a hub for digital security and IT innovation. IT parks, data centers, and cyber research hubs will be developed. Specialized training institutes for AI and blockchain will open. The city will provide cyber solutions to other Indian cities."
            }
        },
        {
            id: 16,
            icon: Wifi,
            hi: {
                title: "16. स्मार्ट सिटी (Smart City)",
                desc: "“स्मार्ट सिटी जयपुर” का अर्थ केवल तकनीक नहीं, बल्कि स्मार्ट जीवनशैली है। शहर में ट्रैफिक, जल, कचरा और ऊर्जा की रीयल-टाइम निगरानी हेतु सेंसर आधारित सिस्टम लगाए जाएंगे। स्मार्ट लाइटिंग, वाई-फाई जोन, डिजिटल सूचना बोर्ड और ई-गवर्नेंस प्लेटफ़ॉर्म नागरिक सुविधाओं को सुगम बनाएंगे। स्मार्ट सिटी का लक्ष्य है — अधिक दक्ष प्रशासन, स्वच्छ वातावरण और खुशहाल नागरिक।"
            },
            en: {
                title: "16. Smart City",
                desc: "\"Smart City Jaipur\" implies a smart lifestyle. Sensor-based systems will monitor traffic, water, and energy in real-time. Smart lighting, Wi-Fi zones, and e-governance platforms will ease civic amenities. The goal is efficient administration, a clean environment, and happy citizens."
            }
        },
        {
            id: 17,
            icon: Leaf,
            hi: {
                title: "17. ग्रीन सिटी (Green City)",
                desc: "“ग्रीन सिटी जयपुर” का विजन है — हर नागरिक के लिए स्वच्छ हवा, हरियाली और स्वस्थ जीवन। शहर में छतों पर बगीचे, वर्टिकल ग्रीन वॉल, और पार्कों का विस्तार किया जाएगा। हर व्यक्ति के लिए “एक पेड़–एक जिम्मेदारी” अभियान चलेगा। सरकारी भवनों और स्कूलों को पर्यावरण-अनुकूल बनाया जाएगा। जयपुर भारत का पहला ऐसा शहर बनेगा जो आर्थिक विकास और पर्यावरण संरक्षण दोनों को संतुलित रखेगा।"
            },
            en: {
                title: "17. Green City",
                desc: "\"Green City Jaipur\" envisions clean air and greenery for all. Rooftop gardens and vertical green walls will expand. A \"One Tree–One Responsibility\" campaign will run for everyone. Jaipur will be India's first city to balance economic development with environmental protection."
            }
        },
        {
            id: 18,
            icon: Trees,
            hi: {
                title: "18. फॉरेस्ट सिटी (Forest City)",
                desc: "“फॉरेस्ट सिटी जयपुर” शहर की फेफड़ों जैसी भूमिका निभाएगी। जयपुर की सीमा और मुख्य मार्गों के किनारे मियावाकी पद्धति से घने वन विकसित किए जाएंगे। प्रत्येक नई कॉलोनी को “मिनी फॉरेस्ट” विकसित करने की जिम्मेदारी दी जाएगी। पहाड़ियों, नालों और परती ज़मीन को जैव विविधता पार्क में बदला जाएगा। जयपुर पुनः “हरित मरुस्थल का चमत्कार” कहलाएगा।"
            },
            en: {
                title: "18. Forest City",
                desc: "\"Forest City Jaipur\" will act as the city's lungs. Dense forests using the Miyawaki method will be developed. Every new colony will develop a \"Mini Forest\". Hills and barren land will turn into biodiversity parks. Jaipur will again be the \"Miracle of the Green Desert\"."
            }
        },
        {
            id: 19,
            icon: Waves,
            hi: {
                title: "19. लेक व रिवरफ्रंट सिटी (Lake & Riverfront City)",
                desc: "जयपुर का गौरव उसकी झीलें और द्रव्यवती नदी हैं। “लेक व रिवरफ्रंट सिटी जयपुर” के तहत इन जलधाराओं को पुनर्जीवित कर शहर के मनोरंजन और पर्यावरण दोनों से जोड़ा जाएगा। किनारों पर जैव विविधता पार्क, साइकिल ट्रैक, योग स्थल और सांस्कृतिक चौपालें बनाई जाएँगी। यह परियोजना जयपुर को “जीवंत जल नगरी” बनाएगी जहाँ हर धारा में संस्कृति बहेगी।"
            },
            en: {
                title: "19. Lake & Riverfront City",
                desc: "Under \"Lake & Riverfront City Jaipur\", water bodies like the Dravyavati River will be revived. Biodiversity parks, cycle tracks, and cultural squares will be built on banks. This project makes Jaipur a \"Vibrant Water City\" where culture follows the stream."
            }
        },
        {
            id: 20,
            icon: Droplets,
            hi: {
                title: "20. वाटर रिचार्ज सिटी (Water Recharge City)",
                desc: "“वाटर रिचार्ज सिटी जयपुर” का उद्देश्य है — हर बूंद को संचित करना और हर नागरिक को जल संरक्षण से जोड़ना। सभी भवनों में वर्षा जल संचयन अनिवार्य होगा। बावड़ियों और तालाबों का पुनर्जीवन किया जाएगा। शहर के जलस्रोतों का डिजिटल मानचित्र तैयार होगा। जयपुर एक ऐसा उदाहरण बनेगा जहाँ हर बूंद भविष्य का निवेश होगी।"
            },
            en: {
                title: "20. Water Recharge City",
                desc: "\"Water Recharge City Jaipur\" aims to save every drop. Rainwater harvesting will be mandatory. Stepwells and ponds will be revived. A digital map of water sources will be created. Jaipur will be an example where every drop is an investment in the future."
            }
        },
        {
            id: 21,
            icon: Sun,
            hi: {
                title: "21. सोलर सिटी (Solar City)",
                desc: "जयपुर के पास सूर्य की अनमोल संपदा है — और “सोलर सिटी जयपुर” इस ऊर्जा को आत्मनिर्भरता में बदल देगा। शहर के हर सरकारी भवन, स्कूल, अस्पताल और आवासीय परिसर को सोलर पैनलों से जोड़ा जाएगा। छतों पर बिजली उत्पादन से प्रत्येक नागरिक “ऊर्जा उत्पादक” बनेगा। सार्वजनिक स्थलों पर सौर–चालित स्ट्रीट लाइटें, बस स्टॉप और चार्जिंग स्टेशन लगाए जाएंगे। जयपुर 2040 तक भारत का पहला “नेट–ज़ीरो एनर्जी सिटी” बनने की दिशा में अग्रसर होगा।"
            },
            en: {
                title: "21. Solar City",
                desc: "Jaipur has the wealth of the sun—\"Solar City Jaipur\" will turn this into self-reliance. Every government building, school, and home will be connected to solar panels. Every citizen will become an \"Energy Producer\". Solar-powered street lights and charging stations will be installed in public places. Jaipur moves towards becoming India's first \"Net-Zero Energy City\" by 2040."
            }
        },
        {
            id: 22,
            icon: Sprout,
            hi: {
                title: "22. बायोडायवर्सिटी सिटी (Biodiversity City)",
                desc: "“बायोडायवर्सिटी सिटी जयपुर” का उद्देश्य है — मानव और प्रकृति के बीच संतुलन स्थापित करना। शहर के पार्कों, झीलों और पहाड़ियों को जैव विविधता क्षेत्रों के रूप में विकसित किया जाएगा। यहाँ स्थानीय वृक्ष प्रजातियाँ, पक्षी आश्रय, तितली उद्यान और औषधीय पौधों के उद्यान बनाए जाएंगे। विद्यालयों में “नेचर क्लब” चलेंगे ताकि बच्चे प्रकृति से जुड़ें। यह परियोजना जयपुर को हर मौसम में हरा–भरा, जीवंत और प्राकृतिक सुंदरता से परिपूर्ण बनाएगी।"
            },
            en: {
                title: "22. Biodiversity City",
                desc: "\"Biodiversity City Jaipur\" aims to balance humans and nature. Parks and hills will be developed as biodiversity zones with native trees, bird shelters, and butterfly gardens. \"Nature Clubs\" in schools will connect children with nature. This project will make Jaipur green, vibrant, and full of natural beauty in every season."
            }
        },
        {
            id: 23,
            icon: Zap,
            hi: {
                title: "23. ईवी सिटी (EV City)",
                desc: "भविष्य की दिशा है — स्वच्छ ऊर्जा परिवहन। “ईवी सिटी जयपुर” में पेट्रोल और डीजल वाहनों को चरणबद्ध रूप से इलेक्ट्रिक वाहनों में परिवर्तित किया जाएगा। सभी प्रमुख मार्गों पर सोलर–पावर्ड चार्जिंग स्टेशन स्थापित होंगे। नगर परिवहन में ई–बसें, ई–ऑटो और ई–बाइकें चलेंगी। निजी वाहनों के लिए पार्किंग शुल्क में छूट और कर प्रोत्साहन दिया जाएगा। जयपुर का लक्ष्य है — 2035 तक 100% सार्वजनिक परिवहन को इलेक्ट्रिक बनाना। जयपुर भारत का “सस्टेनेबल ट्रांसपोर्ट मॉडल सिटी” बनेगा।"
            },
            en: {
                title: "23. EV City",
                desc: "The future is clean energy transport. \"EV City Jaipur\" will phase out petrol/diesel vehicles for EVs. Solar-powered charging stations will be installed. E-buses and E-bikes will run in public transport. Incentives will be given for private EVs. The goal is 100% electric public transport by 2035, making Jaipur India's \"Sustainable Transport Model City\"."
            }
        },
        {
            id: 24,
            icon: Recycle,
            hi: {
                title: "24. वेस्ट मैनेजमेंट सिटी (Waste Management City)",
                desc: "कचरा अब समस्या नहीं, संपदा है — यही “वेस्ट मैनेजमेंट सिटी जयपुर” का दर्शन है। प्रत्येक घर, कार्यालय और बाजार में कचरे का पृथक्करण अनिवार्य होगा। जैविक कचरे से बायोगैस और कम्पोस्ट तैयार किया जाएगा, जबकि पुनर्चक्रण योग्य कचरे से नए उत्पाद। शहर में “जीरो वेस्ट मार्केट” की अवधारणा लागू होगी जहाँ एक भी अपशिष्ट बाहर नहीं जाएगा। स्थानीय उद्यमियों को कचरे के पुनः उपयोग पर आधारित स्टार्टअप के लिए प्रोत्साहित किया जाएगा। यह योजना जयपुर को भारत का पहला “वेस्ट–टू–वेल्थ मॉडल सिटी” बनाएगी।"
            },
            en: {
                title: "24. Waste Management City",
                desc: "Waste is not a problem, but wealth—this is the philosophy of \"Waste Management City Jaipur\". Segregation will be mandatory. Organic waste will turn into biogas/compost. A \"Zero Waste Market\" concept will be applied. Startups based on waste reuse will be encouraged, making Jaipur India's first \"Waste-to-Wealth Model City\"."
            }
        },
        {
            id: 25,
            icon: Bike,
            hi: {
                title: "25. साइकिल सिटी (Cycle City)",
                desc: "जयपुर की गलियों में फिर से साइकिलों की घंटी गूंजेगी — यही “साइकिल सिटी जयपुर” का सपना है। मुख्य सड़कों के किनारे साइकिल ट्रैक, साइकिल पार्किंग स्टेशन और किराए पर साइकिल सेवाएँ शुरू की जाएँगी। स्कूलों, दफ्तरों और पर्यटन स्थलों पर “साइकिल टू वर्क” अभियान चलेगा। नागरिकों को सप्ताह में एक दिन वाहन मुक्त चलने के लिए प्रेरित किया जाएगा। इस पहल से ट्रैफिक, प्रदूषण और ईंधन खर्च — तीनों में कमी आएगी। यह परियोजना जयपुर को स्वास्थ्य, पर्यावरण और अनुशासन के नए प्रतिमान के रूप में स्थापित करेगी।"
            },
            en: {
                title: "25. Cycle City",
                desc: "Bicycle bells will ring again in Jaipur—this is the dream of \"Cycle City Jaipur\". Cycle tracks and rental services will start. A \"Cycle to Work\" campaign will run in offices and schools. Citizens will be encouraged to go vehicle-free once a week. This will reduce traffic, pollution, and fuel costs, establishing Jaipur as a model of health and discipline."
            }
        },
        {
            id: 26,
            icon: Stethoscope,
            hi: {
                title: "26. मेडिकल हेल्थ सिटी (Medical Health City)",
                desc: "जयपुर पहले से ही उत्तर भारत का चिकित्सा केंद्र है। “मेडिकल हेल्थ सिटी जयपुर” के अंतर्गत सुपर–स्पेशियलिटी अस्पतालों, मेडिकल यूनिवर्सिटीज़ और रिसर्च लैब्स का समेकन किया जाएगा। एक “मेडिकल रिसर्च पार्क” स्थापित होगा जहाँ बायोटेक, फार्मा और डायग्नोस्टिक कंपनियाँ साथ काम करेंगी। ग्रामीण क्षेत्रों के लिए टेली–मेडिसिन सेवा बढ़ाई जाएगी। प्रत्येक नागरिक के लिए डिजिटल हेल्थ आईडी बनाई जाएगी। जयपुर को “मेडिकल टूरिज्म डेस्टिनेशन” के रूप में विकसित किया जाएगा, जहाँ उपचार के साथ सेवा–संवेदना भी मिलेगी।"
            },
            en: {
                title: "26. Medical Health City",
                desc: "Under \"Medical Health City Jaipur\", super-specialty hospitals and labs will be consolidated. A \"Medical Research Park\" will be established for biotech and pharma. Tele-medicine will expand to rural areas. A Digital Health ID will be created for everyone. Jaipur will develop as a \"Medical Tourism Destination\" offering both treatment and care."
            }
        },
        {
            id: 27,
            icon: Flower,
            hi: {
                title: "27. वेलनेस योगा सिटी (Wellness & Yoga City)",
                desc: "जयपुर का शांत वातावरण स्वास्थ्य और ध्यान के लिए उपयुक्त है। “वेलनेस योगा सिटी जयपुर” योजना के तहत खुले पार्कों में योग प्लेटफॉर्म, ध्यान केंद्र और आयुर्वेद वेलनेस क्लीनिक बनाए जाएंगे। हर वार्ड में “मॉर्निंग योगा क्लब” स्थापित होगा। अस्पतालों में वैकल्पिक चिकित्सा विभाग खोले जाएंगे। योग और प्राकृतिक चिकित्सा को पर्यटन से जोड़ा जाएगा ताकि भारत आने वाले पर्यटक जयपुर में स्वास्थ्य का अनुभव भी करें। जयपुर को “भारत की वेलनेस कैपिटल” के रूप में विश्व स्तर पर प्रतिष्ठा मिलेगी।"
            },
            en: {
                title: "27. Wellness & Yoga City",
                desc: "\"Wellness & Yoga City Jaipur\" will see yoga platforms and Ayurveda clinics in parks. \"Morning Yoga Clubs\" will start in every ward. Yoga and naturopathy will be linked to tourism. Jaipur will gain prestige as \"India's Wellness Capital\"."
            }
        },
        {
            id: 28,
            icon: Landmark,
            hi: {
                title: "28. टेम्पल सिटी (Temple City)",
                desc: "जयपुर मंदिरों और धर्मस्थलों की नगरी है। “टेम्पल सिटी जयपुर” का उद्देश्य इन स्थलों को धार्मिक, सांस्कृतिक और पर्यटन दृष्टि से जोड़ना है। प्रमुख मंदिरों — गोविंददेवजी, गालता, खole के हनुमान — को एक “पवित्र परिक्रमा मार्ग” से जोड़ा जाएगा। इन स्थलों के आस–पास स्वच्छता, प्रकाश और यातायात व्यवस्था सुधारी जाएगी। मंदिरों में डिजिटल सूचना प्रणाली और भाषा–अनुवाद उपकरण लगाए जाएंगे। यह योजना जयपुर को श्रद्धा और संस्कृति का संगम बनाएगी।"
            },
            en: {
                title: "28. Temple City",
                desc: "\"Temple City Jaipur\" aims to connect temples culturally and for tourism. Major temples will be linked by a \"Sacred Parikrama Route\". Cleanliness and traffic around these sites will improve. Digital info systems will be installed. This plan makes Jaipur a confluence of faith and culture."
            }
        },
        {
            id: 29,
            icon: Dumbbell,
            hi: {
                title: "29. फिटनेस सिटी (Fitness City)",
                desc: "“फिटनेस सिटी जयपुर” का लक्ष्य है — हर नागरिक के लिए स्वास्थ्य प्राथमिकता हो। प्रत्येक वार्ड में ओपन जिम, रनिंग ट्रैक और पार्क–फिटनेस ज़ोन बनाए जाएंगे। स्कूलों और दफ्तरों में “हेल्दी आवर” लागू होगा। साइकिल, वॉकिंग और स्पोर्ट्स को प्रोत्साहित करने के लिए नागरिक पुरस्कार योजना होगी। सरकारी कर्मचारियों और छात्रों के लिए फिटनेस एप आधारित निगरानी प्रणाली शुरू की जाएगी। जयपुर को ऐसा शहर बनाया जाएगा जहाँ स्वास्थ्य केवल इलाज नहीं, जीवन शैली हो।"
            },
            en: {
                title: "29. Fitness City",
                desc: "\"Fitness City Jaipur\" prioritizes health. Open gyms and running tracks will be built in every ward. A \"Healthy Hour\" will be implemented in schools and offices. Awards will encourage cycling and sports. Jaipur will be a city where health is a lifestyle, not just treatment."
            }
        },
        {
            id: 30,
            icon: Trophy,
            hi: {
                title: "30. स्पोर्ट्स सिटी (Sports City)",
                desc: "“स्पोर्ट्स सिटी जयपुर” युवाओं के जोश और प्रतिभा को अंतरराष्ट्रीय पहचान देगा। शहर के अलग–अलग ज़ोन में बहुउद्देशीय खेल कॉम्प्लेक्स, स्विमिंग पूल, स्टेडियम और ट्रेनिंग सेंटर बनाए जाएंगे। स्कूल स्तर पर “एक छात्र–एक खेल” योजना लागू होगी। जयपुर में हर साल “इंटरनेशनल स्पोर्ट्स लीग” और “राजस्थान ओलंपिक” का आयोजन होगा। जयपुर खेल और फिटनेस दोनों का पर्याय बनेगा — “फिट जयपुर, यंग जयपुर।”"
            },
            en: {
                title: "30. Sports City",
                desc: "\"Sports City Jaipur\" will give international recognition to youth talent. Multipurpose sports complexes and stadiums will be built. A \"One Student-One Sport\" scheme will apply in schools. The \"International Sports League\" will be held annually. Jaipur will become synonymous with sports—\"Fit Jaipur, Young Jaipur.\""
            }
        },
        {
            id: 31,
            icon: Award,
            hi: {
                title: "31. वेटरन सिटी (Veteran City)",
                desc: "“वेटरन सिटी जयपुर” का उद्देश्य उन पूर्व सैनिकों का सम्मान करना है, जिन्होंने राष्ट्र की सेवा में जीवन समर्पित किया। शहर में “वेटरन विलेज” बसाया जाएगा जहाँ आवास, स्वास्थ्य सुविधा और पुनर्वास केंद्र होंगे। सेवानिवृत्त सैनिकों को युवाओं के कौशल प्रशिक्षण और अनुशासन शिक्षा में जोड़ा जाएगा। वेटरन स्मारक बनाए जाएंगे। यह पहल जयपुर को “सेवा, सम्मान और समर्पण” की राजधानी बनाएगी।"
            },
            en: {
                title: "31. Veteran City",
                desc: "\"Veteran City Jaipur\" honors those who served the nation. A \"Veteran Village\" with housing and health facilities will be established. Retired soldiers will be involved in youth training and discipline education. Veteran memorials will be built. This initiative makes Jaipur the capital of \"Service, Respect, and Dedication\"."
            }
        },
        {
            id: 32,
            icon: Users,
            hi: {
                title: "32. वूमेन सिटी (Women City)",
                desc: "“वूमेन सिटी जयपुर” महिलाओं की सुरक्षा, स्वावलंबन और सम्मान का प्रतीक होगी। प्रत्येक वार्ड में “महिला सुविधा केंद्र” खोले जाएंगे जहाँ स्वास्थ्य, शिक्षा और रोजगार संबंधी सहायता मिलेगी। महिला उद्यमियों के लिए विशेष आर्थिक क्षेत्र और स्टार्टअप ग्रांट बनाए जाएंगे। सार्वजनिक स्थलों पर सुरक्षा निगरानी बढ़ाई जाएगी। आत्मरक्षा प्रशिक्षण अनिवार्य होगा। जयपुर वह शहर बनेगा जहाँ हर महिला स्वतंत्र और सुरक्षित महसूस करेगी — “जयपुर, जहाँ नारी ही शक्ति है।”"
            },
            en: {
                title: "32. Women City",
                desc: "\"Women City Jaipur\" symbolizes women's safety and independence. \"Women Facility Centers\" will open in every ward. Special economic zones and startup grants will be created for women entrepreneurs. Security surveillance will increase. Self-defense training will be mandatory. Jaipur will be where every woman feels free and safe—\"Jaipur, where Woman is Power.\""
            }
        },
        {
            id: 33,
            icon: Accessibility,
            hi: {
                title: "33. इंक्लूसिव सिटी (Inclusive City)",
                desc: "“इंक्लूसिव सिटी जयपुर” का अर्थ है — ऐसा शहर जो सबका हो। दिव्यांगजन, वरिष्ठ नागरिक, आर्थिक रूप से कमजोर और अल्पसंख्यक — सभी के लिए समान अवसर सुनिश्चित होंगे। सार्वजनिक भवनों में समावेशी डिज़ाइन अनिवार्य होंगे। शहर की योजनाओं में नागरिक परामर्श अनिवार्य बनाया जाएगा। सामाजिक संगठनों के साथ मिलकर “इक्विटी मिशन” चलाया जाएगा। जयपुर सामाजिक न्याय का आदर्श बनेगा — “सब साथ, सबका जयपुर।”"
            },
            en: {
                title: "33. Inclusive City",
                desc: "\"Inclusive City Jaipur\" means a city for everyone. Equal opportunities will be ensured for the disabled, elderly, and economically weak. Inclusive designs will be mandatory in public buildings. An \"Equity Mission\" will run with social organizations. Jaipur will be a model of social justice—\"All Together, Everyone's Jaipur.\""
            }
        },
        {
            id: 34,
            icon: Home,
            hi: {
                title: "34. अफोर्डेबल हाउसिंग सिटी (Affordable Housing City)",
                desc: "“अफोर्डेबल हाउसिंग सिटी जयपुर” का उद्देश्य है — हर नागरिक को एक सम्मानजनक घर मिले। सरकार और निजी क्षेत्र के सहयोग से किफ़ायती आवास परियोजनाएँ विकसित की जाएँगी। हर घर में स्वच्छ जल, सौर ऊर्जा और हरित परिसर की सुविधा होगी। झुग्गी पुनर्वास को मानवीय दृष्टिकोण से किया जाएगा। किराए पर रहने वालों के लिए “रेंट–टू–ओन” मॉडल लागू होगा। जयपुर बनेगा “सभी के लिए आवास का नगर।”"
            },
            en: {
                title: "34. Affordable Housing City",
                desc: "\"Affordable Housing City Jaipur\" aims for a dignified home for every citizen. Affordable housing projects will be developed. Every home will have clean water and solar energy. Slum rehabilitation will be humane. A \"Rent-to-Own\" model will be implemented. Jaipur will become the \"City of Housing for All\"."
            }
        },
        {
            id: 35,
            icon: Smile,
            hi: {
                title: "35. चिल्ड्रेन सिटी (Children City)",
                desc: "“चिल्ड्रेन सिटी जयपुर” का लक्ष्य है — ऐसा शहर बनाना जहाँ हर बच्चा सुरक्षित और कल्पनाशील वातावरण में बढ़ सके। हर वार्ड में “बाल उद्यान” और “क्रिएटिव लर्निंग ज़ोन” विकसित होंगे। स्कूलों के बाहर “प्ले–स्ट्रीट्स” बनाई जाएँगी जहाँ बच्चे बिना वाहन के खेल सकें। बाल–संग्रहालय स्थापित होंगे। स्कूलों में मानसिक स्वास्थ्य को प्राथमिकता मिलेगी। जयपुर बच्चों के लिए सबसे प्रिय शहर बनेगा — “हर मुस्कान जयपुर की पहचान।”"
            },
            en: {
                title: "35. Children City",
                desc: "\"Children City Jaipur\" aims for a safe and imaginative environment for every child. \"Child Gardens\" and \"Creative Learning Zones\" will be developed. \"Play-Streets\" will be created outside schools. Children's museums will be established. Mental health will be prioritized in schools. Jaipur will be the most beloved city for children—\"Every smile is Jaipur's identity.\""
            }
        },
        {
            id: 36,
            icon: Factory,
            hi: {
                title: "36. इंडस्ट्री सिटी (Industry City)",
                desc: "“इंडस्ट्री सिटी जयपुर” शहर की आर्थिक आत्मनिर्भरता का केंद्र बनेगी। नए औद्योगिक क्षेत्र स्मार्ट अवसंरचना और स्वच्छ ऊर्जा पर आधारित होंगे। एमएसएमई और ग्रीन टेक्नोलॉजी को प्रोत्साहन मिलेगा। “मेक इन जयपुर” अभियान के तहत हस्तशिल्प, टेक्सटाइल और ऑटो पार्ट्स जैसे क्षेत्र विकसित होंगे। प्रशिक्षण केंद्रों के माध्यम से स्थानीय युवाओं को रोज़गार मिलेगा। जयपुर उद्योग और स्थिरता दोनों का संतुलन बनेगा।"
            },
            en: {
                title: "36. Industry City",
                desc: "\"Industry City Jaipur\" will be the hub of economic self-reliance. New industrial zones will be based on smart infrastructure and clean energy. \"Make in Jaipur\" will develop sectors like handicrafts and textiles. Local youth will get jobs through training centers. Jaipur will balance industry and sustainability."
            }
        },
        {
            id: 37,
            icon: Utensils,
            hi: {
                title: "37. फ़ूड क्यूलिनेरी सिटी (Food & Culinary City)",
                desc: "जयपुर के स्वाद में राजस्थान की आत्मा बसती है। “फूड एंड क्यूलिनेरी सिटी जयपुर” योजना के तहत पारंपरिक और आधुनिक पाक–कला का संगम होगा। शहर में “राजस्थानी फूड स्ट्रीट” और “ऑर्गेनिक फूड मार्केट” बनाए जाएंगे। स्थानीय व्यंजन को विश्व स्तर पर प्रचारित किया जाएगा। पाक–कला संस्थान खोले जाएंगे जहाँ युवाओं को प्रशिक्षण मिलेगा। हर साल “जयपुर फूड फेस्टिवल” आयोजित होगा। जयपुर भारत का स्वाद बनेगा — “जहाँ हर गली में सुगंध है।”"
            },
            en: {
                title: "37. Food & Culinary City",
                desc: "The soul of Rajasthan lies in Jaipur's taste. \"Food & Culinary City Jaipur\" will blend traditional and modern cuisine. \"Rajasthani Food Streets\" and organic markets will be built. Local cuisine will be promoted globally. Culinary institutes will train youth. The \"Jaipur Food Festival\" will be held annually. Jaipur will be the taste of India—\"Fragrance in every street.\""
            }
        },
        {
            id: 38,
            icon: Paintbrush,
            hi: {
                title: "38. एस्थेटिक होम सिटी (Aesthetic Home City)",
                desc: "“एस्थेटिक होम सिटी जयपुर” का उद्देश्य है — सुंदरता और उपयोगिता का समन्वय। जयपुर की पारंपरिक स्थापत्य शैली को आधुनिक आवासीय वास्तुकला से जोड़ा जाएगा। नई कॉलोनियों में रंग, फसाद और हरियाली का सामंजस्य होगा। प्रत्येक क्षेत्र में “सौंदर्य समिति” बनेगी जो स्वच्छता और दृश्य संतुलन की निगरानी करेगी। घर केवल रहने की जगह नहीं, संस्कृति और सौंदर्य का प्रतीक बनेंगे।"
            },
            en: {
                title: "38. Aesthetic Home City",
                desc: "\"Aesthetic Home City Jaipur\" aims to harmonize beauty and utility. Traditional architecture will blend with modern housing. New colonies will coordinate colors and greenery. Area-wise \"Beauty Committees\" will monitor visual balance. Homes will become symbols of culture and beauty, not just living spaces."
            }
        },
        {
            id: 39,
            icon: Building,
            hi: {
                title: "39. स्काईलाइन सिटी (Skyline City)",
                desc: "“स्काईलाइन सिटी जयपुर” योजना का लक्ष्य है — ऊर्ध्व विकास के साथ सौंदर्य और सुरक्षा का संरक्षण। ऊँची इमारतें जयपुर की विरासत छवि को बिगाड़ें नहीं, बल्कि उसे आधुनिक पहचान दें। भवन निर्माण कोड में सौंदर्य और भूकंपीय सुरक्षा अनिवार्य होगी। शहर के कुछ हिस्सों में “वर्टिकल गार्डन टॉवर्स” विकसित होंगे। ऊँचाई और क्षितिज का संतुलन जयपुर को आधुनिकता और परंपरा के बीच सेतु बनाएगा।"
            },
            en: {
                title: "39. Skyline City",
                desc: "\"Skyline City Jaipur\" aims for vertical growth while preserving beauty. High-rises should utilize modern identity without spoiling heritage. Aesthetic and seismic safety will be mandatory in building codes. \"Vertical Garden Towers\" will be developed. The skyline will bridge modernity and tradition."
            }
        },
        {
            id: 40,
            icon: Siren,
            hi: {
                title: "40. ट्रैफिक डिसिप्लिन सिटी (Traffic Discipline City)",
                desc: "जयपुर की सड़कों पर अनुशासन नया संस्कार बनेगा। “ट्रैफिक डिसिप्लिन सिटी जयपुर” योजना में इंटेलिजेंट ट्रैफिक मैनेजमेंट सिस्टम और लाइव कैमरा निगरानी शामिल होगी। स्कूली बच्चों से लेकर वयस्कों तक में सड़क सुरक्षा शिक्षा दी जाएगी। हर रविवार “नो हॉर्न डे” और “पैदल दिवस” मनाया जाएगा। यह योजना नागरिकों में अनुशासन, धैर्य और सहयोग की संस्कृति विकसित करेगी — जिससे सड़कों पर सुरक्षा और शांति दिखेगी।"
            },
            en: {
                title: "40. Traffic Discipline City",
                desc: "Road discipline will be a new culture in Jaipur. \"Traffic Discipline City\" includes Intelligent Traffic Management and live surveillance. Road safety education will be given to all. Sundays will be \"No Horn Days\". This plan fosters a culture of discipline and patience, ensuring safety on roads."
            }
        },
        {
            id: 41,
            icon: Briefcase,
            hi: {
                title: "41. इन्वेस्टर्स सिटी (Investors City)",
                desc: "“इन्वेस्टर्स सिटी जयपुर” का लक्ष्य है — जयपुर को भारत का सबसे विश्वसनीय निवेश गंतव्य बनाना। सरकार पारदर्शी नीतियाँ और सिंगल–विंडो क्लीयरेंस लागू करेगी। निवेशकों को सुरक्षा और दक्ष प्रशासन की गारंटी दी जाएगी। हर वर्ष “जयपुर ग्लोबल इन्वेस्टमेंट समिट” आयोजित होगा, जिससे जयपुर की पहचान “क्लीन, ग्रीन और बिज़नेस–फ्रेंडली सिटी” के रूप में सुदृढ़ होगी। जयपुर केवल निवेश का स्थान नहीं, विश्वास का प्रतीक बनेगा।"
            },
            en: {
                title: "41. Investors City",
                desc: "\"Investors City Jaipur\" aims to be India's most trusted investment destination. The government will implement transparent policies and single-window clearance. The annual \"Jaipur Global Investment Summit\" will reinforce Jaipur as a \"Clean, Green, and Business-Friendly City\". Jaipur will become a symbol of trust."
            }
        },
        {
            id: 42,
            icon: Palette,
            hi: {
                title: "42. पब्लिक आर्ट सिटी (Public Art City)",
                desc: "“पब्लिक आर्ट सिटी जयपुर” योजना से शहर स्वयं एक खुला कला संग्रहालय बनेगा। सड़कों और सार्वजनिक भवनों पर जयपुर की लोक कला और भित्ति–चित्र दिखाई देंगे। युवा कलाकारों के लिए “ओपन आर्ट ग्रांट” दी जाएगी। मेट्रो स्टेशन और पार्कों में थीम–आधारित कला प्रतिष्ठापन होंगे। हर वर्ष “जयपुर आर्ट कार्निवल” आयोजित किया जाएगा। यह योजना जयपुर को सौंदर्य और संस्कृति का जीवंत उदाहरण बनाएगी — “जहाँ दीवारें भी बोलती हैं।”"
            },
            en: {
                title: "42. Public Art City",
                desc: "\"Public Art City Jaipur\" will make the city an open art museum. Folk art and murals will adorn public buildings. An \"Open Art Grant\" will be given to young artists. The annual \"Jaipur Art Carnival\" will be held. This plan makes Jaipur a living example of beauty and culture—\"Where walls also speak.\""
            }
        },
        {
            id: 43,
            icon: Globe,
            hi: {
                title: "43. एसडीजी सिटी (SDG City)",
                desc: "“एसडीजी सिटी जयपुर” संयुक्त राष्ट्र के सतत विकास लक्ष्यों को स्थानीय स्तर पर लागू करने का मॉडल बनेगा। शिक्षा, स्वास्थ्य, ऊर्जा और लैंगिक समानता के लक्ष्य नगर योजना में शामिल किए जाएंगे। प्रत्येक वार्ड को ‘एसडीजी इंडेक्स’ पर रेट किया जाएगा। नागरिकों और उद्योगों को सामूहिक जिम्मेदारी सौंपी जाएगी। यह योजना जयपुर को “भविष्य–सुरक्षित शहर” बनाएगी — जहाँ विकास केवल भौतिक नहीं, नैतिक और पर्यावरणीय भी होगा।"
            },
            en: {
                title: "43. SDG City",
                desc: "\"SDG City Jaipur\" will be a model for implementing UN Sustainable Development Goals locally. Goals for education, health, and equality will be part of city planning. Each ward will be rated on an 'SDG Index'. This plan makes Jaipur a \"Future-Safe City\" where development is ethical and environmental."
            }
        },
        {
            id: 44,
            icon: Bus,
            hi: {
                title: "44. पब्लिक ट्रांसपोर्ट सिटी (Public Transport City)",
                desc: "“पब्लिक ट्रांसपोर्ट सिटी जयपुर” का उद्देश्य है — हर नागरिक को सुलभ, सस्ता और स्वच्छ आवागमन उपलब्ध कराना। मेट्रो, ई–बसें और साझा टैक्सी सेवाओं को एकीकृत किया जाएगा। स्मार्ट कार्ड प्रणाली लागू होगी। हर मोहल्ले से अंतिम मील कनेक्टिविटी सुनिश्चित की जाएगी। पैदल पथ और साइकिल ट्रैक को ट्रांसपोर्ट नेटवर्क से जोड़ा जाएगा। यह योजना जयपुर को ट्रैफिक–मुक्त, प्रदूषण–मुक्त और समय–सुरक्षित शहर बनाएगी।"
            },
            en: {
                title: "44. Public Transport City",
                desc: "\"Public Transport City Jaipur\" aims for accessible, cheap, and clean transport for all. Metro, E-buses, and shared taxis will be integrated. A Smart Card system will be applied. Last-mile connectivity will be ensured. This plan makes Jaipur a traffic-free, pollution-free, and time-saving city."
            }
        },
        {
            id: 45,
            icon: Moon,
            hi: {
                title: "45. नाईट लाइफ सिटी (Nightlife City)",
                desc: "जयपुर का रात्रि जीवन उसकी आधुनिकता का प्रतीक बनेगा। “नाईट लाइफ सिटी जयपुर” के अंतर्गत शहर में सुरक्षित नाइट मार्केट, कैफे और लाइव म्यूज़िक ज़ोन विकसित किए जाएंगे। परिवारों और पर्यटकों के लिए “24×7 जोन” बनाए जाएंगे। महिलाओं की सुरक्षा हेतु विशेष पुलिस gश्त रहेगी। यह पहल जयपुर की अर्थव्यवस्था को रात के समय भी गतिशील रखेगी — “सिटी दैट नेवर स्लीप्स, बट ऑलवेज शाइन्स।”"
            },
            en: {
                title: "45. Nightlife City",
                desc: "Jaipur's nightlife will symbolize its modernity. Safe Night Markets, cafes, and Live Music Zones will be developed under \"Nightlife City Jaipur\". \"24×7 Zones\" will be created for families. Special police patrols will ensure women's safety. This keeps Jaipur's economy dynamic at night—\"City that never sleeps, but always shines.\""
            }
        },
        {
            id: 46,
            icon: Gift,
            hi: {
                title: "46. डेस्टिनेशन वेडिंग सिटी (Destination Wedding City)",
                desc: "“डेस्टिनेशन वेडिंग सिटी जयपुर” इसे विश्व स्तर पर एक ब्रांड बनाएगी। महलों, हवेलियों और हेरिटेज होटलों को विवाह पर्यटन के लिए संरक्षित किया जाएगा। विवाह आयोजन उद्योग को मानकीकरण दिया जाएगा। “जयपुर वेडिंग फेयर” अंतरराष्ट्रीय आयोजन बनेगा। यह पहल लाखों लोगों के लिए रोजगार और जयपुर के लिए नई पहचान लाएगी — “जहाँ हर शादी एक महोत्सव है।”"
            },
            en: {
                title: "46. Destination Wedding City",
                desc: "\"Destination Wedding City Jaipur\" will make it a global brand. Palaces and heritage hotels will be preserved for wedding tourism. The wedding industry will be standardized. The \"Jaipur Wedding Fair\" will be an international event. This brings jobs and a new identity—\"Where every wedding is a festival.\""
            }
        },
        {
            id: 47,
            icon: Handshake,
            hi: {
                title: "47. हार्मनी सिटी (Harmony City)",
                desc: "“हार्मनी सिटी जयपुर” का उद्देश्य है — ऐसा शहर बनाना जहाँ जाति, धर्म या भाषा की दीवारें न हों। यहाँ विविधता ही एकता बनेगी। स्कूलों में “सांप्रदायिक सद्भाव कार्यक्रम” चलाए जाएंगे। वार्षिक “एकता उत्सव” जयपुर की पहचान बनेगा। नागरिकों को “पीस वालंटियर” के रूप में प्रशिक्षित किया जाएगा। जयपुर केवल गुलाबी रंग से नहीं, बल्कि सौहार्द के सातों रंगों से सजेगा।"
            },
            en: {
                title: "47. Harmony City",
                desc: "\"Harmony City Jaipur\" aims for a city without walls of caste or religion. Diversity will be unity. \"Communal Harmony Programs\" will run in schools. The annual \"Unity Festival\" will be Jaipur's identity. Citizens will be trained as \"Peace Volunteers\". Jaipur will be adorned with the seven colors of harmony."
            }
        },
        {
            id: 48,
            icon: Calendar,
            hi: {
                title: "48. गुड इवेंट सिटी (Good Event City)",
                desc: "“गुड इवेंट सिटी जयपुर” का अर्थ है — ऐसा शहर जहाँ हर आयोजन जन–सहभागी और अनुशासित हो। आयोजनों को सुचारु रूप से संपन्न कराने के लिए “इवेंट मैनेजमेंट अथॉरिटी” बनेगी। पार्क और ऑडिटोरियमों को पेशेवर इवेंट ज़ोन के रूप में विकसित किया जाएगा। युवाओं को इवेंट प्रबंधन में प्रशिक्षण मिलेगा। जयपुर बड़े आयोजनों का विश्वसनीय स्थल बनेगा — “जहाँ हर आयोजन अवसर बने, अव्यवस्था नहीं।”"
            },
            en: {
                title: "48. Good Event City",
                desc: "\"Good Event City Jaipur\" means every event is participatory and disciplined. An \"Event Management Authority\" will ensure smooth execution. Parks will be developed as professional event zones. Youth will be trained in event management. Jaipur will be a trusted venue—\"Where every event is an opportunity, not chaos.\""
            }
        },
        {
            id: 49,
            icon: FileText,
            hi: {
                title: "49. गुड गवर्नेंस सिटी (Good Governance City)",
                desc: "“गुड गवर्नेंस सिटी जयपुर” नागरिक–केंद्रित प्रशासन की दिशा में क्रांति लाएगी। पारदर्शिता और जवाबदेही पर आधारित ई–गवर्नेंस प्रणाली विकसित होगी। प्रत्येक नागरिक को अपने क्षेत्र के कार्यों की जानकारी और शिकायत निवारण की डिजिटल सुविधा मिलेगी। जनसुनवाई से जनता का विश्वास बढ़ेगा। जयपुर शासन के क्षेत्र में “ईमानदारी और नवाचार” का आदर्श बनेगा — “जनता के साथ शासन।”"
            },
            en: {
                title: "49. Good Governance City",
                desc: "\"Good Governance City Jaipur\" will revolutionize citizen-centric administration. Transparent e-governance systems will be developed. Citizens will get digital facilities for information and grievance redressal. Public hearings will boost trust. Jaipur will be a model of \"Honesty and Innovation\" in governance."
            }
        },
        {
            id: 50,
            icon: Sparkles,
            hi: {
                title: "50. प्रोस्पेरस सिटी (Prosperous City)",
                desc: "“प्रोस्पेरस सिटी जयपुर” सभी विचारों का अंतिम लक्ष्य है — एक ऐसा शहर जो आर्थिक, सामाजिक और आध्यात्मिक रूप से समृद्ध हो। जहाँ हर व्यक्ति के पास अवसर हो और हर परिवार के पास सुरक्षा। जयपुर का विकास केवल इमारतों का नहीं, बल्कि मानवीय मूल्यों का विकास होगा। यह शहर अपने अतीत की गरिमा और भविष्य की संभावनाओं को साथ लेकर आगे बढ़ेगा। “जयपुर 2040” — भारत का गर्व, विश्व का उदाहरण।"
            },
            en: {
                title: "50. Prosperous City",
                desc: "\"Prosperous City Jaipur\" is the ultimate goal—a city prosperous economically, socially, and spiritually. Where everyone has opportunity and security. Development will be of human values, not just buildings. This city will move forward with past dignity and future potential. \"Jaipur 2040\"—India's Pride, World's Example."
            }
        }
    ];

    // Helper to get current language content
    const getPointContent = (point: any) => {
        return language === 'hi' ? point.hi : point.en;
    };

    const getCityImage = (id: number) => {
        const images = [
            "/herosection/1.png", "/herosection/4.jpg", "/herosection/7.jpg", "/herosection/8.jpg",
            "/herosection/9.jpg", "/herosection/10.jpg", "/herosection/team.jpg", "/news1.svg",
            "/news2.svg", "/news3.svg", "/news4.svg", "/news5.svg",
            // Remaining 38 points with unique party images
            "/party-images/DSC_0006.JPG", "/party-images/DSC_0007.JPG", "/party-images/DSC_0008.JPG",
            "/party-images/DSC_0009.JPG", "/party-images/DSC_0014.JPG", "/party-images/DSC_0019.JPG",
            "/party-images/DSC_0020.JPG", "/party-images/DSC_0023.JPG", "/party-images/DSC_0024.JPG",
            "/party-images/DSC_0030.JPG", "/party-images/DSC_0031.JPG", "/party-images/DSC_0035.JPG",
            "/party-images/DSC_0037.JPG", "/party-images/DSC_0038.JPG", "/party-images/DSC_0039.JPG",
            "/party-images/DSC_0040.JPG", "/party-images/DSC_0041.JPG", "/party-images/DSC_0042.JPG",
            "/party-images/DSC_0043.JPG", "/party-images/DSC_0044.JPG", "/party-images/DSC_0045.JPG",
            "/party-images/DSC_0046.JPG", "/party-images/DSC_0047.JPG", "/party-images/DSC_0048.JPG",
            "/party-images/DSC_0056.JPG", "/party-images/DSC_0057.JPG", "/party-images/DSC_0059.JPG",
            "/party-images/DSC_0060.JPG", "/party-images/DSC_0061.JPG", "/party-images/DSC_0062.JPG",
            "/party-images/DSC_0063.JPG", "/party-images/DSC_0064.JPG", "/party-images/DSC_0067.JPG",
            "/party-images/DSC_0068.JPG", "/party-images/DSC_0072.JPG", "/party-images/DSC_0073.JPG",
            "/party-images/DSC_0074.JPG", "/party-images/DSC_0076.JPG"
        ];
        return images[(id - 1) % images.length];
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Navbar />

            <main className="pt-32 lg:pt-40 pb-20 px-4 md:px-8 max-w-[1320px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-['Familjen_Grotesk'] font-bold text-4xl md:text-6xl text-[#0D5229] mb-4">
                        {language === 'hi' ? 'जयपुर विजन 2040' : 'JAIPUR VISION 2040'}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#0D5229] font-medium max-w-none mx-auto whitespace-nowrap lg:whitespace-normal">
                        {language === 'hi'
                            ? 'पिंक सिटी को स्थिरता, संस्कृति और नवाचार के वैश्विक मॉडल में बदलने के लिए 50-सूत्रीय खाका।'
                            : 'A 50-point blueprint to transform The Pink City into a global model of sustainability, culture, and innovation.'}
                    </p>
                </div>

                {/* Categories / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visionPoints.map((point) => {
                        const Icon = point.icon;
                        const content = getPointContent(point);

                        return (
                            <div
                                key={point.id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group h-full"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <img
                                        src={getCityImage(point.id)}
                                        alt={content.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col gap-3">
                                    <h3 className="font-['Familjen_Grotesk'] font-bold text-xl leading-tight text-gray-900 group-hover:text-[#0D5229] transition-colors">
                                        {content.title}
                                    </h3>
                                    <p className="text-gray-600 text-[15px] leading-relaxed text-justify">
                                        {content.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Join the Movement CTA */}
                <div className="mt-20 py-16 bg-[#0D5229] rounded-2xl text-center text-white px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/herosection/1.png')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
                        <h2 className="font-['Familjen_Grotesk'] font-bold text-3xl md:text-5xl uppercase tracking-wider">
                            {language === 'hi' ? 'आंदोलन से जुड़ें' : 'Join the Movement'}
                        </h2>
                        <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed">
                            {language === 'hi'
                                ? 'साथ मिलकर हम एक बेहतर, निष्पक्ष और समृद्ध भविष्य बना सकते हैं। आपकी आवाज़ मायने रखती है।'
                                : 'Together we can build a better, fairer, and more prosperous future. Your voice matters.'}
                        </p>
                        <a
                            href="/join"
                            className="mt-4 px-8 py-3 bg-white text-[#0D5229] font-bold rounded-full hover:bg-green-100 hover:scale-105 transition-all shadow-lg uppercase tracking-wide text-sm md:text-base"
                        >
                            {language === 'hi' ? 'आज ही शामिल हों' : 'Join Us Today'}
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
