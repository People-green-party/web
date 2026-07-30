"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { fetchApi } from "../../../lib/api";
import { Users, Search, ChevronRight, Plus, Filter } from "lucide-react";

const SQUAD_TYPE_LABELS: Record<string, string> = {
  Campus:             "Campus Squad",
  Ward:               "Ward Squad",
  Village:            "Village Squad",
  Mohalla:            "Mohalla Squad",
  OnlineCreatorGroup: "Digital Squad",
  Other:              "Squad",
};

const SQUAD_RANK_EMOJI: Record<string, string> = {
  "Bronze Squad":  "🥉",
  "Silver Squad":  "🥈",
  "Gold Squad":    "🥇",
  "Diamond Squad": "💎",
};

const STATUS_UI: Record<string, { label: string; color: string }> = {
  Active:              { label: "Active", color: "text-green-600 bg-green-50" },
  New:                 { label: "Forming", color: "text-yellow-600 bg-yellow-50" },
  PendingVerification: { label: "Pending", color: "text-blue-600 bg-blue-50" },
  Flagged:             { label: "Flagged", color: "text-red-600 bg-red-50" },
};

const ROLES = [
  "Squad Leader", "Vice Leader", "Membership Lead", "Digital Creator",
  "Meme / Creative Lead", "Issue Reporter", "Event Lead",
  "Environment Lead", "Documentation Lead", "Discipline Lead",
];

type Squad = {
  id: number; name: string; squadType: string; district: string; ward: string;
  locality: string; purpose: string; status: string; squadXp: number;
  squadRank: string; memberCount: number; captainName: string | null;
};

