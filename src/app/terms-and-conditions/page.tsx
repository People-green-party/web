import type { Metadata } from "next";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection, policyListClass } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Terms & Conditions | Indian Peoples Green Party",
  description: "Terms governing use of the Indian Peoples Green Party website and voluntary contribution process.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Terms & Conditions" hi="नियम और शर्तें" />}
      title={<L en="Website and voluntary contribution terms" hi="वेबसाइट और स्वैच्छिक योगदान की शर्तें" />}
      intro={<L en={`These terms apply when using ${SITE_DETAILS.legalName}'s official website or its online contribution facility.`} hi={`ये शर्तें ${SITE_DETAILS.legalName} की आधिकारिक वेबसाइट या उसकी ऑनलाइन योगदान सुविधा का उपयोग करते समय लागू होती हैं।`} />}
    >
      <PolicySection title={<L en="Website use" hi="वेबसाइट का उपयोग" />}>
        <L en={<p>Use this website lawfully and do not attempt to disrupt it, impersonate another person, submit fraudulent information or interfere with a payment or verification process. Website material is provided for public information and may be corrected or updated when necessary.</p>} hi={<p>इस वेबसाइट का उपयोग वैधानिक रूप से करें। इसे बाधित करने, किसी अन्य व्यक्ति का रूप धारण करने, झूठी जानकारी देने या भुगतान अथवा सत्यापन प्रक्रिया में हस्तक्षेप करने का प्रयास न करें। वेबसाइट की सामग्री सार्वजनिक जानकारी के लिए दी गई है और आवश्यकता होने पर सुधारी या अपडेट की जा सकती है।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Voluntary contributions" hi="स्वैच्छिक योगदान" />}>
        <L en={<ul className={policyListClass}><li>A contribution is voluntary and is not a purchase of goods or services.</li><li>No product, service, political favour or other personal benefit is provided in return for a contribution.</li><li>The contributor must provide accurate information and complete the declarations shown in the contribution form.</li><li>The contributor is responsible for ensuring that the contribution is permitted under the laws and rules applicable to them.</li></ul>} hi={<ul className={policyListClass}><li>योगदान स्वैच्छिक है और यह किसी वस्तु या सेवा की खरीद नहीं है।</li><li>योगदान के बदले कोई उत्पाद, सेवा, राजनीतिक पक्षपात या अन्य व्यक्तिगत लाभ नहीं दिया जाता।</li><li>योगदानकर्ता को सही जानकारी देनी होगी और योगदान फॉर्म में दिखाई गई घोषणाएँ पूरी करनी होंगी।</li><li>यह सुनिश्चित करना योगदानकर्ता की जिम्मेदारी है कि योगदान उस पर लागू कानूनों और नियमों के अंतर्गत अनुमत है।</li></ul>} />
      </PolicySection>

      <PolicySection title={<L en="Payment processing and confirmation" hi="भुगतान प्रक्रिया और पुष्टि" />}>
        <L en={<p>Payments are processed through a third-party payment gateway. A contribution is treated as confirmed only after the transaction is successfully verified and recorded. A bank debit, pending message or gateway screen alone may not constitute final confirmation. If the status is unclear, do not immediately pay again; contact us with the available transaction reference.</p>} hi={<p>भुगतान तृतीय-पक्ष पेमेंट गेटवे के माध्यम से प्रोसेस होते हैं। योगदान की पुष्टि तभी मानी जाती है जब लेन-देन सफलतापूर्वक सत्यापित और रिकॉर्ड हो जाए। केवल बैंक डेबिट, लंबित संदेश या गेटवे स्क्रीन अंतिम पुष्टि नहीं मानी जा सकती। स्थिति स्पष्ट न हो तो तुरंत दोबारा भुगतान न करें; उपलब्ध लेन-देन संदर्भ के साथ हमसे संपर्क करें।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Failed and duplicate transactions" hi="विफल और दोहरे लेन-देन" />}>
        <L en={<p>Failed, pending, mistaken or duplicate payments will be reviewed using the information available from the contributor, bank and payment gateway. Any refund or reversal is handled under the Refund &amp; Cancellation Policy and applicable payment-provider and banking processes.</p>} hi={<p>विफल, लंबित, गलती से हुए या दोहरे भुगतान की समीक्षा योगदानकर्ता, बैंक और पेमेंट गेटवे से उपलब्ध जानकारी के आधार पर की जाएगी। किसी भी रिफंड या राशि वापसी को रिफंड और रद्दीकरण नीति तथा लागू भुगतान-प्रदाता और बैंकिंग प्रक्रियाओं के अनुसार संभाला जाएगा।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Third-party services and changes" hi="तृतीय-पक्ष सेवाएँ और बदलाव" />}>
        <L en={<p>Payment gateways and linked third-party websites operate under their own terms. {SITE_DETAILS.legalName} may update website content or these policies when operational or compliance requirements change. The version published on this website applies when it is viewed or accepted.</p>} hi={<p>पेमेंट गेटवे और लिंक की गई तृतीय-पक्ष वेबसाइटें अपनी शर्तों के अनुसार काम करती हैं। संचालन या अनुपालन आवश्यकताओं में बदलाव होने पर {SITE_DETAILS.legalName} वेबसाइट की सामग्री या इन नीतियों को अपडेट कर सकता है। वेबसाइट पर प्रकाशित संस्करण उसे देखने या स्वीकार करने के समय लागू होता है।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Support" hi="सहायता" />}>
        <L en={<p className="lg:whitespace-nowrap lg:text-[14px] lg:tracking-[-0.2px]">Questions about these terms or a transaction can be sent to <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> or raised by phone at <a className="font-bold text-[#0D5229] underline" href={`tel:+91${SITE_DETAILS.phone}`}>+91 {SITE_DETAILS.phone}</a>.</p>} hi={<p>इन शर्तों या किसी लेन-देन से संबंधित प्रश्न <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> पर भेजें या <a className="font-bold text-[#0D5229] underline" href={`tel:+91${SITE_DETAILS.phone}`}>+91 {SITE_DETAILS.phone}</a> पर फोन करें।</p>} />
      </PolicySection>
    </PolicyPage>
  );
}
