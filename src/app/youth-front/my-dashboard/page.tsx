"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import Link from "next/link";
import { Copy, CheckCircle2, AlertCircle, Users, MapPin, Award, Flame, Zap, Shield, Star, ClipboardList, ChevronRight, Swords } from "lucide-react";
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

  const xp = profile?.points || 0;
  const rank = getRank(profile?.memberLevel || 'Supporter');
  const nextXp = getXpToNextRank(xp);
  const prevXp = getPrevThreshold(xp);
  const xpProgress = nextXp === prevXp ? 100 : Math.round(((xp - prevXp) / (nextXp - prevXp)) * 100);
  const firstName = (() => { const n = profile?.member?.name || profile?.name; return n ? n.split(' ')[0] : 'Member'; })();
  const jindaId = profile?.jindaId || '—';
  const streak = profile?.currentStreak || 0;
  const bestStreak = profile?.bestStreak || 0;
  const hasSquad = !!squad;
  const completedMissions = missions.filter((m) => m.status === 'completed' || m.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FBF4] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 lg:px-8 py-14">
          <div className="text-center text-[#587E67] font-semibold">Loading your JINDA profile...</div>
        </main>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F0FBF4] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 lg:px-8 py-10">

          {/* ── JINDA Identity Card ── */}
          <div className="rounded-2xl bg-[#04330B] text-white p-6 mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold tracking-widest text-[#86EFAC] uppercase">JINDA · PGP Youth Front</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">Welcome, {firstName}</h1>
              <p className="text-[#86EFAC] text-sm mt-1 font-mono">ID: {jindaId}</p>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xs text-[#86EFAC] font-semibold">Rank</div>
                  <div className="text-lg font-black mt-0.5">{rank.icon} {rank.label}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xs text-[#86EFAC] font-semibold">XP</div>
                  <div className="text-lg font-black mt-0.5">{xp}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xs text-[#86EFAC] font-semibold">Streak</div>
                  <div className="text-lg font-black mt-0.5">{streak > 0 ? `🔥 ${streak}d` : '0 days'}</div>
                  {bestStreak > 0 && <div className="text-[10px] text-[#86EFAC]/70 mt-0.5">Best: {bestStreak}d</div>}
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xs text-[#86EFAC] font-semibold">Recruits</div>
                  <div className="text-lg font-black mt-0.5">{referrals.length}</div>
                </div>
              </div>

              {/* XP Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#86EFAC] font-semibold mb-1">
                  <span>{rank.icon} {rank.label}</span>
                  <span>{xp} / {nextXp} XP → {rank.next}</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4ADE80] rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Missions (from API) ── */}
          <div className="rounded-2xl border border-[#BBF7D0] bg-white p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black">🎯 Your Missions</h2>
              {missions.length > 0 && (
                <span className="text-xs bg-[#DCFCE7] text-[#16A34A] font-bold px-3 py-1 rounded-full">
                  {completedMissions} / {missions.length} done
                </span>
              )}
            </div>
            {missions.length === 0 ? (
              <div className="text-center py-6 text-[#587E67]">
                <p className="font-semibold">Loading missions...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missions.map((m: any, i: number) => {
                  const done = m.status === 'completed' || m.status === 'approved';
                  const submitted = m.status === 'submitted';
                  const statusInfo = MISSION_STATUS_LABEL[m.status] || MISSION_STATUS_LABEL['assigned'];
                  return (
                    <div key={m.userMissionId} className={`flex items-center gap-3 rounded-xl p-4 transition-all ${done ? 'bg-[#F0FBF4] opacity-70' : 'bg-[#F9FAFB]'}`}>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${done ? 'bg-[#16A34A] text-white' : 'bg-[#DCFCE7] text-[#04330B]'}`}>
                        {done ? <CheckCircle2 size={14} /> : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${done ? 'line-through text-[#9CA3AF]' : 'text-[#04330B]'}`}>{m.title}</div>
                        <div className={`text-xs mt-0.5 font-semibold ${statusInfo.color}`}>{statusInfo.label}</div>
                      </div>
                      <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">+{m.xpReward} XP</span>
                      {!done && !submitted && m.completionKey === 'onboarding_report_issue' && (
                        <button onClick={() => router.push('/youth-front/report-issue')} className="ml-1 px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A]">Go</button>
                      )}
                      {!done && !submitted && m.completionKey === 'onboarding_invite_3' && (
                        <button onClick={copyReferralLink} className="ml-1 px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A]">{copied ? '✓' : 'Copy'}</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* ── Squad Card (4-state) ── */}
            <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
              <h2 className="text-xl font-black mb-4">⚔️ Your Squad</h2>

              {/* STATE 1: No squad */}
              {!squad && (
                <div className="text-center py-4">
                  <Users className="mx-auto text-[#9CA3AF] mb-3" size={36} />
                  <p className="font-semibold text-[#04330B]">You are not in a Squad yet.</p>
                  <p className="text-sm text-[#587E67] mt-2 mb-5 leading-relaxed">
                    A Squad is a 10-member local team in your campus, ward, village, mohalla or digital community.
                    Join or start a Squad to unlock Squad XP, Squad missions and leadership roles.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/youth-front/squads" className="px-4 py-2.5 rounded-xl bg-[#04330B] text-white font-bold text-sm hover:bg-[#16A34A] transition-colors">
                      Join a Squad
                    </Link>
                    <Link href="/youth-front/squads/start" className="px-4 py-2.5 rounded-xl border border-[#04330B] text-[#04330B] font-bold text-sm hover:bg-[#DCFCE7] transition-colors">
                      Start a Squad
                    </Link>
                  </div>
                </div>
              )}

              {/* STATE 2: Pending (submitted join request, not yet in active squad) */}
              {squad && squad.status !== 'Active' && squad.status !== 'New' && squad.status !== 'PendingVerification' && (
                <div className="bg-yellow-50 rounded-xl p-4 text-sm">
                  <p className="font-black text-[#04330B] mb-1">Squad request pending</p>
                  <div className="space-y-1 text-[#587E67]">
                    <div><span className="font-semibold">Squad:</span> {squad.name}</div>
                    <div><span className="font-semibold">Role requested:</span> {squad.myPreferredRole || squad.myRole}</div>
                    <div><span className="font-semibold">Status:</span> Pending approval</div>
                  </div>
                </div>
              )}

              {/* STATE 3: Forming (created, not yet Active) */}
              {squad && (squad.status === 'New' || squad.status === 'PendingVerification') && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-[#F59E0B]" />
                    <span className="font-black text-[#04330B]">{squad.name}</span>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#587E67]">Members</span>
                      <span className="font-black text-[#04330B]">{squad.memberCount} / 10</span>
                    </div>
                    <div className="h-2 bg-yellow-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${Math.min(100, (squad.memberCount / 10) * 100)}%` }} />
                    </div>
                    <p className="text-[#587E67] font-semibold">
                      Your Squad is forming. Invite {Math.max(0, 10 - squad.memberCount)} more verified members to activate.
                    </p>
                    {squad.inviteCode && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://peoplesgreen.org/join-squad?code=${squad.inviteCode}`);
                          setSquadCodeCopied(true);
                          setTimeout(() => setSquadCodeCopied(false), 2000);
                        }}
                        className="w-full mt-1 flex items-center justify-center gap-2 bg-[#04330B] text-white font-bold py-2 rounded-lg text-xs hover:bg-[#16A34A]"
                      >
                        {squadCodeCopied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        {squadCodeCopied ? 'Copied!' : `Copy Invite Link (${squad.inviteCode})`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STATE 4: Active */}
              {squad && squad.status === 'Active' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-[#16A34A]" />
                    <span className="font-black text-[#04330B] text-base">{squad.name}</span>
                  </div>
                  <div className="bg-[#F0FBF4] rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#587E67] font-semibold">Your Role</span>
                      <span className="font-black text-[#04330B]">{squad.myPreferredRole || squad.myRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#587E67] font-semibold">Squad Rank</span>
                      <span className="font-black text-[#04330B]">{squad.squadRank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#587E67] font-semibold">Squad XP</span>
                      <span className="font-black text-[#16A34A]">{squad.squadXp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#587E67] font-semibold">Members</span>
                      <span className="font-black text-[#04330B]">{squad.memberCount}</span>
                    </div>
                    {squad.nextRankXp && (
                      <>
                        <div className="h-2 bg-[#BBF7D0] rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-[#16A34A] rounded-full" style={{ width: `${Math.min(100, (squad.squadXp / squad.nextRankXp) * 100)}%` }} />
                        </div>
                        <p className="text-xs text-[#587E67]">{squad.squadXp} / {squad.nextRankXp} XP to {squad.nextRankName}</p>
                      </>
                    )}
                  </div>
                  <Link
                    href="/youth-front/squad-missions"
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-[#04330B] text-white font-bold rounded-xl text-sm hover:bg-[#16A34A] transition-colors"
                  >
                    <Swords size={15} />
                    Squad Missions
                    <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* ── Referral Link ── */}
            <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
              <h2 className="text-xl font-black mb-1">🔗 Your JINDA Invite Link</h2>
              <p className="text-sm text-[#587E67] mb-4">Earn XP for every verified recruit.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={profile?.member?.referralCode
                    ? `https://peoplesgreen.org/join?ref=${profile.member.referralCode}&program=youth-front`
                    : 'Loading...'}
                  className="flex-1 h-[44px] rounded-[10px] border border-[#DDEEE4] px-3 text-sm font-semibold text-[#587E67] bg-[#F5FBF7] outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  disabled={!profile?.member?.referralCode}
                  className="h-[44px] px-4 rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#16A34A] flex items-center gap-2 disabled:opacity-50"
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2">Only OTP-verified signups count as recruits.</p>

              {/* Referrals list */}
              {referrals.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-bold text-[#04330B]">Your Recruits ({referrals.length})</div>
                  {referrals.slice(0, 5).map((r: any) => (
                    <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#F5FBF7]">
                      <div className="h-7 w-7 rounded-full bg-[#DCFCE7] flex items-center justify-center text-xs font-black text-[#16A34A]">
                        {r.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#04330B] truncate">{r.name}</div>
                        <div className="text-xs text-[#587E67]">{r.registrationStatus === 'completed' ? '✓ Verified' : 'Pending'}</div>
                      </div>
                      {r.youthProfile && (
                        <div className="text-xs font-bold text-[#16A34A]">
                          {getRank(r.youthProfile.memberLevel).icon} {getRank(r.youthProfile.memberLevel).label}
                        </div>
                      )}
                    </div>
                  ))}
                  {referrals.length > 5 && <p className="text-xs text-[#587E67] text-center">+{referrals.length - 5} more</p>}
                </div>
              )}
              {referrals.length === 0 && (
                <p className="text-sm text-[#587E67] mt-3 text-center py-4 font-semibold">No recruits yet. Share your link!</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── XP History ── */}
            <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
              <h2 className="text-xl font-black mb-4">⚡ XP History</h2>
              {profile?.member?.youthPointLedgers?.length > 0 ? (
                <div className="space-y-3">
                  {profile.member.youthPointLedgers.map((ledger: any) => (
                    <div key={ledger.id} className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                        <Zap className="text-[#16A34A]" size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#04330B]">{ledger.reason}</div>
                        <div className="text-xs text-[#587E67]">{new Date(ledger.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="font-bold text-[#16A34A]">+{ledger.points} XP</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#587E67]">
                  <Zap className="mx-auto mb-2 text-[#9CA3AF]" size={28} />
                  <p className="font-semibold">No XP yet</p>
                  <p className="text-sm mt-1">Complete a mission to start earning XP</p>
                </div>
              )}
            </div>

            {/* ── Issues ── */}
            <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">📋 Your Issues</h2>
                <button
                  onClick={() => router.push('/youth-front/report-issue')}
                  className="px-3 py-1.5 rounded-lg bg-[#04330B] text-white font-bold hover:bg-[#16A34A] text-xs"
                >
                  + Report
                </button>
              </div>
              {issues.length === 0 ? (
                <div className="text-center py-8 text-[#587E67]">
                  <ClipboardList className="mx-auto mb-2 text-[#9CA3AF]" size={28} />
                  <p className="font-semibold">No issues reported yet</p>
                  <p className="text-sm mt-1">Report a real issue and earn +15 XP</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.map((issue) => (
                    <div key={issue.id} className="rounded-xl bg-[#F5FBF7] p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#04330B] truncate">{issue.title}</div>
                          <div className="text-xs text-[#587E67] mt-0.5">{issue.category} · {issue.district || '—'}</div>
                        </div>
                        <span className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${
                          issue.status === 'HumanVerified' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                          issue.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                          'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Badges ── */}
          {badges.length > 0 && (
            <div className="mt-6 rounded-2xl bg-white p-6 border border-[#BBF7D0]">
              <h2 className="text-xl font-black mb-4">🏅 Your Badges</h2>
              <div className="flex flex-wrap gap-3">
                {badges.map((ub: any) => (
                  <div key={ub.id} className="flex items-center gap-2 bg-[#F5FBF7] rounded-xl px-4 py-2 border border-[#DCFCE7]">
                    <span className="text-2xl">{ub.badge.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-[#04330B]">{ub.badge.name}</div>
                      <div className="text-[10px] text-[#587E67]">{ub.badge.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
