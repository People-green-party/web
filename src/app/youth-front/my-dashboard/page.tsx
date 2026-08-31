"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import Link from "next/link";
import { Copy, CheckCircle2, AlertCircle, Users, MapPin, Award, Flame, Zap, Shield, Star, ClipboardList, ChevronRight, Swords, Upload, X, ExternalLink } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { RequireAuth } from "../../components/RequireAuth";

const RANK_MAP: Record<string, { label: string; icon: string; color: string; next: string; xpNeeded: number }> = {
  Supporter:           { label: 'Observer',     icon: '👁',  color: '#6B7280', next: 'Awake',       xpNeeded: 50   },
  Volunteer:           { label: 'Awake',        icon: '⚡',  color: '#F59E0B', next: 'Active',      xpNeeded: 150  },
  ActiveMember:        { label: 'Active',       icon: '🔥',  color: '#EF4444', next: 'Defender',    xpNeeded: 300  },
  CampusCadre:         { label: 'Defender',     icon: '🛡',  color: '#3B82F6', next: 'Organizer',   xpNeeded: 600  },
  CampusOrganiser:     { label: 'Organizer',    icon: '🚀',  color: '#8B5CF6', next: 'Squad Leader',xpNeeded: 1200 },
  DistrictYouthLeader: { label: 'Squad Leader', icon: '👑',  color: '#D97706', next: 'Influencer',  xpNeeded: 2500 },
  StateYouthFellow:    { label: 'State Fellow', icon: '🌍',  color: '#047857', next: 'Max',         xpNeeded: 9999 },
};

const XP_THRESHOLDS = [0, 50, 150, 300, 600, 1200, 2500];

function getRank(memberLevel: string) {
  return RANK_MAP[memberLevel] || RANK_MAP['Supporter'];
}

function getXpToNextRank(xp: number): number {
  for (const t of XP_THRESHOLDS) { if (xp < t) return t; }
  return 2500;
}

function getPrevThreshold(xp: number): number {
  let prev = 0;
  for (const t of XP_THRESHOLDS) { if (xp < t) return prev; prev = t; }
  return 2500;
}

const MISSION_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  assigned:  { label: 'Not started', color: 'text-[#9CA3AF]' },
  inprogress:{ label: 'In progress', color: 'text-[#F59E0B]' },
  submitted: { label: 'Submitted',   color: 'text-[#3B82F6]' },
  completed: { label: 'Done ✓',      color: 'text-[#16A34A]' },
  approved:  { label: 'Approved ✓',  color: 'text-[#16A34A]' },
  rejected:  { label: 'Rejected',    color: 'text-[#EF4444]' },
  expired:   { label: 'Expired',     color: 'text-[#9CA3AF]' },
};

