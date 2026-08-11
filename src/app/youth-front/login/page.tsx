"use client";

import React, { Suspense, useState } from "react";
import { Phone, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

function YouthLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next') || '/youth-front/my-dashboard';
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sanitizePhoneInput = (value: string) => {
    const digitsOnly = String(value || '').replace(/\D/g, '');
    return digitsOnly.slice(0, 10);
  };

  const safeNext = (path: string) => {
    if (path.startsWith('/youth-front')) return path;
    return '/youth-front/my-dashboard';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanedPhone = sanitizePhoneInput(phone);
    if (cleanedPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!pin || pin.length < 4 || pin.length > 6) {
      setError('Please enter a valid 4-6 digit PIN');
      return;
    }

    setLoading(true);

    try {
      const { fetchApi } = await import('../../../lib/api');
      const phoneNumber = `+91${cleanedPhone}`;

      const data = await fetchApi('users/login-pin', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber, pin }),
      });

      if (data.access_token) {
        const tag = String(data.user?.programTag || '').toLowerCase();
        const isYouth = tag.includes('jinda') || tag.includes('youth');
        if (!isYouth) {
          // Never leave a live session after a rejected Youth login
          try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
          } catch {
            /* ignore */
          }
          setError(
            'This is not a Jinda Youth account. Join Jinda Youth first, or use Party / Union login for those portals.',
          );
          return;
        }
        localStorage.setItem('access_token', data.access_token);
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }
        router.push(safeNext(nextPath));
      } else {
        throw new Error('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid phone or PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-md px-5 lg:px-8 py-14">
        <div className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-[#587E67] font-semibold hover:text-[#04330B]"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Jinda Youth Login</h1>
          <p className="mt-3 text-[#587E67] font-semibold">
            Login to your Jinda Youth account
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Mobile Number <span className="text-[#D93025] font-bold" aria-hidden="true">*</span></label>
              <div className="flex gap-2">
                <div className="flex h-[46px] items-center rounded-[10px] border border-[#DDEEE4] bg-[#F5FBF7] px-4 font-semibold text-[#587E67]">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]*"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                  className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Enter 10-digit number"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Login PIN <span className="text-[#D93025] font-bold" aria-hidden="true">*</span></label>
              <div className="flex gap-2">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  minLength={4}
                  maxLength={6}
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 h-[46px] rounded-[10px] border border-[#DDEEE4] px-4 font-semibold text-[#04330B] outline-none focus:border-[#16A34A]"
                  placeholder="Enter 4-6 digit PIN"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="h-[46px] px-4 rounded-[10px] border border-[#DDEEE4] bg-white text-[#04330B] hover:bg-[#F5FBF7]"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/login?mode=otp_request&next=${encodeURIComponent(safeNext(nextPath))}`,
                  )
                }
                className="mt-2 text-sm font-semibold text-[#0D5229] hover:underline"
              >
                Forgot PIN?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-[12px] bg-[#04330B] px-7 font-black text-white hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/youth-front/join')}
                className="text-[#0D5229] text-sm font-semibold hover:underline"
              >
                Not a member? Join Jinda Youth
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function YouthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5FBF7] pt-[70px] flex items-center justify-center text-[#587E67] font-['Familjen_Grotesk']">
          Loading…
        </div>
      }
    >
      <YouthLoginInner />
    </Suspense>
  );
}
