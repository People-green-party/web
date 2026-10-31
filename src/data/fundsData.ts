export type FundId = "peoples-green-fund" | "green-fund" | "democracy-fund";

export type DedicationOccasion =
  | "Birthday"
  | "Wedding"
  | "Anniversary"
  | "Festival"
  | "New Baby"
  | "Congratulations"
  | "In Memory Of"
  | "Just Because"
  | "Other";

export interface OccasionItem {
  value: DedicationOccasion;
  label: { en: string; hi: string };
  tagline: { en: string; hi: string };
  image?: string;
}

export interface FundContent {
  id: FundId;
  slug: string;
  category: { en: string; hi: string };
  title: { en: string; hi: string };
  shortDescription: { en: string; hi: string };
  coverImage: string;
  heroTagline: { en: string; hi: string };
  heroHeading: { en: string; hi: string };
  heroSubheading: { en: string; hi: string };
  descriptionParagraphs: { en: string[]; hi: string[] };
}

export const OCCASIONS: OccasionItem[] = [
  {
    value: "Birthday",
    label: { en: "Birthday", hi: "जन्मदिन" },
    tagline: { en: "One more candle. One more tree.", hi: "एक और मोमबत्ती। एक और पौधा।" },
    image: "/green-wall/birthday.jpg",
  },
  {
    value: "Wedding",
    label: { en: "Wedding", hi: "शादी" },
    tagline: { en: "Two hearts. One greener future.", hi: "दो दिल। एक हरा कल।" },
    image: "/green-wall/wedding.jpg",
  },
  {
    value: "Anniversary",
    label: { en: "Anniversary", hi: "सालगिरह" },
    tagline: { en: "Love that keeps growing.", hi: "प्यार, जो हर साल बढ़े।" },
    image: "/green-wall/anniversary.jpg",
  },
  {
    value: "Festival",
    label: { en: "Festival", hi: "त्योहार" },
    tagline: { en: "Make the celebration grow beyond tonight.", hi: "जश्न एक दिन का। हरियाली बरसों की।" },
    image: "/green-wall/festival.jpg",
  },
  {
    value: "New Baby",
    label: { en: "New Baby", hi: "नन्हे मेहमान का स्वागत" },
    tagline: { en: "A new life. A greener world to grow into.", hi: "एक नई ज़िंदगी। उसके लिए एक हरी दुनिया।" },
    image: "/green-wall/new-baby.jpg",
  },
  {
    value: "Congratulations",
    label: { en: "Congratulations", hi: "बधाई" },
    tagline: { en: "A big moment deserves something lasting.", hi: "बड़ी खुशी के नाम कुछ ऐसा, जो बना रहे।" },
    image: "/green-wall/congratulations.jpg",
  },
  {
    value: "In Memory Of",
    label: { en: "In Memory", hi: "स्मृति में" },
    tagline: { en: "Let their memory grow.", hi: "यादें, जो हरियाली बनकर जीवित रहें।" },
    image: "/green-wall/in-memory.jpg",
  },
  {
    value: "Just Because",
    label: { en: "Just Because", hi: "बस यूँ ही" },
    tagline: { en: "No occasion needed. Earth is reason enough.", hi: "बहाने की क्या ज़रूरत? धरती ही काफ़ी है।" },
    image: "/green-wall/just-because.jpg",
  },
  {
    value: "Other",
    label: { en: "Other", hi: "अन्य" },
    tagline: { en: "Every tree leaves the world greener.", hi: "हर पौधा धरती को और हरा बनाता है।" },
  },
];

export const PLANT_PRESETS = [
  { count: 1, amount: 1500 },
  { count: 2, amount: 3000 },
  { count: 5, amount: 7500 },
  { count: 10, amount: 15000 },
  { count: 25, amount: 37500 },
  { count: 50, amount: 75000 },
];

export const COST_PER_PLANT = 1500;

