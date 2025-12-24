/**
 * Affiliate Admin Management Page
 * SUPERADMIN ONLY - Access restricted to users with isAdmin: true
 * MacBook-style UI/UX with Primary Color #52b2bf
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
    Eye, RefreshCw, AlertCircle, Wallet, ArrowUpRight, Plus, ShieldX, Lock
} from 'lucide-react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'

export default function AffiliateAdmin() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState(null)
    const [affiliates, setAffiliates] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedAffiliate, setSelectedAffiliate] = useState(null)
    const [showAddEarningModal, setShowAddEarningModal] = useState(false)
    const [earningForm, setEarningForm] = useState({ affiliateId: '', revenueAmount: '', description: '' })
    const [error, setError] = useState('')
    const [accessDenied, setAccessDenied] = useState(false)
    const [showSimulatePurchaseModal, setShowSimulatePurchaseModal] = useState(false)
    const [purchaseForm, setPurchaseForm] = useState({ userEmail: '', planName: 'Premium', amount: '99999' })
    const toast = useToast()
    const modal = useModal()

    useEffect(() => {
        checkAdminAccess()
    }, [])

    useEffect(() => {
        if (!accessDenied && !loading) {
            loadData()
        }
    }, [activeTab, statusFilter, accessDenied])

    const checkAdminAccess = async () => {
        setLoading(true)
        try {
            // Try to load stats - if it fails with 403, user is not admin
            const statsData = await api.getAffiliateStats()
            setStats(statsData)
            setAccessDenied(false)
        } catch (err) {
            console.error('Admin access check:', err.message)
            if (err.message.includes('403') || err.message.includes('Admin') || err.message.includes('permission')) {
                setAccessDenied(true)
            } else {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const loadData = async () => {
        if (accessDenied) return
        setLoading(true)
        setError('')
        try {
            if (activeTab === 'overview') {
                const statsData = await api.getAffiliateStats()
                setStats(statsData)
            } else if (activeTab === 'affiliates') {
                const data = await api.getAdminAffiliates(statusFilter || undefined)
                setAffiliates(data.affiliates || [])
            } else if (activeTab === 'withdrawals') {
                const data = await api.getAdminWithdrawals(statusFilter || undefined)
                setWithdrawals(data.withdrawals || [])
            }
        } catch (err) {
            console.error(err)
            if (err.message.includes('403') || err.message.includes('Admin') || err.message.includes('permission')) {
                setAccessDenied(true)
            } else {
                setError(err.message || 'Failed to load data.')
            }
        } finally {
            setLoading(false)
        }
    }

    // ACCESS DENIED SCREEN
    if (accessDenied) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldX className="text-red-600" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. This area is restricted to SuperAdmins only.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-700 mb-2">
                            <Lock size={18} />
                            <span className="font-medium">Restricted Area</span>
                        </div>
                        <p className="text-sm text-red-600">
                            If you believe you should have access, please contact the system administrator.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const formatCurrency = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`


    const handleApprove = async (id) => {
        const confirmed = await modal.confirm('Approve Affiliate', 'Are you sure you want to approve this affiliate?')
        if (!confirmed) return
        try {
            await api.approveAffiliate(id, {})
            loadData()
            toast.success('Affiliate approved!')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleReject = async (id) => {
        const reason = await modal.prompt('Reject Affiliate', 'Enter rejection reason:', { placeholder: 'Reason for rejection...' })
        if (!reason) return
        try {
            await api.rejectAffiliate(id, { reason })
            loadData()
            toast.success('Affiliate rejected')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleCompleteWithdrawal = async (id) => {
        const transactionId = await modal.prompt('Complete Withdrawal', 'Enter transaction ID:', { placeholder: 'Transaction ID...' })
        if (!transactionId) return
        try {
            await api.completeWithdrawal(id, { transactionId })
            loadData()
            toast.success('Withdrawal completed!')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleRejectWithdrawal = async (id) => {
        const reason = await modal.prompt('Reject Withdrawal', 'Enter rejection reason:', { placeholder: 'Reason for rejection...' })
        if (!reason) return
        try {
            await api.rejectWithdrawal(id, { reason })
            loadData()
            toast.success('Withdrawal rejected and funds returned')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleAddEarning = async (e) => {
        e.preventDefault()
        try {
            await api.addAffiliateEarning({
                affiliateId: earningForm.affiliateId,
                revenueAmount: parseInt(earningForm.revenueAmount) * 100,
                description: earningForm.description
            })
            setShowAddEarningModal(false)
            setEarningForm({ affiliateId: '', revenueAmount: '', description: '' })
            loadData()
            toast.success('Earning added!')
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleSimulatePurchase = async (e) => {
        e.preventDefault()
        try {
            const result = await api.simulatePurchase(
                purchaseForm.userEmail,
                purchaseForm.planName,
                purchaseForm.amount
            )
            setShowSimulatePurchaseModal(false)
            setPurchaseForm({ userEmail: '', planName: 'Premium', amount: '99999' })
            loadData()
            toast.success(result.message)
        } catch (err) {
            toast.error(err.message)
        }
    }


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Affiliate Management</h1>
                    <p className="text-gray-500">Manage affiliates, earnings, and withdrawals</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSimulatePurchaseModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                    >
                        <DollarSign size={20} /> Test Purchase
                    </button>
                    <button
                        onClick={() => setShowAddEarningModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={20} /> Add Earning
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                {['overview', 'affiliates', 'withdrawals'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setStatusFilter(''); }}
                        className={`px-4 py-3 font-medium capitalize border-b-2 transition ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={32} />
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
                    <p className="text-red-600 font-medium mb-2">{error}</p>
                    <p className="text-sm text-gray-500 mb-4">This usually means your session expired. Try logging out and back in.</p>
                    <button
                        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout & Login Again
                    </button>
                </div>
            ) : (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <div className="grid md:grid-cols-4 gap-4">
                            <StatCard icon={Users} label="Total Affiliates" value={stats.totalAffiliates} color="blue" />
                            <StatCard icon={CheckCircle} label="Approved" value={stats.approvedAffiliates} color="green" />
                            <StatCard icon={Clock} label="Pending Applications" value={stats.pendingApplications} color="yellow" />
                            <StatCard icon={DollarSign} label="Total Earnings" value={formatCurrency(stats.totalEarnings)} color="green" />
                            <StatCard icon={Wallet} label="Total Withdrawn" value={formatCurrency(stats.totalWithdrawn)} color="purple" />
                            <StatCard icon={ArrowUpRight} label="Pending Withdrawals" value={`${stats.pendingWithdrawals?.count || 0} (${formatCurrency(stats.pendingWithdrawals?.amount || 0)})`} color="orange" />
                            <StatCard icon={TrendingUp} label="Total Clicks" value={(stats.totalClicks || 0).toLocaleString()} color="blue" />
                            <StatCard icon={Users} label="Total Conversions" value={stats.totalConversions || 0} color="green" />
                        </div>
                    )}


                    {/* Affiliates Tab */}
                    {activeTab === 'affiliates' && (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">Affiliates</h3>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Earnings</th>
                                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Clicks</th>
                                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {affiliates.map((aff) => (
                                            <tr key={aff._id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{aff.name}</p>
                                                        <p className="text-xs text-gray-500">{aff.slug}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{aff.email}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <StatusBadge status={aff.status} />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right">{formatCurrency(aff.totalEarnings || 0)}</td>
                                                <td className="px-4 py-3 text-sm text-right">{aff.totalClicks || 0}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {aff.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleApprove(aff._id)} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Approve">
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button onClick={() => handleReject(aff._id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Reject">
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => setSelectedAffiliate(aff)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="View">
                                                            <Eye size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {affiliates.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">No affiliates found</div>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Withdrawals Tab */}
                    {activeTab === 'withdrawals' && (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="font-semibold">Withdrawal Requests</h3>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="requested">Requested</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Affiliate</th>
                                            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Method</th>
                                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                                            <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withdrawals.map((w) => (
                                            <tr key={w._id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{new Date(w.createdAt).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{w.affiliateId?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-500">{w.affiliateId?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(w.amount)}</td>
                                                <td className="px-4 py-3 text-sm text-center capitalize">{w.paymentMethod?.replace('_', ' ')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <StatusBadge status={w.status} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {(w.status === 'requested' || w.status === 'processing') && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => handleCompleteWithdrawal(w._id)} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Complete">
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button onClick={() => handleRejectWithdrawal(w._id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Reject">
                                                                <XCircle size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {withdrawals.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">No withdrawals found</div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}


            {/* Add Earning Modal */}
            {showAddEarningModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Add Earning</h3>
                        <form onSubmit={handleAddEarning} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Affiliate ID</label>
                                <input
                                    type="text"
                                    value={earningForm.affiliateId}
                                    onChange={(e) => setEarningForm({ ...earningForm, affiliateId: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Affiliate MongoDB ID"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Revenue Amount (₹)</label>
                                <input
                                    type="number"
                                    value={earningForm.revenueAmount}
                                    onChange={(e) => setEarningForm({ ...earningForm, revenueAmount: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., 10000"
                                />
                                <p className="text-xs text-gray-500 mt-1">Commission (20%) will be calculated automatically</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={earningForm.description}
                                    onChange={(e) => setEarningForm({ ...earningForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., Subscription sale"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowAddEarningModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    Add Earning
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Affiliate Detail Modal */}
            {selectedAffiliate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Affiliate Details</h3>
                            <button onClick={() => setSelectedAffiliate(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedAffiliate.name}</span></div>
                            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedAffiliate.email}</span></div>
                            <div><span className="text-gray-500">Slug:</span> <span className="font-medium">{selectedAffiliate.slug}</span></div>
                            <div><span className="text-gray-500">Status:</span> <StatusBadge status={selectedAffiliate.status} /></div>
                            <div><span className="text-gray-500">Commission:</span> <span className="font-medium">{selectedAffiliate.commissionPercent}%</span></div>
                            <div><span className="text-gray-500">Total Earnings:</span> <span className="font-medium">{formatCurrency(selectedAffiliate.totalEarnings || 0)}</span></div>
                            <div><span className="text-gray-500">Available Balance:</span> <span className="font-medium">{formatCurrency(selectedAffiliate.availableBalance || 0)}</span></div>
                            <div><span className="text-gray-500">Withdrawn:</span> <span className="font-medium">{formatCurrency(selectedAffiliate.withdrawnBalance || 0)}</span></div>
                            <div><span className="text-gray-500">Clicks:</span> <span className="font-medium">{selectedAffiliate.totalClicks || 0}</span></div>
                            <div><span className="text-gray-500">Conversions:</span> <span className="font-medium">{selectedAffiliate.totalConversions || 0}</span></div>
                            {selectedAffiliate.website && <div><span className="text-gray-500">Website:</span> <a href={selectedAffiliate.website} target="_blank" className="text-blue-600 hover:underline">{selectedAffiliate.website}</a></div>}
                            {selectedAffiliate.promotionMethod && <div><span className="text-gray-500">Promotion:</span> <span className="font-medium">{selectedAffiliate.promotionMethod}</span></div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Simulate Purchase Modal */}
            {showSimulatePurchaseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Test Purchase (Simulate Commission)</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This simulates a user upgrading to a paid plan. The commission will be added to the affiliate who referred this user.
                        </p>
                        <form onSubmit={handleSimulatePurchase} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">User Email</label>
                                <input
                                    type="email"
                                    value={purchaseForm.userEmail}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, userEmail: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="user@example.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">Must be a user who signed up via affiliate link</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Plan Name</label>
                                <select
                                    value={purchaseForm.planName}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, planName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="Premium">Premium (₹999/month)</option>
                                    <option value="Pro">Pro (₹1,999/month)</option>
                                    <option value="Enterprise">Enterprise (₹4,999/month)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={purchaseForm.amount}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })}
                                    required
                                    min="1"
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="e.g., 999"
                                />
                                <p className="text-xs text-gray-500 mt-1">Commission (20%) = ₹{Math.floor(parseInt(purchaseForm.amount || 0) * 0.2).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowSimulatePurchaseModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    Simulate Purchase
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}


// Helper Components
function StatCard({ icon: Icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600'
    }

    return (
        <div className="bg-white rounded-xl p-5 border shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        suspended: 'bg-gray-100 text-gray-700',
        requested: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700'
    }

    return (
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    )
}
