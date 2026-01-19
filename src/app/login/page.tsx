'use client';

import React, { useState } from 'react';
import { ChevronLeft, X, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); // New state
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false); // For toggling OTP visibility in input
  const [showPassword, setShowPassword] = useState(false); // For toggling Password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [usePassword, setUsePassword] = useState(true); // Default to password login
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format phone number with country code if needed
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      setShowOtpField(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // If we get here, authentication was successful
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Phone and Password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

      // 1. Strict Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password: password,
      });

      if (error) {
        // If Supabase fails, WE STOP HERE. No fallback.
        // This forces the system to be secure.
        console.error('Supabase login failed:', error.message);

        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect Phone Number or Password.');
        } else if (error.message.includes('Phone not confirmed')) {
          throw new Error('Please verify your phone number via OTP first.');
        } else {
          throw error; // Throw generic error
        }
      }

      // 2. Success - Supabase session is set automatically
      // Redirect to dashboard
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      // The browser will redirect to the OAuth provider
    } catch (err: any) {
      console.error('Social Login Error:', err);

      // Handle Supabase "provider not enabled" error specifically
      if (err?.code === 'validation_failed' || err?.msg?.includes('not enabled') || err?.message?.includes('not enabled')) {
        setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not enabled in Supabase dashboard.`);
      } else {
        setError(err.message || `Failed to login with ${provider}`);
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-[470px] min-h-[642px] bg-white rounded-[16px] p-[24px] sm:p-[36px] flex flex-col gap-[36px] shadow-2xl relative transition-all duration-300">
        <div className="w-full h-[24px] flex justify-between items-center shrink-0">
          <button
            onClick={handleBack}
            className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleBack}
            className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        <div className="w-full flex flex-col gap-[32px] flex-1">
          <div className="w-full flex flex-col items-center gap-[8px]">
            <h1 className="w-full font-['Familjen_Grotesk'] font-semibold text-[28px] sm:text-[32px] leading-[38px] tracking-[-0.3px] text-center text-[#04330B]">
              Log In
            </h1>
            <p className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
              Login into your account
            </p>
          </div>

          <form
            className="w-full flex flex-col gap-[32px] sm:gap-[40px]"
            onSubmit={usePassword ? handlePasswordLogin : (showOtpField ? handleVerifyOtp : handleSendOtp)}
          >
            <div className="w-full flex flex-col gap-[12px]">
              <div className="w-full flex flex-col gap-[16px]">
                <div className="flex flex-col">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                    disabled={showOtpField}
                  />
                </div>

              </div>

              {/* Password Input (only if usePassword is true) */}
              {usePassword && (
                <div className="flex flex-col">
                  <div className="relative w-full h-[46px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] hover:text-[#04330B] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Input (only if !usePassword and OTP sent) */}
              {!usePassword && showOtpField && (
                <div className="flex flex-col">
                  <div className="relative w-full h-[46px]">
                    <input
                      type={showOtp ? "text" : "password"}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] hover:text-[#04330B] transition-colors"
                    >
                      {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setUsePassword(!usePassword);
                    setError('');
                    setShowOtpField(false);
                  }}
                  className="text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[14px] hover:underline"
                >
                  {usePassword ? 'Login via OTP' : 'Login via Password'}
                </button>
              </div>

              {error && (
                <p className="mt-[4px] font-['Familjen_Grotesk'] font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-[#EC4521]">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-[2px] w-full h-[46px] rounded-[8px] bg-[#0D5229] disabled:bg-gray-400 flex items-center justify-center gap-[10px] hover:bg-[#0a4220] transition-colors shrink-0"
            >
              <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-white">
                {loading ? 'Processing...' : (usePassword ? 'Log In' : (showOtpField ? 'Verify OTP' : 'Send OTP'))}
              </span>
            </button>
          </form>

          <div className="w-full flex flex-col gap-[16px] mt-[12px]">
            <p className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B]">
              Or login with
            </p>

            <div className="w-full flex flex-col gap-[36px]">
              <div className="w-full flex flex-wrap sm:flex-nowrap justify-between gap-[16px]">
                <button
                  className="w-full sm:w-[122px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[12px] flex items-center justify-center gap-[8px] hover:bg-gray-50 transition-colors"
                  onClick={() => handleSocialLogin('google')}
                >
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <img src="/login/Google-login.svg" alt="Google" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229]">
                    Google
                  </span>
                </button>

                <button
                  className="w-full sm:w-[122px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[12px] flex items-center justify-center gap-[8px] hover:bg-gray-50 transition-colors"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <img src="/login/Fb-login.svg" alt="Facebook" className="w-[20px] h-[20px]" />
                  </div>
                  <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229]">
                    Facebook
                  </span>
                </button>

                
              </div>

              <div className="text-center w-full h-[22px]">
                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B]">
                  Don't have an account?{' '}
                  <button
                    onClick={() => router.push('/join')}
                    className="hover:underline text-[#0D5229]"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}