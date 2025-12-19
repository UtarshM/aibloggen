/**
 * Affiliate Admin Management Page
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import {
    Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
    Eye, RefreshCw, AlertCircle, Search, Filter, ChevronDown,
    Wallet, ArrowUpRight, Plus
} from 'lucide-react'
import { api } from '../api/client'

export default function AffiliateAdmin() {
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState(null)
    const [affiliates, setAffiliates] = useState([])
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedAffiliate, setSelectedAffiliate] = useState(null)
    const [showAddEarningModal, setShowAddEarningModal] = useState(false)
    const [earningForm, setEarningForm] = useState({ affiliateId: '', revenueAmount: '', description: '' })

    useEffect(() => {
        loadData()
    }, [activeTab, statusFilter])

    const loadData = async () => {
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`


    const handleApprove = async (id) => {
        if (!confirm('Approve this affiliate?')) return
        try {
            await api.approveAffiliate(id, {})
            loadData()
            alert('✅ Affiliate approved!')
        } catch (err) {
            alert('❌ ' + err.message)
        }
    }

    const handleReject = async (id) => {
        const reason = prompt('Rejection reason:')
        if (!reason) return
        try {
            await api.rejectAffiliate(id, { reason })
            loadData()
            alert('✅ Affiliate rejected')
        } catch (err) {
            alert('❌ ' + err.message)
        }
    }

    const handleCompleteWithdrawal = async (id) => {
        const transactionId = prompt('Enter transaction ID:')
        if (!transactionId) return
        try {
            await api.completeWithdrawal(id, { transactionId })
            loadData()
            alert('✅ Withdrawal completed!')
        } catch (err) {
            alert('❌ ' + err.message)
        }
    }

    const handleRejectWithdrawal = async (id) => {
        const reason = prompt('Rejection reason:')
        if (!reason) return
        try {
            await api.rejectWithdrawal(id, { reason })
            loadData()
            alert('✅ Withdrawal rejected and funds returned')
        } catch (err) {
            alert('❌ ' + err.message)
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
            alert('✅ Earning added!')
        } catch (err) {
            alert('❌ ' + err.message)
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
                <button
                    onClick={() => setShowAddEarningModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Earning
                </button>
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