export default function MyDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [squad, setSquad] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [squadCodeCopied, setSquadCodeCopied] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [proofModal, setProofModal] = useState<{ userMissionId: number; title: string; completionKey: string } | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Trigger auto-completion check first (fire-and-forget)
      fetchApi('youth/my-missions/check', { method: 'POST' }).catch(() => {});

      const [profileData, issuesData, referralsData, missionsData, badgesData, squadData] = await Promise.all([
        fetchApi('youth/me/profile').catch(() => null),
        fetchApi('youth/my-issues').catch(() => []),
        fetchApi('youth/my-referrals').catch(() => []),
        fetchApi('youth/my-missions').catch(() => []),
        fetchApi('youth/my-badges').catch(() => []),
        fetchApi('youth/my-squad').catch(() => null),
      ]);
      if (profileData) setProfile(profileData);
      if (issuesData) setIssues(issuesData);
      if (referralsData) setReferrals(referralsData);
      if (Array.isArray(missionsData)) setMissions(missionsData);
      if (Array.isArray(badgesData)) setBadges(badgesData);
      setSquad(squadData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = profile?.member?.referralCode
      ? `https://peoplesgreen.org/join?ref=${profile.member.referralCode}&program=youth-front`
      : '';
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinWhatsapp = async (userMissionId: number) => {
    const inviteUrl =
      process.env.NEXT_PUBLIC_YOUTH_WHATSAPP_INVITE ||
      "https://wa.me/919521627701?text=" +
        encodeURIComponent("Hi, I want to join the PGP Youth Front WhatsApp community.");
    window.open(inviteUrl, "_blank");
    try {
      await fetchApi(`youth/my-missions/${userMissionId}/proof`, {
        method: "POST",
        body: JSON.stringify({ proofUrl: inviteUrl }),
      });
      fetchDashboard();
    } catch (e) {
      console.error("Failed to mark WhatsApp mission as completed", e);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofModal || !proofUrl.trim()) return;
    setProofSubmitting(true);
    try {
      await fetchApi(`youth/my-missions/${proofModal.userMissionId}/proof`, {
        method: 'POST',
        body: JSON.stringify({ proofUrl: proofUrl.trim() }),
      });
      setProofSuccess(true);
      setTimeout(() => {
        setProofModal(null);
        fetchDashboard();
      }, 1800);
    } catch (e) {
      console.error('Failed to submit proof', e);
    } finally {
      setProofSubmitting(false);
    }
  };

  const xp = profile?.points || 0;
  const rank = getRank(profile?.memberLevel || 'Supporter');
  const nextXp = getXpToNextRank(xp);
  const prevXp = getPrevThreshold(xp);
  const xpProgress = nextXp === prevXp ? 100 : Math.round(((xp - prevXp) / (nextXp - prevXp)) * 100);
  const firstName = (() => { const n = profile?.member?.name || profile?.name; return n ? n.split(' ')[0] : 'Member'; })();
  const zindaId = profile?.zindaId || profile?.jindaId || '—';
  const streak = profile?.currentStreak || 0;
  const bestStreak = profile?.bestStreak || 0;
  const hasSquad = !!squad;
  const completedMissions = missions.filter((m) => m.status === 'completed' || m.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 lg:px-8 py-14">
          <div className="text-center text-[#587E67] font-semibold">Loading your ZINDA profile...</div>
        </main>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F8FAF9] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />

        {/* ── Proof Upload Modal ── */}
        {proofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 relative">
              <button
                onClick={() => setProofModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>

              {proofSuccess ? (
                <div className="text-center py-6">
                  <div className="h-14 w-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-[#16A34A]" size={28} />
                  </div>
                  <h3 className="text-xl font-black text-[#04330b] mb-1">Submitted!</h3>
                  <p className="text-sm text-[#587E67]">Your proof is under review. XP will be credited after admin approval.</p>
                </div>
              ) : proofModal?.completionKey === 'campaign_attend_meetup' ? (
                /* ── Meetup-specific proof modal ── */
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0 text-xl">🏟️</div>
                    <div>
                      <h3 className="font-black text-[#04330b] text-base leading-tight">Attend a local ZINDA meetup</h3>
                      <p className="text-xs text-[#587E67] mt-0.5">Choose how you want to prove your attendance</p>
                    </div>
                  </div>

                  {/* Option A: Event Code */}
                  <div className="rounded-2xl border-2 border-[#04330b] bg-[#F5FBF7] p-4 mb-3">
                    <p className="text-xs font-black text-[#04330b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      🔑 Option A — Event Check-in Code
                    </p>
                    <p className="text-[11px] text-[#587E67] mb-3 leading-relaxed">
                      ZINDA organizers share a <strong>unique 6-digit code</strong> at every meetup (on a slide or verbally). Enter it here.
                    </p>
                    <input
                      type="text"
                      placeholder="e.g.  ZINDA-2706"
                      value={proofUrl.startsWith('code:') ? proofUrl.replace('code:', '') : ''}
                      onChange={(e) => setProofUrl(e.target.value ? `code:${e.target.value.toUpperCase()}` : '')}
                      maxLength={12}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-[#04330b] outline-none focus:border-[#04330b] bg-white tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] text-gray-400 font-bold">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Option B: Photo link */}
                  <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-4 mb-5">
                    <p className="text-xs font-black text-[#04330b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      📸 Option B — Photo Proof
                    </p>
                    <p className="text-[11px] text-[#587E67] mb-3 leading-relaxed">
                      Take a selfie at the event venue → upload to <strong>Google Drive</strong> or post on <strong>Instagram</strong> → paste the public link below.
                    </p>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or https://instagram.com/p/..."
                      value={proofUrl.startsWith('code:') ? '' : proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#04330b] outline-none focus:border-[#04330b] bg-white placeholder:text-gray-400"
                    />
                    {proofUrl && !proofUrl.startsWith('code:') && (
                      <a href={proofUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-[#587E67] mt-1.5 hover:text-[#04330b] transition-colors w-fit">
                        <ExternalLink size={10} /> Preview link
                      </a>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitProof}
                    disabled={!proofUrl.trim() || proofSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#04330b] text-white font-bold text-sm hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {proofSubmitting
                      ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      : <><CheckCircle2 size={15} /> Submit Attendance</>}
                  </button>
                </>
              ) : (
                /* ── Generic proof modal (story + meme) ── */
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                      <Upload className="text-[#16A34A]" size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-[#04330b] text-base leading-tight">{proofModal?.title}</h3>
                      <p className="text-xs text-[#587E67] mt-0.5">
                        {proofModal?.completionKey === 'campaign_joining_story' && 'Share a photo/video link (Google Drive, Instagram, etc.)'}
                        {proofModal?.completionKey === 'campaign_meme_upload' && 'Share your meme link (Instagram, Twitter, Drive, etc.)'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F5FBF7] rounded-2xl p-4 border border-[#E8F5E9] mb-5">
                    <p className="text-[10px] font-bold text-[#587E67] uppercase tracking-wider mb-2">How to submit:</p>
                    <ol className="space-y-1.5 text-xs text-[#587E67]">
                      <li className="flex items-start gap-2"><span className="font-bold text-[#04330b] shrink-0">1.</span>
                        {proofModal?.completionKey === 'campaign_meme_upload'
                          ? 'Post your meme on social media or upload to Google Drive'
                          : 'Record/write your joining story (photo or video)'}
                      </li>
                      <li className="flex items-start gap-2"><span className="font-bold text-[#04330b] shrink-0">2.</span>Copy the public / shareable link</li>
                      <li className="flex items-start gap-2"><span className="font-bold text-[#04330b] shrink-0">3.</span>Paste it below and hit Submit</li>
                    </ol>
                  </div>

                  <label className="block text-xs font-bold text-[#04330b] mb-1.5">Paste your proof link here</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or https://instagram.com/p/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#04330b] outline-none focus:border-[#04330b] transition-colors bg-[#FAFAFA] placeholder:text-gray-400"
                  />
                  {proofUrl && (
                    <a href={proofUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-[#587E67] mt-1.5 hover:text-[#04330b] transition-colors w-fit">
                      <ExternalLink size={10} /> Preview link
                    </a>
                  )}

                  <button
                    onClick={handleSubmitProof}
                    disabled={!proofUrl.trim() || proofSubmitting}
                    className="mt-5 w-full py-3 rounded-2xl bg-[#04330b] text-white font-bold text-sm hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {proofSubmitting
                      ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      : <><Upload size={15} /> Submit for Review</>}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <main className="mx-auto max-w-5xl px-5 lg:px-8 py-10">

          {/* ── ZINDA Identity Card (WelcomeHero) ── */}
          <section className="bg-[#04330b] text-white p-8 rounded-[40px] relative overflow-hidden mb-8 shadow-xl">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-[#86EFAC] opacity-80 mb-2">ZINDA • YOUTH</p>
              <h1 className="text-4xl lg:text-5xl font-black mb-1 tracking-tight">Welcome, {firstName}</h1>
              <p className="text-xs opacity-60 font-mono mb-8">ID: {zindaId}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Rank', value: rank.label, icon: <Flame size={16} className="text-orange-400 shrink-0" /> },
                  { label: 'XP', value: String(xp), icon: null },
                  { label: 'Streak', value: `${streak}d`, icon: <Flame size={16} className="text-orange-400 shrink-0" />, sub: `(Best: ${bestStreak}d)` },
                  { label: 'Recruits', value: String(referrals.length), icon: null }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/5 flex flex-col justify-between">
                    <p className="text-xs opacity-70 mb-1 font-semibold">{stat.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.icon}
                      <span className="text-xl font-bold">{stat.value}</span>
                      {stat.sub && <span className="text-[10px] opacity-50 ml-1">{stat.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="flex items-center gap-1"><Flame size={14} className="text-orange-400" /> {rank.label}</span>
                <span>{xp} / {nextXp} XP → {rank.next}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#34d399] rounded-full shadow-[0_0_12px_#34d399]" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </section>

          {/* Main Layout Rows */}
          <div className="space-y-8">
            
            {/* Row 1: Missions (Left) + Squad/Invite (Right) */}
            <div className="grid grid-cols-12 gap-8">
              
              {/* Left Column: Your Missions */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white p-6 rounded-[40px] border border-gray-200/50 shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black flex items-center gap-2 text-[#04330b]">
                        <Swords size={20} className="text-red-500" /> Your Missions
                      </h2>
                      <span className="bg-[#E8F5E9] text-[#16A34A] px-3 py-1 rounded-full text-xs font-bold shrink-0">
                        {completedMissions} / {missions.length} done
                      </span>
                    </div>
                    
                    {missions.length === 0 ? (
                      <div className="text-center py-8 text-[#587E67]">
                        <p className="font-semibold">No missions assigned yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(showAllMissions ? missions : missions.slice(0, 5)).map((m: any, i: number) => {
                          const done = m.status === 'completed' || m.status === 'approved';
                          const submitted = m.status === 'submitted';
                          const statusInfo = MISSION_STATUS_LABEL[m.status] || MISSION_STATUS_LABEL['assigned'];
                          return (
                            <div key={m.userMissionId} className="flex items-center justify-between p-4 bg-[#F5FBF7] rounded-2xl mb-3 border border-gray-200/40">
                              <div className="flex items-center gap-4 min-w-0 flex-1 mr-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                                  done ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-gray-100 text-[#587E67]'
                                }`}>
                                  {done ? <CheckCircle2 size={16} /> : i + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-sm text-[#04330b] truncate">{m.title}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`text-[10px] font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-black text-[#16A34A]">+{m.xpReward} XP</span>
                                
                                {!done && !submitted && m.completionKey === 'onboarding_report_issue' && (
                                  <button onClick={() => router.push('/youth-front/report-issue')} className="px-4 py-1.5 bg-[#04330b] hover:bg-[#16A34A] text-white rounded-full text-xs font-bold transition-colors">Go</button>
                                )}
                                {!done && !submitted && m.completionKey === 'onboarding_invite_3' && (
                                  <button onClick={copyReferralLink} className="px-4 py-1.5 bg-[#04330b] hover:bg-[#16A34A] text-white rounded-full text-xs font-bold transition-colors">{copied ? '✓' : 'Copy'}</button>
                                )}
                                {!done && !submitted && m.completionKey === 'onboarding_join_whatsapp' && (
                                  <button onClick={() => handleJoinWhatsapp(m.userMissionId)} className="px-4 py-1.5 bg-[#04330b] hover:bg-[#16A34A] text-white rounded-full text-xs font-bold transition-colors">Join</button>
                                )}
                                {!done && !submitted && m.completionKey === 'onboarding_join_squad' && (
                                  <button onClick={() => router.push('/youth-front/squads')} className="px-4 py-1.5 bg-[#04330b] hover:bg-[#16A34A] text-white rounded-full text-xs font-bold transition-colors">Go</button>
                                )}
                                {!done && !submitted && ['campaign_joining_story', 'campaign_meme_upload', 'campaign_attend_meetup'].includes(m.completionKey) && (
                                  <button
                                    onClick={() => { setProofModal({ userMissionId: m.userMissionId, title: m.title, completionKey: m.completionKey }); setProofUrl(''); setProofSuccess(false); }}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-[#04330b] hover:bg-[#16A34A] text-white rounded-full text-xs font-bold transition-colors"
                                  >
                                    <Upload size={11} /> Upload
                                  </button>
                                )}
                                {submitted && ['campaign_joining_story', 'campaign_meme_upload', 'campaign_attend_meetup'].includes(m.completionKey) && (
                                  <span className="text-[10px] font-bold text-[#3B82F6] bg-blue-50 px-2.5 py-1 rounded-full">Under Review</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {missions.length > 5 && (
                    <div className="text-center mt-5">
                      <button
                        onClick={() => setShowAllMissions(!showAllMissions)}
                        className="text-sm font-semibold text-[#587E67] hover:text-[#04330B] transition-colors flex items-center gap-1.5 mx-auto"
                      >
                        {showAllMissions ? 'See less missions' : 'See all missions'}
                        <ChevronRight size={14} className={showAllMissions ? '-rotate-90' : 'rotate-90'} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Squad & Invite Link */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                
                {/* ── Your Squad Card ── */}
                <div className="bg-white p-6 rounded-[40px] border border-gray-200/50 shadow-sm">
                  <h2 className="text-xl font-black flex items-center gap-1.5 text-[#04330b]">👥 Your Squad</h2>
                  
                  {!squad && (
                    <div className="text-center py-4">
                      <Users className="mx-auto text-[#9CA3AF] mb-3 opacity-40" size={32} />
                      <p className="font-bold text-[#04330b] text-sm">Not in a Squad yet</p>
                      <p className="text-xs text-[#587E67] mt-2 mb-5 leading-relaxed">
                        Join or start a 10-member Squad near you to unlock Squad XP and co-op missions.
                      </p>
                      <div className="flex flex-col gap-2">
                        <Link href="/youth-front/squads" className="w-full text-center py-3 rounded-2xl bg-[#04330b] text-white font-bold text-xs hover:bg-[#16A34A] transition-colors">
                          Join a Squad
                        </Link>
                        <Link href="/youth-front/squads/start" className="w-full text-center py-3 rounded-2xl border border-[#04330b] text-[#04330b] font-bold text-xs hover:bg-[#DCFCE7] transition-colors">
                          Start a Squad
                        </Link>
                      </div>
                    </div>
                  )}

                  {squad && squad.status !== 'Active' && squad.status !== 'New' && squad.status !== 'PendingVerification' && (
                    <div className="bg-yellow-50 rounded-xl p-4 text-xs mt-3">
                      <p className="font-black text-[#04330b] mb-1">Squad Request Pending</p>
                      <div className="space-y-1 text-[#587E67]">
                        <div><span className="font-semibold">Squad:</span> {squad.name}</div>
                        <div><span className="font-semibold">Role:</span> {squad.myPreferredRole || squad.myRole}</div>
                        <div><span className="font-semibold">Status:</span> Pending Approval</div>
                      </div>
                    </div>
                  )}

                  {squad && (squad.status === 'New' || squad.status === 'PendingVerification') && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-black text-[#04330b] text-sm">{squad.name}</span>
                      </div>
                      <div className="bg-[#FEFCE8] border border-yellow-200 rounded-2xl p-4 text-xs space-y-2">
                        <div className="flex justify-between font-bold text-[#854D0E]">
                          <span>Members</span>
                          <span>{squad.memberCount} / 10</span>
                        </div>
                        <div className="h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, (squad.memberCount / 10) * 100)}%` }} />
                        </div>
                        <p className="text-[#854D0E]/80 font-semibold leading-relaxed">
                          Your Squad is forming. Invite {Math.max(0, 10 - squad.memberCount)} more verified members to activate.
                        </p>
                      </div>
                      {squad.inviteCode && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://peoplesgreen.org/join-squad?code=${squad.inviteCode}`);
                            setSquadCodeCopied(true);
                            setTimeout(() => setSquadCodeCopied(false), 2000);
                          }}
                          className="w-full mt-4 flex items-center justify-center gap-2 bg-[#04330b] text-white font-bold py-3 rounded-2xl text-xs hover:bg-[#16A34A] transition-colors"
                        >
                          {squadCodeCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          {squadCodeCopied ? 'Copied!' : `Copy Invite Link (${squad.inviteCode})`}
                        </button>
                      )}
                    </div>
                  )}

                  {squad && squad.status === 'Active' && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-black text-[#04330b] text-sm">{squad.name}</span>
                      </div>
                      <div className="bg-[#F0FBF4] border border-[#BBF7D0] rounded-2xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#587E67] font-semibold">Your Role</span>
                          <span className="font-bold text-[#04330b]">{squad.myPreferredRole || squad.myRole}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#587E67] font-semibold">Total Members</span>
                          <span className="font-bold text-[#04330b]">{squad.members?.length || 0}</span>
                        </div>
                      </div>
                      <Link
                        href="/youth-front/squad-missions"
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#04330b] text-white font-bold rounded-2xl text-xs hover:bg-[#16A34A] transition-colors"
                      >
                        <Swords size={14} />
                        Squad Missions
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  )}

                </div>

                {/* ── Your ZINDA Invite Link Card ── */}
                <div className="bg-white p-6 rounded-[40px] border border-gray-200/50 shadow-sm">
                  <h2 className="text-xl font-black mb-1 flex items-center gap-1.5 text-[#04330b]">🔗 Your Invite Link</h2>
                  <p className="text-xs text-[#587E67] mb-4">Earn XP for every verified recruit you bring into the movement.</p>
                  
                  <div className="flex gap-2 bg-[#F5FBF7] border border-[#E8F5E9] rounded-2xl p-1 items-center">
                    <input
                      type="text"
                      readOnly
                      value={profile?.member?.referralCode
                        ? `https://peoplesgreen.org/join?ref=${profile.member.referralCode}&program=youth-front`
                        : 'Loading...'}
                      className="flex-1 bg-transparent px-3 text-xs font-semibold text-[#587E67] outline-none select-all"
                    />
                    <button
                      onClick={copyReferralLink}
                      disabled={!profile?.member?.referralCode}
                      className="bg-[#04330b] text-white p-2.5 rounded-xl hover:bg-[#16A34A] transition-colors shrink-0 disabled:opacity-50"
                    >
                      {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-2">Only OTP verified signups count as recruits.</p>

                  {/* Recruits List / Empty State */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    {referrals.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#04330b]">Your Recruits ({referrals.length})</div>
                        {referrals.slice(0, 3).map((r: any) => (
                          <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F5FBF7]">
                            <div className="h-7 w-7 rounded-full bg-[#E8F5E9] flex items-center justify-center text-xs font-black text-[#16A34A] shrink-0">
                              {r.name?.[0] || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-[#04330b] truncate">{r.name}</div>
                              <div className="text-[10px] text-[#587E67]">{r.registrationStatus === 'completed' ? '✓ Verified' : 'Pending'}</div>
                            </div>
                            {r.youthProfile && (
                              <div className="text-[10px] font-bold text-[#16A34A] shrink-0">
                                {getRank(r.youthProfile.memberLevel).icon} {getRank(r.youthProfile.memberLevel).label}
                              </div>
                            )}
                          </div>
                        ))}
                        {referrals.length > 3 && <p className="text-xs text-[#587E67] text-center font-bold mt-1">+{referrals.length - 3} more</p>}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="h-10 w-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-2 border border-dashed border-gray-200">
                          <Users size={16} />
                        </div>
                        <p className="text-xs text-[#587E67] font-semibold">No recruits yet. Share your link!</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>

            {/* Row 2: Bottom Row (XP History, Your Issues, Your Badges) spanning full width */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ── XP History ── */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-200/50 shadow-sm flex flex-col">
                <h2 className="text-xl font-black mb-4 flex items-center gap-1.5 text-[#04330b]">⚡ XP History</h2>
                {profile?.member?.youthPointLedgers?.length > 0 ? (
                  <div className="space-y-4 flex-1">
                    {profile.member.youthPointLedgers.map((ledger: any) => (
                      <div key={ledger.id} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-xs text-[#04330b] leading-tight">{ledger.reason}</div>
                          <div className="text-[9px] text-[#9CA3AF] mt-1">{new Date(ledger.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="font-bold text-[#16A34A] shrink-0 text-xs text-right whitespace-nowrap">
                          +{ledger.points} XP
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#587E67] flex-1 flex flex-col justify-center">
                    <Zap className="mx-auto mb-2 text-[#9CA3AF]" size={28} />
                    <p className="font-semibold text-sm">No XP yet</p>
                    <p className="text-xs mt-1">Complete a mission to start earning XP</p>
                  </div>
                )}
              </div>

              {/* ── Your Issues ── */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-200/50 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black flex items-center gap-1.5 text-[#04330b]">⚠️ Your Issues</h2>
                  <button
                    onClick={() => router.push('/youth-front/report-issue')}
                    className="px-3 py-1 rounded-full bg-[#04330B] text-white hover:bg-[#16A34A] text-[10px] font-black tracking-wider uppercase transition-colors"
                  >
                    REPORT
                  </button>
                </div>
                {issues.length === 0 ? (
                  <div className="text-center py-12 text-[#587E67] flex-1 flex flex-col justify-center">
                    <ClipboardList className="mx-auto mb-2 text-[#9CA3AF]" size={24} />
                    <p className="font-semibold text-xs">No issues reported yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1">
                    {issues.slice(0, 3).map((issue) => (
                      <div key={issue.id} className="rounded-2xl bg-[#F5FBF7] p-3 border border-gray-100 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#04330b] truncate">{issue.title}</div>
                          <div className="text-[10px] text-[#587E67] mt-0.5">{issue.category} · {issue.district || '—'}</div>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          issue.status === 'HumanVerified' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                          issue.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                          'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Your Badges ── */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-200/50 shadow-sm flex flex-col">
                <h2 className="text-xl font-black mb-4 flex items-center gap-1.5 text-[#04330b]">🏆 Your Badges</h2>
                <div className="flex flex-col gap-3 flex-1 justify-start">
                  {badges.map((ub: any) => (
                    <div key={ub.id} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F5FBF7] border border-[#E8F5E9] text-center w-full">
                      <span className="text-3xl mb-1">{ub.badge.icon}</span>
                      <div className="font-bold text-xs text-[#04330B] truncate w-full">{ub.badge.name}</div>
                      <div className="text-[9px] text-[#16A34A] font-bold uppercase tracking-wider mt-0.5">{ub.badge.rarity}</div>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 2 - badges.length) }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-dashed border-gray-200 text-center opacity-50 w-full">
                      <span className="text-2xl mb-1 filter grayscale">🔒</span>
                      <div className="font-bold text-xs text-gray-400">Locked</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">UNLOCKED BY TASK</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
