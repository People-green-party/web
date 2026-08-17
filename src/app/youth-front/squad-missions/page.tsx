'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { fetchApi } from '../../../lib/api';
import { RequireAuth } from '../../components/RequireAuth';
import { CheckCircle2, Clock, XCircle, ChevronRight, Users, Upload } from 'lucide-react';

const STATUS_UI: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  submitted: { label: 'Under Review', icon: <Clock size={13} />,        color: 'text-yellow-700', bg: 'bg-yellow-50' },
  approved:  { label: 'Approved ✓',   icon: <CheckCircle2 size={13} />, color: 'text-green-700',  bg: 'bg-green-50'  },
  rejected:  { label: 'Rejected',     icon: <XCircle size={13} />,      color: 'text-red-700',    bg: 'bg-red-50'    },
};

type Mission = {
  id: number; title: string; description: string; xpReward: number;
  squadStatus: string | null; squadXpAwarded: number;
};

type Member = { id: number; name: string };

export default function SquadMissionsPage() {
  return (
    <RequireAuth portal="youth">
      <SquadMissionsInner />
    </RequireAuth>
  );
}

function SquadMissionsInner() {
  const router = useRouter();
  const [squad, setSquad]           = useState<any>(null);
  const [missions, setMissions]     = useState<Mission[]>([]);
  const [members, setMembers]       = useState<Member[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Mission | null>(null);
  const [proofUrl, setProofUrl]     = useState('');
  const [notes, setNotes]           = useState('');
  const [participants, setParticipants] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    const [squadData, myProfile] = await Promise.all([
      fetchApi('youth/my-squad').catch(() => null),
      fetchApi('youth/me/profile').catch(() => null),
    ]);
    setSquad(squadData);

    if (squadData?.id) {
      const [missionData, squadDetail] = await Promise.all([
        fetchApi(`youth/squad-missions?squadId=${squadData.id}`).catch(() => []),
        fetchApi(`youth/my-squad`).catch(() => null),
      ]);
      setMissions(Array.isArray(missionData) ? missionData : []);
      setMembers(squadDetail?.members?.map((m: any) => ({ id: m.memberId, name: m.name || String(m.memberId) })) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openSubmit = (m: Mission) => {
    setSelected(m);
    setProofUrl('');
    setNotes('');
    setParticipants([]);
  };

  const toggleParticipant = (id: number) => {
    setParticipants((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const submit = async () => {
    if (!selected) return;
    if (!proofUrl.trim()) { showToast('Please add a proof link'); return; }
    setSubmitting(true);
    try {
      const res = await fetchApi('youth/squad-missions/submit', {
        method: 'POST',
        body: JSON.stringify({ missionId: selected.id, proofUrl, notes, participantIds: participants }),
      });
      if (res?.success) {
        showToast('✅ Submitted! Waiting for admin review.');
        setSelected(null);
        load();
      } else {
        showToast(res?.message || 'Submission failed');
      }
    } catch (e: any) {
      showToast(e?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const notInSquad  = !squad;
  const notActive   = squad && squad.status !== 'Active';
  const squadId     = squad?.id;

  return (
      <div className="min-h-screen bg-[#F0FBF4] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#04330B] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold">
            {toast}
          </div>
        )}

        <main className="mx-auto max-w-2xl px-5 py-10">

          {/* Header */}
          <div className="mb-6">
            <button onClick={() => router.back()} className="text-sm text-[#587E67] hover:text-[#04330B] mb-3 flex items-center gap-1">
              ← Back
            </button>
            <h1 className="text-2xl font-black">⚔️ Squad Missions</h1>
            <p className="text-sm text-[#587E67] mt-1">
              Complete missions as a Squad to earn Squad XP and rank up.
            </p>
          </div>

          {loading && (
            <div className="text-center py-16 text-[#587E67] font-semibold">Loading...</div>
          )}

          {/* Not in squad */}
          {!loading && notInSquad && (
            <div className="rounded-2xl bg-white border border-[#BBF7D0] p-8 text-center">
              <Users className="mx-auto text-[#9CA3AF] mb-3" size={40} />
              <p className="font-black text-lg text-[#04330B]">You are not in a Squad</p>
              <p className="text-sm text-[#587E67] mt-2 mb-5">Join or start a Squad first to access Squad Missions.</p>
              <button onClick={() => router.push('/youth-front/squads')}
                className="px-5 py-2.5 bg-[#04330B] text-white font-bold rounded-xl text-sm hover:bg-[#16A34A] transition-colors">
                Find a Squad
              </button>
            </div>
          )}

          {/* Squad not active yet */}
          {!loading && notActive && (
            <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-6 text-center">
              <p className="font-black text-[#04330B]">Your Squad is still forming</p>
              <p className="text-sm text-[#587E67] mt-2">
                Squad Missions unlock once your Squad reaches 10 members and is approved.
              </p>
              <p className="text-sm font-bold text-[#04330B] mt-3">
                {squad.memberCount} / 10 members
              </p>
            </div>
          )}

          {/* Squad is active — show missions */}
          {!loading && squad?.status === 'Active' && (
            <>
              {/* Squad XP banner */}
              <div className="rounded-2xl bg-[#04330B] text-white p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#86EFAC] font-bold uppercase tracking-widest">{squad.name}</p>
                    <p className="text-2xl font-black mt-0.5">{squad.squadRank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#86EFAC]">Squad XP</p>
                    <p className="text-2xl font-black text-[#4ADE80]">{squad.squadXp}</p>
                  </div>
                </div>
                {squad.nextRankXp && (
                  <div className="mt-3">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4ADE80] rounded-full"
                        style={{ width: `${Math.min(100, (squad.squadXp / squad.nextRankXp) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-[#86EFAC] mt-1">{squad.squadXp} / {squad.nextRankXp} XP → {squad.nextRankName}</p>
                  </div>
                )}
              </div>

              {/* Mission list */}
              {missions.length === 0 ? (
                <p className="text-center text-[#587E67] py-10">No Squad Missions available yet.</p>
              ) : (
                <div className="space-y-3">
                  {missions.map((m) => {
                    const s = m.squadStatus ? STATUS_UI[m.squadStatus] : null;
                    const done = m.squadStatus === 'approved';
                    return (
                      <div key={m.id}
                        className={`rounded-2xl bg-white border p-5 transition-all ${done ? 'border-[#BBF7D0] opacity-80' : 'border-[#BBF7D0] hover:border-[#16A34A]'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-black text-base ${done ? 'line-through text-[#9CA3AF]' : 'text-[#04330B]'}`}>
                                {m.title}
                              </h3>
                              {s && (
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.color} ${s.bg}`}>
                                  {s.icon} {s.label}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#587E67] mt-1 leading-relaxed">{m.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                                +{m.xpReward} Squad XP
                              </span>
                              <span className="text-xs text-[#9CA3AF]">
                                +{Math.floor(m.xpReward * 0.5)} XP each member
                              </span>
                            </div>
                            {m.squadStatus === 'rejected' && (
                              <p className="text-xs text-red-600 mt-2 font-semibold">Rejected — you can resubmit with updated proof.</p>
                            )}
                          </div>

                          {!done && m.squadStatus !== 'submitted' && (
                            <button
                              onClick={() => openSubmit(m)}
                              className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#04330B] text-white font-bold text-sm rounded-xl hover:bg-[#16A34A] transition-colors"
                            >
                              <Upload size={14} />
                              Submit
                            </button>
                          )}
                          {m.squadStatus === 'submitted' && (
                            <span className="shrink-0 text-xs text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-xl font-bold">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>

        {/* Submit modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-black text-[#04330B]">{selected.title}</h2>
                <p className="text-sm text-[#587E67] mt-1">{selected.description}</p>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* XP preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#DCFCE7] rounded-xl p-3 text-center">
                    <p className="text-xs text-[#587E67]">Squad XP</p>
                    <p className="text-xl font-black text-[#16A34A]">+{selected.xpReward}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-[#587E67]">Each member</p>
                    <p className="text-xl font-black text-blue-700">+{Math.floor(selected.xpReward * 0.5)}</p>
                  </div>
                </div>

                {/* Proof URL */}
                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-1.5">
                    Proof Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://instagram.com/p/... or Google Drive link"
                    className="w-full border border-[#DDEEE4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1">Share a photo, video or doc link as proof.</p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-1.5">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Describe what the Squad did..."
                    className="w-full border border-[#DDEEE4] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] resize-none"
                  />
                </div>

                {/* Participants */}
                {members.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-1.5">
                      Tag Participants <span className="text-[#9CA3AF] font-normal">(select who took part)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {members.map((mem) => (
                        <button
                          key={mem.id}
                          onClick={() => toggleParticipant(mem.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                            participants.includes(mem.id)
                              ? 'bg-[#04330B] text-white border-[#04330B]'
                              : 'bg-white text-[#587E67] border-[#DDEEE4] hover:border-[#04330B]'
                          }`}
                        >
                          {mem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={submit}
                  disabled={submitting || !proofUrl.trim()}
                  className="flex-1 py-3 bg-[#04330B] text-white font-black rounded-xl hover:bg-[#16A34A] transition-colors disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-3 border border-[#DDEEE4] text-[#587E67] font-semibold rounded-xl hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