function SquadsContent() {
  const router     = useRouter();
  const params     = useSearchParams();
  const [squads, setSquads]       = useState<Squad[]>([]);
  const [loading, setLoading]     = useState(true);
  const [district, setDistrict]   = useState(params?.get("district") || "");
  const [joinTarget, setJoinTarget] = useState<Squad | null>(null);
  const [joinRole, setJoinRole]   = useState("");
  const [joinNote, setJoinNote]   = useState("");
  const [joinCode, setJoinCode]   = useState("");
  const [joining, setJoining]     = useState(false);
  const [joinSuccess, setJoinSuccess] = useState("");
  const [joinError, setJoinError] = useState("");
  const [tab, setTab]             = useState<"browse" | "code">("browse");
  const [existingSquad, setExistingSquad] = useState<any | null>(null);

  const loadSquads = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status: "Active", limit: "30" });
      if (district) q.set("district", district);
      const data = await fetchApi(`youth/squads?${q}`).catch(() => ({ items: [] }));
      setSquads(data.items || []);
    } finally {
      setLoading(false);
    }
  }, [district]);

  const checkExistingSquad = useCallback(async () => {
    try {
      const data = await fetchApi("youth/my-squad");
      if (data) {
        setExistingSquad(data);
      }
    } catch (e) {
      console.error("Failed to check existing squad", e);
    }
  }, []);

  useEffect(() => {
    loadSquads();
    checkExistingSquad();
  }, [loadSquads, checkExistingSquad]);

  const handleJoin = async () => {
    setJoinError("");
    if (!joinTarget && !joinCode) { setJoinError("Select a squad or enter an invite code"); return; }
    setJoining(true);
    try {
      const payload: any = { preferredRole: joinRole, requestNote: joinNote };
      if (joinCode.trim()) payload.inviteCode = joinCode.trim().toUpperCase();
      else if (joinTarget)  payload.squadId   = joinTarget.id;
      await fetchApi("youth/squads/join", { method: "POST", body: JSON.stringify(payload) });
      setJoinSuccess(joinTarget?.name || "the Squad via invite code");
      setJoinTarget(null);
    } catch (e: any) {
      setJoinError(e.message || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  if (joinSuccess) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] pt-[70px] lg:pt-[92px] font-['Familjen_Grotesk']">
        <Navbar />
        <main className="mx-auto max-w-lg px-5 py-16 text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-2xl font-black text-[#04330B]">Request Sent!</h1>
          <p className="text-[#587E67] mt-2">You have requested to join <strong>{joinSuccess}</strong>. Wait for Squad Leader approval.</p>
          <button onClick={() => router.push("/youth-front/my-dashboard")} className="mt-8 bg-[#04330B] text-white font-black px-8 py-3 rounded-2xl">
            Go to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FBF4] pt-[70px] lg:pt-[92px] font-['Familjen_Grotesk']">
      <Navbar />

      {/* Join modal */}
      {(joinTarget || tab === "code") && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-black text-[#04330B] mb-1">
              {joinTarget ? `Join: ${joinTarget.name}` : "Join via Invite Code"}
            </h3>
            <p className="text-sm text-[#587E67] mb-4">Your request will go to the Squad Leader for approval.</p>

            {!joinTarget && (
              <input
                type="text"
                placeholder="Paste invite code e.g. SQUAD-JAIP-4321"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#04330B] font-mono"
              />
            )}

            <select
              value={joinRole}
              onChange={(e) => setJoinRole(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#04330B] bg-white"
            >
              <option value="">Choose preferred role (optional)</option>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>

            <textarea
              placeholder="Why do you want to join? (optional)"
              value={joinNote}
              onChange={(e) => setJoinNote(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 resize-none focus:outline-none focus:border-[#04330B]"
              rows={2}
            />

            {joinError && (
              <div className="mb-4">
                <p className="text-red-600 text-sm font-semibold mb-2">{joinError}</p>
                {(joinError.toLowerCase().includes("already in an active or pending squad") || 
                  joinError.toLowerCase().includes("already a member")) && (
                  <button
                    onClick={() => router.push("/youth-front/my-dashboard")}
                    className="w-full bg-[#16A34A] text-white font-black py-2.5 rounded-xl text-sm hover:bg-[#04330B] transition-colors"
                  >
                    Go to My Squad Dashboard
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex-1 bg-[#04330B] text-white font-black py-3 rounded-xl hover:bg-[#16A34A] disabled:opacity-50"
              >
                {joining ? "Sending..." : "Request to Join"}
              </button>
              <button
                onClick={() => { setJoinTarget(null); setJoinCode(""); setTab("browse"); setJoinError(""); }}
                className="flex-1 border border-gray-200 rounded-xl py-3 font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-5 py-8">
        {existingSquad && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-black text-[#04330B] text-base">You are already in a Squad</h3>
              <p className="text-sm text-[#587E67] mt-1">
                You are a member of <strong className="text-[#04330B]">{existingSquad.name}</strong>. You cannot join or start another Squad.
              </p>
            </div>
            <button
              onClick={() => router.push("/youth-front/my-dashboard")}
              className="bg-[#04330B] text-white font-black px-5 py-2.5 rounded-xl text-sm shrink-0 hover:bg-[#16A34A] transition-colors"
            >
              Go to My Squad Dashboard
            </button>
          </div>
        )}

        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#04330B]">Squads ⚔️</h1>
            <p className="text-[#587E67] text-sm mt-1">Find a Squad near you or join via invite code.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setTab("code"); setJoinTarget(null); }}
              className="flex items-center gap-1.5 border border-[#04330B] text-[#04330B] font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#DCFCE7]"
            >
              Join via Code
            </button>
            <button
              onClick={() => router.push("/youth-front/squads/start")}
              className="flex items-center gap-1.5 bg-[#04330B] text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#16A34A]"
            >
              <Plus size={15} /> Start a Squad
            </button>
          </div>
        </div>

        {/* District filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by district..."
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-[#BBF7D0] rounded-xl text-sm focus:outline-none focus:border-[#04330B]"
            />
          </div>
          {district && (
            <button onClick={() => setDistrict("")} className="text-sm text-[#587E67] font-semibold">Clear</button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#587E67] font-semibold">Loading Squads...</div>
        ) : squads.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto text-[#9CA3AF] mb-4 opacity-40" />
            <p className="font-black text-[#04330B] text-lg">No active Squads found</p>
            <p className="text-[#587E67] text-sm mt-1">Be the first in your area.</p>
            <button
              onClick={() => router.push("/youth-front/squads/start")}
              className="mt-6 bg-[#04330B] text-white font-black px-8 py-3 rounded-2xl hover:bg-[#16A34A]"
            >
              Start a Squad
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {squads.map((sq) => {
              const statusInfo = STATUS_UI[sq.status] || { label: sq.status, color: "text-gray-500 bg-gray-50" };
              const rankEmoji  = SQUAD_RANK_EMOJI[sq.squadRank] || "🥉";
              const typeLabel  = SQUAD_TYPE_LABELS[sq.squadType] || sq.squadType;
              return (
                <div key={sq.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#BBF7D0] transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-black text-[#04330B]">{sq.name}</h3>
                      <p className="text-xs text-[#587E67] mt-0.5">{typeLabel} {sq.district ? `· ${sq.district}` : ""}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {sq.purpose && <p className="text-xs text-[#587E67] mb-3 line-clamp-2">{sq.purpose}</p>}

                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-50 flex-wrap">
                    <span className="text-sm font-semibold text-[#04330B]">
                      {rankEmoji} {sq.squadRank}
                    </span>
                    <span className="text-xs text-[#587E67]">{sq.squadXp} XP</span>
                    <span className="text-xs text-[#587E67]">
                      <Users size={11} className="inline mr-0.5" />{sq.memberCount} members
                    </span>
                    <button
                      onClick={() => setJoinTarget(sq)}
                      className="ml-auto flex items-center gap-1 text-xs font-bold text-[#04330B] bg-[#DCFCE7] px-3 py-1.5 rounded-lg hover:bg-[#BBF7D0]"
                    >
                      Request to Join <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SquadsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px] flex items-center justify-center">Loading...</div>}>
      <SquadsContent />
    </Suspense>
  );
}
