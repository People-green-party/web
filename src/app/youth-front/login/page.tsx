"use client";

import React, { useState } from "react";
import { Phone, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Navbar } from "../../../components/Navbar";

export default function YouthLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sanitizePhoneInput = (value: string) => {
    const digitsOnly = String(value || '').replace(/\D/g, '');
    return digitsOnly.slice(0, 10);
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
        localStorage.setItem('access_token', data.access_token);
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }
        
        // Check if user is youth member
        if (data.user?.programTag === 'PGP Youth Front') {
          router.push('/youth-front/my-dashboard');
        } else {
          setError('This is not a Youth Front account. Please use the main login page.');
        }
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

          <h1 className="text-3xl lg:text-4xl font-black tracking-[-0.05em]">Youth Login</h1>
          <p className="mt-3 text-[#587E67] font-semibold">
            Login to your PGP Youth Front account
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FEE2E2] p-4 text-[#DC2626]">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#04330B] mb-2">Mobile Number *</label>
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
              <label className="block text-sm font-bold text-[#04330B] mb-2">Login PIN *</label>
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
                Not a member? Join PGP Youth Front
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
