"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Phone, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function YouthJoinPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    otp: '',
    pin: '',
    referralCode: '',
    youthAgeGroup: '',
    gender: '',
    memberType: '',
    track: '',
    campusName: '',
    courseOrClass: '',
    district: '',
    ward: '',
    village: '',
    instagramId: '',
    whatsappNumber: '',
    youthSkills: [] as string[],
    communicationConsent: false,
    codeOfConductAccepted: false,
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const devAuthMode = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';
    
    if (devAuthMode) {
      setStep(2);
      setError('Dev mode: Use OTP 123456');
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      // Check if phone is already registered
      const check = await fetchApi('users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (check?.exists) {
        setError('यह मोबाइल नंबर पहले से रजिस्टर है। कृपया लॉगिन करें। (This mobile number is already registered. Please login.)');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        throw new Error(error.message);
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const devAuthMode = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';
    
    if (devAuthMode) {
      if (formData.otp !== '123456') {
        setError('Invalid OTP. Use 123456 in dev mode.');
        setLoading(false);
        return;
      }
      setStep(3);
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: formData.otp,
        type: 'sms',
      });

      if (error) {
        throw new Error(error.message);
      }

      setStep(3);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.youthAgeGroup) {
      setError('Please select your age group.');
      setLoading(false);
      return;
    }
    if (formData.youthAgeGroup === 'below-16') {
      setError('Below 16 signups need legal review before onboarding.');
      setLoading(false);
      return;
    }
    if (!formData.campusName.trim()) {
      setError('Please enter your school, college, university, or profession.');
      setLoading(false);
      return;
    }
    if (!formData.memberType) {
      setError('Please select who you are joining as.');
      setLoading(false);
      return;
    }
    if (!formData.track) {
      setError('Please select what you want to work on.');
      setLoading(false);
      return;
    }
    if (!formData.codeOfConductAccepted) {
      setError('Please accept the code of conduct to continue.');
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import('../../../lib/supabaseClient');
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;

      const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
      if (authUserError) {
        console.warn('Could not fetch Supabase user after OTP verification:', authUserError.message);
      }

      const userProfileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: phoneNumber,
        pin: formData.pin,
        referralCode: formData.referralCode || undefined,
        programTag: 'PGP Youth Front',
        campaignSource: 'CockroachCampusMovement',
        youthAgeGroup: formData.youthAgeGroup,
        gender: formData.gender || undefined,
        campusName: formData.campusName.trim(),
        courseOrClass: formData.courseOrClass.trim(),
        instagramId: formData.instagramId.trim() || undefined,
        whatsappNumber: formData.whatsappNumber.replace(/\D/g, '').slice(-10) || undefined,
        youthSkills: formData.youthSkills.join(','),
        communicationConsent: formData.communicationConsent,
        codeOfConductAccepted: formData.codeOfConductAccepted,
        authUserId: authUserData?.user?.id || undefined,
      };

      const userData = await fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userProfileData),
      });

      router.push('/youth-front/thank-you');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      youthSkills: prev.youthSkills.includes(skill)
        ? prev.youthSkills.filter(s => s !== skill)
        : [...prev.youthSkills, skill]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-5 lg:px-8 py-14">
        <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
          {/* Step 1: Mobile & OTP */}
          {step === 1 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Join PGP Youth Front</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                Become a verified youth member of People's Green Party
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Mobile Number *</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Referral Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder="Enter referral code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">OTP Verification</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                Code sent to {formData.mobile}
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Enter OTP *</label>
                  <div className="flex gap-2">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="Enter 6-digit OTP"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full h-[52px] rounded-[12px] border border-[#BBF7D0] bg-white px-7 font-black text-[#04330B] hover:bg-[#F5FBF7] transition-colors"
                >
                  ← Back
                </button>
              </form>
            </>
          )}

          {/* Step 3: Youth Details */}
          {step === 3 && (
            <>
              <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Complete Your Profile</h1>
              <p className="mt-3 text-[#587E67] font-semibold">
                Tell us more about yourself
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Age Group *</label>
                    <select
                      required
                      value={formData.youthAgeGroup}
                      onChange={(e) => setFormData({ ...formData, youthAgeGroup: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">Select age group</option>
                      <option value="16-17">16-17 Civic Volunteer / Associate</option>
                      <option value="18+">18+ Active Youth Member</option>
                      <option value="below-16">Below 16</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Gender (Optional)</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">I am joining as *</label>
                    <select
                      required
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">Select option</option>
                      <option value="student">College / University Student</option>
                      <option value="coaching">Coaching Student</option>
                      <option value="first-time-voter">First-time Voter</option>
                      <option value="unemployed">Unemployed Youth</option>
                      <option value="professional">Young Professional</option>
                      <option value="digital">Digital Creator</option>
                      <option value="ward">Ward / Mohalla Volunteer</option>
                      <option value="village">Village / Panchayat Volunteer</option>
                      <option value="environment">Environment Volunteer</option>
                      <option value="civic-associate">Civic Associate, age 16–17 only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">I want to work on *</label>
                    <select
                      required
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#587E67] bg-white outline-none focus:border-[#16A34A]"
                    >
                      <option value="">Select track</option>
                      <option value="campus">Campus Issues</option>
                      <option value="ward-mohalla">Ward / Mohalla Issues</option>
                      <option value="village">Village / Panchayat Issues</option>
                      <option value="digital">Digital Content</option>
                      <option value="issue">Issue Reporting</option>
                      <option value="environment">Environment / Jungle / Water</option>
                      <option value="research">Research / RTI / Policy</option>
                      <option value="speaking">Public Speaking / Debate</option>
                      <option value="membership">Membership Building</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">School / College / University / Profession *</label>
                  <input
                    type="text"
                    required
                    value={formData.campusName}
                    onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder="Enter institution name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Course / Class (Optional)</label>
                  <input
                    type="text"
                    value={formData.courseOrClass}
                    onChange={(e) => setFormData({ ...formData, courseOrClass: e.target.value })}
                    className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                    placeholder="e.g., B.Tech, BA 2nd Year, Class 12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Create Login PIN (4-6 digits) *</label>
                  <div className="flex gap-2">
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      minLength={4}
                      maxLength={6}
                      pattern="[0-9]*"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                      className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="Create 4-6 digit PIN"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#587E67]">Use this PIN to login to your account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="District"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Ward</label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="Ward (if applicable)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Village</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="Village (if applicable)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">Instagram (Optional)</label>
                    <input
                      type="text"
                      value={formData.instagramId}
                      onChange={(e) => setFormData({ ...formData, instagramId: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#04330B] mb-2">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#04330B] mb-2">Skills (Optional)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Design', 'Video Editing', 'Writing', 'Public Speaking', 'Research', 'Social Media', 'Event Management', 'Photography'].map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                          formData.youthSkills.includes(skill)
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#DCFCE7] text-[#04330B] hover:bg-[#BBF7D0]'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#FFF7ED] p-4 border border-[#FED7AA]">
                  <div className="text-sm font-bold text-[#9A3412] mb-3">Communication Consent</div>
                  <label className="flex items-start gap-3 text-[12px] font-semibold text-[#04330B]">
                    <input
                      type="checkbox"
                      checked={formData.communicationConsent}
                      onChange={(e) => setFormData({ ...formData, communicationConsent: e.target.checked })}
                      className="mt-1"
                    />
                    <span>I agree to receive communication from PGP Youth Front on phone, WhatsApp, SMS, or email for updates, tasks, events, and issue follow-ups. You can opt out anytime.</span>
                  </label>
                </div>

                <div className="rounded-xl bg-[#FEF2F2] p-4 border border-[#FECACA]">
                  <div className="text-sm font-bold text-[#991B1B] mb-3">Code of Conduct *</div>
                  <label className="flex items-start gap-3 text-[12px] font-semibold text-[#04330B]">
                    <input
                      type="checkbox"
                      checked={formData.codeOfConductAccepted}
                      onChange={(e) => setFormData({ ...formData, codeOfConductAccepted: e.target.checked })}
                      className="mt-1"
                      required
                    />
                    <span>I accept the code of conduct: no violence, hate speech, fake news, harassment, threats, caste abuse, communal targeting, or doxxing. Violations will result in disciplinary action including removal.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Complete Registration'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-[52px] rounded-[12px] border border-[#BBF7D0] bg-white px-7 font-black text-[#04330B] hover:bg-[#F5FBF7] transition-colors"
                >
                  ← Back
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
