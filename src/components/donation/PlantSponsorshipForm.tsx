"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { OCCASIONS, PLANT_PRESETS, COST_PER_PLANT, DedicationOccasion } from "../../data/fundsData";
import { DonationModal } from "./DonationModal";

interface PlantSponsorshipFormProps {
  className?: string;
  selectedOccasion?: DedicationOccasion;
  onOccasionChange?: (occasion: DedicationOccasion) => void;
}

export function PlantSponsorshipForm({
  className = "",
  selectedOccasion,
  onOccasionChange,
}: PlantSponsorshipFormProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [plantCount, setPlantCount] = useState<number>(1);
  const [customInput, setCustomInput] = useState<string>("1");
  const [occasion, setOccasion] = useState<DedicationOccasion>(
    selectedOccasion || "Birthday"
  );
  const [dedicationName, setDedicationName] = useState<string>("");
  const [publicConsent, setPublicConsent] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedOccasion) {
      setOccasion(selectedOccasion);
    }
  }, [selectedOccasion]);

  const handleOccasionChange = (val: DedicationOccasion) => {
    setOccasion(val);
    onOccasionChange?.(val);
  };

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
        className={`w-full rounded-[22px] bg-white p-5 sm:p-6 text-[#173b27] border border-[#E2ECE4] shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${className}`}
      >
        {/* Form Title */}
        <div className="pb-4 border-b border-[#E7EFEA]">
          <h3 className="font-['Familjen_Grotesk'] text-[22px] sm:text-[24px] font-bold text-[#04330B]">
            {isHi ? "पौधों का प्रायोजन करें" : "Sponsor Your Plants"}
          </h3>
        </div>

        {/* 6 Preset Options Grid (3 columns x 2 rows matching reference) */}
        <div className="mt-4">
          <label className="block text-[13px] font-semibold text-[#254B34] mb-2.5">
            <span className="mr-1">💡</span>
            {isHi ? "कितने पौधे?" : "How many plants?"}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {PLANT_PRESETS.map((preset) => {
              const isSelected = plantCount === preset.count;

              return (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => handlePresetSelect(preset.count)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-[10px] border transition-all text-center ${
                    isSelected
                      ? "border-[#10B981] bg-[#E8F8EE] shadow-sm ring-1 ring-[#10B981]"
                      : "border-[#DCEBE2] bg-white hover:border-[#10B981]/50 hover:bg-[#F8FBF9]"
                  }`}
                >
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#04330B]">
                    {preset.count} {isHi ? (preset.count === 1 ? "पौधा" : "पौधे") : preset.count === 1 ? "Plant" : "Plants"}
                  </span>
                  <span className="text-[11px] sm:text-[11.5px] font-semibold text-[#587E67] mt-0.5">
                    ₹{preset.amount.toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom number of plants */}
        <div className="mt-4">
          <label htmlFor="custom-plants" className="block text-[13px] font-semibold text-[#254B34] mb-1.5">
            {isHi ? "अन्य संख्या में पौधे" : "Other number of plants"}
          </label>
          <div className="relative">
            <input
              id="custom-plants"
              type="number"
              min="1"
              step="1"
              value={customInput}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="1"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? "plant-sponsorship-error" : undefined}
              className="w-full h-[44px] rounded-[10px] border border-[#CFE0D5] bg-white px-3.5 pr-20 font-semibold text-[15px] text-[#173B27] placeholder-[#83988A] focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#587E67]">
              {isHi ? "पौधे" : "plants"}
            </span>
          </div>
        </div>

        {/* Dedication Details Section */}
        <div className="mt-4 pt-3.5 border-t border-[#E7EFEA] space-y-3.5">
          <h4 className="font-['Familjen_Grotesk'] text-[15px] sm:text-[16px] font-bold text-[#04330B] flex items-center gap-1.5">
            <span>🌱</span> {isHi ? "समर्पण का विवरण" : "Dedication details"}
          </h4>

          {/* Occasion */}
          <div>
            <label htmlFor="dedication-occasion" className="block text-[12.5px] font-semibold text-[#254B34] mb-1">
              {isHi ? "अवसर (Occasion)" : "Occasion"}
            </label>
            <select
              id="dedication-occasion"
              value={occasion}
              onChange={(e) => handleOccasionChange(e.target.value as DedicationOccasion)}
              className="w-full h-[42px] rounded-[10px] border border-[#CFE0D5] bg-white px-3 font-medium text-[14px] text-[#173B27] focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
            >
              {OCCASIONS.map((item) => (
                <option key={item.value} value={item.value} className="bg-white text-[#173B27]">
                  {isHi ? `${item.label.hi} (${item.label.en})` : item.label.en}
                </option>
              ))}
            </select>
          </div>

          {/* Name for dedication */}
          <div>
            <label htmlFor="dedication-name" className="block text-[12.5px] font-semibold text-[#254B34] mb-1">
              {isHi ? "जिसके नाम समर्पण (Dedication Name)" : "Name for dedication"}
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
              className="w-full h-[42px] rounded-[10px] border border-[#CFE0D5] bg-white px-3 font-medium text-[14px] text-[#173B27] placeholder-[#83988A] focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          {/* Public Consent Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={publicConsent}
              onChange={(e) => setPublicConsent(e.target.checked)}
              className="mt-1 size-3.5 rounded accent-emerald-600"
            />
            <span className="text-[11.5px] leading-snug text-[#587E67]">
              {isHi
                ? "मैं इस समर्पण को मिशन के सम्मान पटल पर सार्वजनिक रूप से प्रदर्शित करने की सहमति देता/देती हूँ।"
                : "I consent to displaying this dedication on the mission roll of honor."}
            </span>
          </label>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <p
            id="plant-sponsorship-error"
            role="alert"
            className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
          >
            {validationError}
          </p>
        )}

        {/* Sponsorship Summary */}
        <div className="mt-4 rounded-[12px] bg-[#F5F9F6] border border-[#E0ECE4] p-3 space-y-1.5">
          <div className="flex justify-between text-xs text-[#587E67]">
            <span>{isHi ? "पौधों की संख्या" : "Plants selected"}:</span>
            <span className="font-bold text-[#173B27]">
              {plantCount} {isHi ? (plantCount === 1 ? "पौधा" : "पौधे") : plantCount === 1 ? "Plant" : "Plants"}
            </span>
          </div>
          <div className="flex justify-between text-xs text-[#587E67]">
            <span>{isHi ? "प्रति पौधा योगदान" : "Cost per plant"}:</span>
            <span className="font-bold text-[#173B27]">₹{COST_PER_PLANT.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-1.5 border-t border-[#DCEBE2] flex justify-between items-baseline">
            <span className="text-[13px] font-bold text-[#173B27]">
              {isHi ? "कुल योगदान" : "Total contribution"}:
            </span>
            <span className="text-[18px] font-black text-[#04330B]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTA Button matching reference image */}
        <button
          type="button"
          onClick={handleContinue}
          className="mt-4 h-[48px] w-full rounded-[10px] bg-[#0D8252] hover:bg-[#0A6B43] font-['Familjen_Grotesk'] text-[15px] sm:text-[16px] font-bold text-white shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>{isHi ? "आगे बढ़ें →" : "Proceed →"}</span>
        </button>

        <p className="mt-2.5 text-center text-[11px] text-[#587E67]">
          {isHi
            ? "डिजिटल समर्पण प्रमाणपत्र भुगतान के बाद तुरंत मिल जाएगा।"
            : "Digital dedication certificate is generated immediately after payment."}
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
