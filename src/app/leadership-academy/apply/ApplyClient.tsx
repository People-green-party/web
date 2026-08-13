"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { DEPARTMENTS } from "@/data/leadership-academy/departments";
import { getAcademyI18n } from "@/data/leadership-academy/i18n";
import { useLanguage } from "@/components/LanguageContext";
import { fetchApi } from "@/lib/api";
import { FormFieldLabel } from "@/components/FormFieldLabel";

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
    pin: "",
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
    if (!/^\d{4,6}$/.test(form.pin)) {
      setError("Login PIN must be 4-6 digits");
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
          pin: form.pin,
        }),
      });

      if (res?.access_token) {
        const { setInternSession } = await import("@/lib/internApi");
        setInternSession(res.access_token, res.application);
      }

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

  const inputClass =
    "w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none bg-white disabled:opacity-60";
  const selectClass =
    "w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none disabled:opacity-60 appearance-none";

  const successBody = a.successBody
    .replace("{name}", form.fullName || a.applicantFallback)
    .replace(
      "{idPart}",
      applicationId ? a.idPart.replace("{id}", String(applicationId)) : ""
    );

  const sidebarSteps = [
    { n: 1, label: a.journeySteps[0]?.title || "Application", active: !submitted },
    { n: 2, label: a.journeySteps[1]?.title || "Shortlisting", active: false },
    { n: 3, label: a.journeySteps[4]?.title || "Programme Begins", active: submitted },
  ];

  return (
    <AcademyShell>
      <div className="w-full bg-[#F7FCF9] text-gray-800 flex flex-col items-center font-['Familjen_Grotesk']">
        <main className="w-full max-w-[1200px] px-4 lg:px-8 mt-[28px] mb-12 lg:mb-24 flex flex-col items-center">
          <h1 className="text-center font-semibold text-[28px] lg:text-[44px] leading-tight tracking-[-0.3px] text-[#04330B] max-w-[880px] flex flex-col gap-3 lg:gap-2">
            {a.heroTitle.split("\n").map((line: string, index: number) => (
              <span key={index}>{line}</span>
            ))}
          </h1>

          <section className="w-full mt-10 bg-white rounded-[28px] border border-[#E4F2EA] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-[360px] w-full bg-[#04330B] text-white p-10 flex flex-col justify-between">
              <div className="space-y-6">
                {sidebarSteps.map((s) => (
                  <div key={s.n} className="flex items-center gap-3">
                    <div
                      className={
                        s.active
                          ? "w-7 h-7 rounded-full bg-[#10B981] text-[#04330B] flex items-center justify-center font-bold"
                          : "w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold"
                      }
                    >
                      {s.n}
                    </div>
                    <div className={s.active ? "font-semibold" : "font-semibold opacity-60"}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <img src="/PGPlogo.svg" alt="PGP" className="w-[120px] opacity-90" />
                <div className="mt-4 text-[12px] text-white/70 italic">
                  &ldquo;Together we represent the power of choice and the future of Rajasthan.&rdquo;
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 lg:p-12">
              {submitted ? (
                <div className="mt-4 max-w-[520px] mx-auto text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#EAF7EE] flex items-center justify-center text-[#10B981]">
                    <CheckCircle2 size={28} />
                  </div>
                  <div className="mt-6 text-[22px] font-bold text-[#04330B]">{a.successTitle}</div>
                  <p className="mt-2 text-[#587E67] font-semibold">{successBody}</p>
                  {emailSent ? (
                    <p className="mt-2 text-[14px] font-semibold text-[#0D5229]">{a.successEmailNote}</p>
                  ) : null}
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <Link
                      href="/leadership-academy/dashboard"
                      className="inline-flex items-center justify-center gap-2 w-full max-w-[280px] h-[50px] rounded-[12px] bg-[#04330B] text-white font-semibold"
                    >
                      Open intern dashboard <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/leadership-academy"
                      className="text-sm font-semibold text-[#587E67] hover:underline"
                    >
                      {a.back}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-[18px] font-bold text-[#04330B]">{a.newApplication}</div>
                  </div>

                  <div className="mt-8 mb-5 max-w-[520px] mx-auto">
                    <form className="space-y-6" onSubmit={onSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormFieldLabel required>{a.fields.fullName}</FormFieldLabel>
                          <input
                            type="text"
                            name="fullName"
                            required
                            disabled={submitting}
                            value={form.fullName}
                            onChange={onChange}
                            className={inputClass}
                            placeholder={a.fields.fullName}
                            autoComplete="name"
                          />
                        </div>
                        <div>
                          <FormFieldLabel required>{a.fields.email}</FormFieldLabel>
                          <input
                            type="email"
                            name="email"
                            required
                            disabled={submitting}
                            value={form.email}
                            onChange={onChange}
                            className={inputClass}
                            placeholder={a.fields.email}
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormFieldLabel required>{a.fields.phone}</FormFieldLabel>
                          <div className="grid grid-cols-[70px_1fr] gap-3 min-w-0">
                            <div className="h-[46px] rounded-[10px] border border-[#DDEEE4] px-3 flex items-center justify-center font-semibold text-[#587E67] bg-white">
                              +91
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              required
                              disabled={submitting}
                              value={form.phone}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "");
                                const normalized = digits.startsWith("91")
                                  ? digits.slice(2)
                                  : digits.startsWith("0")
                                    ? digits.slice(1)
                                    : digits;
                                setForm((prev) => ({ ...prev, phone: normalized.slice(0, 10) }));
                                if (error) setError("");
                              }}
                              inputMode="numeric"
                              className={`${inputClass} min-w-0`}
                              placeholder={a.fields.phone}
                              autoComplete="tel"
                            />
                          </div>
                        </div>
                        <div>
                          <FormFieldLabel required>{a.fields.city}</FormFieldLabel>
                          <input
                            type="text"
                            name="city"
                            required
                            disabled={submitting}
                            value={form.city}
                            onChange={onChange}
                            className={inputClass}
                            placeholder={a.fields.city}
                            autoComplete="address-level2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormFieldLabel>{a.fields.college}</FormFieldLabel>
                          <input
                            type="text"
                            name="college"
                            disabled={submitting}
                            value={form.college}
                            onChange={onChange}
                            className={inputClass}
                            placeholder={a.fields.college}
                          />
                        </div>
                        <div className="relative">
                          <FormFieldLabel required>{a.fields.selectDepartment}</FormFieldLabel>
                          <select
                            name="department"
                            required
                            disabled={submitting}
                            value={form.department}
                            onChange={onChange}
                            className={`${selectClass} pr-10`}
                          >
                            <option value="" disabled>
                              {a.fields.selectDepartment}
                            </option>
                            {DEPARTMENTS.map((d) => (
                              <option key={d.slug} value={d.slug}>
                                {d.number}. {t.deptNames[d.slug].name}
                              </option>
                            ))}
                          </select>
                          <span
                            className="pointer-events-none absolute right-3 top-[38px] text-[#587E67]"
                            aria-hidden
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <FormFieldLabel required>Mode</FormFieldLabel>
                        <select
                          name="mode"
                          required
                          disabled={submitting}
                          value={form.mode}
                          onChange={onChange}
                          className={`${selectClass} pr-10`}
                        >
                          <option value="offline">{a.fields.offline}</option>
                          <option value="hybrid">{a.fields.hybrid}</option>
                        </select>
                        <span
                          className="pointer-events-none absolute right-3 top-[38px] text-[#587E67]"
                          aria-hidden
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </div>

                      <div>
                        <FormFieldLabel required>{a.fields.motivation}</FormFieldLabel>
                        <textarea
                          name="motivation"
                          required
                          rows={4}
                          minLength={10}
                          disabled={submitting}
                          value={form.motivation}
                          onChange={onChange}
                          className="w-full rounded-[10px] border border-[#DDEEE4] px-4 py-3 font-semibold text-[#04330B] outline-none bg-white resize-y disabled:opacity-60"
                          placeholder={a.fields.motivation}
                        />
                      </div>

                      <div>
                        <FormFieldLabel required>Login PIN (4-6 digits)</FormFieldLabel>
                        <input
                          type="password"
                          name="pin"
                          required
                          minLength={4}
                          maxLength={6}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          disabled={submitting}
                          value={form.pin}
                          onChange={onChange}
                          className={inputClass}
                          placeholder="Create PIN for Internship Login"
                        />
                        <p className="mt-1 text-xs text-[#587E67] font-medium">
                          Use this PIN later on Internship Login to open your dashboard.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-[50px] rounded-[12px] bg-[#04330B] text-white font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" /> {a.saving}
                          </>
                        ) : (
                          <>
                            {a.submit} →
                          </>
                        )}
                      </button>

                      {error ? (
                        <div className="text-center text-[12px] text-red-500 font-semibold">{error}</div>
                      ) : null}
                    </form>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </AcademyShell>
  );
}
