import type { Metadata } from "next";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection, policyListClass } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Indian Peoples Green Party",
  description: "How Indian Peoples Green Party reviews duplicate, mistaken, failed or disputed contribution transactions.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Refund & Cancellation Policy" hi="रिफंड और रद्दीकरण नीति" />}
      title={<L en="Help with contribution and transaction issues" hi="योगदान और लेन-देन संबंधी समस्याओं में सहायता" />}
      intro={<L en="Contributions are voluntary and are normally final after successful verification. Genuine transaction errors can be reported for review." hi="योगदान स्वैच्छिक होते हैं और सफल सत्यापन के बाद सामान्यतः अंतिम माने जाते हैं। वास्तविक लेन-देन त्रुटियों की समीक्षा के लिए सूचना दी जा सकती है।" />}
    >
      <PolicySection title={<L en="Successful contributions" hi="सफल योगदान" />}>
        <L en={<p>A successfully verified contribution cannot be cancelled in the same way as an order for goods or services because no product or service is being purchased. Requests involving a mistaken, duplicate or unauthorised transaction will nevertheless be reviewed on the available facts and under applicable rules.</p>} hi={<p>सफलतापूर्वक सत्यापित योगदान को वस्तुओं या सेवाओं के ऑर्डर की तरह रद्द नहीं किया जा सकता, क्योंकि कोई उत्पाद या सेवा खरीदी नहीं जा रही है। फिर भी गलती से हुए, दोहरे या अनधिकृत लेन-देन से संबंधित अनुरोधों की उपलब्ध तथ्यों और लागू नियमों के आधार पर समीक्षा की जाएगी।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Debit without a confirmed contribution" hi="पुष्टि के बिना खाते से राशि कटना" />}>
        <L en={<p>If an account is debited but the website does not show a successful confirmation, do not make another payment immediately. The transaction may still be pending or may be reversed by the bank or payment gateway. Contact us so the payment status can be checked against the available references.</p>} hi={<p>यदि खाते से राशि कट जाए लेकिन वेबसाइट पर सफल पुष्टि न दिखे, तो तुरंत दूसरा भुगतान न करें। लेन-देन अभी लंबित हो सकता है या बैंक अथवा पेमेंट गेटवे द्वारा वापस किया जा सकता है। उपलब्ध संदर्भों के आधार पर भुगतान की स्थिति जाँचने के लिए हमसे संपर्क करें।</p>} />
      </PolicySection>

      <PolicySection title={<L en="Duplicate, mistaken or unrecognised transactions" hi="दोहरे, गलती से हुए या अपरिचित लेन-देन" />}>
        <L
          en={<><p>Send a request to <a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> with:</p><ul className={policyListClass}><li>Contributor name and mobile number.</li><li>Contribution amount and transaction date.</li><li>Payment ID, order ID or bank reference, if available.</li><li>A short description of the issue.</li></ul><p>Do not send card numbers, CVV, UPI PINs, passwords or one-time passwords. We may request additional non-secret information that is reasonably needed to verify the transaction.</p></>}
          hi={<><p><a className="font-bold text-[#0D5229] underline" href={`mailto:${SITE_DETAILS.email}`}>{SITE_DETAILS.email}</a> पर इन विवरणों के साथ अनुरोध भेजें:</p><ul className={policyListClass}><li>योगदानकर्ता का नाम और मोबाइल नंबर।</li><li>योगदान राशि और लेन-देन की तारीख।</li><li>यदि उपलब्ध हो तो भुगतान ID, ऑर्डर ID या बैंक संदर्भ।</li><li>समस्या का संक्षिप्त विवरण।</li></ul><p>कार्ड नंबर, CVV, UPI PIN, पासवर्ड या वन-टाइम पासवर्ड न भेजें। लेन-देन सत्यापित करने के लिए उचित रूप से आवश्यक अतिरिक्त गैर-गोपनीय जानकारी माँगी जा सकती है।</p></>}
        />
      </PolicySection>

      <PolicySection title={<L en="Review and approved refunds" hi="समीक्षा और स्वीकृत रिफंड" />}>
        <L en={<p>A request is not an automatic guarantee of a refund. The transaction will be reviewed using available party, payment-gateway and banking records. If a refund is approved, it will be initiated through the appropriate payment channel and remains subject to applicable banking and payment-provider processes. No unsupported refund timeline is promised by this policy.</p>} hi={<p>अनुरोध करने से रिफंड की स्वतः गारंटी नहीं मिलती। उपलब्ध पार्टी, पेमेंट-गेटवे और बैंकिंग रिकॉर्ड के आधार पर लेन-देन की समीक्षा की जाएगी। यदि रिफंड स्वीकृत होता है, तो उसे उचित भुगतान माध्यम से शुरू किया जाएगा और वह लागू बैंकिंग तथा भुगतान-प्रदाता प्रक्रियाओं के अधीन रहेगा। यह नीति किसी अपुष्ट रिफंड समय-सीमा का वादा नहीं करती।</p>} />
      </PolicySection>
    </PolicyPage>
  );
}
