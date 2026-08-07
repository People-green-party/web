'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '../../lib/supabaseClient';
import PasswordResetSuccess from './Password Reset Successfully';
import SignUpScreen from './signup';

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [phoneNumber, setPhoneNumber] = useState('9876512345');
    const [isEditing, setIsEditing] = useState(false);
    const [tempNumber, setTempNumber] = useState('');
    const [isError, setIsError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (searchParams.get('mode') === 'signup') {
            setShowSignUp(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleEditClick = () => {
        setTempNumber(phoneNumber);
        setIsEditing(true);
    };

    const sendOtp = async (number: string) => {
        const formattedNumber = `+91${number}`;
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedNumber,
            });

            if (error) {
                console.warn('Supabase Auth Error (falling back to simulation):', error.message);
                throw error;
            }

            console.log(`OTP sent to ${formattedNumber}`);
            alert('OTP sent successfully!');
            return true;
        } catch (err: any) {
            console.error('OTP Send Failed.', err.message || err);
            const { isAuthDevMode } = await import('../../lib/authDevMode');
            if (isAuthDevMode()) {
                alert('Dev mode: Simulating OTP sent. Use OTP: 123456');
                return false;
            }
            alert(err.message || 'Failed to send OTP. Please try again later.');
            return false;
        }
    };

    const handleSaveNumber = async () => {
        if (tempNumber.length !== 10) {
            alert('Please enter a valid 10-digit number');
            return;
        }

        await sendOtp(tempNumber);

        // Update State
        setPhoneNumber(tempNumber);
        setIsEditing(false);
        setOtp(['', '', '', '', '', '']);
        setIsError(false);
        setTimeLeft(60);
    };

    const handleResend = async () => {
        await sendOtp(phoneNumber);
        setOtp(['', '', '', '', '', '']);
        setIsError(false);
        setTimeLeft(60);
    };

    const handleVerify = async () => {
        const token = otp.join('');
        if (token.length !== 6) {
            // Button is disabled, but guard clause kept
            return;
        }

        const formattedNumber = `+91${phoneNumber}`;

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: formattedNumber,
                token: token,
                type: 'sms',
            });

            if (error) {
                const { isAuthDevMode } = await import('../../lib/authDevMode');
                if (isAuthDevMode() && token === '123456') {
                    setIsError(false);
                    setIsSuccess(true);
                } else {
                    console.error('Verification Error:', error.message);
                    setIsError(true);
                }
            } else {
                console.log('Phone verified successfully:', data);
                setIsError(false);
                setIsSuccess(true);
            }
        } catch (err) {
            const { isAuthDevMode } = await import('../../lib/authDevMode');
            if (isAuthDevMode() && token === '123456') {
                setIsError(false);
                setIsSuccess(true);
            } else {
                setIsError(true);
            }
        }
    };

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (isError) setIsError(false);

        // Focus next input
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Focus previous input on Backspace if current is empty
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    if (showSignUp) {
        return <SignUpScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">

            {/* Modal Container */}
            <div className="bg-white w-full max-w-[480px] min-h-[600px] rounded-[32px] p-8 md:p-10 relative shadow-2xl flex flex-col">

                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.push('/login')}
                        className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <button
                        onClick={() => router.push('/login')}
                        className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Text Content */}
                <div className="text-center mb-10">
                    <h1 className="text-[32px] font-bold text-[#0F392B] mb-3">Verify Your Number</h1>
                    <p className="text-[#5A7A6F] font-medium text-[15px]">
                        Enter the 6 digit OTP sent to your linked number
                    </p>
                </div>

                {/* Phone Number & Edit */}
                {/* Phone Number & Edit */}
                <div className="flex justify-between items-center px-2 mb-8">
                    {isEditing ? (
                        <div className="flex w-full gap-2 items-center">
                            <span className="text-[#0F392B] font-bold text-lg">+91</span>
                            <input
                                type="text"
                                value={tempNumber}
                                maxLength={10}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setTempNumber(val);
                                }}
                                className="flex-1 bg-transparent border-b-2 border-[#0F392B] text-[#0F392B] font-bold text-lg focus:outline-none tracking-wider"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveNumber}
                                disabled={tempNumber.length !== 10}
                                className={`font-bold text-[15px] hover:underline whitespace-nowrap ${tempNumber.length !== 10 ? 'text-gray-400 cursor-not-allowed' : 'text-[#0F392B]'}`}
                            >
                                Save & Send
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-[#0F392B] font-bold text-lg">+91 {phoneNumber}</span>
                            <button
                                onClick={handleEditClick}
                                className="text-[#0F392B] font-bold text-[15px] hover:underline"
                            >
                                Edit
                            </button>
                        </>
                    )}
                </div>

                {/* OTP Inputs */}
                <div className="flex flex-col mb-8">
                    <div className="flex justify-between gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={`w-12 h-12 md:w-14 md:h-14 border rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-1 transition-all ${isError
                                    ? 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-[#CDE6D9] text-[#0F392B] focus:border-[#0F392B] focus:ring-[#0F392B]'
                                    }`}
                            />
                        ))}
                    </div>
                    {/* Error Message */}
                    {isError && (
                        <div className="text-center mt-[12px] animate-fade-in-down">
                            <p className="text-[#EC4521] text-[15px] font-bold">
                                Invalid OTP try again in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </p>
                        </div>
                    )}
                </div>

                {/* Resend Link */}
                <div className="text-center mb-auto">
                    <p className="text-[#0F392B] font-bold text-[15px]">
                        Didn’t Receive OTP?{' '}
                        <button
                            onClick={handleResend}
                            disabled={timeLeft > 0}
                            className={`hover:underline ${timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#0F392B]'}`}
                        >
                            Resend {timeLeft > 0 && `in 00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
                        </button>
                    </p>
                </div>

                {/* Verify Button */}
                <div className="mt-8">
                    <button
                        onClick={handleVerify}
                        disabled={!otp.every(t => t !== '')}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-colors duration-300 ${otp.every(t => t !== '')
                            ? 'bg-[#CDE6D9] hover:bg-[#0F392B] cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed text-white'
                            }`}
                    >
                        Verify
                    </button>
                </div>

                {/* Sign Up Link if user meant this page */}
                <div className="text-center mt-4">
                    <p className="text-[#0F392B] font-bold text-[15px]">
                        Already have an account? <button onClick={() => setShowSignUp(true)} className="hover:underline text-[#0D5229]">Sign Up</button>
                    </p>
                </div>

            </div>
            {isSuccess && <PasswordResetSuccess />}
        </div>
    );
}

export default function VerifyOtpScreen() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <VerifyOtpContent />
        </React.Suspense>
    );
}
