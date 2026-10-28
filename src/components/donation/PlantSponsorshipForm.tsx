"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { OCCASIONS, PLANT_PRESETS, COST_PER_PLANT, DedicationOccasion } from "../../data/fundsData";
import { DonationModal } from "./DonationModal";

interface PlantSponsorshipFormProps {
  className?: string;
}

export function PlantSponsorshipForm({ className = "" }: PlantSponsorshipFormProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [plantCount, setPlantCount] = useState<number>(1);
  const [customInput, setCustomInput] = useState<string>("1");
  const [occasion, setOccasion] = useState<DedicationOccasion>("Birthday");
  const [dedicationName, setDedicationName] = useState<string>("");
  const [publicConsent, setPublicConsent] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePresetSelect = (count: number) => {
    setPlantCount(count);
    setCustomInput(String(count));
    setValidationError(null);
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const num = Number(val);
    if (Number.isSafeInteger(num) && num > 0) {
      setPlantCount(num);
      setValidationError(null);
    } else if (val === "") {
      setPlantCount(0);
      setValidationError(null);
    } else {
      setPlantCount(0);
      setValidationError(
        isHi ? "कृपया पेड़ों की पूरी संख्या दर्ज करें।" : "Enter a whole number of plants."
      );
    }
  };

  const totalAmount = plantCount * COST_PER_PLANT;

  const handleContinue = () => {
    if (plantCount < 1) {
      setValidationError(isHi ? "कृपया कम से कम 1 पेड़ चुनें।" : "Please select at least 1 plant.");
      return;
    }
    if (!dedicationName.trim()) {
      setValidationError(
        isHi
          ? "कृपया समर्पण के लिए नाम दर्ज करें (जैसे अनन्य शर्मा)।"
          : "Please enter the name for dedication (e.g. Ananya Sharma)."
      );
      return;
    }
    setValidationError(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        id="plant-sponsorship-card"
        className={`w-full rounded-[18px] bg-white p-5 sm:p-6 text-[#173b27] border border-[#E0ECE4] shadow-[0_12px_34px_rgba(3,33,21,0.08)] ${className}`}
      >
        {/* Header follows the site's shared language setting */}
        <div className="pb-5 border-b border-[#E7EFEA]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Great Green Wall Mission
            </span>
            <h3 className="font-['Familjen_Grotesk'] text-[24px] sm:text-[26px] font-bold text-[#04330B] mt-0.5">
              {isHi ? "पेड़ का प्रायोजन करें" : "Sponsor a Plant"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 py-4 text-[11px] sm:text-xs font-semibold text-[#587E67]" aria-label={isHi ? "भुगतान के चरण" : "Payment steps"}>
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#04330B] text-white">1</span>
          <span>{isHi ? "पेड़ का प्रायोजन" : "Sponsor a Plant"}</span>
          <span className="h-px flex-1 bg-[#DCEBE2]" />
          <span className="inline-flex size-6 items-center justify-center rounded-full border border-[#B8CCBF] bg-white text-[#587E67]">2</span>
          <span>{isHi ? "भुगतान" : "Make Payment"}</span>
        </div>

        {/* 6 Preset Options Grid */}
        <div className="mt-6">
          <label className="block text-[13px] font-semibold text-[#254B34] mb-3">
            {isHi ? "पेड़ों की संख्या चुनें:" : "Select number of plants:"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLANT_PRESETS.map((preset) => {
              const isSelected = plantCount === preset.count;

              return (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => handlePresetSelect(preset.count)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-[12px] border transition-all text-center ${
                    isSelected
                      ? "border-emerald-600 bg-[#F0FAF4] shadow-[0_0_0_1px_rgba(5,150,105,0.2)]"
                      : "border-[#DCEBE2] bg-white hover:border-emerald-500 hover:bg-[#F8FBF9]"
                  }`}
                >
                  <span className="text-[14px] sm:text-[15px] font-bold text-[#173B27]">
                    {preset.count} {isHi ? "पेड़" : preset.count === 1 ? "Plant" : "Plants"}
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-semibold text-[#587E67] mt-0.5">
                    ₹{preset.amount.toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom number of plants */}
        <div className="mt-5">
          <label htmlFor="custom-plants" className="block text-[13px] font-semibold text-[#254B34] mb-2">
            {isHi ? "पेड़ों की इच्छित संख्या" : "Custom number of plants"}
          </label>
          <div className="relative">
            <input
              id="custom-plants"
              type="number"
              min="1"
              step="1"
              value={customInput}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g. 5"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? "plant-sponsorship-error" : undefined}
              className="w-full h-[50px] rounded-[10px] border border-[#CFE0D5] bg-white px-4 pr-28 font-semibold text-[16px] text-[#173B27] placeholder-[#83988A] focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-800">
              {isHi ? "पेड़" : "plants"}
            </span>
          </div>
        </div>

        {/* Dedication Details Section */}
        <div className="mt-6 pt-5 border-t border-[#E7EFEA] space-y-4">
          <h4 className="font-['Familjen_Grotesk'] text-[17px] sm:text-[18px] font-bold text-[#04330B] flex items-center gap-2">
            <span>🌱</span> {isHi ? "समर्पण का विवरण" : "Dedication details"}
          </h4>

          {/* Occasion */}
          <div>
            <label htmlFor="dedication-occasion" className="block text-[13px] font-semibold text-[#254B34] mb-2">
              {isHi ? "अवसर" : "Occasion"}
            </label>
            <select
              id="dedication-occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as DedicationOccasion)}
              className="w-full h-[46px] rounded-[10px] border border-[#CFE0D5] bg-white px-4 font-medium text-[15px] text-[#173B27] focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
            >
              {OCCASIONS.map((item) => (
                <option key={item.value} value={item.value} className="bg-white text-[#173B27]">
                  {isHi ? item.label.hi : item.label.en}
                </option>
              ))}
            </select>
          </div>

          {/* Name for dedication */}
          <div>
            <label htmlFor="dedication-name" className="block text-[13px] font-semibold text-[#254B34] mb-2">
              {isHi ? "जिसके नाम समर्पण" : "Name for dedication"}
            </label>
            <input
              id="dedication-name"
              maxLength={120}
              required
              type="text"
              value={dedicationName}
              onChange={(e) => {
                setDedicationName(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={isHi ? "जैसे अनन्य शर्मा" : "e.g. Ananya Sharma"}
              aria-invalid={Boolean(validationError && !dedicationName.trim())}
              className="w-full h-[46px] rounded-[10px] border border-[#CFE0D5] bg-white px-4 font-medium text-[15px] text-[#173B27] placeholder-[#83988A] focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          {/* Public Consent Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={publicConsent}
              onChange={(e) => setPublicConsent(e.target.checked)}
              className="mt-1 size-4 rounded accent-emerald-500"
            />
            <span className="text-[12px] leading-relaxed text-[#587E67]">
              {isHi
                ? "मैं इस समर्पण को मिशन के सम्मान पटल पर सार्वजनिक रूप से प्रदर्शित करने की सहमति देता/देती हूँ।"
                : "I consent to displaying this dedication on the mission roll of honor."}
            </span>
          </label>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <p id="plant-sponsorship-error" role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
            {validationError}
          </p>
        )}

        {/* Sponsorship Summary */}
        <div className="mt-5 rounded-[14px] bg-[#F5F9F6] border border-[#E0ECE4] p-4 space-y-2">
          <div className="flex justify-between text-xs text-[#587E67]">
            <span>{isHi ? "पेड़ों की संख्या" : "Plants selected"}:</span>
            <span className="font-bold text-[#173B27]">
              {plantCount} {isHi ? "पेड़" : plantCount === 1 ? "Plant" : "Plants"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-[#587E67]">
            <span>{isHi ? "प्रति पेड़ योगदान" : "Cost per plant"}:</span>
            <span className="font-bold text-[#173B27]">₹{COST_PER_PLANT.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-2 border-t border-[#DCEBE2] flex justify-between items-baseline">
            <span className="text-[13.5px] font-bold text-[#173B27]">{isHi ? "कुल योगदान" : "Total contribution"}:</span>
            <span className="text-[20px] font-black text-[#04330B]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-5 h-[50px] w-full rounded-[10px] bg-[#079B69] font-['Familjen_Grotesk'] text-[15px] sm:text-[16px] font-bold text-white shadow-sm transition-all hover:bg-[#07865D] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>🌱</span>
          <span>
            {isHi ? "पेड़ प्रायोजित करने के लिए आगे बढ़ें →" : "Continue to Sponsor Plant(s) →"}
          </span>
        </button>

        <p className="mt-3 text-center text-[11.5px] text-[#587E67]">
          {isHi
            ? "सफल सत्यापन के बाद डिजिटल समर्पण प्रमाणपत्र तुरंत जारी किया जाएगा।"
            : "Digital dedication certificate issued immediately upon verified payment."}
        </p>
      </div>

      {/* Donation Checkout Modal */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultFund="green-fund"
        defaultAmount={totalAmount}
        plantCount={plantCount}
        dedicationOccasion={occasion}
        dedicationName={dedicationName}
        publicConsent={publicConsent}
      />
    </>
  );
}
