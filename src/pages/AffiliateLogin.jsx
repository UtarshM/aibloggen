/**
 * Affiliate Login Page - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { DollarSign, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '../api/client'

export default function AffiliateLogin() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await api.affiliateLogin(form.email, form.password)
            localStorage.setItem('affiliateToken', result.token)
            navigate('/affiliate/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold">Affiliate Portal</span>
                        </div>

                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Earn with<br />Scalezix
                        </h1>
                        <p className="text-primary-100 text-lg max-w-md">
                            Join our affiliate program and earn commissions by referring customers to our AI marketing platform.
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            {['30% Commission', 'Monthly Payouts', 'Real-time Tracking'].map((feature) => (
                                <span key={feature} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                                    {feature}
                                </span>
                            ))}
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
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Affiliate Portal</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500 mb-8">Sign in to your affiliate account</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2"
                            >
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                        className="input pl-12 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
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
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign in
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/affiliate/apply" className="text-primary-500 hover:text-primary-600 font-semibold">
                                Apply now
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                            ← Back to home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
