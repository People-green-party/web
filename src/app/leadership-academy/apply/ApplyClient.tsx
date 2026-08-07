"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { SectionHeading } from "@/components/leadership-academy/SectionHeading";
import { DEPARTMENTS } from "@/data/leadership-academy/departments";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { useLanguage } from "@/components/LanguageContext";
import { fetchApi } from "@/lib/api";

const VALID_DEPTS = new Set<string>(DEPARTMENTS.map((d) => d.slug));

function normalizePhone(raw: string) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export default function LeadershipAcademyApplyPage() {
  const { language } = useLanguage();
  const t = getAcademyI18n(language);
  const a = t.applyPage;
  const searchParams = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    college: "",
    department: "",
    mode: "offline",
    motivation: "",
  });

  useEffect(() => {
    const dept = searchParams.get("department") || "";
    if (dept && VALID_DEPTS.has(dept)) {
      setForm((prev) => ({ ...prev, department: dept }));
    }
  }, [searchParams]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const phone = normalizePhone(form.phone);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(a.errorPhone);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetchApi("leadership-academy/applications", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone,
          city: form.city.trim(),
          college: form.college.trim() || undefined,
          department: form.department,
          mode: form.mode,
          motivation: form.motivation.trim(),
        }),
      });

      setApplicationId(res?.application?.id ?? null);
      setEmailSent(Boolean(res?.emailSent));
      setSubmitted(true);
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("already exists") || msg.toLowerCase().includes("active application")) {
        setError(a.errorDuplicate);
      } else if (msg.toLowerCase().includes("invalid phone") || msg.toLowerCase().includes("phone number")) {
        setError(a.errorPhone);
      } else {
        setError(msg || a.errorGeneric);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-[8px] border border-[#E4F2EA] bg-[#F8FBF9] px-4 py-3 font-['Familjen_Grotesk'] text-[15px] font-medium text-[#04330B] outline-none focus:border-[#0D5229] focus:ring-2 focus:ring-[#0D5229]/15 disabled:opacity-60";

  const successBody = a.successBody
    .replace("{name}", form.fullName || a.applicantFallback)
    .replace(
      "{idPart}",
      applicationId ? a.idPart.replace("{id}", String(applicationId)) : ""
    );

  return (
    <AcademyShell>
      <section className="bg-white w-full flex justify-center pt-[40px] lg:pt-[70px] pb-[20px]">
        <div className="w-full max-w-[1320px] px-4 lg:px-8">
          <p className="font-['Familjen_Grotesk'] text-[12px] lg:text-[14px] font-bold uppercase tracking-wider text-[#E85C2F]">
            {a.tag}
          </p>
          <h1 className="mt-3 font-['Familjen_Grotesk'] font-semibold text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.3px] text-[#04330B]">
            {a.title}
          </h1>
          <p className="mt-4 max-w-2xl font-['Familjen_Grotesk'] font-medium text-[16px] lg:text-[18px] text-[#587E67]">
            {a.intro}
          </p>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[30px] lg:py-[40px]">
        <div className="w-full max-w-[720px] px-4 lg:px-8">
          <div className="rounded-[16px] border border-[#B9D3C4] bg-white p-5 sm:p-6">
            <h2 className="font-['Familjen_Grotesk'] font-semibold text-[18px] text-[#04330B] mb-4">
              {a.infoTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
                  {a.eligibilityTitle}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {a.eligibility.map((item) => (
                    <li key={item} className="flex gap-2 font-['Familjen_Grotesk'] text-[13px] text-[#587E67]">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#0D5229]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
                    {a.feeTitle}
                  </p>
                  <p className="mt-2 font-['Familjen_Grotesk'] text-[13px] text-[#587E67]">{a.feeBody}</p>
                </div>
                <div>
                  <p className="font-['Familjen_Grotesk'] text-[12px] font-bold uppercase tracking-wider text-[#0D5229]">
                    {a.intakeTitle}
                  </p>
                  <p className="mt-2 font-['Familjen_Grotesk'] text-[13px] text-[#587E67]">{a.intakeBody}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white w-full flex justify-center py-[40px] lg:py-[70px]">
        <div className="w-full max-w-[720px] px-4 lg:px-8">
          <SectionHeading title={a.formTitle} subtitle={a.formSubtitle} className="mb-[40px]" />

          {submitted ? (
            <div className="rounded-[20px] border border-[#B9D3C4] bg-white p-8 text-center">
              <div className="mx-auto w-14 h-14 rounded-[12px] bg-[#EAF7EE] border border-[#E4F2EA] text-[#0D5229] flex items-center justify-center mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-['Familjen_Grotesk'] font-semibold text-[28px] text-[#04330B]">
                {a.successTitle}
              </h3>
              <p className="mt-3 font-['Familjen_Grotesk'] font-medium text-[16px] text-[#587E67]">
                {successBody}
              </p>
              {emailSent ? (
                <p className="mt-2 font-['Familjen_Grotesk'] text-[14px] font-semibold text-[#0D5229]">
                  {a.successEmailNote}
                </p>
              ) : null}
              <Link
                href="/leadership-academy"
                className="mt-6 inline-flex items-center gap-2 px-[32px] py-[12px] bg-[#04330B] hover:bg-[#0D5229] text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors"
              >
                {a.back} <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-5 rounded-[20px] border border-[#B9D3C4] bg-white p-6 sm:p-8 shadow-sm"
            >
              {[
                { name: "fullName", label: a.fields.fullName, type: "text", required: true },
                { name: "email", label: a.fields.email, type: "email", required: true },
                { name: "phone", label: a.fields.phone, type: "tel", required: true, hint: a.phoneHint },
                { name: "city", label: a.fields.city, type: "text", required: true },
                { name: "college", label: a.fields.college, type: "text", required: false },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B]">
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    disabled={submitting}
                    value={form[field.name as keyof typeof form]}
                    onChange={onChange}
                    className={fieldClass}
                    inputMode={field.name === "phone" ? "numeric" : undefined}
                    autoComplete={field.name === "phone" ? "tel" : undefined}
                  />
                  {"hint" in field && field.hint ? (
                    <span className="mt-1 block font-['Familjen_Grotesk'] text-[12px] text-[#587E67]">
                      {field.hint}
                    </span>
                  ) : null}
                </label>
              ))}

              <fieldset>
                <legend className="font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B]">
                  {a.fields.department} *
                </legend>
                {/* Custom picker — native <select> breaks on mobile (dark overlay / wrong position) */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DEPARTMENTS.map((d) => {
                    const selected = form.department === d.slug;
                    return (
                      <label
                        key={d.slug}
                        className={`rounded-[8px] border px-4 py-3 cursor-pointer font-['Familjen_Grotesk'] text-[14px] font-semibold leading-snug transition-colors ${
                          selected
                            ? "border-[#04330B] bg-[#EAF7EE] text-[#04330B]"
                            : "border-[#E4F2EA] bg-[#F8FBF9] text-[#587E67] hover:border-[#B9D3C4]"
                        } ${submitting ? "opacity-60 pointer-events-none" : ""}`}
                      >
                        <input
                          type="radio"
                          name="department"
                          value={d.slug}
                          required
                          checked={selected}
                          onChange={onChange}
                          disabled={submitting}
                          className="sr-only"
                        />
                        <span className="text-[#0D5229] font-bold">{d.number}.</span>{" "}
                        {t.deptNames[d.slug].name}
                      </label>
                    );
                  })}
                </div>
                {!form.department ? (
                  <p className="mt-2 font-['Familjen_Grotesk'] text-[12px] text-[#587E67]">
                    {a.fields.selectDepartment}
                  </p>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className="font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B]">
                  {a.fields.mode} *
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { value: "offline", label: a.fields.offline },
                    { value: "hybrid", label: a.fields.hybrid },
                  ].map((mode) => (
                    <label
                      key={mode.value}
                      className={`rounded-[8px] border px-4 py-3 cursor-pointer font-['Familjen_Grotesk'] text-[14px] font-bold ${
                        form.mode === mode.value
                          ? "border-[#04330B] bg-[#EAF7EE] text-[#04330B]"
                          : "border-[#E4F2EA] bg-[#F8FBF9] text-[#587E67]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={mode.value}
                        checked={form.mode === mode.value}
                        onChange={onChange}
                        disabled={submitting}
                        className="sr-only"
                      />
                      {mode.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="font-['Familjen_Grotesk'] text-[14px] font-bold text-[#04330B]">
                  {a.fields.motivation} *
                </span>
                <textarea
                  name="motivation"
                  required
                  rows={4}
                  minLength={10}
                  disabled={submitting}
                  value={form.motivation}
                  onChange={onChange}
                  className={`${fieldClass} resize-y`}
                />
              </label>

              {error ? (
                <p className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 font-['Familjen_Grotesk'] text-[14px] font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-[32px] py-[14px] bg-[#04330B] hover:bg-[#0D5229] disabled:opacity-60 disabled:pointer-events-none text-white rounded-[8px] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors shadow-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {a.saving}
                  </>
                ) : (
                  <>
                    {a.submit} <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center font-['Familjen_Grotesk'] text-[12px] font-medium text-[#587E67]">
                {a.agreement}{" "}
                <Link href="/leadership-academy/faq" className="text-[#04330B] font-bold">
                  {a.readFaq}
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </AcademyShell>
  );
}
