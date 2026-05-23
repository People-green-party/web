"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { AlertCircle, CheckCircle2, MapPin, Upload } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { RequireAuth } from "../../components/RequireAuth";

export default function ReportIssuePage() {
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

    try {
      const response = await fetchApi('youth/issues', {
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
              <h1 className="mt-7 text-4xl lg:text-5xl font-black tracking-[-0.05em]">Issue Submitted!</h1>
              <p className="mt-4 text-lg font-semibold text-[#587E67]">
                Your issue has been recorded. We will review it and take action.
              </p>
              <p className="mt-2 text-sm text-[#587E67]">Redirecting to dashboard...</p>
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
            <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Report an Issue</h1>
            <p className="mt-3 text-[#587E67] font-semibold">
              Help us identify and solve problems in your community.
            </p>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Issue Title *</label>
              <input
                type="text"
                required
                maxLength={160}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                placeholder="Brief title of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
              >
                <option value="">Select category</option>
                <option value="Campus">Campus</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Corruption">Corruption</option>
                <option value="Environment">Environment</option>
                <option value="Forest">Forest</option>
                <option value="Waste">Waste</option>
                <option value="PublicTransport">Public Transport</option>
                <option value="Unemployment">Unemployment</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Description *</label>
              <textarea
                required
                maxLength={3000}
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-[10px] border border-[#DDEEE4] px-4 py-3 font-semibold text-[#04330B] outline-none focus:border-[#16A34A] resize-none"
                placeholder="Describe the issue in detail"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#04330B] mb-2">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="District name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#04330B] mb-2">Ward</label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Ward number/name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#04330B] mb-2">Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Village name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#04330B] mb-2">Locality</label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Locality/Mohalla"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Location Description</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                placeholder="Specific location (landmark, building, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">GPS Coordinates (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.geoLocation}
                  onChange={(e) => setFormData({ ...formData, geoLocation: e.target.value })}
                  className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Latitude, Longitude"
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
                        () => setError("Unable to get location")
                      );
                    }
                  }}
                >
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
              >
                <option value="">Select urgency</option>
                <option value="Emergency">Emergency - Immediate action needed</option>
                <option value="High">High - Action needed within 24 hours</option>
                <option value="Normal">Normal - Routine issue</option>
                <option value="Low">Low - Minor issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Proof URL (Photo/Video)</label>
              <input
                type="url"
                value={formData.proofUrl}
                onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                placeholder="Link to photo or video evidence"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : <><Upload size={20} /> Submit Issue</>}
            </button>
          </form>
        </div>
      </main>
    </div>
    </RequireAuth>
  );
}
