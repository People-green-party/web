"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const VisionCarousel = ({ language }: { language: string }) => {

    // --- Data ---
    const visionPoints = [
        {
            id: 1,
            icon: Building2,
            hi: {
                title: "1. क्लीन सिटी (Clean City)",
                desc: "स्वच्छ जयपुर का लक्ष्य केवल सफाई नहीं, बल्कि नागरिक संस्कृति का पुनर्जागरण है। “क्लीन सिटी जयपुर” का उद्देश्य शहर को धूल, धुआँ और कचरे से मुक्त करना है।"
            },
            en: {
                title: "1. Clean City",
                desc: "The goal of a Clean Jaipur is not just cleanliness, but a renaissance of civic culture. \"Clean City Jaipur\" aims to free the city from dust, smoke, and waste."
            }
        },
        {
            id: 2,
            icon: MapPin,
            hi: {
                title: "2. हैरिटेज सिटी (Heritage City)",
                desc: "जयपुर विश्व धरोहर नगर है। पुरानी दीवारों, चौकियों, हवेलियों को संरक्षित किया जाएगा। हर हवेली में “लिविंग म्यूज़ियम” की अवधारणा लागू की जाएगी।"
            },
            en: {
                title: "2. Heritage City",
                desc: "Jaipur is a World Heritage City. Ancient walls, outposts, and havelis will be revitalized. A \"Living Museum\" concept will be applied in havelis."
            }
        },
        {
            id: 3,
            icon: Tent,
            hi: {
                title: "3. टूरिज्म सिटी (Tourism City)",
                desc: "नगर को 24×7 पर्यटक-अनुकूल शहर के रूप में विकसित किया जाएगा। हेरिटेज सर्किट, डेज़र्ट ट्रेल और फूड ट्रेल जैसे नए अनुभवपरक मार्ग तैयार होंगे।"
            },
            en: {
                title: "3. Tourism City",
                desc: "The city will be developed as a 24x7 tourist-friendly destination. Experiential routes like Heritage Circuits, Desert Trails, and Food Trails will be created."
            }
        },
        {
            id: 4,
            icon: Music,
            hi: {
                title: "4. फेस्टिवल सिटी (Festival City)",
                desc: "जयपुर को पूरे वर्ष जीवंत रखने के लिए हर माह किसी न किसी सांस्कृतिक, साहित्यिक या संगीत उत्सव का आयोजन होगा।"
            },
            en: {
                title: "4. Festival City",
                desc: "To keep Jaipur vibrant year-round, every month will feature a cultural, literary, or music festival. Jaipur will be—\"Every day a celebration.\""
            }
        },
        {
            id: 5,
            icon: ShoppingBag,
            hi: {
                title: "5. हस्तशिल्पी व हाट सिटी",
                desc: "शहर के हर कोने में हाट बाजार और डिज़ाइन क्लस्टर स्थापित किए जाएंगे। ग्रामीण कारीगरों को शहर के बाज़ारों से सीधे जोड़ने के लिए डिजिटल प्लेटफ़ॉर्म बनेगा।"
            },
            en: {
                title: "5. Handicraft & Haat City",
                desc: "Haat bazaars and design clusters will be established in every corner. A digital platform will connect rural artisans directly to city markets."
            }
        },
        {
            id: 6,
            icon: Palette,
            hi: {
                title: "6. आर्ट एंड कल्चर सिटी",
                desc: "हर वार्ड में “संस्कृति केंद्र” बनेगा। दीवारों पर भित्ति चित्र और सार्वजनिक स्थलों पर मूर्तियाँ होंगी। वार्षिक “जयपुर आर्ट वीक” शहर की पहचान बनेगा।"
            },
            en: {
                title: "6. Art & Culture City",
                desc: "A \"Culture Center\" will be built in every ward. Murals on walls and sculptures in public spaces. The annual \"Jaipur Art Week\" will become the city's identity."
            }
        },
        {
            id: 7,
            icon: Drama,
            hi: {
                title: "7. थियेटर सिटी (Theatre City)",
                desc: "हर ज़ोन में एक मिनी थिएटर और ओपन-एयर मंच विकसित किया जाएगा। जयपुर नाट्य महोत्सव जैसे आयोजन देश के शीर्ष मंचों में होंगे।"
            },
            en: {
                title: "7. Theatre City",
                desc: "A mini-theater and open-air stage will be developed in every zone. Events like the Jaipur Theatre Festival will be among the country's top platforms."
            }
        },
        {
            id: 8,
            icon: Film,
            hi: {
                title: "8. फ़िल्म सिटी (Film City)",
                desc: "एक संगठित फिल्म सिटी बनाई जाएगी जिसमें शूटिंग स्टूडियो और पोस्ट-प्रोडक्शन हाउस होंगे। यह स्थानीय युवाओं को रोजगार देगा और पर्यटन को बढ़ावा देगा।"
            },
            en: {
                title: "8. Film City",
                desc: "An organized Film City with shooting studios and post-production houses will be built. This will employ local youth and boost tourism."
            }
        },
        {
            id: 9,
            icon: Scissors,
            hi: {
                title: "9. फैशन सिटी (Fashion City)",
                desc: "पारंपरिक कला को आधुनिक फैशन डिज़ाइन से जोड़ा जाएगा। वार्षिक “जयपुर फैशन वीक” आयोजित किया जाएगा जिसमें स्थानीय डिजाइनर वैश्विक मंच पाएँगे।"
            },
            en: {
                title: "9. Fashion City",
                desc: "Traditional arts will merge with modern fashion design. An annual \"Jaipur Fashion Week\" will give local designers a global stage."
            }
        },
        {
            id: 10,
            icon: BookOpen,
            hi: {
                title: "10. लिटरेचर सिटी (Literature City)",
                desc: "जयपुर लिटरेचर फेस्टिवल को शहर के हर भाग तक पहुँचाया जाएगा। पुस्तकालयों का आधुनिकीकरण और सार्वजनिक पठन स्थल बनाए जाएँगे।"
            },
            en: {
                title: "10. Literature City",
                desc: "The Jaipur Literature Festival will reach every part of the city. Modernization of libraries and public reading spaces will be created."
            }
        },
        {
            id: 11,
            icon: Gem,
            hi: {
                title: "11. ज्वेलरी सिटी (Jewellery City)",
                desc: "शहर में अत्याधुनिक “जेम एंड ज्वेलरी पार्क” स्थापित किए जाएंगे। कारीगरों को तकनीकी प्रशिक्षण और वैश्विक विपणन सहायता मिलेगी।"
            },
            en: {
                title: "11. Jewellery City",
                desc: "\"Gem & Jewelry Parks\" will be established. Artisans will receive technical training and global marketing support."
            }
        },
        {
            id: 12,
            icon: GraduationCap,
            hi: {
                title: "12. नॉलेज सिटी (Knowledge City)",
                desc: "विश्वविद्यालयों और शोध संस्थानों को एक साझा नेटवर्क से जोड़ा जाएगा। शहर के हर क्षेत्र में “कम्युनिटी लर्निंग हब” स्थापित होंगे।"
            },
            en: {
                title: "12. Knowledge City",
                desc: "Universities and research institutes will be linked in a shared network. \"Community Learning Hubs\" will be established in every area."
            }
        },
        {
            id: 13,
            icon: Lightbulb,
            hi: {
                title: "13. इनोवेशन सिटी (Innovation City)",
                desc: "शहर में “इनोवेशन डिस्ट्रिक्ट्स” स्थापित होंगे। नागरिक जीवन की समस्याओं के समाधान स्थानीय नवाचारों से निकाले जाएँगे।"
            },
            en: {
                title: "13. Innovation City",
                desc: "\"Innovation Districts\" will be established. Solutions to civic problems will come from local innovations."
            }
        },
        {
            id: 14,
            icon: Rocket,
            hi: {
                title: "14. स्टार्टअप सिटी (Startup City)",
                desc: "इनक्यूबेशन सेंटर और सीड फंडिंग की सुविधा मिलेगी। जयपुर के युवाओं को “जॉब सीकर” से “जॉब क्रिएटर” बनाया जाएगा।"
            },
            en: {
                title: "14. Startup City",
                desc: "Incubation centers and seed funding will be provided. Transforming Jaipur's youth from \"Job Seekers\" to \"Job Creators\"."
            }
        },
        {
            id: 15,
            icon: ShieldCheck,
            hi: {
                title: "15. साइबर सिटी (Cyber City)",
                desc: "अत्याधुनिक आईटी पार्क और डेटा सेंटर विकसित किए जाएंगे। डिजिटल सुरक्षा और कृत्रिम बुद्धिमत्ता के लिए विशेष संस्थान खोले जाएंगे।"
            },
            en: {
                title: "15. Cyber City",
                desc: "IT parks and data centers will be developed. Specialized institutes for digital security and AI will open."
            }
        },
        {
            id: 16,
            icon: Wifi,
            hi: {
                title: "16. स्मार्ट सिटी (Smart City)",
                desc: "सेंसर आधारित सिस्टम से ट्रैफिक और ऊर्जा की निगरानी होगी। स्मार्ट लाइटिंग और ई-गवर्नेंस नागरिक सुविधाओं को सुगम बनाएंगे।"
            },
            en: {
                title: "16. Smart City",
                desc: "Sensor-based systems will monitor traffic and energy. Smart lighting and e-governance will ease civic amenities."
            }
        },
        {
            id: 17,
            icon: Leaf,
            hi: {
                title: "17. ग्रीन सिटी (Green City)",
                desc: "छतों पर बगीचे और वर्टिकल ग्रीन वॉल का विस्तार होगा। “एक पेड़–एक जिम्मेदारी” अभियान हर नागरिक के लिए चलेगा।"
            },
            en: {
                title: "17. Green City",
                desc: "Rooftop gardens and vertical green walls will expand. A \"One Tree–One Responsibility\" campaign will run for everyone."
            }
        },
        {
            id: 18,
            icon: Trees,
            hi: {
                title: "18. फॉरेस्ट सिटी (Forest City)",
                desc: "शहर की सीमा पर मियावाकी पद्धति से घने वन विकसित किए जाएंगे। हर नई कॉलोनी को “मिनी फॉरेस्ट” विकसित करने की जिम्मेदारी दी जाएगी।"
            },
            en: {
                title: "18. Forest City",
                desc: "Dense forests using the Miyawaki method will be developed. Every new colony will develop a \"Mini Forest\"."
            }
        },
        {
            id: 19,
            icon: Waves,
            hi: {
                title: "19. लेक व रिवरफ्रंट सिटी",
                desc: "द्रव्यवती नदी और झीलों को पुनर्जीवित किया जाएगा। किनारों पर जैव विविधता पार्क और साइकिल ट्रैक बनाए जाएँगे।"
            },
            en: {
                title: "19. Lake & Riverfront City",
                desc: "Water bodies like Dravyavati River will be revived. Biodiversity parks and cycle tracks will be built on banks."
            }
        },
        {
            id: 20,
            icon: Droplets,
            hi: {
                title: "20. वाटर रिचार्ज सिटी (Water Recharge City)",
                desc: "सभी भवनों में वर्षा जल संचयन अनिवार्य होगा। बावड़ियों का पुनर्जीवन किया जाएगा। हर बूंद भविष्य का निवेश होगी।"
            },
            en: {
                title: "20. Water Recharge City",
                desc: "Rainwater harvesting will be mandatory. Stepwells will be revived. Every drop is an investment in the future."
            }
        },
        {
            id: 21,
            icon: Sun,
            hi: {
                title: "21. सोलर सिटी (Solar City)",
                desc: "हर सरकारी भवन और स्कूल को सोलर पैनलों से जोड़ा जाएगा। सार्वजनिक स्थलों पर सौर–चालित स्ट्रीट लाइटें लगाई जाएंगी।"
            },
            en: {
                title: "21. Solar City",
                desc: "Every government building and school will be connected to solar panels. Solar-powered street lights in public places."
            }
        },
        {
            id: 22,
            icon: Sprout,
            hi: {
                title: "22. बायोडायवर्सिटी सिटी (Biodiversity City)",
                desc: "पार्कों और पहाड़ियों को जैव विविधता क्षेत्रों के रूप में विकसित किया जाएगा। विद्यालयों में “नेचर क्लब” चलेंगे।"
            },
            en: {
                title: "22. Biodiversity City",
                desc: "Parks and hills will be developed as biodiversity zones. \"Nature Clubs\" will run in schools."
            }
        },
        {
            id: 23,
            icon: Zap,
            hi: {
                title: "23. ईवी सिटी (EV City)",
                desc: "पेट्रोल/डीजल वाहनों को चरणबद्ध रूप से इलेक्ट्रिक वाहनों में बदला जाएगा। सोलर–पावर्ड चार्जिंग स्टेशन स्थापित होंगे।"
            },
            en: {
                title: "23. EV City",
                desc: "Petrol/diesel vehicles will be phased out for EVs. Solar-powered charging stations will be installed."
            }
        },
        {
            id: 24,
            icon: Recycle,
            hi: {
                title: "24. वेस्ट मैनेजमेंट सिटी (Waste Management City)",
                desc: "कचरे का पृथक्करण अनिवार्य होगा। “जीरो वेस्ट मार्केट” की अवधारणा लागू होगी जहाँ अपशिष्ट बाहर नहीं जाएगा।"
            },
            en: {
                title: "24. Waste Management City",
                desc: "Segregation will be mandatory. \"Zero Waste Market\" concept will be applied."
            }
        },
        {
            id: 25,
            icon: Bike,
            hi: {
                title: "25. साइकिल सिटी (Cycle City)",
                desc: "साइकिल ट्रैक और किराए पर साइकिल सेवाएँ शुरू की जाएँगी। नागरिकों को सप्ताह में एक दिन वाहन मुक्त चलने के लिए प्रेरित किया जाएगा।"
            },
            en: {
                title: "25. Cycle City",
                desc: "Cycle tracks and rental services will start. Citizens encouraged to go vehicle-free once a week."
            }
        },
        {
            id: 26,
            icon: Stethoscope,
            hi: {
                title: "26. मेडिकल हेल्थ सिटी (Medical Health City)",
                desc: "एक “मेडिकल रिसर्च पार्क” स्थापित होगा। प्रत्येक नागरिक के लिए डिजिटल हेल्थ आईडी बनाई जाएगी।"
            },
            en: {
                title: "26. Medical Health City",
                desc: "A \"Medical Research Park\" will be established. A Digital Health ID will be created for everyone."
            }
        },
        {
            id: 27,
            icon: Flower,
            hi: {
                title: "27. वेलनेस योगा सिटी (Wellness City)",
                desc: "पार्कों में योग प्लेटफॉर्म और ध्यान केंद्र बनाए जाएंगे। अस्पतालों में वैकल्पिक चिकित्सा विभाग खोले जाएंगे।"
            },
            en: {
                title: "27. Wellness & Yoga City",
                desc: "Yoga platforms and meditation centers in parks. Alternative medicine departments in hospitals."
            }
        },
        {
            id: 28,
            icon: Landmark,
            hi: {
                title: "28. टेम्पल सिटी (Temple City)",
                desc: "प्रमुख मंदिरों को “पवित्र परिक्रमा मार्ग” से जोड़ा जाएगा। स्थलों के आस–पास स्वच्छता और यातायात सुधारे जाएंगे।"
            },
            en: {
                title: "28. Temple City",
                desc: "Major temples linked by a \"Sacred Parikrama Route\". Cleanliness and traffic around sites will improve."
            }
        },
        {
            id: 29,
            icon: Dumbbell,
            hi: {
                title: "29. फिटनेस सिटी (Fitness City)",
                desc: "प्रत्येक वार्ड में ओपन जिम और रनिंग ट्रैक बनाए जाएंगे। स्कूलों और दफ्तरों में “हेल्दी आवर” लागू होगा।"
            },
            en: {
                title: "29. Fitness City",
                desc: "Open gyms and running tracks in every ward. \"Healthy Hour\" implemented in schools and offices."
            }
        },
        {
            id: 30,
            icon: Trophy,
            hi: {
                title: "30. स्पोर्ट्स सिटी (Sports City)",
                desc: "बहुउद्देशीय खेल कॉम्प्लेक्स और स्टेडियम बनाए जाएंगे। स्कूल स्तर पर “एक छात्र–एक खेल” योजना लागू होगी।"
            },
            en: {
                title: "30. Sports City",
                desc: "Multipurpose sports complexes and stadiums will be built. \"One Student-One Sport\" scheme in schools."
            }
        },
        {
            id: 31,
            icon: Award,
            hi: {
                title: "31. वेटरन सिटी (Veteran City)",
                desc: "शहर में “वेटरन विलेज” बसाया जाएगा। सेवानिवृत्त सैनिकों को युवाओं के कौशल प्रशिक्षण में जोड़ा जाएगा।"
            },
            en: {
                title: "31. Veteran City",
                desc: "A \"Veteran Village\" will be established. Retired soldiers will be involved in youth training."
            }
        },
        {
            id: 32,
            icon: Users,
            hi: {
                title: "32. वूमेन सिटी (Women City)",
                desc: "प्रत्येक वार्ड में “महिला सुविधा केंद्र” खोले जाएंगे। महिला उद्यमियों के लिए विशेष आर्थिक क्षेत्र बनाए जाएंगे।"
            },
            en: {
                title: "32. Women City",
                desc: "\"Women Facility Centers\" in every ward. Special economic zones for women entrepreneurs."
            }
        },
        {
            id: 33,
            icon: Accessibility,
            hi: {
                title: "33. इंक्लूसिव सिटी (Inclusive City)",
                desc: "सार्वजनिक भवनों में समावेशी डिज़ाइन अनिवार्य होंगे। सभी के लिए समान अवसर सुनिश्चित होंगे।"
            },
            en: {
                title: "33. Inclusive City",
                desc: "Inclusive designs mandatory in public buildings. Equal opportunities ensured for all."
            }
        },
        {
            id: 34,
            icon: Home,
            hi: {
                title: "34. अफोर्डेबल हाउसिंग सिटी",
                desc: "किफ़ायती आवास परियोजनाएँ विकसित की जाएँगी। किराए पर रहने वालों के लिए “रेंट–टू–ओन” मॉडल लागू होगा।"
            },
            en: {
                title: "34. Affordable Housing City",
                desc: "Affordable housing projects will be developed. \"Rent-to-Own\" model for tenants."
            }
        },
        {
            id: 35,
            icon: Smile,
            hi: {
                title: "35. चिल्ड्रेन सिटी (Children City)",
                desc: "“बाल उद्यान” और “क्रिएटिव लर्निंग ज़ोन” विकसित होंगे। स्कूलों के बाहर “प्ले–स्ट्रीट्स” बनाई जाएँगी।"
            },
            en: {
                title: "35. Children City",
                desc: "\"Child Gardens\" and \"Creative Learning Zones\" will be developed. \"Play-Streets\" outside schools."
            }
        },
        {
            id: 36,
            icon: Factory,
            hi: {
                title: "36. इंडस्ट्री सिटी (Industry City)",
                desc: "नए औद्योगिक क्षेत्र स्मार्ट अवसंरचना पर आधारित होंगे। “मेक इन जयपुर” अभियान के तहत स्थानीय उद्योग विकसित होंगे।"
            },
            en: {
                title: "36. Industry City",
                desc: "New industrial zones based on smart infrastructure. \"Make in Jaipur\" will develop local industries."
            }
        },
        {
            id: 37,
            icon: Utensils,
            hi: {
                title: "37. फ़ूड क्यूलिनेरी सिटी",
                desc: "“राजस्थानी फूड स्ट्रीट” और “ऑर्गेनिक फूड मार्केट” बनाए जाएंगे। स्थानीय व्यंजन को विश्व स्तर पर प्रचारित किया जाएगा।"
            },
            en: {
                title: "37. Food & Culinary City",
                desc: "\"Rajasthani Food Streets\" and organic markets will be built. Local cuisine promoted globally."
            }
        },
        {
            id: 38,
            icon: Paintbrush,
            hi: {
                title: "38. एस्थेटिक होम सिटी",
                desc: "पारंपरिक स्थापत्य शैली को आधुनिक वास्तुकला से जोड़ा जाएगा। प्रत्येक क्षेत्र में “सौंदर्य समिति” बनेगी।"
            },
            en: {
                title: "38. Aesthetic Home City",
                desc: "Traditional architecture will blend with modern housing. Area-wise \"Beauty Committees\" will form."
            }
        },
        {
            id: 39,
            icon: Building,
            hi: {
                title: "39. स्काईलाइन सिटी (Skyline City)",
                desc: "भवन निर्माण कोड में सौंदर्य और भूकंपीय सुरक्षा अनिवार्य होगी। “वर्टिकल गार्डन टॉवर्स” विकसित होंगे।"
            },
            en: {
                title: "39. Skyline City",
                desc: "Aesthetic and seismic safety mandatory in codes. \"Vertical Garden Towers\" will be developed."
            }
        },
        {
            id: 40,
            icon: Siren,
            hi: {
                title: "40. ट्रैफिक डिसिप्लिन सिटी",
                desc: "इंटेलिजेंट ट्रैफिक मैनेजमेंट सिस्टम लागू होगा। हर रविवार “नो हॉर्न डे” और “पैदल दिवस” मनाया जाएगा।"
            },
            en: {
                title: "40. Traffic Discipline City",
                desc: "Intelligent Traffic Management System applied. Sundays will be \"No Horn Days\"."
            }
        },
        {
            id: 41,
            icon: Briefcase,
            hi: {
                title: "41. इन्वेस्टर्स सिटी (Investors City)",
                desc: "सरकार पारदर्शी नीतियाँ और सिंगल–विंडो क्लीयरेंस लागू करेगी। “जयपुर ग्लोबल इन्वेस्टमेंट समिट” आयोजित होगा।"
            },
            en: {
                title: "41. Investors City",
                desc: "Transparent policies and single-window clearance. \"Jaipur Global Investment Summit\" will be held."
            }
        },
        {
            id: 42,
            icon: Palette,
            hi: {
                title: "42. पब्लिक आर्ट सिटी (Public Art City)",
                desc: "सड़कों और भवनों पर लोक कला दिखाई देगी। युवा कलाकारों के लिए “ओपन आर्ट ग्रांट” दी जाएगी।"
            },
            en: {
                title: "42. Public Art City",
                desc: "Folk art will adorn streets and buildings. \"Open Art Grant\" for young artists."
            }
        },
        {
            id: 43,
            icon: Globe,
            hi: {
                title: "43. एसडीजी सिटी (SDG City)",
                desc: "सतत विकास लक्ष्यों को स्थानीय स्तर पर लागू किया जाएगा। प्रत्येक वार्ड को ‘एसडीजी इंडेक्स’ पर रेट किया जाएगा।"
            },
            en: {
                title: "43. SDG City",
                desc: "SDGs will be implemented locally. Each ward will be rated on an 'SDG Index'."
            }
        },
        {
            id: 44,
            icon: Bus,
            hi: {
                title: "44. पब्लिक ट्रांसपोर्ट सिटी",
                desc: "मेट्रो, ई–बसें और साझा टैक्सी सेवाओं को एकीकृत किया जाएगा। हर मोहल्ले से अंतिम मील कनेक्टिविटी सुनिश्चित होगी।"
            },
            en: {
                title: "44. Public Transport City",
                desc: "Metro, E-buses, and shared taxis integrated. Last-mile connectivity ensured from every neighborhood."
            }
        },
        {
            id: 45,
            icon: Moon,
            hi: {
                title: "45. नाईट लाइफ सिटी (Nightlife City)",
                desc: "सुरक्षित नाइट मार्केट और लाइव म्यूज़िक ज़ोन विकसित किए जाएंगे। परिवारों के लिए “24×7 जोन” बनाए जाएंगे।"
            },
            en: {
                title: "45. Nightlife City",
                desc: "Safe Night Markets and Live Music Zones developed. \"24x7 Zones\" created for families."
            }
        },
        {
            id: 46,
            icon: Gift,
            hi: {
                title: "46. डेस्टिनेशन वेडिंग सिटी",
                desc: "महलों और हवेलियों को विवाह पर्यटन के लिए संरक्षित किया जाएगा। “जयपुर वेडिंग फेयर” अंतरराष्ट्रीय आयोजन बनेगा।"
            },
            en: {
                title: "46. Destination Wedding City",
                desc: "Palaces and havelis preserved for wedding tourism. \"Jaipur Wedding Fair\" will be an international event."
            }
        },
        {
            id: 47,
            icon: Handshake,
            hi: {
                title: "47. हार्मनी सिटी (Harmony City)",
                desc: "विविधता ही एकता बनेगी। स्कूलों में “सांप्रदायिक सद्भाव कार्यक्रम” चलाए जाएंगे। वार्षिक “एकता उत्सव” मनाया जाएगा।"
            },
            en: {
                title: "47. Harmony City",
                desc: "Diversity will be unity. \"Communal Harmony Programs\" in schools. Annual \"Unity Festival\" held."
            }
        },
        {
            id: 48,
            icon: Calendar,
            hi: {
                title: "48. गुड इवेंट सिटी (Good Event City)",
                desc: "आयोजनों के लिए “इवेंट मैनेजमेंट अथॉरिटी” बनेगी। पार्क और ऑडिटोरियमों को पेशेवर इवेंट ज़ोन बनाया जाएगा।"
            },
            en: {
                title: "48. Good Event City",
                desc: "An \"Event Management Authority\" will be formed. Parks developed as professional event zones."
            }
        },
        {
            id: 49,
            icon: FileText,
            hi: {
                title: "49. गुड गवर्नेंस सिटी",
                desc: "पारदर्शिता पर आधारित ई–गवर्नेंस प्रणाली विकसित होगी। नागरिक को शिकायत निवारण की डिजिटल सुविधा मिलेगी।"
            },
            en: {
                title: "49. Good Governance City",
                desc: "Transparent e-governance systems developed. Digital grievance redressal for citizens."
            }
        },
        {
            id: 50,
            icon: Sparkles,
            hi: {
                title: "50. प्रोस्पेरस सिटी (Prosperous City)",
                desc: "एक ऐसा शहर जो आर्थिक, सामाजिक और आध्यात्मिक रूप से समृद्ध हो। “जयपुर 2040” — भारत का गर्व, विश्व का उदाहरण।"
            },
            en: {
                title: "50. Prosperous City",
                desc: "A city prosperous economically, socially, and spiritually. \"Jaipur 2040\"—India's Pride, World's Example."
            }
        }
    ];

    const getCityImage = (id: number) => {
        return `/vision/${((id - 1) % 50) + 1}.png`;
    };

    // Card component
    const VisionCard = ({ point, isActive, isSide }: { point: any, isActive: boolean, isSide: boolean }) => {
        const Icon = point.icon;
        const content = language === 'hi' ? point.hi : point.en;

        return (
            <div
                className={`
                    relative rounded-3xl bg-white border border-[#E4F2EA] flex flex-col justify-start overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                    ${isActive
                        ? 'w-[320px] md:w-[400px] h-[500px] shadow-[0px_20px_50px_-10px_rgba(13,82,41,0.3)] border-[#0D5229]'
                        : 'w-[300px] md:w-[350px] h-[450px] shadow-lg opacity-90 grayscale-0'}
                `}
            >
                {/* Image Area */}
                <div className={`
                    w-full h-[220px] shrink-0 flex items-center justify-center relative overflow-hidden group
                    ${isActive ? 'bg-[#EAF7EE]' : 'bg-gray-100'}
                `}>
                    {/* Real Image Background */}
                    <Image
                        src={getCityImage(point.id)}
                        alt={content.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className={`absolute inset-0 object-cover transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-110'}`}
                        priority={point.id <= 3}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${isActive ? 'opacity-80' : 'opacity-40'}`}></div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center text-center p-6 pt-2 h-full">
                    <h3 className={`font-['Familjen_Grotesk'] font-bold leading-tight transition-colors duration-300 mb-2 ${isActive ? 'text-[24px] text-[#0D5229]' : 'text-[20px] text-gray-700'}`}>
                        {content.title}
                    </h3>

                    <p className={`font-['Familjen_Grotesk'] font-medium text-center line-clamp-3 leading-relaxed transition-colors duration-300 mb-4 ${isActive ? 'text-[16px] text-[#587E67]' : 'text-[14px] text-gray-500'}`}>
                        {content.desc}
                    </p>

                    {/* Button */}
                    <div className={`mt-auto transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <Link
                            href="/vision/jaipur-2040"
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#0D5229] hover:bg-[#04330B] text-white font-['Familjen_Grotesk'] font-semibold text-sm transition-colors shadow-lg shadow-green-900/20"
                        >
                            {language === 'hi' ? 'विस्तार से पढ़ें' : 'Read More'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const [activeIndex, setActiveIndex] = useState(visionPoints.length * 100);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (autoplayTimeoutRef.current) {
                clearTimeout(autoplayTimeoutRef.current);
            }
        };
    }, []);

    const handleNext = () => setActiveIndex(prev => prev + 1);
    const handlePrev = () => setActiveIndex(prev => prev - 1);

    const triggerAutoplayPause = () => {
        setIsAutoPlaying(false);
        if (autoplayTimeoutRef.current) {
            clearTimeout(autoplayTimeoutRef.current);
        }
        autoplayTimeoutRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 5000);
    };

    const handleUserNext = () => {
        handleNext();
        triggerAutoplayPause();
    };

    const handleUserPrev = () => {
        handlePrev();
        triggerAutoplayPause();
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        if (autoplayTimeoutRef.current) {
            clearTimeout(autoplayTimeoutRef.current);
            autoplayTimeoutRef.current = null;
        }
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false);
    };
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (touchStart && touchEnd) {
            const dist = touchStart - touchEnd;
            if (dist > 50) handleNext();
            else if (dist < -50) handlePrev();
        }
        
        setTouchStart(null);
        setTouchEnd(null);
        triggerAutoplayPause();
    };

    const onMouseEnter = () => {
        setIsAutoPlaying(false);
        if (autoplayTimeoutRef.current) {
            clearTimeout(autoplayTimeoutRef.current);
            autoplayTimeoutRef.current = null;
        }
    };

    const onMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(handleNext, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <section className="relative z-10 bg-white w-full flex flex-col items-center pt-[30px] lg:pt-[50px] pb-[60px] lg:pb-[100px] overflow-hidden">
            <div className="text-center mb-12 px-4">
                <ScrollReveal animation="fade-up" duration={800}>
                    <h2 className="font-['Familjen_Grotesk'] font-bold text-[24px] md:text-[32px] lg:text-[48px] leading-tight text-[#04330B] mb-4 uppercase max-w-4xl mx-auto">
                        {language === 'hi' ? 'विजन जयपुर 2040' : 'VISION JAIPUR 2040'}
                    </h2>
                </ScrollReveal>
                <ScrollReveal animation="fade-up" duration={800} delay={200}>
                    <p className="font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[20px] text-[#587E67] max-w-3xl mx-auto">
                        {language === 'hi' ? 'गुलाबी नगरी को बदलने के लिए 50 विचार' : '50 IDEAS TO TRANSFORM THE PINK CITY'}
                    </p>
                </ScrollReveal>
            </div>

            <div 
                className="relative w-full max-w-[1700px] flex items-center justify-center h-[550px]"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Navigation Buttons (Desktop) */}
                <button
                    onClick={handleUserPrev}
                    className="hidden lg:flex absolute left-8 z-40 w-12 h-12 bg-white/80 border border-gray-200 rounded-full items-center justify-center text-[#0D5229] hover:bg-[#0D5229] hover:text-white transition-all shadow-lg hover:scale-110"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={handleUserNext}
                    className="hidden lg:flex absolute right-8 z-40 w-12 h-12 bg-white/80 border border-gray-200 rounded-full items-center justify-center text-[#0D5229] hover:bg-[#0D5229] hover:text-white transition-all shadow-lg hover:scale-110"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Cards Track (Absolute Layout) */}
                <div
                    className="flex items-center justify-center w-full perspective-1000 select-none h-full"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onTouchCancel={onTouchEnd}
                >
                    {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offset) => {
                        const index = ((activeIndex + offset) % visionPoints.length + visionPoints.length) % visionPoints.length;
                        const point = visionPoints[index];
                        const isActive = offset === 0;

                        let translateX = '0%';
                        let zIndex = 30;
                        let opacity = 1;
                        let scale = 1;

                        if (offset === 0) {
                            translateX = '0%';
                            zIndex = 50;
                            scale = 1;
                        } else if (Math.abs(offset) === 1) {
                            translateX = offset > 0 ? '55%' : '-55%';
                            zIndex = 40;
                            scale = 0.9;
                            opacity = 0.95;
                        } else if (Math.abs(offset) === 2) {
                            translateX = offset > 0 ? '95%' : '-95%';
                            zIndex = 30;
                            scale = 0.8;
                            opacity = 0.85;
                        } else if (Math.abs(offset) === 3) {
                            translateX = offset > 0 ? '130%' : '-130%';
                            zIndex = 20;
                            scale = 0.7;
                            opacity = 0.5;
                        } else if (Math.abs(offset) === 4) {
                            translateX = offset > 0 ? '160%' : '-160%';
                            zIndex = 10;
                            scale = 0.6;
                            opacity = 0.2;
                        }

                        return (
                            <div
                                key={`${point.id}-${activeIndex + offset}`}
                                className="absolute cursor-pointer"
                                style={{
                                    transition: 'transform 800ms cubic-bezier(0.25, 1, 0.5, 1), opacity 800ms cubic-bezier(0.25, 1, 0.5, 1)',
                                    transform: `translate3d(${isMobile ? offset * 110 + '%' : translateX}, 0, 0) scale(${scale})`,
                                    willChange: 'transform',
                                    zIndex: zIndex,
                                    opacity: opacity,
                                    pointerEvents: 'auto'
                                }}
                                onClick={() => {
                                    if (!isActive) {
                                        setActiveIndex(activeIndex + offset);
                                        triggerAutoplayPause();
                                    }
                                }}
                            >
                                <VisionCard point={point} isActive={isActive} isSide={offset !== 0} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default VisionCarousel;