export const FUNDS_DATA: Record<FundId, FundContent> = {
  "peoples-green-fund": {
    id: "peoples-green-fund",
    slug: "peoples-green-fund",
    category: {
      en: "Political Fund",
      hi: "राजनीतिक कोष",
    },
    title: {
      en: "People's Green Fund",
      hi: "पीपुल्स ग्रीन फंड",
    },
    shortDescription: {
      en: "Political organisation, public dialogue and policy work focused on accountable governance.",
      hi: "जवाबदेह शासन से जुड़े राजनीतिक संगठन, जनसंवाद और नीतिगत कार्यों के लिए।",
    },
    coverImage: "/funds/peoples-green-fund-rally.jpeg",
    heroTagline: {
      en: "Political Organisation & Public Accountability",
      hi: "राजनीतिक संगठन एवं सार्वजनिक जवाबदेही",
    },
    heroHeading: {
      en: "PEOPLE'S GREEN FUND",
      hi: "पीपुल्स ग्रीन फंड",
    },
    heroSubheading: {
      en: "An Alternative Political Voice",
      hi: "एक वैकल्पिक राजनीतिक आवाज़",
    },
    descriptionParagraphs: {
      en: [
        "The People's Green Fund supports the political and organisational activities of the Indian Peoples Green Party.",
      ],
      hi: [
        "पीपुल्स ग्रीन फंड इंडियन पीपुल्स ग्रीन पार्टी की राजनीतिक और संगठनात्मक गतिविधियों में सहयोग करता है।",
      ],
    },
  },

  "green-fund": {
    id: "green-fund",
    slug: "green-fund",
    category: {
      en: "Great Green Wall Mission",
      hi: "महान हरित दीवार मिशन",
    },
    title: {
      en: "The Great Green Wall",
      hi: "महान हरित दीवार",
    },
    shortDescription: {
      en: "Not a wall of bricks. A wall of life. One crore native plants for vulnerable landscapes around the Aravallis.",
      hi: "ईंटों की नहीं। ज़िंदगी की दीवार। अरावली के संवेदनशील भूभाग में एक करोड़ देशी पौधों का जीवन अभियान।",
    },
    coverImage: "/funds/green-fund-aravalli-restoration.jpg",
    heroTagline: {
      en: "GREAT GREEN WALL MISSION",
      hi: "महान हरित दीवार मिशन",
    },
    heroHeading: {
      en: "THE GREAT GREEN WALL MISSION",
      hi: "महान हरित दीवार मिशन",
    },
    heroSubheading: {
      en: "Not a wall of bricks. A wall of life.",
      hi: "ईंटों की नहीं। ज़िंदगी की दीवार।",
    },
    descriptionParagraphs: {
      en: [
        "The Aravallis have stood for ages. Now the landscapes around them need a little help from us. We're working towards a living green barrier in vulnerable areas around the Aravalli landscape. Not with concrete. With native plants. Living roots. And the care it takes to keep them alive.",
        "One crore plants is our dream for Phase One. Your one plant can be where it begins.",
      ],
      hi: [
        "अरावली सदियों से खड़ी है। अब उसके आसपास के नाज़ुक इलाकों को हमारी ज़रूरत है। हम अरावली के संवेदनशील भूभाग में हरियाली की एक जीवित दीवार विकसित करने की दिशा में काम कर रहे हैं। सीमेंट से नहीं। देशी पौधों से। उनकी जड़ों से। और उन्हें जीवित रखने वाली लगातार देखभाल से।",
        "पहले चरण का सपना है एक करोड़ पौधे। शुरुआत आपके एक पौधे से भी हो सकती है।",
      ],
    },
  },

  "democracy-fund": {
    id: "democracy-fund",
    slug: "democracy-fund",
    category: {
      en: "Constitutional Rights & Public Accountability",
      hi: "संवैधानिक अधिकार एवं सार्वजनिक जवाबदेही",
    },
    title: {
      en: "Democracy Fund",
      hi: "लोकतंत्र फंड",
    },
    shortDescription: {
      en: "Public-interest legal research, constitutional rights initiatives, civic education and peaceful public activities focused on equality before the law and accountable governance.",
      hi: "जनहित से जुड़े कानूनी अध्ययन, संवैधानिक अधिकारों, नागरिक जागरूकता तथा कानून के समक्ष समानता और जवाबदेह शासन से संबंधित शांतिपूर्ण सार्वजनिक गतिविधियों के लिए।",
    },
    coverImage: "/funds/democracy-fund-people-flag.jpeg",
    heroTagline: {
      en: "Constitutional Rights & Public Accountability",
      hi: "संवैधानिक अधिकार एवं सार्वजनिक जवाबदेही",
    },
    heroHeading: {
      en: "DEMOCRACY FUND",
      hi: "लोकतंत्र फंड",
    },
    heroSubheading: {
      en: "Equality. Accountability. Constitutional Rights.",
      hi: "समानता। जवाबदेही। संवैधानिक अधिकार।",
    },
    descriptionParagraphs: {
      en: [
        "The Democracy Fund supports public-interest legal research, constitutional rights initiatives, civic education and peaceful public activities focused on equality before the law and accountable governance.",
        "The programme will document governance concerns, examine legal and administrative practices, and provide public information about the rights and remedies available to citizens.",
      ],
      hi: [
        "लोकतंत्र फंड का उद्देश्य जनहित से जुड़े कानूनी अध्ययन, संवैधानिक अधिकारों, नागरिक जागरूकता तथा कानून के समक्ष समानता और जवाबदेह शासन से संबंधित शांतिपूर्ण सार्वजनिक गतिविधियों को सहयोग देना है।",
        "इस कार्यक्रम के अंतर्गत शासन संबंधी समस्याओं का दस्तावेज़ीकरण, कानूनों और प्रशासनिक व्यवस्थाओं का अध्ययन तथा नागरिकों के अधिकारों एवं उपलब्ध कानूनी उपायों की जानकारी प्रदान की जाएगी।",
      ],
    },
  },
};
