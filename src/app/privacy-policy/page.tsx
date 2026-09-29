import type { Metadata } from "next";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection, policyListClass } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for visitors and contributors using the Indian Peoples Green Party website.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Privacy Policy" hi="गोपनीयता नीति" />}
      title={<L en="How contribution and website information is handled" hi="योगदान और वेबसाइट की जानकारी का उपयोग कैसे किया जाता है" />}
      intro={<L en={`${SITE_DETAILS.legalName} uses personal information for the purposes described on this page, including portal access, applications, participation, contribution processing, verification, record keeping and support.`} hi={`${SITE_DETAILS.legalName} व्यक्तिगत जानकारी का उपयोग इस पृष्ठ पर बताए गए उद्देश्यों के लिए करता है, जिनमें पोर्टल एक्सेस, आवेदन, भागीदारी, योगदान प्रोसेसिंग, सत्यापन, रिकॉर्ड रखना और सहायता शामिल हैं।`} />}
    >
      <PolicySection title={<L en="Information we may collect" hi="हम कौन-सी जानकारी एकत्र कर सकते हैं" />}>
        <L en={<ul className={policyListClass}><li>Name, mobile number, email address and one-time-password verification records.</li><li>Postal address, city, state, PIN code, age or date of birth, occupation and constituency details where requested.</li><li>Membership, union, Zinda Youth and internship application, profile, participation and status information.</li><li>Photographs, identity or supporting documents that a specific application asks the user to upload.</li><li>Contribution amount and donor declarations.</li><li>PAN only where the contribution flow identifies it as required or the contributor requests related documentation.</li><li>Payment order, transaction or reference identifiers, payment status and transaction time.</li><li>Technical information needed for security and operation, such as basic device, browser, log and error information.</li><li>Information included in an email or other support request sent to us.</li></ul>} hi={<ul className={policyListClass}><li>नाम, मोबाइल नंबर, ईमेल पता और वन-टाइम पासवर्ड सत्यापन रिकॉर्ड।</li><li>जहाँ आवश्यक हो, डाक पता, शहर, राज्य, पिन कोड, आयु या जन्म-तिथि, व्यवसाय और निर्वाचन क्षेत्र का विवरण।</li><li>सदस्यता, यूनियन, जिंदा यूथ और इंटर्नशिप आवेदन, प्रोफाइल, भागीदारी तथा स्थिति की जानकारी।</li><li>किसी विशेष आवेदन में माँगी गई फोटो, पहचान या सहायक दस्तावेज़।</li><li>योगदान राशि और योगदानकर्ता की घोषणाएँ।</li><li>PAN केवल तब, जब योगदान प्रक्रिया में इसकी आवश्यकता हो या योगदानकर्ता संबंधित दस्तावेज माँगे।</li><li>भुगतान ऑर्डर, लेन-देन या संदर्भ पहचान संख्या, भुगतान स्थिति और लेन-देन का समय।</li><li>सुरक्षा और संचालन के लिए आवश्यक सामान्य डिवाइस, ब्राउज़र, लॉग और त्रुटि जानकारी।</li><li>हमें भेजे गए ईमेल या सहायता अनुरोध में दी गई जानकारी।</li></ul>} />
      </PolicySection>

      <PolicySection title={<L en="Why we use this information" hi="हम इस जानकारी का उपयोग क्यों करते हैं" />}>
        <L en={<ul className={policyListClass}><li>To register users, verify portal access and provide the dashboard or programme they request.</li><li>To review applications, communicate status, administer activities and issue eligible programme records or certificates.</li><li>To initiate, verify and record a voluntary contribution and provide a confirmation or receipt where applicable.</li><li>To investigate failed, pending, duplicate or disputed transactions.</li><li>To maintain records and respond to applicable legal, regulatory or compliance requirements.</li><li>To answer enquiries and protect users, the website and its processes from misuse.</li></ul>} hi={<ul className={policyListClass}><li>उपयोगकर्ता का पंजीकरण, पोर्टल एक्सेस का सत्यापन और अनुरोधित डैशबोर्ड या कार्यक्रम उपलब्ध कराने के लिए।</li><li>आवेदन की समीक्षा, स्थिति की सूचना, गतिविधियों के संचालन और पात्र कार्यक्रम रिकॉर्ड या प्रमाणपत्र जारी करने के लिए।</li><li>स्वैच्छिक योगदान शुरू करने, सत्यापित करने, रिकॉर्ड रखने और जहाँ लागू हो पुष्टि या रसीद देने के लिए।</li><li>विफल, लंबित, दोहरे या विवादित लेन-देन की जाँच के लिए।</li><li>रिकॉर्ड बनाए रखने और लागू कानूनी, नियामक या अनुपालन आवश्यकताओं का उत्तर देने के लिए।</li><li>प्रश्नों का उत्तर देने तथा उपयोगकर्ताओं, वेबसाइट और इसकी प्रक्रियाओं को दुरुपयोग से बचाने के लिए।</li></ul>} />
      </PolicySection>

      <PolicySection title={<L en="Payment credentials" hi="भुगतान संबंधी गोपनीय जानकारी" />}>
        <L en={<p>Payment processing is completed on or through a third-party payment gateway. {SITE_DETAILS.shortName} does not ask contributors to provide card numbers, CVV, UPI PINs, online-banking passwords or one-time passwords directly to this website, and does not store those credentials in its donation records. The payment gateway&apos;s own terms and privacy practices also apply when its services are used.</p>} hi={<p>भुगतान प्रक्रिया तृतीय-पक्ष पेमेंट गेटवे पर या उसके माध्यम से पूरी होती है। {SITE_DETAILS.shortName} योगदानकर्ताओं से कार्ड नंबर, CVV, UPI PIN, ऑनलाइन-बैंकिंग पासवर्ड या वन-टाइम पासवर्ड सीधे इस वेबसाइट पर देने के लिए नहीं कहता और ऐसी जानकारी अपने योगदान रिकॉर्ड में संग्रहीत नहीं करता। पेमेंट गेटवे की अपनी शर्तें और गोपनीयता प्रथाएँ भी लागू होती हैं।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Sharing and retention" hi="जानकारी साझा करना और सुरक्षित रखना" />}>
        <L en={<p>Information may be shared with payment, messaging, hosting and technology service providers only as needed to operate or verify the relevant service, and with competent authorities where disclosure is required. Records are retained only while reasonably needed for programme administration, operations, support, accounting, security and applicable compliance. Third-party providers apply their own retention practices.</p>} hi={<p>संबंधित सेवा के संचालन या सत्यापन के लिए आवश्यक सीमा तक जानकारी भुगतान, संदेश, होस्टिंग और प्रौद्योगिकी सेवा प्रदाताओं के साथ तथा जहाँ आवश्यक हो सक्षम प्राधिकरणों के साथ साझा की जा सकती है। रिकॉर्ड कार्यक्रम संचालन, सहायता, लेखांकन, सुरक्षा और लागू अनुपालन के लिए उचित रूप से आवश्यक अवधि तक रखे जाते हैं। तृतीय-पक्ष प्रदाता अपनी रिकॉर्ड-रखाव पद्धतियाँ लागू करते हैं।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Young users" hi="युवा उपयोगकर्ता" />}>
        <L en={<p>Youth or internship forms must be completed with accurate age information. A person who is not legally able to provide a requested consent should use the service only with the involvement of a parent or lawful guardian. The party may request additional confirmation where appropriate.</p>} hi={<p>युवा या इंटर्नशिप फॉर्म में आयु की सही जानकारी देना आवश्यक है। जो व्यक्ति कानूनी रूप से माँगी गई सहमति देने में सक्षम नहीं है, वह माता-पिता या वैध अभिभावक की भागीदारी के साथ ही सेवा का उपयोग करे। जहाँ उचित हो, पार्टी अतिरिक्त पुष्टि माँग सकती है।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Access, correction and deletion requests" hi="जानकारी देखने, सुधारने और हटाने के अनुरोध" />}>
        <L en={<p>Users may contact us to request access to or correction of their information, or deletion where retention is not required for legal, accounting, security or programme-record purposes. We may need to verify the requester before acting.</p>} hi={<p>उपयोगकर्ता अपनी जानकारी देखने या सुधारने, अथवा जहाँ कानूनी, लेखांकन, सुरक्षा या कार्यक्रम रिकॉर्ड के लिए रखना आवश्यक न हो वहाँ हटाने का अनुरोध कर सकते हैं। कार्रवाई से पहले अनुरोधकर्ता का सत्यापन किया जा सकता है।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Your questions" hi="आपके प्रश्न" />}>
        <L en={<p>For a privacy-related question, contact <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a>. Please do not send payment passwords, PINs, CVV or one-time passwords by email.</p>} hi={<p>गोपनीयता से संबंधित प्रश्न के लिए <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> पर संपर्क करें। भुगतान पासवर्ड, PIN, CVV या वन-टाइम पासवर्ड ईमेल से न भेजें।</p>} />
      </PolicySection>
    </PolicyPage>
  );
}
