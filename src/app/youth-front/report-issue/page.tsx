"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { AlertCircle, CheckCircle2, MapPin, Upload } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { RequireAuth } from "../../components/RequireAuth";
import { FormFieldLabel } from "../../../components/FormFieldLabel";
import { useLanguage } from "../../../components/LanguageContext";

const COPY = {
  en: {
    title: "Report an Issue",
    subtitle: "Help us identify and solve problems in your community.",
    submitted: "Issue Submitted!",
    submittedMsg: "Your issue has been recorded. We will review it and take action.",
    redirecting: "Redirecting to dashboard...",
    issueTitle: "Issue Title",
    issueTitlePh: "Brief title of the issue",
    category: "Category",
    selectCategory: "Select category",
    description: "Description",
    descriptionPh: "Describe the issue in detail",
    district: "District",
    districtPh: "District name",
    ward: "Ward",
    wardPh: "Ward number/name",
    village: "Village",
    villagePh: "Village name",
    locality: "Locality",
    localityPh: "Locality/Mohalla",
    location: "Location Description",
    locationPh: "Specific location (landmark, building, etc.)",
    gps: "GPS Coordinates (Optional)",
    gpsPh: "Latitude, Longitude",
    gpsFail: "Unable to get location",
    urgency: "Urgency",
    selectUrgency: "Select urgency",
    urgEmergency: "Emergency - Immediate action needed",
    urgHigh: "High - Action needed within 24 hours",
    urgNormal: "Normal - Routine issue",
    urgLow: "Low - Minor issue",
    proof: "Proof URL (Photo/Video)",
    proofPh: "Link to photo or video evidence",
    submit: "Submit Issue",
    submitting: "Submitting...",
    required: (label: string) => `${label} is required.`,
    categories: [
      "Campus",
      "Road",
      "Water",
      "Electricity",
      "Corruption",
      "Environment",
      "Forest",
      "Waste",
      "PublicTransport",
      "Unemployment",
      "Health",
      "Education",
      "Other",
    ] as const,
    categoryLabels: {
      Campus: "Campus",
      Road: "Road",
      Water: "Water",
      Electricity: "Electricity",
      Corruption: "Corruption",
      Environment: "Environment",
      Forest: "Forest",
      Waste: "Waste",
      PublicTransport: "Public Transport",
      Unemployment: "Unemployment",
      Health: "Health",
      Education: "Education",
      Other: "Other",
    } as Record<string, string>,
  },
  hi: {
    title: "समस्या रिपोर्ट करें",
    subtitle: "अपने समुदाय की समस्याओं को पहचानने और हल करने में हमारी मदद करें।",
    submitted: "समस्या दर्ज हो गई!",
    submittedMsg: "आपकी समस्या दर्ज कर ली गई है। हम इसकी समीक्षा कर कार्रवाई करेंगे।",
    redirecting: "डैशबोर्ड पर जा रहे हैं...",
    issueTitle: "समस्या का शीर्षक",
    issueTitlePh: "समस्या का संक्षिप्त शीर्षक",
    category: "श्रेणी",
    selectCategory: "श्रेणी चुनें",
    description: "विवरण",
    descriptionPh: "समस्या का विस्तृत विवरण लिखें",
    district: "ज़िला",
    districtPh: "ज़िले का नाम",
    ward: "वार्ड",
    wardPh: "वार्ड नंबर/नाम",
    village: "गाँव",
    villagePh: "गाँव का नाम",
    locality: "मोहल्ला / इलाका",
    localityPh: "मोहल्ला / इलाका",
    location: "स्थान का विवरण",
    locationPh: "विशेष स्थान (लैंडमार्क, भवन आदि)",
    gps: "GPS निर्देशांक (वैकल्पिक)",
    gpsPh: "अक्षांश, देशांतर",
    gpsFail: "लोकेशन नहीं मिल सकी",
    urgency: "तात्कालिकता",
    selectUrgency: "तात्कालिकता चुनें",
    urgEmergency: "आपातकाल - तुरंत कार्रवाई आवश्यक",
    urgHigh: "उच्च - 24 घंटे में कार्रवाई",
    urgNormal: "सामान्य - नियमित समस्या",
    urgLow: "कम - छोटी समस्या",
    proof: "प्रमाण लिंक (फोटो/वीडियो)",
    proofPh: "फोटो या वीडियो प्रमाण का लिंक",
    submit: "समस्या जमा करें",
    submitting: "जमा हो रहा है...",
    required: (label: string) => `${label} आवश्यक है।`,
    categories: [
      "Campus",
      "Road",
      "Water",
      "Electricity",
      "Corruption",
      "Environment",
      "Forest",
      "Waste",
      "PublicTransport",
      "Unemployment",
      "Health",
      "Education",
      "Other",
    ] as const,
    categoryLabels: {
      Campus: "कैंपस",
      Road: "सड़क",
      Water: "पानी",
      Electricity: "बिजली",
      Corruption: "भ्रष्टाचार",
      Environment: "पर्यावरण",
      Forest: "जंगल",
      Waste: "कचरा",
      PublicTransport: "सार्वजनिक परिवहन",
      Unemployment: "बेरोजगारी",
      Health: "स्वास्थ्य",
      Education: "शिक्षा",
      Other: "अन्य",
    } as Record<string, string>,
  },
} as const;

