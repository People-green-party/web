'use client';

import React, { useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from "../../components/LanguageContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import ScrollReveal from '../../components/ScrollReveal';

// --- Local Translations for About Page Content ---
const translations = {
  en: {
    hero: {
      title: "Indian Peoples Green Party",
      subtitle: "Learn about the Indian Peoples Green Party — working towards sustainable growth and social justice.",
      readMore: "Read More",
      overviewTitle: "Overview",
      overviewText: "Indian Peoples Green Party is working for social, economic, and political change. Through a new vision and a broader perspective, the fight for “Equality for All and Happiness for Everyone” has begun. We consider timeliness, excellence, and all-round development as our mission, and human dignity as our religion. We believe that caste and religion are threats to human freedom.\nWe believe that inequality, slow development, miserable conditions, and poverty may have corruption and dynastic politics as one of the reasons, but the main reason behind all these is our thoughtless, inactive, and inefficient leadership and their status quo mindset. They know how to win elections by taking votes, but they can never win the hearts of the people through their work. They know how to use the power of the people to increase their own power — or in simple words, they know how to take, not how to give. Sacrifice, perhaps, is not even a word in their dictionary."
    },
    principles: {
      title: "Eight Principles of the Green Vision",
      subtitle: "Our Commitment to Balance, Progress, and Nature.",
      items: [
        "The biggest priority of the Peoples Green Party is to give maximum representation to women, youth, and the working class. The party believes inclusive leadership is the foundation of true democracy.",
        "The Peoples Green Party has introduced a new working style that emphasizes honesty, transparency, and accountability in administration at every level of governance.",
        "Through the Green Movement, efforts are being made to make people aware of environmental protection and to establish a balance between development and nature.",
        "The Peoples Green Party believes that the development of rural and tribal areas is the real development of the country. The party has given these regions special focus in its agenda.",
        "Against corruption, nepotism, and black money, the party has launched a strong movement. The party believes that corruption has hollowed democratic institutions and must be uprooted.",
        "On the completion of 75 years of independence, the party has taken a pledge to establish a new governance system — one that will ensure true equality, dignity, and opportunity for every citizen.",
        "To strengthen national unity and brotherhood, the party has started a social harmony campaign. The party believes that religious and caste-based division weakens the nation.",
        "The Peoples Green Party is committed to removing unemployment and poverty by promoting cottage industries and self-employment opportunities across the country."
      ]
    },
    vision: {
      mainTitle: "Our Vision",
      mainText: "In five years — 1875 days — we will transform the living standards of every citizen of the state, ensuring equality and happiness for all, doubling the GDP, and creating a Green State.",
      footerText: "Now the people's front will defeat the dishonest.",
      cards: [
        {
          title: "Human Dignity and Equality",
          text: "The Peoples Green Movement believes that human dignity is the greatest religion. Therefore, the party is determined to ensure equality in every sphere of life. The exploitation of the poor, weak, and backward will be stopped, and a society based on equality will be created."
        },
        {
          title: "Open Economy",
          text: "Under the Green Economic Model, a completely new economic structure will be established that connects villages and cities through green industries. The party will promote small and medium industries, and the youth will be made self-reliant by linking them to entrepreneurship."
        },
        {
          title: "Agro-Industrial Revolution",
          text: "The Peoples Green Movement believes that the future lies in the integration of agriculture and industry. Therefore, by connecting agricultural produce with industries, the party will create new employment opportunities and build a strong economic base nationwide."
        },
        {
          title: "Superior Standard of Living",
          text: "After 75 years of independence, the goal is to make every citizen prosperous and dignified. By ensuring quality housing, education, health, and employment, the standard of living for all will rise. The party envisions a society where comfort, equality, and opportunity reach every home."
        }
      ]
    }
  },
  hi: {
    hero: {
      title: "इंडियन पीपल्स ग्रीन\nपार्टी",
      subtitle: "इंडियन पीपल्स ग्रीन पार्टी के बारे में जानें — सतत विकास और सामाजिक न्याय की दिशा में कार्यरत।",
      readMore: "और पढ़ें",
      overviewTitle: "अवलोकन",
      overviewText: "इंडियन पीपल्स ग्रीन पार्टी सामाजिक, आर्थिक और राजनीतिक परिवर्तन के लिए काम कर रही है। एक नई दृष्टि और व्यापक दृष्टिकोण के माध्यम से, 'सभी के लिए समानता और सभी के लिए खुशी' की लड़ाई शुरू हो गई है। हम समयबद्धता, उत्कृष्टता और सर्वांगीण विकास को अपना मिशन और मानवीय गरिमा को अपना धर्म मानते हैं। हमारा मानना है कि जाति और धर्म मानव स्वतंत्रता के लिए खतरा हैं।\n\nहम मानते हैं कि असमानता, धीमा विकास, दयनीय स्थिति और गरीबी के पीछे भ्रष्टाचार और वंशवाद एक कारण हो सकता है, लेकिन इन सबके पीछे मुख्य कारण हमारा विचारहीन, निष्क्रिय और अक्षम नेतृत्व और उनकी यथास्थितिवादी मानसिकता है। वे वोट लेकर चुनाव जीतना जानते हैं, लेकिन अपने काम से जनता का दिल कभी नहीं जीत सकते। वे जनता की शक्ति का उपयोग अपनी शक्ति बढ़ाने के लिए करना जानते हैं — या सीधे शब्दों में कहें तो वे लेना जानते हैं, देना नहीं। शायद 'त्याग' शब्द उनके शब्दकोश में ही नहीं है।"
    },
    principles: {
      title: "ग्रीन विजन के आठ सिद्धांत",
      subtitle: "संतुलन, प्रगति और प्रकृति के प्रति हमारी प्रतिबद्धता।",
      items: [
        "पीपल्स ग्रीन पार्टी की सबसे बड़ी प्राथमिकता महिलाओं, युवाओं और श्रमिक वर्ग को अधिकतम प्रतिनिधित्व देना है। पार्टी का मानना है कि समावेशी नेतृत्व ही सच्ची लोकतंत्र की नींव है।",
        "पीपल्स ग्रीन पार्टी ने एक नई कार्यशैली पेश की है जो प्रशासन के हर स्तर पर ईमानदारी, पारदर्शिता और जवाबदेही पर जोर देती है।",
        "ग्रीन मूवमेंट के माध्यम से लोगों को पर्यावरण संरक्षण के प्रति जागरूक करने और विकास व प्रकृति के बीच संतुलन स्थापित करने के प्रयास किए जा रहे हैं।",
        "पीपल्स ग्रीन पार्टी का मानना है कि ग्रामीण और आदिवासी क्षेत्रों का विकास ही देश का वास्तविक विकास है। पार्टी ने इन क्षेत्रों को अपने एजेंडे में विशेष प्राथमिकता दी है।",
        "भ्रष्टाचार, भाई-भतीजावाद और काले धन के खिलाफ पार्टी ने एक मजबूत आंदोलन शुरू किया है। पार्टी का मानना है कि भ्रष्टाचार ने लोकतांत्रिक संस्थाओं को खोखला कर दिया है और इसे जड़ से उखाड़ना होगा।",
        "आजादी के 75 साल पूरे होने पर, पार्टी ने एक नई शासन प्रणाली स्थापित करने का संकल्प लिया है — जो हर नागरिक के लिए सच्ची समानता, गरिमा और अवसर सुनिश्चित करे।",
        "राष्ट्रीय एकता और भाईचारे को मजबूत करने के लिए, पार्टी ने सामाजिक सद्भाव अभियान शुरू किया है। पार्टी का मानना है कि धार्मिक और जाति-आधारित विभाजन राष्ट्र को कमजोर करता है।",
        "पीपल्स ग्रीन पार्टी कुटीर उद्योगों और स्वरोजगार को बढ़ावा देकर देशभर में बेरोजगारी और गरीबी को दूर करने के लिए प्रतिबद्ध है।"
      ]
    },
    vision: {
      mainTitle: "हमारा विजन",
      mainText: "पांच वर्षों में — 1875 दिनों में — हम राज्य के प्रत्येक नागरिक के जीवन स्तर को बदल देंगे, सभी के लिए समानता और खुशी सुनिश्चित करेंगे, जीडीपी को दोगुना करेंगे और एक ग्रीन स्टेट बनाएंगे।",
      footerText: "अब जनता का मोर्चा बेईमानों को हराएगा।",
      cards: [
        {
          title: "मानवीय गरिमा और समानता",
          text: "पीपल्स ग्रीन मूवमेंट का मानना है कि मानवीय गरिमा सबसे बड़ा धर्म है। इसलिए, पार्टी जीवन के हर क्षेत्र में समानता सुनिश्चित करने के लिए दृढ़ संकल्पित है। गरीबों, कमजोरों और पिछड़ों का शोषण रोका जाएगा।"
        },
        {
          title: "खुली अर्थव्यवस्था",
          text: "ग्रीन इकोनॉमिक मॉडल के तहत, एक पूरी तरह से नई आर्थिक संरचना स्थापित की जाएगी जो हरित उद्योगों के माध्यम से गांवों और शहरों को जोड़ेगी। पार्टी छोटे और मध्यम उद्योगों को बढ़ावा देगी, और युवा आत्मनिर्भर होंगे।"
        },
        {
          title: "कृषि-औद्योगिक क्रांति",
          text: "पीपल्स ग्रीन मूवमेंट का मानना है कि भविष्य कृषि और उद्योग के एकीकरण में निहित है। इसलिए, कृषि उपज को उद्योगों से जोड़कर, पार्टी रोजगार के नए अवसर पैदा करेगी।"
        },
        {
          title: "उत्कृष्ट बुनियादी ढांचा",
          text: "आजादी के 75 साल बाद, हम हर गांव और शहर को विश्वस्तरीय बनाने की योजना बना रहे हैं, जिससे गुणवत्तापूर्ण जीवन सुनिश्चित हो सके। पार्टी शिक्षा, स्वास्थ्य और परिवहन पर ध्यान केंद्रित करेगी ताकि हर घर का आराम और सर्वांगीण विकास सुनिश्चित हो सके।"
        }
      ]
    }
  }
};

// --- Helper Components ---

const PrincipleItem = ({ iconUrl, text }: { iconUrl: string, text: string }) => (
  <div className="w-full flex items-center gap-[10px]">
    <div className="w-[48px] h-[48px] rounded-[8px] border border-[#B9D3C4] bg-white flex items-center justify-center p-[10px] shrink-0">
      <img src={iconUrl} alt="icon" className="w-[24px] h-[24px] object-contain" />
    </div>
    <p className="flex-1 font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] lg:line-clamp-3">
      {text}
    </p>
  </div>
);

const VisionCard = ({ iconUrl, title, text }: { iconUrl: string, title: string, text: string }) => (
  <div className="w-[300px] lg:w-[377px] min-h-[304px] shrink-0 rounded-[8px] border border-[#B9D3C4] bg-white p-[24px] flex flex-col gap-[16px] hover:shadow-lg transition-shadow">
    <div className="w-[48px] h-[48px] rounded-[8px] bg-white text-green-700 flex items-center justify-center">
      <img src={iconUrl} alt="icon" className="w-[48px] h-[48px] object-contain" />
    </div>

    <div className="w-full flex flex-col gap-[8px]">
      <h3 className="font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B]">
        {title}
      </h3>
      <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
        {text}
      </p>
    </div>
  </div>
);

const AboutPageContent = () => {
  // Use global language context
  const { language } = useLanguage();
  // Select local translations based on language
  const t = translations[language as 'en' | 'hi'];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col items-center pt-[70px] lg:pt-[92px]">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content Wrapper - Centered, Responsive Width & Padding */}
      <main className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col mt-[12px] pb-[80px]">

        {/* --- Hero Section --- */}
        <div className="w-full flex flex-col lg:flex-row justify-between gap-10 lg:gap-0 h-auto lg:h-[672px]">

          {/* Left Column: Fluid Width */}
          <div className="flex flex-col w-full lg:w-[58%] shrink-0 gap-[44px]">
            {/* Text Section */}
            <div className="flex flex-col gap-[16px] h-auto lg:h-[208px]">
              <ScrollReveal animation="fade-up" duration={800}>
                <h1 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-pre-line">
                  {t.hero.title}
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" duration={800} delay={200}>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                  {t.hero.subtitle}
                </p>
              </ScrollReveal>
            </div>

            {/* Image Section */}
            <ScrollReveal animation="fade-in" duration={1000} delay={400} className="w-full h-[300px] lg:h-[420px] rounded-[8px] overflow-hidden bg-gray-100">
              <img
                src="/party-images/DSC_0006.JPG"
                alt="Conference"
                className="w-full h-full object-cover"
              />
            </ScrollReveal>
          </div>

          {/* Right Column: Fluid Width */}
          <div className="w-full lg:w-[40%] h-auto lg:h-[672px] rounded-[8px] border border-[#B9D3C4] shadow-[0px_4px_20px_0px_#0000001A] p-[28px_32px] flex flex-col justify-between">

            <div className="flex flex-col gap-[16px]">
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[32px] leading-[38px] tracking-[-0.3px] text-[#04330B]">
                {t.hero.overviewTitle}
              </h2>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[18px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] text-justify lg:text-left whitespace-pre-line">
                {t.hero.overviewText}
              </p>
            </div>

            <button className="w-[154px] h-[46px] rounded-[8px] border border-[#0D5229] flex items-center justify-center gap-[12px] text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] hover:bg-green-50 transition-colors shrink-0 mt-8 lg:mt-0">
              {t.hero.readMore}
            </button>

          </div>

        </div>

        {/* --- Eight Principles Section --- */}
        <div className="w-full mt-[80px] lg:mt-[120px] flex flex-col gap-[64px]">

          <div className="flex flex-col gap-[16px] w-full max-w-[960px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                {t.principles.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                {t.principles.subtitle}
              </p>
            </ScrollReveal>
          </div>

          <div className="w-full flex flex-col lg:flex-row h-auto gap-8 lg:gap-[48px]">

            {/* Left Column (4 Cards) */}
            <div className="w-full lg:flex-1 flex flex-col gap-[40px] lg:gap-[60px]">
              <ScrollReveal animation="slide-right" delay={100}><PrincipleItem iconUrl="/About/about-Icon-1.svg" text={t.principles.items[0]} /></ScrollReveal>
              <ScrollReveal animation="slide-right" delay={200}><PrincipleItem iconUrl="/About/about-Icon-2.svg" text={t.principles.items[1]} /></ScrollReveal>
              <ScrollReveal animation="slide-right" delay={300}><PrincipleItem iconUrl="/About/about-Icon-3.svg" text={t.principles.items[2]} /></ScrollReveal>
              <ScrollReveal animation="slide-right" delay={400}><PrincipleItem iconUrl="/About/about-Icon-4.svg" text={t.principles.items[3]} /></ScrollReveal>
            </div>

            {/* Middle Image */}
            <ScrollReveal animation="fade-in" duration={1000} className="w-full lg:w-[32%] h-[300px] lg:h-auto rounded-[8px] overflow-hidden bg-gray-100 self-stretch">
              <img
                src="/party-images/DSC_0110.JPG"
                alt="Principles Image"
                className="w-full h-full object-cover"
              />
            </ScrollReveal>

            {/* Right Column (4 Cards) */}
            <div className="w-full lg:flex-1 flex flex-col gap-[40px] lg:gap-[60px]">
              <ScrollReveal animation="slide-left" delay={100}><PrincipleItem iconUrl="/About/about-Icon-5.svg" text={t.principles.items[4]} /></ScrollReveal>
              <ScrollReveal animation="slide-left" delay={200}><PrincipleItem iconUrl="/About/about-Icon-6.svg" text={t.principles.items[5]} /></ScrollReveal>
              <ScrollReveal animation="slide-left" delay={300}><PrincipleItem iconUrl="/About/about-Icon-7.svg" text={t.principles.items[6]} /></ScrollReveal>
              <ScrollReveal animation="slide-left" delay={400}><PrincipleItem iconUrl="/About/about-Icon-8.svg" text={t.principles.items[7]} /></ScrollReveal>
            </div>

          </div>

        </div>

        {/* --- Vision Section --- */}
        <div className="w-full mt-[80px] lg:mt-[120px] flex flex-col items-center">

          <div className="w-full max-w-[920px] flex flex-col gap-[16px] mb-[64px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-center text-[#04330B]">
                {t.vision.mainTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-center text-[#587E67]">
                {t.vision.mainText}
              </p>
            </ScrollReveal>
          </div>

          <div
            className="w-full lg:overflow-x-hidden pb-4 no-scrollbar"
            ref={scrollContainerRef}
            style={{ overflowX: 'auto', scrollSnapType: 'x mandatory' }}
          >
            <div className="flex flex-row gap-[24px]">
              {t.vision.cards.map((card: any, i: number) => (
                <ScrollReveal key={i} animation="scale-up" delay={i * 150} className="snap-start shrink-0">
                  <VisionCard
                    iconUrl={`/About/about-Icon-${9 + i}.svg`}
                    title={card.title}
                    text={card.text}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="mt-[48px] w-full max-w-[404px]">
            <p className="font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-center text-[#587E67]">
              {t.vision.footerText}
            </p>
          </div>

          <div className="hidden lg:flex mt-[24px] justify-center gap-[12px]">
            <button
              onClick={() => scroll('left')}
              className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#0D5229] hover:bg-green-50 transition-colors cursor-pointer"
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#0D5229] hover:bg-green-50 transition-colors cursor-pointer"
            >
              <ArrowRight size={24} strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

export default function AboutPage() {
  return <AboutPageContent />;
}