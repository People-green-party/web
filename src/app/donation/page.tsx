"use client";

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Check,
} from 'lucide-react';
import { useLanguage } from "../../components/LanguageContext";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { fetchApi } from "../../lib/api";
import { FormFieldLabel, RequiredMark } from "../../components/FormFieldLabel";

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; contact: string; email?: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal?: { ondismiss: () => void };
};

type DonationReceipt = {
  donationId: number;
  paymentId: string;
  orderId: string;
  fullName: string;
  amount: number;
  paidAt: string;
  pan?: string;
  receiptToken: string;
};

type PaymentOutcome = "idle" | "cancelled" | "failed" | "pending-verification" | "success";

const RECEIPT_STORAGE_KEY = "pgp-latest-donation-receipt";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpayCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load secure checkout.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load secure checkout."));
    document.body.appendChild(script);
  });
}

// --- 1. Translation Data ---

const translations = {
  en: {
    hero: {
      titleLines: [
        "Fight for Bringing",
        "the Change. Fight for",
        "Democracy."
      ],
      subTitle: "Every Indian Deserves a System That Works For Them",
      p1: "You have watched it happen. A VIP convoy brings an entire road to a standstill while hundreds of ordinary citizens sit waiting — late for work, late for school, late for a hospital appointment. Nobody is held accountable. Nobody is even questioned.",
      p2: "You have read about it. A forest that communities depended on for generations, cleared overnight for a project that somehow bypassed every environmental safeguard that existed to prevent exactly this. The paperwork was approved. The trees are gone.",
      p3: "You have lived it. A road, a bridge, a civic facility promised to your neighbourhood — funded, announced, inaugurated — and then abandoned. The money was spent. The work was not done. And nothing happened to anyone responsible.",
      p4: "This is not bad luck. This is a system operating exactly as it has been allowed to operate — without consequence, without transparency, and without fear of accountability.",
      p5: "Peoples Green Party is changing that.",
      p6: "We are a political and civic movement rooted in Rajasthan, fighting for every Indian citizen’s constitutional right to equality, dignity, and a government that answers to the people who fund it.",
      p7: "Fight with us. Fight for Bringing the Change."
    },
    form: {
      title: "Donate to PGP",
      subtitle: "Your contribution helps us build a stronger movement.",
      citizen: "Are you an Indian citizen?",
      yes: "Yes",
      no: "No",
      name: "Full Name",
      mobile: "Mobile Number",
      amount: "Donation Amount",
      other: "Other",
      otherAmount: "Enter another amount (₹)",
      mobileHint: "10-digit mobile number",
      address: "Address",
      state: "State",
      city: "City",
      pincode: "PIN Code",
      pinHint: "6-digit PIN",
      nonCitizen: "Only Indian citizens can make political donations.",
      taxDocumentation: "I need tax deduction documentation",
      pan: "PAN",
      panHint: "ABCDE1234F",
      panReason: "PAN is required for contributions above ₹20,000 or when tax documentation is requested.",
      declaration: "I confirm that I am an Indian citizen and the information provided by me is correct.",
      submit: "Continue to Donate →",
      retry: "Try Payment Again →",
      opening: "Opening payment…",
      receiptTitle: "Donation confirmed",
      receiptNumber: "Receipt number",
      downloadReceipt: "Download Receipt (PDF)",
      privacyTitle: "Privacy & data use",
      privacyText: "We use the information entered here only to process the donation, issue a receipt, maintain legally required records and contact you about this payment. Card, bank and UPI credentials are handled by Razorpay and are not stored by PGP.",
      refundTitle: "Cancellation & refund information",
      refundText: "Donations are normally final. For a duplicate, mistaken or unauthorised payment, contact partypeoplesgreen@gmail.com with the payment ID. Eligible requests will be reviewed according to applicable law and payment-provider rules.",
      taxNote: "Eligible non-cash political contributions may qualify for deduction under Section 80GGC. Eligibility depends on the donor's circumstances; this is not tax advice.",
      messages: {
        declaration: "Please accept the declaration to continue.",
        required: "Please complete all required fields.",
        phone: "Please enter a valid 10-digit mobile number.",
        amount: "Donation amount must be a whole number of at least ₹1.",
        pincode: "Please enter a valid 6-digit PIN code.",
        pan: "Please enter a valid PAN, for example ABCDE1234F.",
        success: "Thank you! Your donation has been confirmed.",
        cancelled: "The payment window closed before confirmation. If your account was debited, do not retry; contact us with the bank reference. Otherwise, you can try again.",
        startFailed: "Unable to start payment. Please try again.",
        pendingVerification: "Your payment was completed, but confirmation is pending. Please do not pay again; contact us with the payment ID shown below."
      }
    },
    campaigns: {
      title: "Fund for democracy"
    }
  },
  hi: {
    hero: {
      titleLines: [
        "बदलाव लाने के लिए",
        "संघर्ष करें। लोकतंत्र के लिए",
        "संघर्ष करें।"
      ],
      subTitle: "हर भारतीय एक ऐसे सिस्टम का हकदार है जो उनके लिए काम करे",
      p1: "आपने इसे होते हुए देखा है। एक वीआईपी काफिला पूरी सड़क को ठप कर देता है जबकि सैकड़ों आम नागरिक बैठे इंतजार करते हैं — काम के लिए देर, स्कूल के लिए देर, अस्पताल के अपॉइंटमेंट के लिए देर। किसी को जवाबदेह नहीं ठहराया जाता। किसी से पूछताछ तक नहीं की जाती।",
      p2: "आपने इसके बारे में पढ़ा है। एक जंगल जिस पर पीढ़ियों से समुदाय निर्भर थे, रातों-रात एक ऐसी परियोजना के लिए साफ कर दिया गया जिसने किसी तरह हर उस पर्यावरणीय सुरक्षा उपाय को बायपास कर दिया जो इसे रोकने के लिए बनाया गया था। कागजी कार्रवाई मंजूर हो गई। पेड़ गायब हो गए।",
      p3: "आपने इसे जिया है। आपके पड़ोस में वादा की गई एक सड़क, एक पुल, एक नागरिक सुविधा — वित्त पोषित, घोषित, उद्घाटित — और फिर लावारिस छोड़ दी गई। पैसा खर्च हो गया। काम नहीं हुआ। और जिम्मेदार किसी भी व्यक्ति का कुछ नहीं बिगड़ा।",
      p4: "यह दुर्भाग्य नहीं है। यह एक ऐसी व्यवस्था है जो ठीक वैसे ही चल रही है जैसे उसे चलने की अनुमति दी गई है — बिना किसी परिणाम के, बिना किसी पारदर्शिता के, और बिना किसी जवाबदेही के डर के।",
      p5: "पीपल्स ग्रीन पार्टी इसे बदल रही है।",
      p6: "हम राजस्थान में निहित एक राजनीतिक और नागरिक आंदोलन हैं, जो हर भारतीय नागरिक के समानता, गरिमा के संवैधानिक अधिकार और एक ऐसी सरकार के लिए लड़ रहे हैं जो उन लोगों को जवाब देती है जो इसे वित्तपोषित करते हैं।",
      p7: "हमारे साथ लड़ें। बदलाव लाने के लिए लड़ें।"
    },
    form: {
      title: "PGP को दान करें",
      subtitle: "आपका योगदान हमें एक मजबूत आंदोलन बनाने में मदद करता है।",
      citizen: "क्या आप भारतीय नागरिक हैं?",
      yes: "हाँ",
      no: "नहीं",
      name: "पूरा नाम",
      mobile: "मोबाइल नंबर",
      amount: "दान राशि",
      other: "अन्य",
      otherAmount: "अन्य राशि दर्ज करें (₹)",
      mobileHint: "10 अंकों का मोबाइल नंबर",
      address: "पता",
      state: "राज्य",
      city: "शहर",
      pincode: "पिन कोड",
      pinHint: "6 अंकों का पिन",
      nonCitizen: "केवल भारतीय नागरिक ही राजनीतिक दान कर सकते हैं।",
      taxDocumentation: "मुझे कर कटौती के लिए दस्तावेज चाहिए",
      pan: "PAN",
      panHint: "ABCDE1234F",
      panReason: "₹20,000 से अधिक दान या कर दस्तावेज के लिए PAN आवश्यक है।",
      declaration: "मैं पुष्टि करता/करती हूँ कि मैं भारतीय नागरिक हूँ और मेरे द्वारा दी गई जानकारी सही है।",
      submit: "दान के लिए आगे बढ़ें →",
      retry: "भुगतान फिर से करें →",
      opening: "भुगतान खोला जा रहा है…",
      receiptTitle: "दान की पुष्टि हो गई",
      receiptNumber: "रसीद संख्या",
      downloadReceipt: "रसीद PDF डाउनलोड करें",
      privacyTitle: "गोपनीयता और डेटा का उपयोग",
      privacyText: "यहाँ दी गई जानकारी का उपयोग केवल दान प्रोसेस करने, रसीद देने, कानूनी रिकॉर्ड रखने और इस भुगतान के संबंध में संपर्क करने के लिए होता है। कार्ड, बैंक और UPI जानकारी Razorpay संभालता है; PGP इसे संग्रहीत नहीं करता।",
      refundTitle: "रद्दीकरण और रिफंड जानकारी",
      refundText: "दान सामान्यतः अंतिम होता है। दोहरे, गलती से हुए या अनधिकृत भुगतान के लिए payment ID के साथ partypeoplesgreen@gmail.com पर संपर्क करें। पात्र अनुरोधों की लागू कानून और भुगतान प्रदाता के नियमों के अनुसार समीक्षा की जाएगी।",
      taxNote: "पात्र गैर-नकद राजनीतिक दान धारा 80GGC के तहत कटौती के लिए पात्र हो सकते हैं। पात्रता दाता की परिस्थितियों पर निर्भर करती है; यह कर सलाह नहीं है।",
      messages: {
        declaration: "कृपया आगे बढ़ने के लिए घोषणा स्वीकार करें।",
        required: "कृपया सभी आवश्यक जानकारी भरें।",
        phone: "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।",
        amount: "दान राशि कम से कम ₹1 की पूर्ण संख्या होनी चाहिए।",
        pincode: "कृपया 6 अंकों का सही पिन कोड दर्ज करें।",
        pan: "कृपया सही PAN दर्ज करें, जैसे ABCDE1234F।",
        success: "धन्यवाद! आपके दान की पुष्टि हो गई है।",
        cancelled: "पुष्टि से पहले भुगतान विंडो बंद हो गई। यदि खाते से राशि कटी है तो दोबारा भुगतान न करें; bank reference के साथ हमसे संपर्क करें। अन्यथा आप फिर से प्रयास कर सकते हैं।",
        startFailed: "भुगतान शुरू नहीं हो सका। कृपया फिर से प्रयास करें।",
        pendingVerification: "आपका भुगतान पूरा हो गया, लेकिन पुष्टि लंबित है। कृपया दोबारा भुगतान न करें; नीचे दी गई payment ID के साथ हमसे संपर्क करें।"
      }
    },
    campaigns: {
      title: "लोकतंत्र के लिए फंड"
    }
  }
};