export default function ReportIssuePage() {
  const { language } = useLanguage();
  const t = useMemo(() => COPY[language === "hi" ? "hi" : "en"], [language]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    ward: "",
    district: "",
    village: "",
    locality: "",
    geoLocation: "",
    proofUrl: "",
    urgency: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const required: Array<[keyof typeof formData, string]> = [
      ["title", t.issueTitle],
      ["category", t.category],
      ["description", t.description],
      ["district", t.district],
      ["ward", t.ward],
      ["village", t.village],
      ["locality", t.locality],
      ["location", t.location],
      ["urgency", t.urgency],
      ["proofUrl", t.proof],
    ];
    for (const [key, label] of required) {
      if (!String(formData[key] || "").trim()) {
        setError(t.required(label));
        setLoading(false);
        return;
      }
    }

    try {
      await fetchApi("youth/issues", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push("/youth-front/my-dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
          <Navbar />
          <main className="mx-auto max-w-2xl px-5 lg:px-8 py-14">
            <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 text-center shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
                <CheckCircle2 className="text-[#16A34A]" size={44} />
              </div>
              <h1 className="mt-7 text-4xl lg:text-5xl font-black tracking-[-0.05em]">{t.submitted}</h1>
              <p className="mt-4 text-lg font-semibold text-[#587E67]">{t.submittedMsg}</p>
              <p className="mt-2 text-sm text-[#587E67]">{t.redirecting}</p>
            </div>
          </main>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-3xl px-5 lg:px-8 py-14">
          <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
            <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">{t.title}</h1>
            <p className="mt-3 text-[#587E67] font-semibold">{t.subtitle}</p>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.issueTitle}
                </FormFieldLabel>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder={t.issueTitlePh}
                />
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.category}
                </FormFieldLabel>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                >
                  <option value="">{t.selectCategory}</option>
                  {t.categories.map((c) => (
                    <option key={c} value={c}>
                      {t.categoryLabels[c] || c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.description}
                </FormFieldLabel>
                <textarea
                  required
                  maxLength={3000}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-[10px] border border-[#DDEEE4] px-4 py-3 font-semibold text-[#04330B] outline-none focus:border-[#16A34A] resize-none"
                  placeholder={t.descriptionPh}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                    {t.district}
                  </FormFieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.districtPh}
                  />
                </div>
                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                    {t.ward}
                  </FormFieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.wardPh}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                    {t.village}
                  </FormFieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.villagePh}
                  />
                </div>
                <div>
                  <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                    {t.locality}
                  </FormFieldLabel>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.localityPh}
                  />
                </div>
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.location}
                </FormFieldLabel>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder={t.locationPh}
                />
              </div>

              <div>
                <FormFieldLabel className="block text-sm font-bold text-[#04330B] mb-2">{t.gps}</FormFieldLabel>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.geoLocation}
                    onChange={(e) => setFormData({ ...formData, geoLocation: e.target.value })}
                    className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder={t.gpsPh}
                  />
                  <button
                    type="button"
                    className="h-[46px] px-4 rounded-[10px] bg-[#DCFCE7] text-[#04330B] font-bold hover:bg-[#BBF7D0] transition-colors"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setFormData({
                              ...formData,
                              geoLocation: `${pos.coords.latitude}, ${pos.coords.longitude}`,
                            });
                          },
                          () => setError(t.gpsFail),
                        );
                      }
                    }}
                  >
                    <MapPin size={20} />
                  </button>
                </div>
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.urgency}
                </FormFieldLabel>
                <select
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                >
                  <option value="">{t.selectUrgency}</option>
                  <option value="Emergency">{t.urgEmergency}</option>
                  <option value="High">{t.urgHigh}</option>
                  <option value="Normal">{t.urgNormal}</option>
                  <option value="Low">{t.urgLow}</option>
                </select>
              </div>

              <div>
                <FormFieldLabel required className="block text-sm font-bold text-[#04330B] mb-2">
                  {t.proof}
                </FormFieldLabel>
                <input
                  type="url"
                  required
                  value={formData.proofUrl}
                  onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder={t.proofPh}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  t.submitting
                ) : (
                  <>
                    <Upload size={20} /> {t.submit}
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
