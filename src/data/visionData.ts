export interface VisionCard {
    id: string;
    link: string;
    image: string;
    en: {
        title: string;
        desc: string;
    };
    hi: {
        title: string;
        desc: string;
    };
}

export const visionCards: VisionCard[] = [
    {
        id: "entrepreneurship",
        link: "/vision/entrepreneurship",
        image: "/herosection/2.png",
        en: {
            title: "Green Swaraj (Entrepreneurship Mission)",
            desc: "Not just jobs, but creating opportunities. Every youth an entrepreneur, every panchayat a development hub.",
        },
        hi: {
            title: "ग्रीन स्वराज (आन्त्रेप्रेन्योर मिशन)",
            desc: "नौकरी नहीं, अवसर पैदा करेंगे हर युवा बनेगा उद्यमी, हर पंचायत बनेगी विकास केंद्र",
        },
    },
    {
        id: "farming",
        link: "/vision/farming",
        image: "/herosection/5.jpg",
        en: {
            title: "New Farming – Capable Farmer",
            desc: "Less water • More production • Prosperous farmer. Transforming farming into a dignified, profitable profession.",
        },
        hi: {
            title: "नई खेती – समर्थ किसान",
            desc: "कम पानी • ज़्यादा उत्पादन • समृद्ध किसान खेती को घाटे से निकालकर सम्मानजनक व्यवसाय बनाएँ",
        },
    },
    {
        id: "empowerment",
        link: "/vision/empowerment",
        image: "/herosection/9.jpg",
        en: {
            title: "Empowerment of Every Section of Society",
            desc: "Equality is not just a promise, it's a system. Women, Dalits, and vulnerable groups at the center of power.",
        },
        hi: {
            title: "समाज के हर वर्ग का सशक्तिकरण",
            desc: "बराबरी सिर्फ़ वादा नहीं, व्यवस्था होगी महिला, दलित और कमजोर वर्ग — शक्ति के केंद्र में ",
        },
    },
    {
        id: "urban-rural",
        link: "/vision/urban-rural",
        image: "/herosection/1.png",
        en: {
            title: "Holistic Urban-Rural Development",
            desc: "Progress where you are born. Decentralization of development, putting a stop to migration.",
        },
        hi: {
            title: "शहरी–ग्रामीण समग्र विकास",
            desc: "जहाँ पैदा हुए, वहीं प्रगति हो विकास का विकेंद्रीकरण, पलायन पर विराम",
        },
    },
    {
        id: "civil-liberties",
        link: "/vision/civil-liberties",
        image: "/herosection/6.jpg",
        en: {
            title: "Civil Liberties, Duties, and Cultural Awareness",
            desc: "Freedom is both a right and a responsibility. Building a sensitive, tolerant, and aware India.",
        },
        hi: {
            title: "नागरिक स्वतंत्रता, कर्तव्य और सांस्कृतिक चेतना",
            desc: "स्वतंत्रता अधिकार और जिम्मेदारी दोनों है। एक संवेदनशील, सहनशील और जागरूक भारत का निर्माण कर रहे हैं।",
        },
    },
    {
        id: "open-economy",
        link: "/vision/open-economy",
        image: "/herosection/8.jpg",
        en: {
            title: "Open Economy and Minimum Government",
            desc: "Minimum government, maximum opportunity. Freedom from License Raj, promoting individual growth.",
        },
        hi: {
            title: "खुली अर्थव्यवस्था और न्यून सरकार",
            desc: "न्यूनतम सरकार, अधिकतम अवसर। लाइसेंस राज से मुक्ति, व्यक्तिगत विकास को बढ़ावा।",
        },
    },
    {
        id: "living-standards",
        link: "/vision/living-standards",
        image: "/herosection/10.jpg",
        en: {
            title: "World-Class Living Standards",
            desc: "Living with dignity is every citizen's right. Guaranteeing quality education, health, and life.",
        },
        hi: {
            title: "विश्व स्तरीय जीवन स्तर",
            desc: "गरिमा के साथ जीना हर नागरिक का अधिकार है। गुणवत्तापूर्ण शिक्षा, स्वास्थ्य और जीवन की गारंटी।",
        },
    },
    {
        id: "nature",
        link: "/vision/nature",
        image: "/herosection/4.jpg",
        en: {
            title: "Nature Conservation and Sustainable Development",
            desc: "Only if nature survives, the future survives. Today's development is tomorrow's responsibility.",
        },
        hi: {
            title: "प्रकृति संरक्षण और सतत विकास",
            desc: "प्रकृति बचेगी तभी भविष्य बचेगा। आज का विकास कल की जिम्मेदारी है।",
        },
    },
];
