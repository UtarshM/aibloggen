/**
 * Affiliate Application Page - Enhanced Version
 * 20% Lifetime Recurring Commission Program
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    DollarSign, User, Mail, Lock, Eye, EyeOff, Globe,
    AlertCircle, CheckCircle, ArrowRight, Percent, Users, TrendingUp,
    Youtube, Instagram, Twitter, ExternalLink
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
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        website: '',
        youtube: '',
        tiktok: '',
        instagram: '',
        twitter: '',
        audienceSize: '',
        promotionChannels: [],
        whyJoin: '',
        agreedToTerms: false
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

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        if (!form.agreedToTerms) {
            setError('You must agree to the terms and conditions')
            return
        }

        if (form.whyJoin.length < 100) {
            setError('Please tell us more about why you want to join (minimum 100 characters)')
            return
        }

        setLoading(true)

        try {
            await api.affiliateApply({
                name: form.name,
                email: form.email,
                password: form.password,
                website: form.website,
                youtube: form.youtube,
                tiktok: form.tiktok,
                instagram: form.instagram,
                twitter: form.twitter,
                audienceSize: form.audienceSize,
                promotionChannels: form.promotionChannels,
                whyJoin: form.whyJoin,
                agreedToTerms: form.agreedToTerms
            })
            setSuccess(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
                    <p className="text-gray-500 mb-6">
                        Thank you for applying to our affiliate program. We usually review applications within 1-3 business days. You'll receive an email once your application is reviewed.
                    </p>
                    <Link
                        to="/affiliate/login"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Go to Login <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Affiliate Program
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Join Our Affiliate Program</h1>
                    <p className="text-gray-500 text-lg">Earn <span className="text-green-600 font-bold">20% lifetime recurring commission</span> on every referred customer</p>
                </div>

                {/* Benefits */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-5 shadow-sm border">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                            <Percent className="text-green-600" size={20} />
                        </div>
                        <h3 className="font-semibold mb-1">20% Recurring</h3>
                        <p className="text-sm text-gray-500">Lifetime commission on every payment</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                            <Users className="text-blue-600" size={20} />
                        </div>
                        <h3 className="font-semibold mb-1">30-Day Cookie</h3>
                        <p className="text-sm text-gray-500">Credit for sales within 30 days</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                            <TrendingUp className="text-purple-600" size={20} />
                        </div>
                        <h3 className="font-semibold mb-1">Real-time Stats</h3>
                        <p className="text-sm text-gray-500">Track clicks & earnings live</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                            <DollarSign className="text-orange-600" size={20} />
                        </div>
                        <h3 className="font-semibold mb-1">₹50K Min Payout</h3>
                        <p className="text-sm text-gray-500">Monthly payouts via Bank/UPI</p>
                    </div>
                </div>

                {/* Application Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-xl font-bold mb-6">Apply Now</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Min 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Website & Social */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website/Blog URL</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Channel</label>
                                <div className="relative">
                                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="url"
                                        value={form.youtube}
                                        onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://youtube.com/@yourchannel"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                                <input
                                    type="url"
                                    value={form.tiktok}
                                    onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://tiktok.com/@yourprofile"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="url"
                                        value={form.instagram}
                                        onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://instagram.com/yourprofile"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="url"
                                        value={form.twitter}
                                        onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://twitter.com/yourprofile"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Audience Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Audience Size *</label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {AUDIENCE_SIZES.map(size => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, audienceSize: size.value })}
                                        className={`px-3 py-2 border rounded-lg text-sm transition ${form.audienceSize === size.value
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Promotion Channels */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Main Promotion Channels *</label>
                            <div className="flex flex-wrap gap-2">
                                {PROMOTION_CHANNELS.map(channel => (
                                    <button
                                        key={channel}
                                        type="button"
                                        onClick={() => toggleChannel(channel)}
                                        className={`px-4 py-2 border rounded-full text-sm transition ${form.promotionChannels.includes(channel)
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Why Join */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Why do you want to join our affiliate program? *
                            </label>
                            <textarea
                                value={form.whyJoin}
                                onChange={(e) => setForm({ ...form, whyJoin: e.target.value })}
                                required
                                minLength={100}
                                maxLength={500}
                                rows={4}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell us about your audience, how you plan to promote our products, and why you'd be a great affiliate partner... (100-500 characters)"
                            />
                            <p className="text-xs text-gray-500 mt-1">{form.whyJoin.length}/500 characters (minimum 100)</p>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={form.agreedToTerms}
                                onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/affiliate/terms" className="text-blue-600 hover:underline" target="_blank">
                                    Affiliate Terms & Conditions
                                </Link>
                                {' '}and understand that I will earn 20% lifetime recurring commission on all referred paying customers.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? 'Submitting Application...' : (
                                <>Submit Application <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <Link to="/affiliate/login" className="text-blue-600 font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to main site */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        ← Back to main site
                    </Link>
                </div>
            </div>
        </div>
    )
}
