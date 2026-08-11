"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AcademyShell } from "@/components/leadership-academy/AcademyShell";
import { fetchApi } from "@/lib/api";
import { FormFieldLabel } from "@/components/FormFieldLabel";

export default function InternshipStatusPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await fetchApi("leadership-academy/applications/status", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      setResult(data);
      if (!data?.found) {
        setError("No internship application found for this number. Please Apply first.");
      }
    } catch (err: any) {
      setError(err?.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AcademyShell>
      <section className="mx-auto max-w-lg px-5 py-16">
        <h1 className="text-3xl font-black text-[#04330B] tracking-tight">Internship status</h1>
        <p className="mt-2 text-[#587E67] font-semibold text-sm">
          Internships use a separate application (not Party / Union / Youth login). Enter the
          mobile number you used on Apply.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl border border-[#DDEEE4] bg-white p-6">
          <div>
            <FormFieldLabel required>Mobile number</FormFieldLabel>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="mt-2 w-full h-12 rounded-xl border border-[#DDEEE4] px-4 font-semibold outline-none focus:border-[#16A34A]"
              placeholder="10-digit mobile"
            />
          </div>
          {error && <p className="text-sm font-semibold text-[#DC2626]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#04330B] text-white font-black disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check status"}
          </button>
        </form>

        {result?.found && result.application && (
          <div className="mt-6 rounded-3xl border border-[#BBF7D0] bg-[#F5FBF7] p-6 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-[#16A34A]">Application found</p>
            <p className="font-black text-[#04330B] text-lg">{result.application.fullName}</p>
            <p className="text-sm text-[#587E67]">
              <span className="font-bold text-[#04330B]">ID:</span> #{result.application.id}
            </p>
            <p className="text-sm text-[#587E67]">
              <span className="font-bold text-[#04330B]">Department:</span> {result.application.department}
            </p>
            <p className="text-sm text-[#587E67]">
              <span className="font-bold text-[#04330B]">Mode:</span> {result.application.mode}
            </p>
            <p className="text-sm text-[#587E67]">
              <span className="font-bold text-[#04330B]">Status:</span>{" "}
              <span className="font-black text-[#04330B] uppercase">{result.application.status}</span>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 text-sm font-semibold">
          <Link href="/leadership-academy/apply" className="text-[#0D5229] hover:underline">
            Apply for Internship →
          </Link>
          <Link href="/leadership-academy" className="text-[#587E67] hover:underline">
            ← Back to Internships
          </Link>
        </div>
      </section>
    </AcademyShell>
  );
}
