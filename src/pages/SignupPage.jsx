/**
 * Signup Page - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * Clean, modern registration design
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api');

export default function SignupPage() {
    const [step, setStep] = useState('signup');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard');
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const affiliateRef = localStorage.getItem('affiliate_ref');
            const response = await axios.post(`${API_URL}/auth/signup`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                affiliateRef: affiliateRef || undefined
            });

            if (import.meta.env.DEV && response.data.otp) {
                setMessage(`DEV MODE - OTP: ${response.data.otp}`);
            } else {
                setMessage(response.data.message || 'OTP sent to your email');
            }
            toast.success('OTP sent to your email!');
            setStep('verify');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/auth/verify-otp`, {
                email: formData.email,
                otp: formData.otp
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Welcome to Scalezix!');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/resend-otp`, { email: formData.email });
            setMessage(response.data.message);
            toast.success('OTP resent!');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: Sparkles, text: 'AI-powered content creation' },
        { icon: Shield, text: 'Enterprise-grade security' },
        { icon: CheckCircle, text: 'Free forever plan available' },
    ];

    return (
        <div className="min-h-screen bg-mesh flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold">Scalezix</span>
                        </div>

                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Start your AI<br />marketing journey
                        </h1>
                        <p className="text-primary-100 text-lg max-w-md mb-8">
                            Join thousands of marketers using AI to create better content and grow faster.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-primary-50">{benefit.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Scalezix</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft-xl p-8 border border-gray-100">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'signup' ? 'bg-primary-400 text-white' : 'bg-primary-100 text-primary-600'
                                }`}>
                                1
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: step === 'verify' ? '100%' : '0%' }}
                                    className="h-full bg-primary-400"
                                />
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'verify' ? 'bg-primary-400 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                2
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {step === 'signup' ? 'Create account' : 'Verify email'}
                        </h2>
                        <p className="text-gray-500 mb-8">
                            {step === 'signup' ? 'Fill in your details to get started' : 'Enter the code sent to your email'}
                        </p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-sm"
                            >
                                {message}
                            </motion.div>
                        )}

                        {step === 'signup' ? (
                            <form onSubmit={handleSignup} className="space-y-5">
                                <div>
                                    <label className="label">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input pl-12"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input pl-12"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="input pl-12 pr-12"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-3.5"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Continue
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify} className="space-y-5">
                                <div>
                                    <label className="label">Verification Code</label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                        maxLength={6}
                                        className="input text-center text-2xl tracking-[0.5em] font-bold"
                                        placeholder="000000"
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Sent to {formData.email}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-3.5"
                                >
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium"
                                >
                                    Didn't receive code? Resend
                                </button>
                            </form>
                        )}

                        {step === 'signup' && (
                            <p className="mt-8 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                            ← Back to home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
