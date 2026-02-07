/**
 * Affiliate Application Page - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    DollarSign, User, Mail, Lock, Eye, EyeOff, Globe,
    AlertCircle, CheckCircle, ArrowRight, Percent, Users, TrendingUp,
    Youtube, Instagram, Twitter, Sparkles
} from 'lucide-react'
import { api } from '../api/client'

const AUDIENCE_SIZES = [
    { value: '<1k', label: 'Less than 1,000' },
    { value: '1k-10k', label: '1,000 - 10,000' },
    { value: '10k-50k', label: '10,000 - 50,000' },
    { value: '50k-100k', label: '50,000 - 100,000' },
    { value: '100k+', label: '100,000+' }
]

const PROMOTION_CHANNELS = [
    'YouTube', 'TikTok', 'Instagram', 'Blog', 'Email', 'Twitter/X', 'Facebook', 'Reddit', 'Other'
]

export default function AffiliateApply() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        website: '', youtube: '', tiktok: '', instagram: '', twitter: '',
        audienceSize: '', promotionChannels: [], whyJoin: '', agreedToTerms: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const toggleChannel = (channel) => {
        setForm(prev => ({
            ...prev,
            promotionChannels: prev.promotionChannels.includes(channel)
                ? prev.promotionChannels.filter(c => c !== channel)
                : [...prev.promotionChannels, channel]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
        if (!form.agreedToTerms) { setError('You must agree to the terms'); return }
        if (form.whyJoin.length < 100) { setError('Please tell us more (minimum 100 characters)'); return }

        setLoading(true)
        try {
            await api.affiliateApply(form)
            setSuccess(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-soft-xl p-8 text-center border border-gray-100"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-emerald-600 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">Application Submitted!</h1>
                    <p className="text-gray-500 mb-6">
                        We'll review your application within 1-3 business days. You'll receive an email once approved.
                    </p>
                    <Link to="/affiliate/login" className="btn-primary inline-flex items-center gap-2">
                        Go to Login <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-mesh py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-button">
                            <DollarSign className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-gradient-primary">Affiliate Program</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Join Our Affiliate Program</h1>
                    <p className="text-gray-500 text-lg">
                        Earn <span className="text-emerald-600 font-bold">20% lifetime recurring commission</span> on every referred customer
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Percent, title: '20% Recurring', desc: 'Lifetime commission', color: 'emerald' },
                        { icon: Users, title: '30-Day Cookie', desc: 'Credit for 30 days', color: 'primary' },
                        { icon: TrendingUp, title: 'Real-time Stats', desc: 'Track earnings live', color: 'violet' },
                        { icon: DollarSign, title: '₹50K Min Payout', desc: 'Monthly payouts', color: 'orange' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-5 shadow-card border border-gray-100"
                        >
                            <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                                <item.icon className={`text-${item.color}-600 w-5 h-5`} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-soft-xl p-8 border border-gray-100"
                >
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Apply Now</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        className="input pl-12"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Email *</label>
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
                        </div>

                        {/* Password */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                        minLength={8}
                                        className="input pl-12 pr-12"
                                        placeholder="Min 8 characters"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="label">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        required
                                        className="input pl-12"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="label">Website/Blog URL</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    className="input pl-12"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>

                        {/* Social */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">YouTube Channel</label>
                                <div className="relative">
                                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="url" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} className="input pl-12" placeholder="https://youtube.com/@channel" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Instagram</label>
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="url" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="input pl-12" placeholder="https://instagram.com/profile" />
                                </div>
                            </div>
                        </div>

                        {/* Audience Size */}
                        <div>
                            <label className="label">Total Audience Size *</label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {AUDIENCE_SIZES.map(size => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, audienceSize: size.value })}
                                        className={`px-3 py-2.5 border rounded-xl text-sm transition-all ${form.audienceSize === size.value
                                            ? 'border-primary-400 bg-primary-50 text-primary-600'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Promotion Channels */}
                        <div>
                            <label className="label">Main Promotion Channels *</label>
                            <div className="flex flex-wrap gap-2">
                                {PROMOTION_CHANNELS.map(channel => (
                                    <button
                                        key={channel}
                                        type="button"
                                        onClick={() => toggleChannel(channel)}
                                        className={`px-4 py-2 border rounded-full text-sm transition-all ${form.promotionChannels.includes(channel)
                                            ? 'border-primary-400 bg-primary-400 text-white'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Why Join */}
                        <div>
                            <label className="label">Why do you want to join? *</label>
                            <textarea
                                value={form.whyJoin}
                                onChange={(e) => setForm({ ...form, whyJoin: e.target.value })}
                                required
                                minLength={100}
                                maxLength={500}
                                rows={4}
                                className="textarea"
                                placeholder="Tell us about your audience and how you plan to promote..."
                            />
                            <p className="text-xs text-gray-500 mt-1">{form.whyJoin.length}/500 characters (min 100)</p>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={form.agreedToTerms}
                                onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                                className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/affiliate/terms" className="text-primary-500 hover:underline" target="_blank">
                                    Affiliate Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            {loading ? 'Submitting...' : (
                                <span className="flex items-center justify-center gap-2">
                                    Submit Application <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/affiliate/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
                    </p>
                </motion.div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to home</Link>
                </div>
            </div>
        </div>
    )
}
