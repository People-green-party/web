export type FundId = "peoples-green-fund" | "green-fund" | "democracy-fund";

export type DedicationOccasion =
  | "Birthday"
  | "Wedding"
  | "Anniversary"
  | "Festival"
  | "In Memory Of"
  | "Other";

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

export const OCCASIONS: { value: DedicationOccasion; label: { en: string; hi: string } }[] = [
  { value: "Birthday", label: { en: "Birthday", hi: "जन्मदिन" } },
  { value: "Wedding", label: { en: "Wedding", hi: "विवाह" } },
  { value: "Anniversary", label: { en: "Anniversary", hi: "सालगिरह" } },
  { value: "Festival", label: { en: "Festival", hi: "त्योहार" } },
  { value: "In Memory Of", label: { en: "In Memory Of", hi: "स्मृति में" } },
  { value: "Other", label: { en: "Other", hi: "अन्य" } },
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
      hi: "Great Green Wall Mission",
    },
    title: {
      en: "Green Fund",
      hi: "ग्रीन फंड",
    },
    shortDescription: {
      en: "A proposed one-crore-plant restoration mission for vulnerable landscapes around the Aravalli region.",
      hi: "अरावली क्षेत्र के संवेदनशील भूभागों के लिए प्रस्तावित एक करोड़ पेड़ों का पुनर्स्थापन मिशन।",
    },
    coverImage: "/funds/green-fund-aravalli-restoration.jpg",
    heroTagline: {
      en: "Great Green Wall Mission",
      hi: "Great Green Wall Mission",
    },
    heroHeading: {
      en: "GREEN FUND",
      hi: "ग्रीन फंड",
    },
    heroSubheading: {
      en: "One Crore Plants. A Long-Term Restoration Mission.",
      hi: "एक करोड़ पेड़। दीर्घकालीन हरित पुनर्स्थापन अभियान।",
    },
    descriptionParagraphs: {
      en: [
        "The Great Green Wall Mission is a proposed ecological restoration initiative focused on vulnerable landscapes around the Aravalli range and adjoining semi-arid regions.",
        "The Aravalli landscape plays an important ecological role in western and northwestern India. Land degradation, loss of vegetation and desertification risks require scientifically planned restoration and long-term care.",
        "The mission proposes site-specific plantations and ecological restoration, using suitable native species and maintenance practices."
      ],
      hi: [
        "Great Green Wall Mission अरावली पर्वतमाला और उससे जुड़े शुष्क एवं संवेदनशील भूभागों में प्रस्तावित पर्यावरणीय पुनर्स्थापन की पहल है।",
        "अरावली का भूभाग पश्चिमी और उत्तर-पश्चिमी भारत के पर्यावरण में महत्वपूर्ण भूमिका निभाता है। भूमि क्षरण, वनस्पति में कमी और मरुस्थलीकरण के जोखिमों को देखते हुए वैज्ञानिक योजना तथा दीर्घकालीन देखभाल आवश्यक है।",
        "इस मिशन में स्थानीय परिस्थितियों के अनुसार उपयुक्त देशी प्रजातियों का रोपण और पारिस्थितिक पुनर्स्थापन प्रस्तावित है।"
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
