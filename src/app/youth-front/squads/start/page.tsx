"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../../components/Navbar";
import { fetchApi } from "../../../../lib/api";
import { Copy, CheckCircle2, Share2, ChevronLeft } from "lucide-react";

const SQUAD_TYPES = [
  "Campus Squad",
  "Ward Squad",
  "Village Squad",
  "Mohalla Squad",
  "Digital Squad",
  "Environment Squad",
  "Issue Action Squad",
];

const SQUAD_ROLES = [
  "Squad Leader",
  "Vice Leader",
  "Membership Lead",
  "Digital Creator",
  "Meme / Creative Lead",
  "Issue Reporter",
  "Event Lead",
  "Environment Lead",
  "Documentation Lead",
  "Discipline Lead",
];

const SQUAD_TYPE_DESC: Record<string, string> = {
  "Campus Squad":       "A team based at a college or school campus.",
  "Ward Squad":         "A local team in a city ward or municipal area.",
  "Village Squad":      "A village-level grassroots team.",
  "Mohalla Squad":      "A neighbourhood / mohalla team.",
  "Digital Squad":      "An online team — memes, reels, campaigns, digital reach.",
  "Environment Squad":  "A green action team focused on environment issues.",
  "Issue Action Squad": "A team focused on one or more local issues.",
};

export default function StartSquadPage() {
  const router = useRouter();

  const [step, setStep]       = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<any>(null);
  const [copied, setCopied]   = useState(false);

  const [form, setForm] = useState({
    name:          "",
    squadType:     "",
    district:      "",
    ward:          "",
    village:       "",
    locality:      "",
    purpose:       "",
    preferredRole: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Squad name is required"); return; }
    if (!form.squadType)   { setError("Select a Squad type"); return; }
    setError("");
    setLoading(true);
    try {
      const data = await fetchApi("youth/squads", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setResult(data);
      setStep("success");
    } catch (e: any) {
      setError(e.message || "Failed to create Squad");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    const link = `https://peoplesgreen.org/join-squad?code=${result?.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShare = () => {
    const msg = encodeURIComponent(
      `Join my JINDA Squad: ${result?.name}\n\nUse invite code: ${result?.inviteCode}\nOr join here: https://peoplesgreen.org/join-squad?code=${result?.inviteCode}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  if (step === "success" && result) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] pt-[70px] lg:pt-[92px] font-['Familjen_Grotesk']">
        <Navbar />
        <main className="mx-auto max-w-lg px-5 py-10">
          <div className="bg-[#04330B] text-white rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">⚔️</div>
            <h1 className="text-2xl font-black mb-1">Squad Created!</h1>
            <p className="text-[#86EFAC] text-sm">{result.name}</p>
            <div className="mt-6 bg-white/10 rounded-2xl p-5 text-left space-y-3">
              <div>
                <div className="text-xs text-[#86EFAC] font-bold uppercase tracking-widest">Squad Code</div>
                <div className="font-mono text-lg font-black mt-0.5">{result.inviteCode}</div>
              </div>
              <div>
                <div className="text-xs text-[#86EFAC] font-bold uppercase tracking-widest">Type</div>
                <div className="font-semibold mt-0.5">{result.squadType}</div>
              </div>
              <div>
                <div className="text-xs text-[#86EFAC] font-bold uppercase tracking-widest">Status</div>
                <div className="font-semibold mt-0.5">🟡 Forming — invite 9 more members</div>
              </div>
            </div>
            <p className="text-sm text-[#86EFAC]/80 mt-4">
              Invite 9 more verified members to activate your Squad and unlock Squad XP.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={copyInviteLink}
                className="flex items-center justify-center gap-2 bg-[#4ADE80] text-[#04330B] font-black py-3 rounded-xl hover:bg-[#86EFAC] transition-colors"
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy Invite Link"}
              </button>
              <button
                onClick={whatsappShare}
                className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 size={18} /> Share on WhatsApp
              </button>
              <button
                onClick={() => router.push("/youth-front/my-dashboard")}
                className="text-[#86EFAC] font-semibold py-2 text-sm"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FBF4] pt-[70px] lg:pt-[92px] font-['Familjen_Grotesk']">
      <Navbar />
      <main className="mx-auto max-w-lg px-5 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#587E67] font-semibold mb-6 hover:text-[#04330B]"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#04330B]">Start a Squad ⚔️</h1>
          <p className="text-[#587E67] mt-2 text-sm">
            A Squad is a 10-member local team. You'll be the Squad Leader. Once 10 verified members join, submit for activation.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Squad name */}
          <div>
            <label className="text-sm font-bold text-[#04330B] block mb-1.5">Squad Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Jaipur Ward 24 Squad"
              className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#04330B]"
              required
            />
          </div>

          {/* Squad type */}
          <div>
            <label className="text-sm font-bold text-[#04330B] block mb-1.5">Squad Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {SQUAD_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("squadType", t)}
                  className={`text-left rounded-xl px-4 py-3 text-sm font-semibold border transition-all ${
                    form.squadType === t
                      ? "bg-[#04330B] text-white border-[#04330B]"
                      : "border-[#BBF7D0] bg-white text-[#04330B] hover:border-[#04330B]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {form.squadType && (
              <p className="text-xs text-[#587E67] mt-2 pl-1">{SQUAD_TYPE_DESC[form.squadType]}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-[#04330B] block mb-1.5">District</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#04330B]"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[#04330B] block mb-1.5">Ward / Village</label>
              <input
                type="text"
                value={form.ward}
                onChange={(e) => set("ward", e.target.value)}
                placeholder="e.g. Ward 24"
                className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#04330B]"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-[#04330B] block mb-1.5">Campus / Locality</label>
            <input
              type="text"
              value={form.locality}
              onChange={(e) => set("locality", e.target.value)}
              placeholder="e.g. Rajasthan University, Sindhi Camp"
              className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#04330B]"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="text-sm font-bold text-[#04330B] block mb-1.5">Squad Purpose</label>
            <textarea
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
              placeholder="What will your Squad work on? e.g. Report water issues in Ward 24, organise campus clean drives..."
              className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#04330B]"
              rows={3}
            />
          </div>

          {/* My preferred role */}
          <div>
            <label className="text-sm font-bold text-[#04330B] block mb-1.5">Your Preferred Role</label>
            <select
              value={form.preferredRole}
              onChange={(e) => set("preferredRole", e.target.value)}
              className="w-full border border-[#BBF7D0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#04330B] bg-white"
            >
              <option value="">Select a role (optional)</option>
              {SQUAD_ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#04330B] text-white font-black py-4 rounded-2xl hover:bg-[#16A34A] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Creating Squad..." : "Create Squad ⚔️"}
          </button>
        </form>
      </main>
    </div>
  );
}
