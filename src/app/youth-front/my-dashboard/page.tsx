"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Copy, CheckCircle2, AlertCircle, Users, MapPin, Award, TrendingUp, ClipboardList } from "lucide-react";
import { fetchApi } from "../../../lib/api";
import { RequireAuth } from "../../components/RequireAuth";

export default function MyDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [profileData, issuesData, referralsData] = await Promise.all([
        fetchApi('youth/me/profile').catch(() => null),
        fetchApi('youth/my-issues').catch(() => []),
        fetchApi('youth/my-referrals').catch(() => []),
      ]);
      console.log('Profile data received:', profileData);
      if (profileData) {
        console.log('Member data:', profileData.member);
        console.log('Referral code:', profileData.member?.referralCode);
        setProfile(profileData);
      }
      if (issuesData) {
        console.log('Issues data received:', issuesData);
        setIssues(issuesData);
      }
      if (referralsData) {
        console.log('Referrals data received:', referralsData);
        setReferrals(referralsData);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
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

  const getNextLevel = (points: number) => {
    if (points >= 2500) return 'Max Level';
    if (points >= 1200) return 'State Youth Fellow';
    if (points >= 600) return 'District Youth Leader';
    if (points >= 300) return 'Campus Organiser';
    if (points >= 150) return 'Active Volunteer';
    if (points >= 50) return 'Contributor';
    return 'Contributor';
  };

  const getNextLevelThreshold = (points: number) => {
    if (points >= 2500) return 2500;
    if (points >= 1200) return 2500;
    if (points >= 600) return 1200;
    if (points >= 300) return 600;
    if (points >= 150) return 300;
    if (points >= 50) return 150;
    return 50;
  };

  const getProgressPercentage = (points: number) => {
    if (points >= 2500) return 100;
    if (points >= 1200) return ((points - 1200) / 1300) * 100;
    if (points >= 600) return ((points - 600) / 600) * 100;
    if (points >= 300) return ((points - 300) / 300) * 100;
    if (points >= 150) return ((points - 150) / 150) * 100;
    if (points >= 50) return ((points - 50) / 100) * 100;
    return (points / 50) * 100;
  };

  const getNextAction = (points: number) => {
    if (points >= 50) return 'Report an issue';
    return 'Complete your profile';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-6xl px-5 lg:px-8 py-14">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
        <Navbar />
        <main className="mx-auto max-w-6xl px-5 lg:px-8 py-14">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">My Dashboard</h1>
          <p className="mt-2 text-[#587E67] font-semibold">
            Welcome, {(() => {
              const name = profile?.member?.name || profile?.name;
              return name ? name.split(' ')[0] : 'Member';
            })()}
          </p>
          <p className="mt-1 text-sm text-[#587E67]">
            You are part of PGP Youth Front — #CockroachCampusMovement.
          </p>
        </div>

        {/* Level Progress Card */}
        <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0] mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-[#587E67] font-semibold">Current Level</div>
              <div className="text-2xl font-black text-[#04330B]">{profile?.memberLevel || 'Supporter'}</div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="text-sm text-[#587E67] font-semibold mb-2">Progress to {getNextLevel(profile?.points || 0)}</div>
              <div className="h-3 bg-[#DCFCE7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#16A34A] transition-all duration-500"
                  style={{ width: `${getProgressPercentage(profile?.points || 0)}%` }}
                />
              </div>
              <div className="text-xs text-[#587E67] mt-1">
                {profile?.points || 0} / {getNextLevelThreshold(profile?.points || 0)} points
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#587E67] font-semibold">Next Goal</div>
              <div className="text-lg font-bold text-[#04330B]">{getNextAction(profile?.points || 0)}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <Award className="text-[#16A34A]" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black">{profile?.points || 0}</div>
                <div className="text-xs text-[#587E67] font-semibold">Points</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <TrendingUp className="text-[#16A34A]" size={20} />
              </div>
              <div>
                <div className="text-lg font-black">{profile?.memberLevel || "Supporter"}</div>
                <div className="text-xs text-[#587E67] font-semibold">Level</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <ClipboardList className="text-[#16A34A]" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black">{issues.length}</div>
                <div className="text-xs text-[#587E67] font-semibold">Issues Reported</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-[#BBF7D0]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <Users className="text-[#16A34A]" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black">{profile?.recruitsCount || 0}</div>
                <div className="text-xs text-[#587E67] font-semibold">Referrals</div>
              </div>
            </div>
          </div>
        </div>

        {/* First Mission */}
        <div className="rounded-2xl bg-[#DCFCE7] p-6 mb-8">
          <div className="text-xl font-black text-[#04330B] mb-4">Your First Mission</div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${profile?.joinedDistrictGroup ? 'bg-[#16A34A] text-white' : 'bg-[#BBF7D0] text-[#04330B]'}`}>
                {profile?.joinedDistrictGroup ? <CheckCircle2 size={14} /> : '1'}
              </span>
              <span className={`flex-1 text-[#04330B] ${profile?.joinedDistrictGroup ? 'line-through opacity-60' : ''}`}>Join your district WhatsApp group</span>
              {!profile?.joinedDistrictGroup && (
                <button className="px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A]">
                  Join Group
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${(profile?.recruitsCount || 0) >= 3 ? 'bg-[#16A34A] text-white' : 'bg-[#BBF7D0] text-[#04330B]'}`}>
                {(profile?.recruitsCount || 0) >= 3 ? <CheckCircle2 size={14} /> : '2'}
              </span>
              <span className={`flex-1 text-[#04330B] ${(profile?.recruitsCount || 0) >= 3 ? 'line-through opacity-60' : ''}`}>Invite 3 youth using your referral link</span>
              {(profile?.recruitsCount || 0) < 3 && (
                <div className="flex gap-2">
                  <button onClick={copyReferralLink} className="px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A]">
                    Copy Link
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#128C7E]">
                    Share WhatsApp
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${issues.length >= 1 ? 'bg-[#16A34A] text-white' : 'bg-[#BBF7D0] text-[#04330B]'}`}>
                {issues.length >= 1 ? <CheckCircle2 size={14} /> : '3'}
              </span>
              <span className={`flex-1 text-[#04330B] ${issues.length >= 1 ? 'line-through opacity-60' : ''}`}>Report 1 real issue from your area</span>
              {issues.length < 1 && (
                <button
                  onClick={() => router.push('/youth-front/report-issue')}
                  className="px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A]"
                >
                  Report Issue
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${profile?.member?.cellMemberships?.length > 0 ? 'bg-[#16A34A] text-white' : 'bg-[#BBF7D0] text-[#04330B]'}`}>
                {profile?.member?.cellMemberships?.length > 0 ? <CheckCircle2 size={14} /> : '4'}
              </span>
              <span className={`flex-1 text-[#04330B] ${profile?.member?.cellMemberships?.length > 0 ? 'line-through opacity-60' : ''}`}>Choose your preferred role</span>
              {!profile?.member?.cellMemberships?.length && (
                <button disabled className="px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A] disabled:opacity-50 disabled:cursor-not-allowed">
                  Choose Role
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${profile?.member?.cellMemberships?.length > 0 ? 'bg-[#16A34A] text-white' : 'bg-[#BBF7D0] text-[#04330B]'}`}>
                {profile?.member?.cellMemberships?.length > 0 ? <CheckCircle2 size={14} /> : '5'}
              </span>
              <span className={`flex-1 text-[#04330B] ${profile?.member?.cellMemberships?.length > 0 ? 'line-through opacity-60' : ''}`}>Help build a 10-member Youth Action Cell</span>
              {!profile?.member?.cellMemberships?.length && (
                <div className="flex gap-2">
                  <button disabled className="px-3 py-1 rounded-lg bg-[#04330B] text-white text-xs font-bold hover:bg-[#16A34A] disabled:opacity-50 disabled:cursor-not-allowed">
                    Find Cell
                  </button>
                  <button disabled className="px-3 py-1 rounded-lg border border-[#04330B] text-[#04330B] text-xs font-bold hover:bg-[#F5FBF7] disabled:opacity-50 disabled:cursor-not-allowed">
                    Start Cell
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity History */}
          <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
            <h2 className="text-xl font-black mb-4">Recent Activity</h2>
            {profile?.member?.youthPointLedgers && profile.member.youthPointLedgers.length > 0 ? (
              <div className="space-y-3">
                {profile.member.youthPointLedgers.map((ledger: any) => (
                  <div key={ledger.id} className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                      <Award className="text-[#16A34A]" size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#04330B]">{ledger.reason}</div>
                      <div className="text-xs text-[#587E67]">
                        {new Date(ledger.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-bold text-[#16A34A]">+{ledger.points}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#587E67]">
                <p className="font-semibold">No activity yet</p>
                <p className="text-sm mt-1">Complete your first action to start earning points</p>
              </div>
            )}
          </div>

          {/* Referral Link */}
          <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
            <h2 className="text-xl font-black mb-4">Your Referral Link</h2>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={profile?.member?.referralCode ? `https://peoplesgreen.org/join?ref=${profile.member.referralCode}&program=youth-front` : 'Generating your referral link...'}
                className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-[#F5FBF7] outline-none"
              />
              <button
                onClick={copyReferralLink}
                disabled={!profile?.member?.referralCode}
                className="h-[46px] px-4 rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#16A34A] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-3 text-sm text-[#587E67]">Share this link to invite new members and earn points.</p>
            <p className="mt-1 text-xs text-[#587E67]">Only OTP-verified members will count as verified referrals.</p>
            <div className="mt-4">
              <button className="w-full px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-bold hover:bg-[#128C7E]">
                Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Cell Status */}
          <div className="rounded-2xl bg-white p-6 border border-[#BBF7D0]">
            <h2 className="text-xl font-black mb-4">Your Youth Action Cell</h2>
            
            {/* State 1: No cell joined */}
            {!profile?.member?.cellMemberships || profile.member.cellMemberships.length === 0 ? (
              <div className="text-center py-4">
                <AlertCircle className="mx-auto text-[#F59E0B] mb-2" size={32} />
                <p className="text-[#04330B] font-semibold text-lg">You are not part of a Youth Action Cell yet.</p>
                <p className="mt-2 text-sm text-[#587E67]">
                  A Youth Action Cell is a 10-member local team in your campus, ward, village, mohalla, coaching hub or digital community.
                </p>
                <div className="mt-4 flex gap-2 justify-center">
                  <button disabled className="px-4 py-2 rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Find a Cell
                  </button>
                  <button disabled className="px-4 py-2 rounded-[10px] border border-[#04330B] text-[#04330B] font-bold hover:bg-[#F5FBF7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Start a Cell
                  </button>
                </div>
              </div>
            ) : (() => {
              const membership = profile.member.cellMemberships[0];
              const cell = membership.cell;
              const status = cell.status;
              
              // State 2: Pending cell
              if (status === 'New' || status === 'PendingVerification') {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={18} className="text-[#F59E0B]" />
                      <span className="font-bold text-lg">{cell.name}</span>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                      <div className="text-sm text-[#587E67] space-y-1">
                        <div><span className="font-semibold">Members:</span> {cell._count.members} / 10</div>
                        <div><span className="font-semibold">Status:</span> {status === 'New' ? 'Pending Verification' : status}</div>
                      </div>
                    </div>
                    <p className="text-sm text-[#587E67] mb-3">Invite more youth to activate this cell.</p>
                    <button className="w-full px-4 py-2 rounded-lg bg-[#04330B] text-white font-bold hover:bg-[#16A34A] transition-colors">
                      Copy Invite Link
                    </button>
                  </div>
                );
              }
              
              // State 3: Active cell
              if (status === 'Active') {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={18} className="text-[#16A34A]" />
                      <span className="font-bold text-lg">{cell.name}</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 mb-3">
                      <div className="text-sm text-[#587E67] space-y-1">
                        <div><span className="font-semibold">Role:</span> {membership.role}</div>
                        <div><span className="font-semibold">Members:</span> {cell._count.members}</div>
                        <div><span className="font-semibold">Captain:</span> {cell.captain?.name || 'Not assigned'}</div>
                        <div><span className="font-semibold">Wing:</span> {cell.wing}</div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // State 4: Rejected / inactive
              if (status === 'Rejected' || status === 'Inactive' || status === 'Flagged' || status === 'Closed') {
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle size={18} className="text-[#EF4444]" />
                      <span className="font-bold text-lg">{cell.name}</span>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 mb-3">
                      <div className="text-sm text-[#587E67] space-y-1">
                        <div><span className="font-semibold">Status:</span> {status}</div>
                        <div><span className="font-semibold">Reason:</span> {status === 'Inactive' ? 'Cell is currently inactive' : status === 'Rejected' ? 'Cell request was rejected' : 'Cell needs review'}</div>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 rounded-lg bg-[#04330B] text-white font-bold hover:bg-[#16A34A] transition-colors">
                      Contact District Coordinator
                    </button>
                  </div>
                );
              }
              
              // Fallback for other statuses
              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-[#16A34A]" />
                    <span className="font-bold text-lg">{cell.name}</span>
                  </div>
                  <div className="text-sm text-[#587E67]">
                    <div>Wing: {cell.wing}</div>
                    <div>Role: {membership.role}</div>
                    <div>Status: {status}</div>
                    <div>Members: {cell._count.members}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* My Referrals */}
        <div className="mt-8 rounded-2xl bg-white p-6 border border-[#BBF7D0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Your Referrals ({referrals.length})</h2>
          </div>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-[#587E67] font-semibold">
              No referrals yet.
              <p className="mt-2 text-sm text-[#587E67]">
                Share your referral link to invite new members and earn points when they complete their profile.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral: any) => (
                <div key={referral.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F5FBF7]">
                  <div className="h-10 w-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <Users className="text-[#16A34A]" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#04330B]">{referral.name}</div>
                    <div className="text-xs text-[#587E67]">
                      {referral.registrationStatus === 'completed' ? '✓ Verified' : 'Pending'} • {new Date(referral.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {referral.youthProfile && (
                    <div className="text-right">
                      <div className="text-xs text-[#587E67]">Level</div>
                      <div className="font-semibold text-[#04330B]">{referral.youthProfile.memberLevel}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="mt-8 rounded-2xl bg-white p-6 border border-[#BBF7D0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Your Reported Issues</h2>
            <button
              onClick={() => router.push('/youth-front/report-issue')}
              className="px-4 py-2 rounded-[10px] bg-[#04330B] text-white font-bold hover:bg-[#16A34A] transition-colors text-sm"
            >
              + Report New
            </button>
          </div>
          {issues.length === 0 ? (
            <div className="text-center py-8 text-[#587E67] font-semibold">
              No issues reported yet.
              <p className="mt-2 text-sm text-[#587E67]">
                Start with a real issue from your area: road, water, garbage, electricity, campus problem, corruption, environment or public service failure.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="rounded-xl bg-[#F5FBF7] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#04330B]">{issue.title}</div>
                      <div className="text-sm text-[#587E67] mt-1">
                        {issue.category} • {issue.district || "No district"}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      issue.priority === "P0" ? "bg-[#FEE2E2] text-[#DC2626]" :
                      issue.priority === "P1" ? "bg-[#FEF3C7] text-[#D97706]" :
                      "bg-[#DCFCE7] text-[#16A34A]"
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-[#587E67]">
                    Status: <span className="font-semibold">{issue.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
    </RequireAuth>
  );
}
