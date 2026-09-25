import type { Metadata } from "next";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection, policyListClass } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Privacy Policy | Indian Peoples Green Party",
  description: "Privacy information for visitors and contributors using the Indian Peoples Green Party website.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Privacy Policy" hi="गोपनीयता नीति" />}
      title={<L en="How contribution and website information is handled" hi="योगदान और वेबसाइट की जानकारी का उपयोग कैसे किया जाता है" />}
      intro={<L en={`${SITE_DETAILS.legalName} uses personal information only for the purposes described on this page, including contribution processing, verification, record keeping and support.`} hi={`${SITE_DETAILS.legalName} व्यक्तिगत जानकारी का उपयोग केवल इस पृष्ठ पर बताए गए उद्देश्यों के लिए करता है, जिनमें योगदान प्रोसेसिंग, सत्यापन, रिकॉर्ड रखना और सहायता शामिल हैं।`} />}
    >
      <PolicySection title={<L en="Information we may collect" hi="हम कौन-सी जानकारी एकत्र कर सकते हैं" />}>
        <L en={<ul className={policyListClass}><li>Name and mobile number.</li><li>Postal address, city, state and PIN code where requested.</li><li>Contribution amount and donor declarations.</li><li>PAN only where the contribution flow identifies it as required or the contributor requests related documentation.</li><li>Payment order, transaction or reference identifiers, payment status and transaction time.</li><li>Information included in an email or other support request sent to us.</li></ul>} hi={<ul className={policyListClass}><li>नाम और मोबाइल नंबर।</li><li>जहाँ आवश्यक हो, डाक पता, शहर, राज्य और पिन कोड।</li><li>योगदान राशि और योगदानकर्ता की घोषणाएँ।</li><li>PAN केवल तब, जब योगदान प्रक्रिया में इसकी आवश्यकता हो या योगदानकर्ता संबंधित दस्तावेज माँगे।</li><li>भुगतान ऑर्डर, लेन-देन या संदर्भ पहचान संख्या, भुगतान स्थिति और लेन-देन का समय।</li><li>हमें भेजे गए ईमेल या सहायता अनुरोध में दी गई जानकारी।</li></ul>} />
      </PolicySection>

      <PolicySection title={<L en="Why we use this information" hi="हम इस जानकारी का उपयोग क्यों करते हैं" />}>
        <L en={<ul className={policyListClass}><li>To initiate, verify and record a voluntary contribution.</li><li>To provide a transaction confirmation or receipt where applicable.</li><li>To investigate failed, pending, duplicate or disputed transactions.</li><li>To maintain records and respond to applicable legal, regulatory or compliance requirements.</li><li>To answer enquiries and protect the website and contribution process from misuse.</li></ul>} hi={<ul className={policyListClass}><li>स्वैच्छिक योगदान शुरू करने, सत्यापित करने और रिकॉर्ड रखने के लिए।</li><li>जहाँ लागू हो, लेन-देन की पुष्टि या रसीद देने के लिए।</li><li>विफल, लंबित, दोहरे या विवादित लेन-देन की जाँच के लिए।</li><li>रिकॉर्ड बनाए रखने और लागू कानूनी, नियामक या अनुपालन आवश्यकताओं का उत्तर देने के लिए।</li><li>प्रश्नों का उत्तर देने तथा वेबसाइट और योगदान प्रक्रिया को दुरुपयोग से बचाने के लिए।</li></ul>} />
      </PolicySection>

      <PolicySection title={<L en="Payment credentials" hi="भुगतान संबंधी गोपनीय जानकारी" />}>
        <L en={<p>Payment processing is completed on or through a third-party payment gateway. {SITE_DETAILS.shortName} does not ask contributors to provide card numbers, CVV, UPI PINs, online-banking passwords or one-time passwords directly to this website, and does not store those credentials in its donation records. The payment gateway&apos;s own terms and privacy practices also apply when its services are used.</p>} hi={<p>भुगतान प्रक्रिया तृतीय-पक्ष पेमेंट गेटवे पर या उसके माध्यम से पूरी होती है। {SITE_DETAILS.shortName} योगदानकर्ताओं से कार्ड नंबर, CVV, UPI PIN, ऑनलाइन-बैंकिंग पासवर्ड या वन-टाइम पासवर्ड सीधे इस वेबसाइट पर देने के लिए नहीं कहता और ऐसी जानकारी अपने योगदान रिकॉर्ड में संग्रहीत नहीं करता। पेमेंट गेटवे की अपनी शर्तें और गोपनीयता प्रथाएँ भी लागू होती हैं।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Sharing and retention" hi="जानकारी साझा करना और सुरक्षित रखना" />}>
        <L en={<p>Information may be shared with payment and technology service providers to process or verify a transaction, and with competent authorities where disclosure is required. Records are retained only for operational, support, accounting and applicable compliance purposes. We do not claim that every payment or service provider follows identical retention practices.</p>} hi={<p>लेन-देन को प्रोसेस या सत्यापित करने के लिए जानकारी भुगतान और प्रौद्योगिकी सेवा प्रदाताओं के साथ तथा जहाँ आवश्यक हो, सक्षम प्राधिकरणों के साथ साझा की जा सकती है। रिकॉर्ड केवल संचालन, सहायता, लेखांकन और लागू अनुपालन उद्देश्यों के लिए रखे जाते हैं। हम यह दावा नहीं करते कि प्रत्येक भुगतान या सेवा प्रदाता समान रिकॉर्ड-रखाव पद्धति अपनाता है।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Your questions" hi="आपके प्रश्न" />}>
        <L en={<p>For a privacy-related question, contact <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a>. Please do not send payment passwords, PINs, CVV or one-time passwords by email.</p>} hi={<p>गोपनीयता से संबंधित प्रश्न के लिए <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> पर संपर्क करें। भुगतान पासवर्ड, PIN, CVV या वन-टाइम पासवर्ड ईमेल से न भेजें।</p>} />
      </PolicySection>
    </PolicyPage>
  );
}
