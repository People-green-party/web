"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { useLanguage } from "../../components/LanguageContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import ScrollReveal from '../../components/ScrollReveal';

// --- 1. Translation Data ---

const translations = {
  en: {
    hero: {
      titleLine1: "Constitution: Indian Peoples",
      titleLine2: "Green Party",
      subtitle: "Guiding Principles and Vision for a Just, Prosperous, and Sustainable India.",
    },
    slogan: {
      label: "The Slogan of the party is",
      text: "“Jai Bharat, Jai Jan, Jai Manavta”"
    },
    preamble: {
      title: "Article I-A : Preamble",
      subtitle: "Empowering Learners Through Online Education",
      text: "The Indian Peoples Green Party will work on the principle to develop India as a utopian state where citizens live as a single Community and a common society by peaceful means. The party will strive to construct a developed nation where citizens will follow true morals and ethics with nationalistic spirit as their religion, they will be enterprising and innovative while being honest, laborious and courageous thus provide true services for the betterment of humanity and well being of our people and as the sequel, India will lead the world."
    },
    vision: {
      title: "Article I-B: Vision, Policies and Aims",
      subtitle: "Defining the Party’s Core Philosophy for a Prosperous, Equal, and Sustainable Nation",
      items: [
        {
          heading: "People-Centric Governance & Shared Prosperity",
          text: "Jan-Khushali or Peoples Green aims to establish a political philosophy that prioritizes the happiness, well-being, and dignified life of citizens. The party advocates for education for all, healthy citizens, quality housing, fair income, and human dignity and liberty as guaranteed provisions fulfilling citizens’ basic needs. They propose that government businesses and profit-making activities be conducted through a disciplined professional limited company, making every citizen a non-transferable shareholder with annual benefits. This ensures that the people benefit from profits and prevents exploitation by executives and representatives."
        },
        {
          heading: "Sustainable Development & Environmental Stewardship",
          text: "We are committed to a development model that respects the planet's ecological boundaries. Our vision includes a robust transition to renewable energy, conservation of natural resources, and the promotion of green technologies. By integrating environmental consciousness into every policy decision, we aim to safeguard the health of our ecosystems for future generations while ensuring sustainable economic growth."
        },
        {
          heading: "Social Justice & Inclusive Growth",
          text: "True progress is only possible when every voice is heard and every citizen is empowered. We strive to eliminate systemic inequalities based on caste, gender, religion, or economic status. Our policies focus on uplifting marginalized communities, ensuring equal access to opportunities, legal aid, and social security. We believe in a society where justice is not a privilege, but a fundamental right for all."
        }
      ]
    }
  },
  hi: {
    hero: {
      titleLine1: "बेहतर भविष्य के लिए",
      titleLine2: "नवाचार को प्रेरित करना",
      subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।",
    },
    slogan: {
      label: "पार्टी का नारा है",
      text: "“जय भारत, जय जन, जय मानवता”"
    },
    preamble: {
      title: "अनुच्छेद I-A: प्रस्तावना",
      subtitle: "ऑनलाइन शिक्षा के माध्यम से शिक्षार्थियों को सशक्त बनाना",
      text: "इंडियन पीपल्स ग्रीन पार्टी भारत को एक आदर्श राज्य के रूप में विकसित करने के सिद्धांत पर काम करेगी जहां नागरिक एक समुदाय और एक सामान्य समाज के रूप में शांतिपूर्ण तरीके से रहें। पार्टी एक विकसित राष्ट्र के निर्माण के लिए प्रयास करेगी जहां नागरिक अपने धर्म के रूप में राष्ट्रवादी भावना के साथ सच्चे नैतिकता और नैतिकता का पालन करेंगे, वे ईमानदार, परिश्रमी और साहसी होने के साथ-साथ उद्यमशील और नवीन होंगे, इस प्रकार मानवता की बेहतरी और हमारे लोगों की भलाई के लिए सच्ची सेवाएं प्रदान करेंगे और परिणामस्वरूप, भारत दुनिया का नेतृत्व करेगा।"
    },
    vision: {
      title: "अनुच्छेद I-B: दृष्टि, नीतियां और उद्देश्य",
      subtitle: "एक समृद्ध, समान और टिकाऊ राष्ट्र के लिए पार्टी के मुख्य दर्शन को परिभाषित करना",
      items: [
        {
          heading: "जन-केंद्रित शासन और साझा समृद्धि",
          text: "जन-खुशाली या पीपल्स ग्रीन का उद्देश्य एक ऐसा राजनीतिक दर्शन स्थापित करना है जो नागरिकों की खुशी, भलाई और गरिमापूर्ण जीवन को प्राथमिकता देता है। पार्टी सभी के लिए शिक्षा, स्वस्थ नागरिक, गुणवत्तापूर्ण आवास, उचित आय और नागरिकों की बुनियादी जरूरतों को पूरा करने वाले गारंटीकृत प्रावधानों के रूप में मानवीय गरिमा और स्वतंत्रता की वकालत करती है। उनका प्रस्ताव है कि सरकारी व्यवसायों और लाभ कमाने वाले उद्यमों को लाभ के उद्देश्यों के बजाय लोगों के हितों की सेवा करनी चाहिए।"
        },
        {
          heading: "सतत विकास और पर्यावरण संरक्षण",
          text: "हम एक ऐसे विकास मॉडल के लिए प्रतिबद्ध हैं जो ग्रह की पारिस्थितिक सीमाओं का सम्मान करता है। हमारे दृष्टिकोण में नवीकरणीय ऊर्जा के लिए एक मजबूत संक्रमण, प्राकृतिक संसाधनों का संरक्षण, और हरित प्रौद्योगिकियों को बढ़ावा देना शामिल है। हर नीतिगत निर्णय में पर्यावरण चेतना को एकीकृत करके, हम भविष्य की पीढ़ियों के लिए अपने पारिस्थितिक तंत्र के स्वास्थ्य की रक्षा करते हुए स्थायी आर्थिक विकास सुनिश्चित करना चाहते हैं।"
        },
        {
          heading: "सामाजिक न्याय और समावेशी विकास",
          text: "सच्ची प्रगति तभी संभव है जब हर आवाज सुनी जाए और हर नागरिक सशक्त हो। हम जाति, लिंग, धर्म या आर्थिक स्थिति के आधार पर प्रणालीगत असमानताओं को खत्म करने का प्रयास करते हैं। हमारी नीतियां हाशिए पर रहने वाले समुदायों के उत्थान, अवसरों तक समान पहुंच, कानूनी सहायता और सामाजिक सुरक्षा सुनिश्चित करने पर केंद्रित हैं। हम एक ऐसे समाज में विश्वास करते हैं जहां न्याय विशेषाधिकार नहीं, बल्कि सभी के लिए एक मौलिक अधिकार है।"
        }
      ]
    }
  }
};

