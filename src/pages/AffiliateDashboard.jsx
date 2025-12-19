/**
 * Affiliate Dashboard - Main affiliate portal
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DollarSign, TrendingUp, Users, MousePointer, Copy, Check,
    Wallet, ArrowUpRight, Clock, AlertCircle, LogOut, Settings,
    CreditCard, Building, Smartphone, ChevronRight, RefreshCw
} from 'lucide-react'
import { api } from '../api/client'

export default function AffiliateDashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState(null)
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [withdrawForm, setWithdrawForm] = useState({
        amount: '',
        paymentMethod: 'bank_transfer',
        bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '',
        upiId: '', paypalEmail: '', note: ''
    })
    const [withdrawing, setWithdrawing] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('affiliateToken')
        if (!token) {
            navigate('/affiliate/login')
            return
        }
        loadDashboard()
    }, [navigate])

    const loadDashboard = async () => {
        try {
            setLoading(true)
            const data = await api.getAffiliateDashboard()
            setDashboard(data)
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('403')) {
                localStorage.removeItem('affiliateToken')
                navigate('/affiliate/login')
            }
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    const copyReferralLink = () => {
        navigator.clipboard.writeText(dashboard?.affiliate?.referralLink || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatCurrency = (paise) => {
        return `₹${(paise / 100).toLocaleString('en-IN')}`
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        setWithdrawing(true)
        setError('')

        try {
            const paymentDetails = {}
            if (withdrawForm.paymentMethod === 'bank_transfer') {
                paymentDetails.bankName = withdrawForm.bankName
                paymentDetails.accountNumber = withdrawForm.accountNumber
                paymentDetails.ifscCode = withdrawForm.ifscCode
                paymentDetails.accountHolderName = withdrawForm.accountHolderName
            } else if (withdrawForm.paymentMethod === 'upi') {
                paymentDetails.upiId = withdrawForm.upiId
            } else if (withdrawForm.paymentMethod === 'paypal') {
                paymentDetails.paypalEmail = withdrawForm.paypalEmail
            }

            await api.affiliateWithdraw({
                amount: parseInt(withdrawForm.amount) * 100, // Convert to paise
                paymentMethod: withdrawForm.paymentMethod,
                paymentDetails,
                note: withdrawForm.note
            })

            setShowWithdrawModal(false)
            setWithdrawForm({
                amount: '', paymentMethod: 'bank_transfer',
                bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '',
                upiId: '', paypalEmail: '', note: ''
            })
            loadDashboard()
            alert('✅ Withdrawal request submitted successfully!')
        } catch (err) {
            setError(err.message)
        } finally {
            setWithdrawing(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('affiliateToken')
        navigate('/affiliate/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }


    const aff = dashboard?.affiliate || {}
    const minWithdrawal = (dashboard?.minimumWithdrawal || 5000000) / 100

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl">Affiliate Portal</h1>
                            <p className="text-sm text-gray-500">Welcome, {aff.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveTab('settings')} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Settings size={20} className="text-gray-600" />
                        </button>
                        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Referral Link Card */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
                    <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
                        <input
                            type="text"
                            value={aff.referralLink || ''}
                            readOnly
                            className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-sm"
                        />
                        <button
                            onClick={copyReferralLink}
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50 transition"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-sm text-white/80 mt-2">
                        Share this link and earn {aff.commissionPercent}% commission on every sale!
                    </p>
                </div>


                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <DollarSign className="text-green-600" size={24} />
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(aff.totalEarnings || 0)}</p>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <Wallet className="text-blue-600" size={24} />
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Available</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(aff.availableBalance || 0)}</p>
                        <p className="text-sm text-gray-500">Available Balance</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <MousePointer className="text-purple-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold">{(aff.totalClicks || 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total Clicks</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="text-orange-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold">{aff.totalConversions || 0}</p>
                        <p className="text-sm text-gray-500">Conversions ({aff.conversionRate || 0}%)</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['overview', 'earnings', 'withdrawals', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>


                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Withdraw Card */}
                        <div className="bg-white rounded-xl p-6 border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Request Withdrawal</h3>

                            {dashboard?.pendingWithdrawal ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                                        <Clock size={20} />
                                        <span className="font-medium">Pending Withdrawal</span>
                                    </div>
                                    <p className="text-2xl font-bold text-yellow-800">
                                        {formatCurrency(dashboard.pendingWithdrawal.amount)}
                                    </p>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        Status: {dashboard.pendingWithdrawal.status}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">Available for withdrawal</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {formatCurrency(aff.availableBalance || 0)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowWithdrawModal(true)}
                                        disabled={(aff.availableBalance || 0) < minWithdrawal * 100}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ArrowUpRight size={20} />
                                        Request Withdrawal
                                    </button>

                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Minimum withdrawal: ₹{minWithdrawal.toLocaleString()}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Recent Earnings */}
                        <div className="bg-white rounded-xl p-6 border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Recent Earnings</h3>

                            {dashboard?.recentEarnings?.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboard.recentEarnings.slice(0, 5).map((earning, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div>
                                                <p className="font-medium">{earning.description || 'Commission'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(earning.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-green-600 font-semibold">
                                                +{formatCurrency(earning.commissionAmount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <DollarSign size={40} className="mx-auto mb-2 opacity-30" />
                                    <p>No earnings yet</p>
                                    <p className="text-sm">Share your referral link to start earning!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Earnings History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Description</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Revenue</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Commission</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboard?.recentEarnings?.map((earning, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(earning.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{earning.description || 'Commission'}</td>
                                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(earning.revenueAmount)}</td>
                                            <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                                                +{formatCurrency(earning.commissionAmount)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs px-2 py-1 rounded-full ${earning.status === 'available' ? 'bg-green-100 text-green-700' :
                                                    earning.status === 'locked' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {earning.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!dashboard?.recentEarnings || dashboard.recentEarnings.length === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No earnings yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Withdrawals Tab */}
                {activeTab === 'withdrawals' && (
                    <WithdrawalsTab formatCurrency={formatCurrency} />
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <SettingsTab affiliate={aff} onUpdate={loadDashboard} />
                )}
            </div>


            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">Request Withdrawal</h3>
                            <p className="text-sm text-gray-500">Minimum: ₹{minWithdrawal.toLocaleString()}</p>
                        </div>

                        <form onSubmit={handleWithdraw} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={withdrawForm.amount}
                                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                                    min={minWithdrawal}
                                    max={(aff.availableBalance || 0) / 100}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Min ₹${minWithdrawal.toLocaleString()}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Method</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'bank_transfer', icon: Building, label: 'Bank' },
                                        { id: 'upi', icon: Smartphone, label: 'UPI' },
                                        { id: 'paypal', icon: CreditCard, label: 'PayPal' }
                                    ].map(method => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setWithdrawForm({ ...withdrawForm, paymentMethod: method.id })}
                                            className={`p-3 border rounded-lg flex flex-col items-center gap-1 transition ${withdrawForm.paymentMethod === method.id
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <method.icon size={20} />
                                            <span className="text-xs">{method.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>


                            {withdrawForm.paymentMethod === 'bank_transfer' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Bank Name</label>
                                        <input
                                            type="text"
                                            value={withdrawForm.bankName}
                                            onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Account Number</label>
                                        <input
                                            type="text"
                                            value={withdrawForm.accountNumber}
                                            onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">IFSC Code</label>
                                        <input
                                            type="text"
                                            value={withdrawForm.ifscCode}
                                            onChange={(e) => setWithdrawForm({ ...withdrawForm, ifscCode: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                                        <input
                                            type="text"
                                            value={withdrawForm.accountHolderName}
                                            onChange={(e) => setWithdrawForm({ ...withdrawForm, accountHolderName: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>
                                </>
                            )}

                            {withdrawForm.paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">UPI ID</label>
                                    <input
                                        type="text"
                                        value={withdrawForm.upiId}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, upiId: e.target.value })}
                                        required
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            {withdrawForm.paymentMethod === 'paypal' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">PayPal Email</label>
                                    <input
                                        type="email"
                                        value={withdrawForm.paypalEmail}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, paypalEmail: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                                <textarea
                                    value={withdrawForm.note}
                                    onChange={(e) => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={withdrawing}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {withdrawing ? 'Processing...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}


// Withdrawals Tab Component
function WithdrawalsTab({ formatCurrency }) {
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadWithdrawals()
    }, [])

    const loadWithdrawals = async () => {
        try {
            const data = await api.getAffiliateWithdrawals()
            setWithdrawals(data.withdrawals || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8"><RefreshCw className="animate-spin mx-auto" /></div>
    }

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
                <h3 className="font-semibold">Withdrawal History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Method</th>
                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map((w, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{new Date(w.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(w.amount)}</td>
                                <td className="px-4 py-3 text-sm text-center capitalize">{w.paymentMethod?.replace('_', ' ')}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`text-xs px-2 py-1 rounded-full ${w.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            w.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {w.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {withdrawals.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No withdrawal history</p>
                    </div>
                )}
            </div>
        </div>
    )
}


// Settings Tab Component
function SettingsTab({ affiliate, onUpdate }) {
    const [form, setForm] = useState({
        name: affiliate.name || '',
        website: affiliate.website || '',
        promotionMethod: affiliate.promotionMethod || ''
    })
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
    const [saving, setSaving] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await api.updateAffiliateProfile(form)
            alert('✅ Profile updated!')
            onUpdate()
        } catch (err) {
            alert('❌ ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (passwordForm.new !== passwordForm.confirm) {
            alert('❌ Passwords do not match')
            return
        }
        setChangingPassword(true)
        try {
            await api.changeAffiliatePassword(passwordForm.current, passwordForm.new)
            alert('✅ Password changed!')
            setPasswordForm({ current: '', new: '', confirm: '' })
        } catch (err) {
            alert('❌ ' + err.message)
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Profile Settings</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Website</label>
                        <input
                            type="url"
                            value={form.website}
                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Promotion Method</label>
                        <textarea
                            value={form.promotionMethod}
                            onChange={(e) => setForm({ ...form, promotionMethod: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
                    >
                        {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
