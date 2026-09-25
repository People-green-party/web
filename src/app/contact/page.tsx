import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { LocalizedContent as L } from "../../components/LocalizedContent";
import { PolicyPage, PolicySection, policyListClass } from "../../components/PolicyPage";
import { SITE_DETAILS } from "../../lib/siteDetails";

export const metadata: Metadata = {
  title: "Contact Indian Peoples Green Party",
  description: "Official contact details for Indian Peoples Green Party, including donation and transaction support.",
};

export default function ContactPage() {
  return (
    <PolicyPage
      eyebrow={<L en="Contact Us" hi="संपर्क करें" />}
      title={<L en={`Contact ${SITE_DETAILS.legalName}`} hi={`${SITE_DETAILS.legalName} से संपर्क करें`} />}
      intro={<L en="Use the official contact details below for general enquiries, contribution questions and payment or transaction support." hi="सामान्य प्रश्नों, योगदान संबंधी प्रश्नों और भुगतान या लेन-देन सहायता के लिए नीचे दिए गए आधिकारिक संपर्क विवरण का उपयोग करें।" />}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <a href={`mailto:${SITE_DETAILS.email}`} className="rounded-2xl border border-[#DDEEE4] p-5 transition-colors hover:bg-[#F5FBF7]">
          <Mail className="mb-4 text-[#0D5229]" aria-hidden="true" />
          <span className="block text-sm font-bold uppercase tracking-wide text-[#587E67]"><L en="Email" hi="ईमेल" /></span>
          <span className="mt-1 block break-all font-semibold text-[#04330B]">{SITE_DETAILS.email}</span>
        </a>
        <a href={`tel:+91${SITE_DETAILS.phone}`} className="rounded-2xl border border-[#DDEEE4] p-5 transition-colors hover:bg-[#F5FBF7]">
          <Phone className="mb-4 text-[#0D5229]" aria-hidden="true" />
          <span className="block text-sm font-bold uppercase tracking-wide text-[#587E67]"><L en="Phone" hi="फोन" /></span>
          <span className="mt-1 block font-semibold text-[#04330B]">+91 {SITE_DETAILS.phone}</span>
        </a>
        <div className="rounded-2xl border border-[#DDEEE4] p-5">
          <MapPin className="mb-4 text-[#0D5229]" aria-hidden="true" />
          <span className="block text-sm font-bold uppercase tracking-wide text-[#587E67]"><L en="Office" hi="कार्यालय" /></span>
          <span className="mt-1 block font-semibold text-[#04330B]"><L en={SITE_DETAILS.address} hi={SITE_DETAILS.addressHi} /></span>
        </div>
      </div>

      <PolicySection title={<L en="How we can help" hi="हम कैसे सहायता कर सकते हैं" />}>
        <L
          en={<ul className={policyListClass}><li>General questions about {SITE_DETAILS.legalName} and its public activities.</li><li>Questions about making a voluntary online contribution.</li><li>Help with a failed, pending, duplicate or unrecognised transaction.</li><li>Requests concerning a contribution confirmation or receipt.</li><li>Privacy questions relating to information submitted through this website.</li></ul>}
          hi={<ul className={policyListClass}><li>{SITE_DETAILS.legalName} और उसकी सार्वजनिक गतिविधियों से संबंधित सामान्य प्रश्न।</li><li>स्वैच्छिक ऑनलाइन योगदान करने से संबंधित प्रश्न।</li><li>विफल, लंबित, दोहरे या अपरिचित लेन-देन में सहायता।</li><li>योगदान की पुष्टि या रसीद से संबंधित अनुरोध।</li><li>इस वेबसाइट के माध्यम से दी गई जानकारी से संबंधित गोपनीयता प्रश्न।</li></ul>}
        />
      </PolicySection>

      <PolicySection title={<L en="For transaction support" hi="लेन-देन सहायता के लिए" />}>
        <L
          en={<p>Email us from the contact address used for the enquiry and include the contributor&apos;s name, mobile number, contribution amount, transaction date and the payment, order or bank reference available to you. Do not email card numbers, CVV, UPI PINs, passwords or one-time passwords.</p>}
          hi={<p>पूछताछ के लिए उपयोग किए गए संपर्क पते से हमें ईमेल करें और योगदानकर्ता का नाम, मोबाइल नंबर, योगदान राशि, लेन-देन की तारीख तथा उपलब्ध भुगतान, ऑर्डर या बैंक संदर्भ शामिल करें। कार्ड नंबर, CVV, UPI PIN, पासवर्ड या वन-टाइम पासवर्ड ईमेल न करें।</p>}
        />
      </PolicySection>
    </PolicyPage>
  );
}