// --- 4. Main Page Component ---

const ConstitutionPageContent = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [currentVisionIndex, setCurrentVisionIndex] = useState(0);

  const handleNextVision = () => {
    setCurrentVisionIndex((prev) => (prev + 1) % t.vision.items.length);
  };

  const handlePrevVision = () => {
    setCurrentVisionIndex((prev) => (prev - 1 + t.vision.items.length) % t.vision.items.length);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 pt-[70px] lg:pt-[92px]">

      <Navbar />

      {/* 1. HERO SECTION (FROM HOME PAGE) */}
      <section className="w-full flex justify-center mt-[12px]">
        <div className="w-full max-w-[1320px] relative px-4 lg:px-8 flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-[50%] shrink-0 lg:justify-between">
            {/* Image 1 */}
            <div className="flex flex-col gap-[16px] w-full mb-[48px] lg:mb-0">
              <ScrollReveal animation="fade-up" duration={800}>
                <h1 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                  {t.hero.titleLine1} {t.hero.titleLine2}
                </h1>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" duration={800} delay={200}>
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] max-w-[476px]">
                  {t.hero.subtitle}
                </p>
              </ScrollReveal>
            </div>

            <div className="w-full h-[246px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/party-images/DSC_0006.JPG" alt="Hero 1" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Gap */}
          <div className="hidden lg:block w-[3%] shrink-0"></div>

          {/* --- MIDDLE COLUMN --- */}
          <div className="hidden lg:flex flex-col w-[23%] shrink-0 gap-[24px]">
            {/* Image 2 */}
            <ScrollReveal animation="scale-up" duration={800} delay={100} className="w-full h-[256px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/party-images/DSC_0007.JPG" alt="Hero 2" className="w-full h-full object-cover" />
            </ScrollReveal>
            {/* Image 3 */}
            <ScrollReveal animation="scale-up" duration={800} delay={200} className="w-full h-[222px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/party-images/DSC_0008.JPG" alt="Hero 3" className="w-full h-full object-cover" />
            </ScrollReveal>
          </div>

          {/* Gap */}
          <div className="hidden lg:block w-[2%] shrink-0"></div>

          {/* --- RIGHT COLUMN --- */}
          <div className="hidden lg:flex flex-col w-[22%] shrink-0 gap-[24px]">
            {/* Image 4 */}
            <ScrollReveal animation="scale-up" duration={800} delay={300} className="w-full h-[230px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/party-images/DSC_0009.JPG" alt="Hero 4" className="w-full h-full object-cover" />
            </ScrollReveal>
            {/* Image 5 */}
            <ScrollReveal animation="scale-up" duration={800} delay={400} className="w-full h-[246px] rounded-[8px] overflow-hidden bg-gray-100">
              <img src="/party-images/DSC_0014.JPG" alt="Hero 5" className="w-full h-full object-cover" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. PREAMBLE SECTION (New Layout) */}
      <section className="w-full flex flex-col items-center mt-[40px] lg:mt-[120px] relative h-auto lg:min-h-[948px] pb-[40px] lg:pb-0">

        {/* Layer 1: Image (Z-Index 10) */}
        <ScrollReveal animation="scale-up" duration={1000} className="relative z-10 w-full max-w-[1240px] h-auto aspect-[1240/533] rounded-[16px] overflow-hidden shadow-lg mx-4 lg:mx-0 px-4 lg:px-8">
          <img
            src="/party-images/DSC_0019.JPG"
            alt="Preamble Banner"
            className="w-full h-full object-cover rounded-[16px]"
          />
        </ScrollReveal>

        {/* Layer 2: Green Background Section (Z-Index 0) */}
        <div className="absolute top-[100px] lg:top-[314px] bottom-0 lg:bottom-auto w-full lg:h-[634px] bg-[#C6E0D1] -z-0"></div>

        {/* Layer 3: Text Content (Z-Index 10) */}
        <div className="relative z-10 mt-[32px] lg:mt-[53px] flex flex-col items-center w-full max-w-[972px] px-4 lg:px-8 text-center">

          {/* Title & Subtitle Block */}
          <div className="flex flex-col items-center gap-[0px] mb-[24px] lg:mb-[44px]">
            <ScrollReveal animation="fade-up" duration={800}>
              <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#0D5229]">
                {t.preamble.title}
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" duration={800} delay={200}>
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] mt-[8px]">
                {t.preamble.subtitle}
              </h3>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade-up" duration={800} delay={400}>
            <p className="font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] text-center max-w-[972px]">
              {t.preamble.text}
            </p>
          </ScrollReveal>

        </div>

      </section>

      {/* 4. VISION SECTION (Article I-B) */}
      <section className="w-full max-w-[1320px] mx-auto px-4 lg:px-8 flex flex-col mt-[40px] lg:mt-[120px]">

        <div className="flex flex-col gap-[0px] w-full text-left mb-[24px] lg:mb-[61px]">
          <ScrollReveal animation="fade-up" duration={800}>
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
              {t.vision.title}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={200}>
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] mt-[0px]">
              {t.vision.subtitle}
            </p>
          </ScrollReveal>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-start justify-between">
          {/* Left Column: Text & Buttons */}
          <div className="flex flex-col w-full lg:w-[60%] order-2 lg:order-1">
            <h3 className="w-full font-['Familjen_Grotesk'] font-semibold text-[24px] leading-[30px] tracking-[-0.3px] text-[#04330B] animate-in fade-in duration-300">
              {t.vision.items[currentVisionIndex].heading}
            </h3>
            <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] text-left min-h-[132px] flex items-center mt-[12px] lg:mt-0 animate-in fade-in duration-300">
              {t.vision.items[currentVisionIndex].text}
            </p>

            <div className="flex gap-[12px] mt-[14px]">
              <button
                onClick={handlePrevVision}
                className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors"
                type="button"
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onClick={handleNextVision}
                className="w-[46px] h-[46px] rounded-[8px] border border-[#B9D3C4] flex items-center justify-center text-[#04330B] hover:bg-green-50 transition-colors"
                type="button"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          {/* Right Column: Image */}
          <ScrollReveal animation="fade-in" duration={800} delay={200} className="w-full lg:w-[35%] h-[304px] rounded-[8px] shadow-[0px_4px_20px_0px_#0000001A] overflow-hidden shrink-0 order-1 lg:order-3 mb-[24px] lg:mb-0">
            <img
              src="/party-images/DSC_0020.JPG"
              alt="Vision"
              className="w-full h-full object-cover"
            />
          </ScrollReveal>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default function ConstitutionPage() {
  return <ConstitutionPageContent />;
}