// --- Helper Component: Image with Fallback ---
const ImageWithFallback = ({
  src,
  fallback,
  alt,
  className
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

// --- 4. Main Page Component ---

const DonationPageContent = () => {
  // Use the global language context, but fall back to 'en' content from local translations 
  // because global translations file doesn't have form labels yet.
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [isDeclared, setIsDeclared] = useState(false);
  const [wantsTaxDocumentation, setWantsTaxDocumentation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [paymentOutcome, setPaymentOutcome] = useState<PaymentOutcome>("idle");
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState("");
  const [form, setForm] = useState({
    citizen: "" as "" | "yes" | "no",
    fullName: "",
    phone: "",
    pan: "",
    amount: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const panRequired = Number(form.amount) > 20000 || wantsTaxDocumentation;

  useEffect(() => {
    let active = true;
    try {
      const saved = JSON.parse(window.localStorage.getItem(RECEIPT_STORAGE_KEY) || "null") as {
        donationId?: number;
        receiptToken?: string;
      } | null;
      if (!saved?.donationId || !saved.receiptToken) return;
      fetchApi(`donations/${saved.donationId}/receipt`, {
        method: "POST",
        body: JSON.stringify({ token: saved.receiptToken }),
        cache: "no-store",
      })
        .then((restored) => {
          if (active) setReceipt(restored as DonationReceipt);
        })
        .catch(() => window.localStorage.removeItem(RECEIPT_STORAGE_KEY));
    } catch {
      window.localStorage.removeItem(RECEIPT_STORAGE_KEY);
    }
    return () => {
      active = false;
    };
  }, []);

  const downloadReceipt = () => {
    if (!receipt) return;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setTextColor(4, 51, 11);
    pdf.setFontSize(20);
    pdf.text("Peoples Green Party", 20, 24);
    pdf.setFontSize(15);
    pdf.text("Donation Receipt", 20, 35);
    pdf.setDrawColor(197, 220, 207);
    pdf.line(20, 41, 190, 41);
    pdf.setTextColor(40, 55, 44);
    pdf.setFontSize(11);
    const rows = [
      ["Receipt number", `PGP-${receipt.donationId}`],
      ["Donation date", new Date(receipt.paidAt).toLocaleString("en-IN")],
      ["Donor name", receipt.fullName],
      ["Amount", `INR ${receipt.amount.toLocaleString("en-IN")}`],
      ["Payment ID", receipt.paymentId],
      ["Order ID", receipt.orderId],
      ...(receipt.pan ? [["PAN", receipt.pan]] : []),
      ["Payment status", "Confirmed"],
    ];
    rows.forEach(([label, value], index) => {
      const y = 53 + index * 10;
      pdf.setFont("helvetica", "bold");
      pdf.text(`${label}:`, 20, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(String(value), 62, y);
    });
    pdf.setFontSize(9);
    pdf.setTextColor(88, 126, 103);
    const note = "This receipt acknowledges a verified non-cash political contribution. Tax-deduction eligibility depends on the donor's circumstances.";
    pdf.text(pdf.splitTextToSize(note, 170), 20, 145);
    pdf.text("Peoples Green Party, Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan", 20, 172, { maxWidth: 170 });
    pdf.text("Contact: partypeoplesgreen@gmail.com", 20, 184);
    pdf.save(`PGP-donation-receipt-${receipt.donationId}.pdf`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMsg(null);
    setPaymentOutcome("idle");
    setPendingPaymentId("");
    if (!isDeclared) {
      setSubmitMsg({ type: "err", text: t.form.messages.declaration });
      return;
    }
    if (form.citizen !== "yes") {
      setSubmitMsg({ type: "err", text: t.form.nonCitizen });
      return;
    }
    const amount = Number(form.amount);
    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);
    if (
      !form.fullName.trim() || !phoneDigits || !amount || !form.address.trim() ||
      !form.state.trim() || !form.city.trim() || !form.pincode.trim()
    ) {
      setSubmitMsg({ type: "err", text: t.form.messages.required });
      return;
    }
    if (!Number.isSafeInteger(amount) || amount < 1) {
      setSubmitMsg({ type: "err", text: t.form.messages.amount });
      return;
    }
    if (phoneDigits.length !== 10) {
      setSubmitMsg({ type: "err", text: t.form.messages.phone });
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setSubmitMsg({ type: "err", text: t.form.messages.pincode });
      return;
    }
    const normalizedPan = form.pan.trim().toUpperCase();
    if (panRequired && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
      setSubmitMsg({ type: "err", text: t.form.messages.pan });
      return;
    }
    setSubmitting(true);
    try {
      const order = await fetchApi("donations/razorpay/order", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: phoneDigits,
          pan: panRequired ? normalizedPan : undefined,
          amount,
          country: "India",
          address: form.address.trim(),
          state: form.state.trim(),
          city: form.city.trim(),
          pincode: form.pincode,
        }),
      }) as {
        donationId: number;
        orderId: string;
        keyId: string;
        amount: number;
        currency: string;
      };
      await loadRazorpayCheckout();
      if (!window.Razorpay) throw new Error("Unable to load secure checkout.");

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Peoples Green Party",
        description: "Donation",
        order_id: order.orderId,
        prefill: {
          name: form.fullName.trim(),
          contact: phoneDigits,
        },
        theme: { color: "#04330B" },
        modal: {
          ondismiss: () => {
            setPaymentOutcome("cancelled");
            setSubmitMsg({ type: "err", text: t.form.messages.cancelled });
            setSubmitting(false);
          },
        },
        handler: async (payment) => {
          try {
            const verification = await fetchApi("donations/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpayOrderId: payment.razorpay_order_id,
                razorpaySignature: payment.razorpay_signature,
              }),
            }) as DonationReceipt;
            setReceipt(verification);
            window.localStorage.setItem(
              RECEIPT_STORAGE_KEY,
              JSON.stringify({
                donationId: verification.donationId,
                receiptToken: verification.receiptToken,
              }),
            );
            setPaymentOutcome("success");
            setSubmitMsg({ type: "ok", text: t.form.messages.success });
            setForm({
              citizen: "",
              fullName: "",
              phone: "",
              pan: "",
              amount: "",
              address: "",
              state: "",
              city: "",
              pincode: "",
            });
            setIsDeclared(false);
            setWantsTaxDocumentation(false);
          } catch {
            setPendingPaymentId(payment.razorpay_payment_id);
            setPaymentOutcome("pending-verification");
            setSubmitMsg({ type: "err", text: t.form.messages.pendingVerification });
          } finally {
            setSubmitting(false);
          }
        },
      });
      checkout.open();
    } catch {
      setPaymentOutcome("failed");
      setSubmitMsg({ type: "err", text: t.form.messages.startFailed });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-[70px] lg:pt-[92px]">
      <Navbar />

      {/* Main Content: Text + Form */}
      <section className="w-full flex justify-center py-[40px] lg:py-[80px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col-reverse lg:flex-row gap-[48px] lg:gap-[64px] items-stretch lg:items-end justify-between">

          {/* LEFT: Text Section */}
          <div className="w-full lg:w-[50%] flex flex-col gap-[20px]">
            <h1 className="font-['Familjen_Grotesk'] font-bold text-[clamp(28px,5.4vw,73px)] leading-[1.15] text-[#04330B] tracking-[-0.5px]">
              {t.hero.titleLines.map((line) => (
                <span key={line} className="block whitespace-nowrap">{line}</span>
              ))}
            </h1>

            <p className="font-['Familjen_Grotesk'] font-bold text-[16px] lg:text-[20px] text-[#04330B] leading-[1.4]">
              {t.hero.subTitle}
            </p>

            <div className="flex flex-col gap-[18px] font-sans text-[15px] lg:text-[17.5px] leading-[1.6] text-[#2D3A31]">
              <p>{t.hero.p1}</p>
              <p>{t.hero.p2}</p>
              <p>{t.hero.p3}</p>
              <p>{t.hero.p4}</p>
              <p className="font-bold text-[#04330B]">{t.hero.p5}</p>
              <p>{t.hero.p6}</p>
              <p className="font-bold text-[#04330B]">{t.hero.p7}</p>
            </div>
          </div>

          {/* RIGHT: Donation Form with Premium Effects */}
          <div className="w-full lg:w-[46%] lg:max-w-[560px] shrink-0 bg-white rounded-[16px] p-[24px] lg:p-[32px] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] border border-[#EFF5F1] flex flex-col justify-center relative">

            <div className="relative z-10">
              <h2 className="text-center font-['Familjen_Grotesk'] font-bold text-[32px] text-[#04330B] mb-[8px]">
                {t.form.title}
              </h2>
              <p className="text-center font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] mb-[12px]">
                {t.form.subtitle}
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-[18px] relative z-10">
              {receipt ? (
                <div className="rounded-[12px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900" role="status">
                  <p className="font-bold text-lg">{t.form.receiptTitle}</p>
                  <p className="mt-1 text-sm">{t.form.receiptNumber}: PGP-{receipt.donationId}</p>
                  <p className="text-sm">INR {receipt.amount.toLocaleString("en-IN")} · {receipt.paymentId}</p>
                  <button type="button" onClick={downloadReceipt} className="mt-3 rounded-[8px] bg-[#04330B] px-4 py-2 text-sm font-bold text-white hover:bg-[#064e11]">
                    {t.form.downloadReceipt}
                  </button>
                </div>
              ) : null}

              <fieldset className="flex flex-col gap-2">
                <legend className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">
                  {t.form.citizen}<RequiredMark />
                </legend>
                <div className="flex gap-6">
                  {(["yes", "no"] as const).map((choice) => (
                    <label key={choice} className="flex items-center gap-2 cursor-pointer text-[15px] font-medium text-[#2D3A31]">
                      <input
                        type="radio"
                        name="citizen"
                        value={choice}
                        checked={form.citizen === choice}
                        onChange={() => setField("citizen", choice)}
                        className="size-4 accent-[#04330B]"
                      />
                      {choice === "yes" ? t.form.yes : t.form.no}
                    </label>
                  ))}
                </div>
                {form.citizen === "no" ? <p className="text-sm font-semibold text-red-700">{t.form.nonCitizen}</p> : null}
              </fieldset>

              <div className="flex flex-col gap-2">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.name}</FormFieldLabel>
                <input required type="text" autoComplete="name" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} placeholder={t.form.name} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
              </div>

              <div className="flex flex-col gap-2">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.mobile}</FormFieldLabel>
                <div className="flex gap-2">
                  <div className="w-[68px] h-[52px] rounded-[8px] border border-[#C5DCCF] flex items-center justify-center font-semibold text-[#587E67] bg-[#F9FBF9]">+91</div>
                  <input required type="tel" autoComplete="tel-national" value={form.phone} onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={t.form.mobileHint} inputMode="numeric" maxLength={10} className="min-w-0 flex-1 h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.amount}</FormFieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[500, 1000, 2000].map((value) => (
                    <button key={value} type="button" onClick={() => setField("amount", String(value))} className={`h-[46px] rounded-[8px] border font-bold transition-colors ${form.amount === String(value) ? "border-[#04330B] bg-[#04330B] text-white" : "border-[#C5DCCF] text-[#04330B] hover:bg-[#F0F7F2]"}`}>
                      ₹ {value.toLocaleString("en-IN")}
                    </button>
                  ))}
                  <button type="button" onClick={() => setField("amount", "")} className={`h-[46px] rounded-[8px] border font-bold transition-colors ${form.amount !== "" && !["500", "1000", "2000"].includes(form.amount) ? "border-[#04330B] bg-[#04330B] text-white" : "border-[#C5DCCF] text-[#04330B] hover:bg-[#F0F7F2]"}`}>{t.form.other}</button>
                </div>
                <input required type="number" min="1" step="1" inputMode="numeric" value={form.amount} onChange={(e) => setField("amount", /^\d*$/.test(e.target.value) ? e.target.value : form.amount)} placeholder={t.form.otherAmount} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={wantsTaxDocumentation} onChange={(e) => setWantsTaxDocumentation(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#04330B]" />
                <span className="text-[14px] font-medium text-[#2D3A31]">{t.form.taxDocumentation}</span>
              </label>

              {panRequired ? (
                <div className="flex flex-col gap-2">
                  <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.pan}</FormFieldLabel>
                  <input required type="text" autoCapitalize="characters" value={form.pan} onChange={(e) => setField("pan", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))} placeholder={t.form.panHint} maxLength={10} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium uppercase tracking-wide text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
                  <p className="text-xs leading-relaxed text-[#587E67]">{t.form.panReason}</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.address}</FormFieldLabel>
                <textarea required autoComplete="street-address" rows={3} value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder={t.form.address} className="w-full rounded-[8px] border border-[#C5DCCF] px-4 py-3 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B] resize-y" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.state}</FormFieldLabel>
                  <input required autoComplete="address-level1" type="text" value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder={t.form.state} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
                </div>
                <div className="flex flex-col gap-2">
                  <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.city}</FormFieldLabel>
                  <input required autoComplete="address-level2" type="text" value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder={t.form.city} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:max-w-[50%]">
                <FormFieldLabel required className="font-['Familjen_Grotesk'] font-semibold text-[14px] text-[#04330B]">{t.form.pincode}</FormFieldLabel>
                <input required autoComplete="postal-code" type="text" inputMode="numeric" value={form.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={t.form.pinHint} maxLength={6} className="w-full h-[52px] rounded-[8px] border border-[#C5DCCF] px-4 font-medium text-[16px] text-[#04330B] placeholder-[#789080] focus:outline-none focus:border-[#04330B]" />
              </div>

              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <input type="checkbox" checked={isDeclared} onChange={(e) => setIsDeclared(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#BE1E2D]" />
                <span className="font-['Familjen_Grotesk'] font-medium text-[13px] leading-[1.45] text-[#587E67]">
                  {t.form.declaration}<RequiredMark />
                </span>
              </label>

              {submitMsg ? (
                <p
                  className={`text-sm font-semibold rounded-[8px] px-3 py-2 ${
                    submitMsg.type === "ok"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {submitMsg.text}
                  {pendingPaymentId ? <span className="mt-1 block break-all font-mono text-xs">Payment ID: {pendingPaymentId}</span> : null}
                </p>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                className={`
                  w-full h-[60px] rounded-[12px] font-['Familjen_Grotesk'] font-bold text-[18px] text-white transition-all shadow-lg
                  ${isDeclared && form.citizen === "yes" && paymentOutcome !== "pending-verification" && !submitting ? 'bg-[#04330B] hover:bg-[#064e11] hover:scale-[1.02]' : 'bg-gray-400 cursor-not-allowed'}
                `}
                disabled={!isDeclared || form.citizen !== "yes" || paymentOutcome === "pending-verification" || submitting}
              >
                {submitting ? t.form.opening : paymentOutcome === "failed" || paymentOutcome === "cancelled" ? t.form.retry : t.form.submit}
              </button>

              <div id="donation-policies" className="border-t border-[#E3EEE6] pt-3 text-xs leading-relaxed text-[#587E67]">
                <details className="py-1">
                  <summary className="cursor-pointer font-bold text-[#04330B]">{t.form.privacyTitle}</summary>
                  <p className="pt-2">{t.form.privacyText}</p>
                </details>
                <details className="py-1">
                  <summary className="cursor-pointer font-bold text-[#04330B]">{t.form.refundTitle}</summary>
                  <p className="pt-2">{t.form.refundText}</p>
                </details>
                <p className="mt-2">{t.form.taxNote}</p>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Campaigns section */}
      <section className="w-full flex justify-center bg-[#F9FBF9] py-[64px] lg:py-[80px] border-t border-[#EFF5F1]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8 flex flex-col items-center">
          <h2 className="text-center font-['Familjen_Grotesk'] font-bold text-[28px] md:text-[36px] lg:text-[44px] text-[#04330B] mb-[40px] lg:mb-[48px]">
            {t.campaigns.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] lg:gap-[32px] w-full">
            {[
              { en: "/Donation/Accountable.jpeg", hi: "/Donation/Accountable(hindi).png", alt: "Accountable" },
              { en: "/Donation/Democracy.jpeg", hi: "/Donation/Democracy(hindi).png", alt: "Democracy" },
              { en: "/Donation/Envronment.jpeg", hi: "/Donation/Envronment(hindi).png", alt: "Environment" }
            ].map((item, index) => {
              const currentSrc = language === 'hi' ? item.hi : item.en;

              return (
                <div
                  key={index}
                  className="bg-white rounded-[16px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.04)] border border-[#EFF5F1] group transition-all duration-300 hover:shadow-[0px_20px_40px_rgba(4,51,11,0.1)] hover:-translate-y-[4px]"
                >
                  <div className="aspect-[959/512] relative overflow-hidden bg-gray-50">
                    <ImageWithFallback
                      src={currentSrc}
                      fallback={item.en}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default function DonationPage() {
  return <DonationPageContent />;
}
