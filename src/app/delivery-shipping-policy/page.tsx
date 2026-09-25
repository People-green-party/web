import type { Metadata } from "next";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Delivery & Shipping Policy | Indian Peoples Green Party",
  description: "Delivery information for voluntary online contributions to Indian Peoples Green Party.",
};

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Delivery & Shipping Policy" hi="डिलीवरी और शिपिंग नीति" />}
      title={<L en="No physical delivery applies to contributions" hi="योगदान पर कोई भौतिक डिलीवरी लागू नहीं होती" />}
      intro={<L en={`The contribution facility on ${SITE_DETAILS.website} is for voluntary online contributions to ${SITE_DETAILS.legalName}, not for the sale of physical products.`} hi={`${SITE_DETAILS.website} पर उपलब्ध योगदान सुविधा ${SITE_DETAILS.legalName} को स्वैच्छिक ऑनलाइन योगदान देने के लिए है, भौतिक उत्पाद बेचने के लिए नहीं।`} />}
    >
      <PolicySection title={<L en="No goods or shipping" hi="कोई वस्तु या शिपिंग नहीं" />}>
        <L
          en={<p>No physical goods are sold, dispatched or delivered in exchange for a contribution. Shipping methods, courier charges and delivery timelines therefore do not apply to transactions completed through the contribution page.</p>}
          hi={<p>योगदान के बदले कोई भौतिक वस्तु बेची, भेजी या वितरित नहीं की जाती। इसलिए योगदान पृष्ठ से पूर्ण किए गए लेन-देन पर शिपिंग विधि, कूरियर शुल्क या डिलीवरी समय लागू नहीं होता।</p>}
        />
      </PolicySection>

      <PolicySection title={<L en="Electronic transaction confirmation" hi="इलेक्ट्रॉनिक लेन-देन की पुष्टि" />}>
        <L
          en={<p>Contributions are processed electronically through a payment gateway. After successful verification, the website may display an electronic confirmation and make a contribution receipt available where the transaction flow supports it.</p>}
          hi={<p>योगदान पेमेंट गेटवे के माध्यम से इलेक्ट्रॉनिक रूप से संसाधित किए जाते हैं। सफल सत्यापन के बाद वेबसाइट इलेक्ट्रॉनिक पुष्टि दिखा सकती है और जहाँ लेन-देन प्रक्रिया इसका समर्थन करती है, वहाँ योगदान की रसीद उपलब्ध करा सकती है।</p>}
        />
      </PolicySection>

      <PolicySection title={<L en="Missing confirmation" hi="पुष्टि न मिलने पर" />}>
        <L
          en={<p>If your account is debited but no confirmation is shown, do not immediately repeat the payment. Contact <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> with the available transaction reference so the status can be reviewed.</p>}
          hi={<p>यदि आपके खाते से राशि कट जाए लेकिन कोई पुष्टि न दिखे, तो तुरंत दोबारा भुगतान न करें। स्थिति की समीक्षा के लिए उपलब्ध लेन-देन संदर्भ के साथ <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> पर संपर्क करें।</p>}
        />
      </PolicySection>
    </PolicyPage>
  );
}
