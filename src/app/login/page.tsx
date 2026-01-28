'use client';

import React, { useState } from 'react';
import { ChevronLeft, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { fetchApi } from '../../lib/api';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modes: 'login' (Phone+PIN), 'otp_request' (Forgot PIN), 'otp_verify' (Verify OTP), 'set_new_pin' (Set New PIN)
  const [mode, setMode] = useState<'login' | 'otp_request' | 'otp_verify' | 'set_new_pin'>('login');
  
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);

  const router = useRouter();

  // Helper to extract clean error message
  const cleanError = (msg: string) => {
    if (!msg) return '';
    // Remove "API error calling ... : <status> " prefix
    return msg.replace(/^API error calling .*?:\s*\d+\s+/, '');
  };

  const handleBack = () => {
    if (mode === 'login') {
      router.back();
    } else {
      setMode('login');
      setError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      setError('Phone and PIN are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;
      
      const data = await fetchApi('users/login-pin', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber, pin }),
      });

      if (data.access_token) {
        // Store token for API access
        localStorage.setItem('access_token', data.access_token);
        // Also store user info if needed
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }
        router.push('/dashboard');
      } else {
        throw new Error('No access token received');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(cleanError(err.message || 'Login failed. Please check your PIN.'));
    } finally {
      setLoading(false);
    }
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
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      setMode('otp_verify');
    } catch (err: any) {
      setError(cleanError(err.message || 'Failed to send OTP. Please try again.'));
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
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      // OTP Verified - now let user set new PIN
      // Clear any old custom token so fetchApi uses the fresh Supabase session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      setMode('set_new_pin');
    } catch (err: any) {
      setError(cleanError(err.message || 'Invalid OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || !confirmNewPin) {
      setError('Please enter and confirm your new PIN');
      return;
    }
    if (newPin !== confirmNewPin) {
      setError('PINs do not match');
      return;
    }
    if (newPin.length < 4 || newPin.length > 6) {
      setError('PIN must be 4-6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // User is authenticated via Supabase (from OTP verify), so this call should work if API supports Supabase auth or we have a way to identify user
      // Note: We need an endpoint to update PIN. Assuming 'users/me' with PATCH can handle it or we add one.
      // We'll update the 'me' endpoint to accept PIN updates.
      
      await fetchApi('users/me', {
        method: 'PATCH',
        body: JSON.stringify({ pin: newPin }),
      });

      // After setting PIN, go back to login or dashboard?
      // Let's go to dashboard as they are technically logged in via Supabase now.
      // Or force them to login with new PIN to ensure the custom token flow is used.
      
      setMode('login');
      setPin('');
      setError(''); // Clear error on success
      // Consider showing a success message instead of error state, but for now just clear error.
      // Ideally we should use a toast or a temporary success state.
      alert('PIN updated successfully. Please login with your new PIN.');
      
      // Optionally logout from Supabase to force PIN login flow
      await supabase.auth.signOut();

    } catch (err: any) {
      setError(cleanError(err.message || 'Failed to update PIN.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-[470px] min-h-[400px] bg-white rounded-[16px] p-[24px] sm:p-[36px] flex flex-col gap-[36px] shadow-2xl relative transition-all duration-300">
        <div className="w-full h-[24px] flex justify-between items-center shrink-0">
          <button
            onClick={handleBack}
            className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        <div className="w-full flex flex-col gap-[32px] flex-1">
          <div className="w-full flex flex-col items-center gap-[8px]">
            <h1 className="w-full font-['Familjen_Grotesk'] font-semibold text-[28px] sm:text-[32px] leading-[38px] tracking-[-0.3px] text-center text-[#04330B]">
              {mode === 'login' && 'Log In'}
              {mode === 'otp_request' && 'Reset PIN'}
              {mode === 'otp_verify' && 'Verify OTP'}
              {mode === 'set_new_pin' && 'Set New PIN'}
            </h1>
            <p className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
              {mode === 'login' && 'Enter your phone number and PIN'}
              {mode === 'otp_request' && 'Enter your phone number to receive OTP'}
              {mode === 'otp_verify' && `Enter OTP sent to ${phone}`}
              {mode === 'set_new_pin' && 'Create a new PIN for your account'}
            </p>
          </div>

          <form
            className="w-full flex flex-col gap-[32px] sm:gap-[40px]"
            onSubmit={
              mode === 'login' ? handleLogin :
              mode === 'otp_request' ? handleSendOtp :
              mode === 'otp_verify' ? handleVerifyOtp :
              handleSetNewPin
            }
          >
            <div className="w-full flex flex-col gap-[12px]">
              
              {/* Phone Input */}
              {(mode === 'login' || mode === 'otp_request') && (
                <div className="flex flex-col">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                  />
                </div>
              )}

              {/* PIN Input (Login Mode) */}
              {mode === 'login' && (
                <div className="flex flex-col">
                  <div className="relative w-full h-[46px]">
                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] hover:text-[#04330B] transition-colors"
                    >
                      {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setMode('otp_request')}
                      className="text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[14px] hover:underline"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              {mode === 'otp_verify' && (
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
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#0D5229] font-['Familjen_Grotesk'] font-semibold text-[14px] hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              {/* New PIN Input */}
              {mode === 'set_new_pin' && (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full h-[46px]">
                      <input
                        type={showNewPin ? "text" : "password"}
                        placeholder="New PIN (4-6 digits)"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] hover:text-[#04330B] transition-colors"
                      >
                        {showNewPin ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    
                    <div className="relative w-full h-[46px]">
                      <input
                        type={showNewPin ? "text" : "password"}
                        placeholder="Confirm New PIN"
                        value={confirmNewPin}
                        onChange={(e) => setConfirmNewPin(e.target.value)}
                        className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-2 w-full p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-5 h-5 text-[#EC4521] shrink-0 mt-0.5" />
                  <p className="font-['Familjen_Grotesk'] font-medium text-[14px] leading-[20px] tracking-[-0.2px] text-[#C93514]">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-[2px] w-full h-[46px] rounded-[8px] bg-[#0D5229] disabled:bg-gray-400 flex items-center justify-center gap-[10px] hover:bg-[#0a4220] transition-colors shrink-0"
            >
              <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-white">
                {loading ? 'Processing...' : (
                  mode === 'login' ? 'Log In' :
                  mode === 'otp_request' ? 'Send OTP' :
                  mode === 'otp_verify' ? 'Verify' :
                  'Set PIN'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}