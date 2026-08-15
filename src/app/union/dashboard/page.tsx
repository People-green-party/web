"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { useLanguage } from '../../../components/LanguageContext';
import { fetchApi, getApiBaseUrl } from '../../../lib/api';
import { RequireAuth } from '../../components/RequireAuth';
import { User, Phone, MapPin, Car, FileText, AlertCircle, Camera, Trash2, Edit2, Check, X } from 'lucide-react';
import { UnionIdCard } from '../../../components/UnionIdCard';
import { getAuthHeader } from '../../../lib/supabaseClient';
import { localizeUnionName } from '../../../lib/unionNames';

interface UnionUser {
  id: number;
  name: string;
  phone: string;
  memberId: string | null;
  photoUrl: string | null;
  unionName: string | null;
  vehicleNumber: string | null;
  governmentId: string | null;
  address: string | null;
}

interface UnionUserSummary {
  user: UnionUser;
}

const COPY = {
  en: {
    pageTitle: 'Union Dashboard',
    memberCard: 'Union Member Card',
    photoMgmt: 'Photo Management',
    photoSet: 'Profile photo is set',
    photoEmpty: 'No photo yet',
    photoHint: 'Changing or deleting a photo here updates the ID card immediately.',
    changePhoto: 'Change Photo',
    addPhoto: 'Add Photo',
    uploading: 'Uploading...',
    removePhoto: 'Remove photo',
    removeConfirm: 'Are you sure you want to remove your photo?',
    removeFail: 'Failed to remove photo',
    uploadFail: 'Photo upload failed. Try a clear JPG/PNG.',
    loginAgain: 'Please login again, then upload photo.',
    profileDetails: 'Member Details',
    edit: 'Edit',
    fullName: 'Full Name',
    address: 'Address',
    vehicleNumber: 'Vehicle Number',
    governmentId: 'Government ID',
    mobile: 'Mobile Number',
    unionName: 'Union Name',
    memberId: 'Member ID',
    nameRequired: 'Name is required',
    updateError: 'Could not update profile. Please try again.',
    saving: 'Saving...',
    save: 'Save',
    cancel: 'Cancel',
    saveOk: 'Profile saved — details are shown below.',
    sessionExpired: 'Session Expired',
    sessionMsg: 'Please log in again to view your dashboard.',
    goLogin: 'Go to Login',
    namePh: 'Enter your full name',
    addressPh: 'Enter your full address',
    vehiclePh: 'e.g. RJ14AB1234',
    govPh: 'Aadhaar / PAN / Voter ID',
  },
  hi: {
    pageTitle: 'यूनियन डैशबोर्ड',
    memberCard: 'यूनियन सदस्य कार्ड',
    photoMgmt: 'फोटो प्रबंधन',
    photoSet: 'प्रोफाइल फोटो लगी हुई है',
    photoEmpty: 'अभी कोई फोटो नहीं है',
    photoHint: 'यहाँ से फोटो बदलने या हटाने पर वह तुरंत ID कार्ड पर अपडेट हो जाएगी।',
    changePhoto: 'फोटो बदलें',
    addPhoto: 'फोटो लगायें',
    uploading: 'अपलोड हो रहा है...',
    removePhoto: 'फोटो हटाएं',
    removeConfirm: 'क्या आप वाकई अपनी फोटो हटाना चाहते हैं?',
    removeFail: 'फोटो हट नहीं सकी',
    uploadFail: 'फोटो अपलोड नहीं हुई। साफ JPG/PNG आज़माएँ।',
    loginAgain: 'कृपया दोबारा लॉगिन करके फोटो अपलोड करें।',
    profileDetails: 'सदस्य का विवरण',
    edit: 'संपादन करें',
    fullName: 'पूरा नाम',
    address: 'पता',
    vehicleNumber: 'वाहन नंबर',
    governmentId: 'सरकारी ID',
    mobile: 'मोबाइल नंबर',
    unionName: 'यूनियन का नाम',
    memberId: 'सदस्य ID',
    nameRequired: 'नाम आवश्यक है',
    updateError: 'प्रोफाइल अपडेट नहीं हो सकी। कृपया फिर कोशिश करें।',
    saving: 'सेव हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द',
    saveOk: 'प्रोफाइल सेव हो गई — विवरण नीचे दिख रहे हैं।',
    sessionExpired: 'सत्र समाप्त',
    sessionMsg: 'डैशबोर्ड देखने के लिए कृपया दोबारा लॉगिन करें।',
    goLogin: 'लॉगिन पर जाएँ',
    namePh: 'अपना पूरा नाम दर्ज करें',
    addressPh: 'अपना पूरा पता दर्ज करें',
    vehiclePh: 'जैसे: RJ14AB1234',
    govPh: 'आधार / पैन / वोटर ID',
  },
} as const;

function resolvePhotoUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http')) {
    return url.replace(/\/v1(\/uploads\/)/i, '$1');
  }
  let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
  baseUrl = baseUrl.replace(/\/v1\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

/** Bridge until Coolify API returns address/vehicle/governmentId in summary */
type CachedProfile = {
  address?: string | null;
  vehicleNumber?: string | null;
  governmentId?: string | null;
  name?: string | null;
  photoUrl?: string | null;
};

function profileCacheKey(userId: number) {
  return `pgp_union_profile_v1_${userId}`;
}

function readProfileCache(userId: number): CachedProfile | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(profileCacheKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as CachedProfile;
  } catch {
    return null;
  }
}

function writeProfileCache(userId: number, data: CachedProfile) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    const prev = readProfileCache(userId) || {};
    localStorage.setItem(
      profileCacheKey(userId),
      JSON.stringify({
        ...prev,
        ...data,
      }),
    );
  } catch {
    /* ignore quota */
  }
}

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#DCFCE7] last:border-b-0 last:pb-1">
      <div className="w-10 h-10 rounded-full bg-[#22C55E]/15 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider mb-1">{label}</p>
        <p
          className={`font-bold text-[#04330B] text-base leading-relaxed break-words whitespace-pre-wrap ${
            mono ? 'uppercase tracking-wide' : ''
          }`}
        >
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default function UnionDashboardPage() {
  const { language } = useLanguage();
  const t = useMemo(() => COPY[language === 'hi' ? 'hi' : 'en'], [language]);
  const router = useRouter();
  const [summary, setSummary] = useState<UnionUserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    address: '',
    vehicleNumber: '',
    governmentId: '',
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [photoBroken, setPhotoBroken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSummary = async (retryCount = 0, preserve?: Partial<UnionUser>) => {
    try {
      const auth = await getAuthHeader();

      if (!auth.Authorization) {
        if (retryCount < 3) {
          setTimeout(() => loadSummary(retryCount + 1, preserve), 600);
          return;
        }
        throw new Error('No active session found. Please log in.');
      }

      const sum = await fetchApi('users/me/summary');
      const incoming = (sum as UnionUserSummary)?.user;
      const unionName = incoming?.unionName;
      if (!unionName) {
        window.location.replace('/union/join');
        return;
      }

      const cached = readProfileCache(incoming.id);
      const user: UnionUser = {
        ...incoming,
        name: incoming.name || preserve?.name || cached?.name || '',
        // Prefer API when it actually returns fields; otherwise keep save/cache (old Coolify API omits these)
        address:
          incoming.address ??
          preserve?.address ??
          cached?.address ??
          null,
        vehicleNumber:
          incoming.vehicleNumber ??
          preserve?.vehicleNumber ??
          cached?.vehicleNumber ??
          null,
        governmentId:
          incoming.governmentId ??
          preserve?.governmentId ??
          cached?.governmentId ??
          null,
        photoUrl:
          preserve && Object.prototype.hasOwnProperty.call(preserve, 'photoUrl')
            ? preserve.photoUrl ?? null
            : (incoming.photoUrl ?? cached?.photoUrl ?? null),
      };

      // Keep a local backup so hard refresh does not blank the form while API is outdated
      writeProfileCache(incoming.id, {
        name: user.name,
        address: user.address,
        vehicleNumber: user.vehicleNumber,
        governmentId: user.governmentId,
        photoUrl: user.photoUrl,
      });

      setSummary({ user });
      setPhotoBroken(false);
      setError(null);
      setLoading(false);
    } catch (e: any) {
      console.error(`Dashboard Load Error:`, e);
      window.location.replace(`/union/login?next=${encodeURIComponent('/union/dashboard')}`);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    setPhotoBroken(false);
  }, [summary?.user?.photoUrl]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { compressImageForUpload } = await import('../../../lib/compressImage');
      const compressed = await compressImageForUpload(file);
      const auth = await getAuthHeader();
      if (!auth.Authorization) throw new Error(t.loginAgain);
      const { uploadMemberPhoto } = await import('../../../lib/uploadMemberPhoto');
      const data = await uploadMemberPhoto(
        compressed,
        auth.Authorization,
        (compressed as File).name || file.name || 'profile.jpg',
      );
      if (!data?.photoUrl) {
        throw new Error(t.uploadFail);
      }
      const nextUrl = String(data.photoUrl).includes('?')
        ? `${data.photoUrl}&t=${Date.now()}`
        : `${data.photoUrl}?t=${Date.now()}`;
      setPhotoBroken(false);
      setSummary((prev) => {
        if (!prev) return prev;
        writeProfileCache(prev.user.id, { photoUrl: nextUrl });
        return { user: { ...prev.user, photoUrl: nextUrl } };
      });
      await loadSummary(0, { photoUrl: data.photoUrl });
      setSummary((prev) => {
        if (!prev) return prev;
        writeProfileCache(prev.user.id, { photoUrl: nextUrl });
        return { user: { ...prev.user, photoUrl: nextUrl } };
      });
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || t.uploadFail);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePhotoRemove = async () => {
    if (!confirm(t.removeConfirm)) return;
    setUploading(true);
    try {
      const auth = await getAuthHeader();
      await fetch(`${getApiBaseUrl()}/users/me/photo`, {
        method: 'DELETE',
        headers: { ...auth },
      });
      setPhotoBroken(false);
      setSummary((prev) => (prev ? { user: { ...prev.user, photoUrl: null } } : prev));
      await loadSummary(0, { photoUrl: null });
      setSummary((prev) => (prev ? { user: { ...prev.user, photoUrl: null } } : prev));
    } catch {
      alert(t.removeFail);
    } finally {
      setUploading(false);
    }
  };

  const startEditing = () => {
    if (!summary?.user) return;
    setEditData({
      name: summary.user.name || '',
      address: summary.user.address || '',
      vehicleNumber: summary.user.vehicleNumber || '',
      governmentId: summary.user.governmentId || '',
    });
    setEditError(null);
    setSaveOk(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError(null);
  };

  const saveProfile = async () => {
    if (!editData.name.trim()) {
      setEditError(t.nameRequired);
      return;
    }
    setSaving(true);
    setEditError(null);
    const payload = {
      name: editData.name.trim(),
      address: editData.address.trim(),
      vehicleNumber: editData.vehicleNumber.trim().toUpperCase(),
      governmentId: editData.governmentId.trim(),
    };
    try {
      const updated = (await fetchApi('users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          name: payload.name,
          address: payload.address || undefined,
          vehicleNumber: payload.vehicleNumber || undefined,
          governmentId: payload.governmentId || undefined,
        }),
      })) as Partial<UnionUser>;

      const preserved: Partial<UnionUser> = {
        name: updated.name ?? payload.name,
        address: updated.address ?? payload.address,
        vehicleNumber: updated.vehicleNumber ?? payload.vehicleNumber,
        governmentId: updated.governmentId ?? payload.governmentId,
      };

      setSummary((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev.user,
          name: preserved.name || prev.user.name,
          address: preserved.address || null,
          vehicleNumber: preserved.vehicleNumber || null,
          governmentId: preserved.governmentId || null,
        };
        writeProfileCache(prev.user.id, {
          name: next.name,
          address: next.address,
          vehicleNumber: next.vehicleNumber,
          governmentId: next.governmentId,
          photoUrl: next.photoUrl,
        });
        return { user: next };
      });
      setEditing(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
      await loadSummary(0, preserved);
    } catch (err: any) {
      setEditError(err.message || t.updateError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col pt-[104px]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#04330B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !summary?.user) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col pt-[104px]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-red-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#04330B] mb-2">{t.sessionExpired}</h2>
            <p className="text-gray-600 mb-6">{error || t.sessionMsg}</p>
            <button
              onClick={() => router.push('/union/login')}
              className="w-full py-3 bg-[#04330B] text-white rounded-xl font-bold hover:bg-[#0B5A2A]"
            >
              {t.goLogin}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const user = summary.user;
  const photoSrc = resolvePhotoUrl(user.photoUrl);
  const unionLabel = localizeUnionName(user.unionName, language) || t.pageTitle;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#F7FCF9] pt-[104px] font-['Familjen_Grotesk']">
        <Navbar />

        <main className="max-w-[1100px] mx-auto px-4 lg:px-8 mt-6 mb-24 lg:mb-32">
          <div className="bg-gradient-to-r from-[#04330B] to-[#0B5A2A] rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none"></div>
            <h1 className="text-3xl font-black mb-2 relative z-10">{t.pageTitle}</h1>
            <p className="text-white/80 font-medium text-lg relative z-10 break-words">
              {unionLabel}
            </p>
          </div>

          {saveOk && (
            <div className="mb-6 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-[#04330B] font-semibold">
              {t.saveOk}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.95fr)_minmax(320px,1.2fr)] gap-8 items-start">
            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] p-6 bg-white border border-[#BBF7D0] shadow-sm">
                <h3 className="text-xl font-bold text-[#04330B] w-full text-left mb-6">
                  {t.memberCard}
                </h3>
                <div className="union-dashboard max-w-md mx-auto">
                  <UnionIdCard
                    key={`${user.photoUrl || 'no-photo'}-${language}`}
                    user={user}
                  />
                </div>
              </div>

              <div className="rounded-[24px] px-5 pt-5 pb-7 sm:px-6 sm:pt-6 sm:pb-8 bg-white border border-[#BBF7D0] shadow-sm">
                <h3 className="text-lg font-bold text-[#04330B] mb-4">{t.photoMgmt}</h3>

                <div className="flex items-stretch gap-4 mb-5">
                  <div className="w-[72px] h-[90px] sm:w-[80px] sm:h-[100px] rounded-xl overflow-hidden border-2 border-[#BBF7D0] bg-[#F0FDF4] flex items-center justify-center shrink-0">
                    {photoSrc && !photoBroken ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photoSrc}
                        src={photoSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setPhotoBroken(true)}
                      />
                    ) : (
                      <User className="w-9 h-9 text-[#0B5A2A]/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-[#04330B] mb-1">
                      {photoSrc && !photoBroken ? t.photoSet : t.photoEmpty}
                    </p>
                    <p className="text-xs text-[#0B5A2A]/70 leading-relaxed">{t.photoHint}</p>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_48px] gap-3 items-stretch">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-12 bg-[#F0FDF4] border border-[#22C55E] text-[#04330B] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-all disabled:opacity-60"
                  >
                    <Camera size={18} />
                    {uploading
                      ? t.uploading
                      : photoSrc && !photoBroken
                        ? t.changePhoto
                        : t.addPhoto}
                  </button>
                  <button
                    onClick={handlePhotoRemove}
                    disabled={uploading || !user.photoUrl}
                    className="h-12 w-12 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={t.removePhoto}
                    title={t.removePhoto}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10 border border-[#BBF7D0] h-fit">
              <div className="flex items-center justify-between gap-3 mb-2 border-b border-[#DCFCE7] pb-4">
                <h3 className="text-xl font-bold text-[#04330B]">{t.profileDetails}</h3>
                {!editing && (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F0FDF4] text-[#04330B] rounded-xl font-semibold hover:bg-[#DCFCE7] transition-all shrink-0"
                  >
                    <Edit2 size={16} />
                    <span>{t.edit}</span>
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider mb-1 block">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none focus:border-[#22C55E]"
                      placeholder={t.namePh}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider mb-1 block">
                      {t.address}
                    </label>
                    <textarea
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="w-full min-h-[96px] rounded-[10px] border border-[#BBF7D0] p-3 font-semibold text-[#04330B] outline-none resize-y focus:border-[#22C55E]"
                      placeholder={t.addressPh}
                      autoComplete="street-address"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider mb-1 block">
                      {t.vehicleNumber}
                    </label>
                    <input
                      type="text"
                      value={editData.vehicleNumber}
                      onChange={(e) =>
                        setEditData({ ...editData, vehicleNumber: e.target.value.toUpperCase() })
                      }
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none uppercase focus:border-[#22C55E]"
                      placeholder={t.vehiclePh}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#0B5A2A]/60 font-bold uppercase tracking-wider mb-1 block">
                      {t.governmentId}
                    </label>
                    <input
                      type="text"
                      value={editData.governmentId}
                      onChange={(e) => setEditData({ ...editData, governmentId: e.target.value })}
                      className="w-full h-[46px] rounded-[10px] border border-[#BBF7D0] px-4 font-semibold text-[#04330B] outline-none focus:border-[#22C55E]"
                      placeholder={t.govPh}
                      autoComplete="off"
                    />
                  </div>

                  {editError && (
                    <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-xl">
                      {editError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="flex-1 h-[46px] rounded-[10px] bg-[#04330B] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {saving ? (
                        t.saving
                      ) : (
                        <>
                          <Check size={18} /> {t.save}
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="px-6 h-[46px] rounded-[10px] border border-gray-300 text-gray-600 font-semibold flex items-center gap-2 hover:bg-gray-50"
                    >
                      <X size={18} /> {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1">
                  <DetailRow
                    icon={<Phone className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.mobile}
                    value={user.phone}
                  />
                  <DetailRow
                    icon={<User className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.fullName}
                    value={user.name}
                  />
                  <DetailRow
                    icon={<User className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.unionName}
                    value={unionLabel || '—'}
                  />
                  <DetailRow
                    icon={<Car className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.vehicleNumber}
                    value={user.vehicleNumber || '—'}
                    mono
                  />
                  <DetailRow
                    icon={<FileText className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.governmentId}
                    value={user.governmentId || '—'}
                  />
                  <DetailRow
                    icon={<MapPin className="w-5 h-5 text-[#0B5A2A]" />}
                    label={t.address}
                    value={user.address || '—'}
                  />
                  {user.memberId && (
                    <DetailRow
                      icon={<FileText className="w-5 h-5 text-[#0B5A2A]" />}
                      label={t.memberId}
                      value={user.memberId}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
