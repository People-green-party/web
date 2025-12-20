import React, { useState, useRef } from 'react';
import { ChevronLeft, X, Eye, EyeOff, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function SignUpScreen() {
    const router = useRouter();

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Error State
    const [emailError, setEmailError] = useState('');
    const [dobError, setDobError] = useState('');
    const [loading, setLoading] = useState(false);

    const dobInputRef = useRef<HTMLInputElement>(null);

    // Validation Logic
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateAge = (dobString: string) => {
        if (!dobString) return false;
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setDobError('');
        setLoading(true);

        let isValid = true;

        // Email Validation
        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Email not valid.');
            isValid = false;
        }

        // Age Validation
        if (!dob) {
            setDobError('Date of birth is required.');
            isValid = false;
        } else if (!validateAge(dob)) {
            setDobError('Age not eligible');
            isValid = false;
        }

        if (!password) {
            // Basic check if needed, but Supabase handles strong password checks too.
            // We can just rely on Supabase or add a simple check.
            if (password.length < 6) {
                alert('Password should be at least 6 characters'); // Simple alert/check
                isValid = false;
            }
        }

        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            // Supabase Sign Up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        dob: dob,
                    },
                },
            });

            if (error) {
                console.error('Signup Error:', error.message);
                if (error.message.includes('already registered') || error.message.includes('unique constraint')) {
                    setEmailError('Email already in use.');
                } else if (error.message.includes('fetch') || error.message.includes('URL')) {
                    // Network error or missing Supabase config -> Fallback to Demo Mode
                    console.warn("Supabase unreachable. Enabling Demo Mode.");
                    alert("Backend connection failed. Logging you in via Demo Mode.");
                    // Simulate login
                    localStorage.setItem('demo_user', JSON.stringify({ name, email }));
                    router.push('/dashboard');
                } else {
                    alert(error.message);
                }
            } else {
                console.log('User registered:', data);
                // Success - Open Dashboard
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            // Catch generic fetch errors
            if (err.message && (err.message.includes('fetch') || err.message.includes('URL'))) {
                console.warn("Supabase unreachable (in catch). Enabling Demo Mode.");
                alert("Backend connection failed. Logging you in via Demo Mode.");
                localStorage.setItem('demo_user', JSON.stringify({ name, email }));
                router.push('/dashboard');
            } else {
                alert('An unexpected error occurred: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Social Login Error:', error.message);
            alert(`Error logging in with ${provider}: ${error.message}`);
        }
    };

    const handleCalendarClick = () => {
        if (dobInputRef.current) {
            // showPicker() is the modern way to open date picker from JS
            // @ts-ignore
            if (typeof dobInputRef.current.showPicker === 'function') {
                // @ts-ignore
                dobInputRef.current.showPicker();
            } else {
                dobInputRef.current.focus();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
            {/* Modal Container: 470x766, Radius 16, Padding 36, Gap 36 */}
            <div className="w-[470px] h-[766px] bg-white rounded-[16px] p-[36px] flex flex-col gap-[36px] shadow-2xl relative">

                {/* Top Navigation: 398x24 */}
                <div className="w-full h-[24px] flex justify-between items-center shrink-0">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content: 398x634, Gap 32 */}
                <div className="w-full h-full flex flex-col gap-[32px]">

                    {/* Header: 324x68, Gap 8 */}
                    <div className="w-full flex flex-col items-center gap-[8px]">
                        <h1 className="w-[324px] h-[38px] text-[32px] font-bold text-[#04330B] text-center leading-[38px]">
                            Sign Up
                        </h1>
                        <p className="w-[137px] h-[22px] font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] text-center leading-[22px] tracking-[-0.3px]">
                            Create your account
                        </p>
                    </div>

                    {/* Body Section: 398x534, Gap 56 */}
                    <div className="w-full h-[534px] flex flex-col gap-[40px]">

                        {/* Input Group Section */}
                        <div className="w-full h-auto flex flex-col gap-[12px]">

                            {/* Inputs Components Wrapper */}
                            <form className="w-full flex flex-col gap-[16px]" onSubmit={handleSignUp}>
                                {/* Name */}
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                                />

                                {/* Email */}
                                <div className="flex flex-col">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (emailError) setEmailError('');
                                        }}
                                        className="w-full h-[46px] rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                                    />
                                    {/* Error Message */}
                                    {emailError && (
                                        <p className="mt-[4px] font-['Familjen_Grotesk'] font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-[#EC4521]">
                                            {emailError}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="relative w-full h-[46px]">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] hover:text-[#04330B] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Date of Birth */}
                                <div className="flex flex-col">
                                    <div className="relative w-full h-[46px]">
                                        <input
                                            ref={dobInputRef}
                                            type="text"
                                            placeholder="Date of birth"
                                            value={dob}
                                            onChange={(e) => {
                                                setDob(e.target.value);
                                                if (dobError) setDobError('');
                                            }}
                                            onFocus={(e) => e.target.type = 'date'}
                                            onBlur={(e) => {
                                                if (!e.target.value) e.target.type = 'text';
                                            }}
                                            className="w-full h-full rounded-[8px] border border-[#E4F2EA] px-[16px] py-[12px] font-['Familjen_Grotesk'] font-semibold text-[16px] text-[#587E67] placeholder-[#587E67] focus:outline-none focus:border-[#04330B] transition-colors bg-white appearance-none"
                                            style={{ colorScheme: 'light' }}
                                        />
                                        <div
                                            onClick={handleCalendarClick}
                                            className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#587E67] cursor-pointer"
                                        >
                                            <Calendar size={20} />
                                        </div>
                                    </div>
                                    {/* Error Message */}
                                    {dobError && (
                                        <p className="mt-[4px] font-['Familjen_Grotesk'] font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-[#EC4521]">
                                            {dobError}
                                        </p>
                                    )}
                                </div>
                            </form>

                            {/* Forgot Password Link (Height 22px) */}
                            <div className="flex justify-start h-[22px]">
                                <a href="#" className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Bottom Section: Create Account + Social + Footer */}
                        <div className="w-full flex flex-col gap-[28px]">

                            {/* Create Account Button */}
                            <button
                                onClick={handleSignUp}
                                disabled={loading}
                                className="w-full h-[46px] rounded-[8px] bg-[#CDE6D9] hover:bg-[#0F392B] disabled:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                            >
                                <span className="font-['Familjen_Grotesk'] font-bold text-[18px] text-white">
                                    {loading ? 'Creating...' : 'Create Account'}
                                </span>
                            </button>

                            {/* Social Signup Section */}
                            <div className="w-full flex flex-col gap-[16px]">
                                {/* Header: Signup with */}
                                <p className="w-full text-center font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B]">
                                    Login with
                                </p>

                                {/* Social Buttons Row */}
                                <div className="w-full flex justify-between gap-[16px]">
                                    {/* Google */}
                                    <button
                                        onClick={() => handleSocialLogin('google')}
                                        className="w-[122px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[12px] flex items-center justify-center gap-[8px] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                                            <img src="/login/Google-login.svg" alt="Google" className="w-[20px] h-[20px]" />
                                        </div>
                                        <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229]">
                                            Google
                                        </span>
                                    </button>

                                    {/* Facebook */}
                                    <button
                                        onClick={() => handleSocialLogin('facebook')}
                                        className="w-[122px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[12px] flex items-center justify-center gap-[8px] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                                            <img src="/login/Fb-login.svg" alt="Facebook" className="w-[20px] h-[20px]" />
                                        </div>
                                        <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229]">
                                            Facebook
                                        </span>
                                    </button>

                                    {/* Apple */}
                                    <button
                                        onClick={() => handleSocialLogin('apple')}
                                        className="w-[122px] h-[46px] rounded-[8px] border border-[#B9D3C4] p-[12px] flex items-center justify-center gap-[8px] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                                            <img src="/login/Apple-login.svg" alt="Apple" className="w-[20px] h-[20px]" />
                                        </div>
                                        <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#0D5229]">
                                            Apple
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Already have an account? Log In */}
                            <div className="text-center w-full h-[22px]">
                                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B]">
                                    Already have an account? <button onClick={() => router.push('/login')} className="hover:underline text-[#0D5229]">Log In</button>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}