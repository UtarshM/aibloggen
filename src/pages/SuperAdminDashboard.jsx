/**
 * SuperAdmin Dashboard - Complete Control Center
 * MacBook-style UI/UX with Primary Color #52b2bf
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useModal } from '../components/Modal';

// Icons Component
const Icons = {
    Dashboard: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
    ),
    Users: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Affiliates: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Withdrawals: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    Newsletter: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    WordPress: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    ),
    Analytics: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Settings: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Logout: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Refresh: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
    Check: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    X: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Eye: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    Ban: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    Mail: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Activity: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    Database: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
    ),
    Globe: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    ),
    Shield: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Clock: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    TrendingUp: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    Download: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Plus: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    ChevronRight: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    ),
};

// Navigation Items
// Add Link icon for referred users
Icons.Link = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

// Add Performance icon
Icons.Performance = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'users', label: 'Users', icon: Icons.Users },
    { id: 'referred', label: 'Referred Users', icon: Icons.Link },
    { id: 'affiliates', label: 'Affiliates', icon: Icons.Affiliates },
    { id: 'performance', label: 'Performance', icon: Icons.Performance },
    { id: 'withdrawals', label: 'Withdrawals', icon: Icons.Withdrawals },
    { id: 'newsletter', label: 'Newsletter', icon: Icons.Newsletter },
    { id: 'wordpress', label: 'WordPress Jobs', icon: Icons.WordPress },
    { id: 'analytics', label: 'Analytics', icon: Icons.Analytics },
    { id: 'activity', label: 'Activity Log', icon: Icons.Activity },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
];

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('superAdminToken');
        const user = localStorage.getItem('superAdminUser');

        if (!token) {
            navigate('/superadmin/login');
            return;
        }

        if (user) {
            setAdminUser(JSON.parse(user));
        }

        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('superAdminToken');
        localStorage.removeItem('superAdminUser');
        navigate('/superadmin/login');
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarCollapsed ? 80 : 280 }}
                className="fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50 flex flex-col"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                            <Icons.Shield />
                        </div>
                        {!sidebarCollapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <h1 className="font-semibold text-gray-900">SuperAdmin</h1>
                                <p className="text-xs text-gray-500">Control Center</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                                }`}
                        >
                            <item.icon />
                            {!sidebarCollapsed && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </motion.button>
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-gray-100">
                    {!sidebarCollapsed && adminUser && (
                        <div className="mb-4 px-4">
                            <p className="font-medium text-gray-900 truncate">{adminUser.name}</p>
                            <p className="text-xs text-gray-500 truncate">{adminUser.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Icons.Logout />
                        {!sidebarCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all"
                >
                    <motion.div animate={{ rotate: sidebarCollapsed ? 0 : 180 }}>
                        <Icons.ChevronRight />
                    </motion.div>
                </button>
            </motion.aside>

            {/* Main Content */}
            <main
                className="flex-1 transition-all duration-300"
                style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
                            <p className="text-sm text-gray-500">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={loadDashboardData}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <Icons.Refresh />
                            </button>
                            <div className="relative">
                                <Icons.Search />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-gray-900/10 outline-none w-64"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && <DashboardView stats={stats} loading={loading} />}
                        {activeTab === 'users' && <UsersView />}
                        {activeTab === 'referred' && <ReferredUsersView />}
                        {activeTab === 'affiliates' && <AffiliatesView />}
                        {activeTab === 'performance' && <PerformanceView />}
                        {activeTab === 'withdrawals' && <WithdrawalsView />}
                        {activeTab === 'newsletter' && <NewsletterView />}
                        {activeTab === 'wordpress' && <WordPressView />}
                        {activeTab === 'analytics' && <AnalyticsView stats={stats} />}
                        {activeTab === 'activity' && <ActivityView />}
                        {activeTab === 'settings' && <SettingsView />}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// DASHBOARD VIEW - Overview with Stats Cards
// ═══════════════════════════════════════════════════════════════
function DashboardView({ stats, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Icons.Users, color: 'from-primary-400 to-primary-500', change: '+12%' },
        { label: 'Verified Users', value: stats?.verifiedUsers || 0, icon: Icons.Check, color: 'from-success-400 to-success-500', change: '+8%' },
        { label: 'Total Affiliates', value: stats?.totalAffiliates || 0, icon: Icons.Affiliates, color: 'from-secondary-400 to-secondary-500', change: '+15%' },
        { label: 'Pending Applications', value: stats?.pendingAffiliates || 0, icon: Icons.Clock, color: 'from-accent-400 to-accent-500', change: '' },
        { label: 'Newsletter Subscribers', value: stats?.newsletterSubscribers || 0, icon: Icons.Mail, color: 'from-primary-400 to-secondary-500', change: '+22%' },
        { label: 'WordPress Sites', value: stats?.wordpressSites || 0, icon: Icons.Globe, color: 'from-secondary-400 to-primary-500', change: '' },
        { label: 'Total Earnings (₹)', value: `₹${((stats?.totalAffiliateEarnings || 0) / 100).toLocaleString()}`, icon: Icons.TrendingUp, color: 'from-success-400 to-success-500', change: '+18%' },
        { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: Icons.Withdrawals, color: 'from-accent-400 to-accent-500', change: '' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                                {stat.change && (
                                    <p className="text-xs text-green-600 mt-1">{stat.change} this month</p>
                                )}
                            </div>
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                <stat.icon />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Review Applications', icon: Icons.Users, action: 'affiliates' },
                        { label: 'Process Withdrawals', icon: Icons.Withdrawals, action: 'withdrawals' },
                        { label: 'Send Newsletter', icon: Icons.Mail, action: 'newsletter' },
                        { label: 'View Analytics', icon: Icons.Analytics, action: 'analytics' },
                    ].map((action) => (
                        <button
                            key={action.label}
                            className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <action.icon />
                            <span className="font-medium text-gray-700">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {(stats?.recentUsers || []).slice(0, 5).map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {user.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Affiliates</h3>
                    <div className="space-y-3">
                        {(stats?.recentAffiliates || []).slice(0, 5).map((aff, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                        {aff.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{aff.name}</p>
                                        <p className="text-xs text-gray-500">{aff.email}</p>
                                    </div>
                                </div>
                                <StatusBadge status={aff.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Status Badge Component
function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        suspended: 'bg-orange-100 text-orange-700',
        banned: 'bg-red-200 text-red-800',
        blocked: 'bg-red-200 text-red-800',
        active: 'bg-green-100 text-green-700',
        completed: 'bg-green-100 text-green-700',
        requested: 'bg-primary-100 text-primary-700',
        processing: 'bg-yellow-100 text-yellow-700',
        verified: 'bg-green-100 text-green-700',
        unverified: 'bg-yellow-100 text-yellow-700',
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}


// ═══════════════════════════════════════════════════════════════
// USERS VIEW - Complete User Management
// ═══════════════════════════════════════════════════════════════
function UsersView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const toast = useToast();
    const modal = useModal();

    useEffect(() => {
        loadUsers();
    }, [page, filter]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminUsers(filter, page, 20, search);
            setUsers(data.users || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        loadUsers();
    };

    const handleAction = async (userId, action, data = {}) => {
        try {
            if (action === 'delete') {
                const confirmed = await modal.danger('Delete User', 'Are you sure you want to delete this user? This action cannot be undone.');
                if (!confirmed) return;
                await api.superAdminDeleteUser(userId);
                toast.success('User deleted successfully');
            } else if (action === 'verify') {
                await api.superAdminVerifyUser(userId);
                toast.success('User verified successfully');
            } else if (action === 'makeAdmin') {
                await api.superAdminToggleAdmin(userId, true);
                toast.success('User is now an admin');
            } else if (action === 'removeAdmin') {
                await api.superAdminToggleAdmin(userId, false);
                toast.success('Admin privileges removed');
            } else if (action === 'block') {
                const reason = await modal.prompt('Block User', 'Enter reason for blocking this user:', { placeholder: 'Reason for blocking...' });
                if (reason === null) return;
                await api.superAdminBlockUser(userId, reason);
                toast.success('User blocked successfully');
            } else if (action === 'unblock') {
                const confirmed = await modal.confirm('Unblock User', 'Are you sure you want to unblock this user?');
                if (!confirmed) return;
                await api.superAdminUnblockUser(userId);
                toast.success('User unblocked successfully');
            }
            loadUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Filters & Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {['all', 'verified', 'unverified', 'admin', 'blocked'].map((f) => (
                            <button
                                key={f}
                                onClick={() => { setFilter(f); setPage(1); }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="px-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-gray-900/10 outline-none"
                        />
                        <button type="submit" className="p-2 bg-gray-900 text-white rounded-xl">
                            <Icons.Search />
                        </button>
                    </form>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Last Login</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${user.isBlocked ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-primary-400 to-primary-500'} rounded-full flex items-center justify-center text-white font-medium`}>
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                                {user.isAdmin && (
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Admin</span>
                                                )}
                                                {user.isBlocked && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Blocked</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isBlocked ? (
                                                <StatusBadge status="blocked" />
                                            ) : (
                                                <StatusBadge status={user.isVerified ? 'verified' : 'unverified'} />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-gray-700">{user.plan || 'free'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Icons.Eye />
                                                </button>
                                                {!user.isVerified && !user.isBlocked && (
                                                    <button
                                                        onClick={() => handleAction(user._id, 'verify')}
                                                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                                        title="Verify User"
                                                    >
                                                        <Icons.Check />
                                                    </button>
                                                )}
                                                {!user.isAdmin ? (
                                                    <button
                                                        onClick={() => handleAction(user._id, 'makeAdmin')}
                                                        className="p-2 hover:bg-primary-100 text-primary-600 rounded-lg transition-all"
                                                        title="Make Admin"
                                                    >
                                                        <Icons.Shield />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(user._id, 'removeAdmin')}
                                                        className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                                                        title="Remove Admin"
                                                    >
                                                        <Icons.X />
                                                    </button>
                                                )}
                                                {/* Block/Unblock Button */}
                                                {user.isBlocked ? (
                                                    <button
                                                        onClick={() => handleAction(user._id, 'unblock')}
                                                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                                        title="Unblock User"
                                                    >
                                                        <Icons.Refresh />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(user._id, 'block')}
                                                        className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all"
                                                        title="Block User"
                                                    >
                                                        <Icons.Clock />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(user._id, 'delete')}
                                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Icons.Ban />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onRefresh={loadUsers} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// User Detail Modal
function UserDetailModal({ user, onClose, onRefresh }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
                        <Icons.X />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-semibold">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h4 className="text-2xl font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <StatusBadge status={user.isVerified ? 'verified' : 'unverified'} />
                                {user.isAdmin && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Admin</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Plan" value={user.plan || 'Free'} />
                        <InfoCard label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                        <InfoCard label="Last Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'} />
                        <InfoCard label="Google ID" value={user.googleId ? 'Connected' : 'Not Connected'} />
                    </div>

                    {user.profile && (
                        <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900">Profile Information</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <InfoCard label="First Name" value={user.profile.firstName || '-'} />
                                <InfoCard label="Last Name" value={user.profile.lastName || '-'} />
                                <InfoCard label="Phone" value={user.profile.phone || '-'} />
                                <InfoCard label="Location" value={user.profile.location || '-'} />
                            </div>
                        </div>
                    )}

                    {user.apiUsage && (
                        <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900">API Usage</h5>
                            <div className="grid grid-cols-3 gap-4">
                                <InfoCard label="Content Generated" value={user.apiUsage.contentGenerated || 0} />
                                <InfoCard label="Images Generated" value={user.apiUsage.imagesGenerated || 0} />
                                <InfoCard label="Social Posts" value={user.apiUsage.socialPosts || 0} />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="font-medium text-gray-900 capitalize">{value}</p>
        </div>
    );
}


// ═══════════════════════════════════════════════════════════════
// AFFILIATES VIEW - Complete Affiliate Management
// ═══════════════════════════════════════════════════════════════
function AffiliatesView() {
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [actionModal, setActionModal] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const toast = useToast();

    useEffect(() => {
        loadAffiliates();
    }, [page, filter]);

    const loadAffiliates = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? undefined : filter;
            const data = await api.getAdminAffiliates(status, page, 20);
            setAffiliates(data.affiliates || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to load affiliates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (affiliateId, action, data = {}) => {
        try {
            if (action === 'approve') {
                await api.approveAffiliate(affiliateId, data);
                toast.success('Affiliate approved successfully');
            } else if (action === 'reject') {
                await api.rejectAffiliate(affiliateId, data);
                toast.success('Affiliate rejected');
            } else if (action === 'suspend') {
                await api.suspendAffiliate(affiliateId, data);
                toast.warning('Affiliate suspended');
            } else if (action === 'ban') {
                await api.banAffiliate(affiliateId, data);
                toast.error('Affiliate banned');
            } else if (action === 'reactivate') {
                await api.reactivateAffiliate(affiliateId);
                toast.success('Affiliate reactivated');
            }
            setActionModal(null);
            loadAffiliates();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                    {['all', 'pending', 'approved', 'rejected', 'suspended', 'banned'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Affiliates Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Affiliate</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Audience</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Earnings</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Applied</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {affiliates.map((aff) => (
                                    <tr key={aff._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {aff.name?.charAt(0) || 'A'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{aff.name}</p>
                                                    <p className="text-sm text-gray-500">{aff.email}</p>
                                                    <p className="text-xs text-primary-500">{aff.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={aff.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {aff.audienceSize || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">₹{((aff.totalEarnings || 0) / 100).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {aff.totalConversions || 0}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(aff.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedAffiliate(aff)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Icons.Eye />
                                                </button>
                                                {aff.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => setActionModal({ type: 'approve', affiliate: aff })}
                                                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                                            title="Approve"
                                                        >
                                                            <Icons.Check />
                                                        </button>
                                                        <button
                                                            onClick={() => setActionModal({ type: 'reject', affiliate: aff })}
                                                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <Icons.X />
                                                        </button>
                                                    </>
                                                )}
                                                {aff.status === 'approved' && (
                                                    <button
                                                        onClick={() => setActionModal({ type: 'suspend', affiliate: aff })}
                                                        className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                                                        title="Suspend"
                                                    >
                                                        <Icons.Clock />
                                                    </button>
                                                )}
                                                {aff.status === 'suspended' && (
                                                    <button
                                                        onClick={() => handleAction(aff._id, 'reactivate')}
                                                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                                        title="Reactivate"
                                                    >
                                                        <Icons.Refresh />
                                                    </button>
                                                )}
                                                {aff.status !== 'banned' && (
                                                    <button
                                                        onClick={() => setActionModal({ type: 'ban', affiliate: aff })}
                                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                                        title="Ban"
                                                    >
                                                        <Icons.Ban />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Affiliate Detail Modal */}
            <AnimatePresence>
                {selectedAffiliate && (
                    <AffiliateDetailModal affiliate={selectedAffiliate} onClose={() => setSelectedAffiliate(null)} />
                )}
            </AnimatePresence>

            {/* Action Modal */}
            <AnimatePresence>
                {actionModal && (
                    <AffiliateActionModal
                        type={actionModal.type}
                        affiliate={actionModal.affiliate}
                        onClose={() => setActionModal(null)}
                        onSubmit={(data) => handleAction(actionModal.affiliate._id, actionModal.type, data)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Affiliate Detail Modal
function AffiliateDetailModal({ affiliate, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Affiliate Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><Icons.X /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-semibold">
                            {affiliate.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <h4 className="text-2xl font-semibold text-gray-900">{affiliate.name}</h4>
                            <p className="text-gray-500">{affiliate.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <StatusBadge status={affiliate.status} />
                                <span className="text-sm text-primary-500">Code: {affiliate.slug}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard label="Total Earnings" value={`₹${((affiliate.totalEarnings || 0) / 100).toLocaleString()}`} />
                        <InfoCard label="Available Balance" value={`₹${((affiliate.availableBalance || 0) / 100).toLocaleString()}`} />
                        <InfoCard label="Total Clicks" value={affiliate.totalClicks || 0} />
                        <InfoCard label="Conversions" value={affiliate.totalConversions || 0} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Audience Size" value={affiliate.audienceSize || '-'} />
                        <InfoCard label="Commission Rate" value={`${affiliate.commissionPercent || 20}%`} />
                        <InfoCard label="Website" value={affiliate.website || '-'} />
                        <InfoCard label="Applied On" value={new Date(affiliate.createdAt).toLocaleDateString()} />
                    </div>

                    {affiliate.promotionChannels?.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Promotion Channels</p>
                            <div className="flex flex-wrap gap-2">
                                {affiliate.promotionChannels.map((ch) => (
                                    <span key={ch} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{ch}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {affiliate.whyJoin && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Why They Want to Join</p>
                            <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{affiliate.whyJoin}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {affiliate.youtube && <InfoCard label="YouTube" value={affiliate.youtube} />}
                        {affiliate.instagram && <InfoCard label="Instagram" value={affiliate.instagram} />}
                        {affiliate.tiktok && <InfoCard label="TikTok" value={affiliate.tiktok} />}
                        {affiliate.twitter && <InfoCard label="Twitter" value={affiliate.twitter} />}
                    </div>

                    <div className="bg-primary-50 rounded-xl p-4">
                        <p className="text-sm text-blue-700">
                            <strong>Referral Link:</strong> {affiliate.referralLink || `https://aiblog.scalezix.com/?ref=${affiliate.slug}`}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Affiliate Action Modal
function AffiliateActionModal({ type, affiliate, onClose, onSubmit }) {
    const [reason, setReason] = useState('');
    const [commission, setCommission] = useState(affiliate.commissionPercent || 20);

    const titles = {
        approve: 'Approve Affiliate',
        reject: 'Reject Application',
        suspend: 'Suspend Affiliate',
        ban: 'Ban Affiliate'
    };

    const handleSubmit = () => {
        const data = { reason };
        if (type === 'approve') data.commissionPercent = commission;
        onSubmit(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            >
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">{titles[type]}</h3>
                    <p className="text-sm text-gray-500 mt-1">{affiliate.name} ({affiliate.email})</p>
                </div>
                <div className="p-6 space-y-4">
                    {type === 'approve' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                            <input
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(parseInt(e.target.value))}
                                min="1"
                                max="100"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                            />
                        </div>
                    )}
                    {type !== 'approve' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason {type === 'reject' || type === 'ban' ? '(Required)' : '(Optional)'}</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none resize-none"
                                placeholder={`Enter reason for ${type}...`}
                            />
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-white rounded-xl transition-all ${type === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                            type === 'reject' || type === 'ban' ? 'bg-red-600 hover:bg-red-700' :
                                'bg-orange-600 hover:bg-orange-700'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}


// ═══════════════════════════════════════════════════════════════
// WITHDRAWALS VIEW - Process Withdrawal Requests
// ═══════════════════════════════════════════════════════════════
function WithdrawalsView() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionModal, setActionModal] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const toast = useToast();

    useEffect(() => {
        loadWithdrawals();
    }, [page, filter]);

    const loadWithdrawals = async () => {
        setLoading(true);
        try {
            const status = filter === 'all' ? undefined : filter;
            const data = await api.getAdminWithdrawals(status, page, 20);
            setWithdrawals(data.withdrawals || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to load withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (withdrawalId, action, data = {}) => {
        try {
            if (action === 'complete') {
                await api.completeWithdrawal(withdrawalId, data);
                toast.success('Withdrawal completed successfully');
            } else if (action === 'reject') {
                await api.rejectWithdrawal(withdrawalId, data);
                toast.warning('Withdrawal rejected');
            }
            setActionModal(null);
            loadWithdrawals();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                    {['all', 'requested', 'processing', 'completed', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Withdrawals Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Affiliate</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Method</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdrawals.map((w) => (
                                    <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{w.affiliateId?.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{w.affiliateId?.email || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-semibold text-gray-900">₹{((w.amount || 0) / 100).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-gray-700">{w.paymentMethod?.replace('_', ' ') || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={w.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(w.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {(w.status === 'requested' || w.status === 'processing') && (
                                                    <>
                                                        <button
                                                            onClick={() => setActionModal({ type: 'complete', withdrawal: w })}
                                                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                                            title="Complete"
                                                        >
                                                            <Icons.Check />
                                                        </button>
                                                        <button
                                                            onClick={() => setActionModal({ type: 'reject', withdrawal: w })}
                                                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <Icons.X />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            <AnimatePresence>
                {actionModal && (
                    <WithdrawalActionModal
                        type={actionModal.type}
                        withdrawal={actionModal.withdrawal}
                        onClose={() => setActionModal(null)}
                        onSubmit={(data) => handleAction(actionModal.withdrawal._id, actionModal.type, data)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Withdrawal Action Modal
function WithdrawalActionModal({ type, withdrawal, onClose, onSubmit }) {
    const [transactionId, setTransactionId] = useState('');
    const [reason, setReason] = useState('');
    const [adminNote, setAdminNote] = useState('');

    const handleSubmit = () => {
        if (type === 'complete') {
            onSubmit({ transactionId, adminNote });
        } else {
            onSubmit({ reason, adminNote });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            >
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {type === 'complete' ? 'Complete Withdrawal' : 'Reject Withdrawal'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Amount: ₹{((withdrawal.amount || 0) / 100).toLocaleString()}
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Payment Details</p>
                        <p className="text-sm text-gray-600">Method: {withdrawal.paymentMethod?.replace('_', ' ')}</p>
                        {withdrawal.paymentDetails?.bankName && (
                            <>
                                <p className="text-sm text-gray-600">Bank: {withdrawal.paymentDetails.bankName}</p>
                                <p className="text-sm text-gray-600">Account: {withdrawal.paymentDetails.accountNumber}</p>
                                <p className="text-sm text-gray-600">IFSC: {withdrawal.paymentDetails.ifscCode}</p>
                                <p className="text-sm text-gray-600">Name: {withdrawal.paymentDetails.accountHolderName}</p>
                            </>
                        )}
                        {withdrawal.paymentDetails?.upiId && (
                            <p className="text-sm text-gray-600">UPI: {withdrawal.paymentDetails.upiId}</p>
                        )}
                        {withdrawal.paymentDetails?.paypalEmail && (
                            <p className="text-sm text-gray-600">PayPal: {withdrawal.paymentDetails.paypalEmail}</p>
                        )}
                    </div>

                    {type === 'complete' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                                placeholder="Enter transaction reference..."
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none resize-none"
                                placeholder="Enter reason for rejection..."
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Note (Optional)</label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none resize-none"
                            placeholder="Internal note..."
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-white rounded-xl transition-all ${type === 'complete' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {type === 'complete' ? 'Complete Payment' : 'Reject'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER VIEW - Manage Subscribers & Send Emails
// ═══════════════════════════════════════════════════════════════
function NewsletterView() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [emailData, setEmailData] = useState({ subject: '', headline: '', body: '', ctaText: '', ctaUrl: '' });
    const [sending, setSending] = useState(false);
    const toast = useToast();

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminNewsletterSubscribers();
            setSubscribers(data.subscribers || []);
        } catch (error) {
            console.error('Failed to load subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendNewsletter = async () => {
        if (!emailData.subject || !emailData.headline || !emailData.body) {
            toast.warning('Please fill in all required fields');
            return;
        }
        setSending(true);
        try {
            await api.sendSuperAdminNewsletter(emailData);
            toast.success('Newsletter sent successfully!');
            setShowCompose(false);
            setEmailData({ subject: '', headline: '', body: '', ctaText: '', ctaUrl: '' });
        } catch (error) {
            toast.error('Failed to send: ' + error.message);
        } finally {
            setSending(false);
        }
    };

    const handleExport = () => {
        const csv = 'Email,Status,Subscribed At\n' + subscribers.map(s =>
            `${s.email},${s.status},${new Date(s.subscribedAt).toLocaleDateString()}`
        ).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter-subscribers.csv';
        a.click();
        toast.success('CSV exported successfully');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Stats & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Subscribers</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-1">{subscribers.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Active Subscribers</p>
                    <p className="text-3xl font-semibold text-green-600 mt-1">
                        {subscribers.filter(s => s.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Actions</p>
                        <p className="text-lg font-medium text-gray-900 mt-1">Send Newsletter</p>
                    </div>
                    <button
                        onClick={() => setShowCompose(true)}
                        className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
                    >
                        <Icons.Mail />
                    </button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Subscribers</h3>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                    >
                        <Icons.Download />
                        <span>Export CSV</span>
                    </button>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Subscribed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                                        <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">{sub.source || 'website'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            <AnimatePresence>
                {showCompose && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCompose(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Compose Newsletter</h3>
                                <button onClick={() => setShowCompose(false)} className="p-2 hover:bg-gray-100 rounded-xl"><Icons.X /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        value={emailData.subject}
                                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                                        placeholder="Email subject line..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline *</label>
                                    <input
                                        type="text"
                                        value={emailData.headline}
                                        onChange={(e) => setEmailData({ ...emailData, headline: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                                        placeholder="Main headline..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Body *</label>
                                    <textarea
                                        value={emailData.body}
                                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none resize-none"
                                        placeholder="Email content..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                                        <input
                                            type="text"
                                            value={emailData.ctaText}
                                            onChange={(e) => setEmailData({ ...emailData, ctaText: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                                            placeholder="Learn More"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA URL</label>
                                        <input
                                            type="url"
                                            value={emailData.ctaUrl}
                                            onChange={(e) => setEmailData({ ...emailData, ctaUrl: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-500">Will be sent to {subscribers.filter(s => s.status === 'active').length} subscribers</p>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                                    <button
                                        onClick={handleSendNewsletter}
                                        disabled={sending}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <>
                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Mail />
                                                <span>Send Newsletter</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


// ═══════════════════════════════════════════════════════════════
// WORDPRESS VIEW - Monitor Bulk Import Jobs
// ═══════════════════════════════════════════════════════════════
function WordPressView() {
    const [jobs, setJobs] = useState([]);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [jobsData, sitesData] = await Promise.all([
                api.getSuperAdminWordPressJobs(),
                api.getSuperAdminWordPressSites()
            ]);
            setJobs(jobsData.jobs || []);
            setSites(sitesData.sites || []);
        } catch (error) {
            console.error('Failed to load WordPress data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Sites</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-1">{sites.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Jobs</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-1">{jobs.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Completed Jobs</p>
                    <p className="text-3xl font-semibold text-green-600 mt-1">
                        {jobs.filter(j => j.status === 'completed').length}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-3xl font-semibold text-primary-500 mt-1">
                        {jobs.filter(j => j.status === 'processing').length}
                    </p>
                </div>
            </div>

            {/* Connected Sites */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Connected WordPress Sites</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : sites.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No WordPress sites connected</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Site</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sites.map((site) => (
                                    <tr key={site._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{site.siteName}</p>
                                                <p className="text-sm text-primary-500">{site.siteUrl}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{site.userId?.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={site.connected ? 'active' : 'inactive'} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(site.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bulk Import Jobs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Bulk Import Jobs</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No bulk import jobs found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">File</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{job.fileName}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{job.userId?.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full transition-all"
                                                        style={{ width: `${(job.processedPosts / job.totalPosts) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {job.processedPosts}/{job.totalPosts}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={job.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS VIEW - Platform Analytics
// ═══════════════════════════════════════════════════════════════
function AnalyticsView({ stats }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-3xl font-semibold text-gray-900 mt-1">{stats?.totalUsers || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary-500">
                            <Icons.Users />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Affiliate Revenue</p>
                            <p className="text-3xl font-semibold text-gray-900 mt-1">₹{((stats?.totalAffiliateEarnings || 0) / 100).toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Icons.TrendingUp />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Clicks</p>
                            <p className="text-3xl font-semibold text-gray-900 mt-1">{stats?.totalClicks || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-primary-600">
                            <Icons.Activity />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Conversions</p>
                            <p className="text-3xl font-semibold text-gray-900 mt-1">{stats?.totalConversions || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Icons.Check />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Growth Chart Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">Chart visualization coming soon</p>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Free Plan</span>
                            <span className="font-medium">{stats?.planDistribution?.free || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Starter Plan</span>
                            <span className="font-medium">{stats?.planDistribution?.starter || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Professional Plan</span>
                            <span className="font-medium">{stats?.planDistribution?.professional || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Enterprise Plan</span>
                            <span className="font-medium">{stats?.planDistribution?.enterprise || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Affiliates</span>
                            <span className="font-medium">{stats?.totalAffiliates || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Approved</span>
                            <span className="font-medium text-green-600">{stats?.approvedAffiliates || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Pending</span>
                            <span className="font-medium text-yellow-600">{stats?.pendingAffiliates || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Withdrawn</span>
                            <span className="font-medium">₹{((stats?.totalWithdrawn || 0) / 100).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY VIEW - Audit Logs
// ═══════════════════════════════════════════════════════════════
function ActivityView() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadLogs();
    }, [page]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminActivityLogs(page, 50);
            setLogs(data.logs || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error('Failed to load logs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                    <p className="text-sm text-gray-500">Recent actions and events</p>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.action.includes('approved') ? 'bg-green-100 text-green-600' :
                                        log.action.includes('rejected') || log.action.includes('banned') ? 'bg-red-100 text-red-600' :
                                            log.action.includes('withdrawal') ? 'bg-blue-100 text-primary-500' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        <Icons.Activity />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 capitalize">
                                            {log.action.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {log.actorType}: {log.actorId} → {log.targetType}: {log.targetId}
                                        </p>
                                        {log.details && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {JSON.stringify(log.details).substring(0, 100)}...
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS VIEW - Platform Settings
// ═══════════════════════════════════════════════════════════════
function SettingsView() {
    const [settings, setSettings] = useState({
        commissionRate: 20,
        cookieDuration: 30,
        minimumWithdrawal: 50000,
        maintenanceMode: false
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const modal = useModal();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.getSuperAdminSettings();
            if (data.settings) {
                setSettings({
                    commissionRate: data.settings.commissionRate || 20,
                    cookieDuration: data.settings.cookieDuration || 30,
                    minimumWithdrawal: data.settings.minimumWithdrawal || 50000,
                    maintenanceMode: data.settings.maintenanceMode || false
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateSuperAdminSettings(settings);
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClearLogs = async () => {
        const confirmed = await modal.danger('Clear All Logs', 'Are you sure you want to clear all activity logs? This cannot be undone.', { confirmText: 'Clear Logs' });
        if (!confirmed) return;
        try {
            await api.superAdminClearLogs();
            toast.success('Activity logs cleared successfully!');
        } catch (error) {
            toast.error('Failed to clear logs: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Affiliate Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Affiliate Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
                        <input
                            type="number"
                            value={settings.commissionRate}
                            onChange={(e) => setSettings({ ...settings, commissionRate: parseInt(e.target.value) })}
                            min="1"
                            max="100"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cookie Duration (Days)</label>
                        <input
                            type="number"
                            value={settings.cookieDuration}
                            onChange={(e) => setSettings({ ...settings, cookieDuration: parseInt(e.target.value) })}
                            min="1"
                            max="365"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Withdrawal (₹ in paise)</label>
                        <input
                            type="number"
                            value={settings.minimumWithdrawal}
                            onChange={(e) => setSettings({ ...settings, minimumWithdrawal: parseInt(e.target.value) })}
                            min="1000"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current: ₹{(settings.minimumWithdrawal / 100).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-medium text-gray-900">Maintenance Mode</p>
                            <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            className={`relative w-14 h-8 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Icons.Check />
                            <span>Save Settings</span>
                        </>
                    )}
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-red-900">Clear All Logs</p>
                            <p className="text-sm text-red-700">Permanently delete all activity logs</p>
                        </div>
                        <button
                            onClick={handleClearLogs}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                        >
                            Clear Logs
                        </button>
                    </div>
                </div>
            </div>

            {/* Help Section - Explain Suspend vs Ban */}
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">📚 Help: User & Affiliate Status Guide</h3>
                <div className="space-y-4 text-sm">
                    <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">👤 User Statuses</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li><span className="font-medium text-green-600">Verified:</span> User has confirmed their email and can use all features</li>
                            <li><span className="font-medium text-yellow-600">Unverified:</span> User hasn't confirmed email yet</li>
                            <li><span className="font-medium text-red-600">Blocked:</span> User cannot login until you unblock them. Use for temporary issues or violations.</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">🤝 Affiliate Statuses</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li><span className="font-medium text-yellow-600">Pending:</span> New application waiting for your review</li>
                            <li><span className="font-medium text-green-600">Approved:</span> Active affiliate who can earn commissions</li>
                            <li><span className="font-medium text-red-600">Rejected:</span> Application was declined</li>
                            <li><span className="font-medium text-orange-600">Suspended:</span> Temporarily paused - affiliate can't earn but can be reactivated. Use for warnings or investigations.</li>
                            <li><span className="font-medium text-red-800">Banned:</span> Permanently removed - cannot be reactivated. Use for serious violations or fraud.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}


// ═══════════════════════════════════════════════════════════════
// REFERRED USERS VIEW - Track which users came from which affiliate
// ═══════════════════════════════════════════════════════════════
function ReferredUsersView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReferredUsers, setTotalReferredUsers] = useState(0);
    const [topAffiliates, setTopAffiliates] = useState([]);

    useEffect(() => {
        loadReferredUsers();
    }, [page]);

    const loadReferredUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminReferredUsers(page, 20);
            setUsers(data.users || []);
            setTotalPages(data.pagination?.pages || 1);
            setTotalReferredUsers(data.totalReferredUsers || 0);
            setTopAffiliates(data.topAffiliatesByReferrals || []);
        } catch (error) {
            console.error('Failed to load referred users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Referred Users</p>
                            <p className="text-3xl font-semibold text-gray-900">{totalReferredUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center text-white">
                            <Icons.Link />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Affiliates</p>
                            <p className="text-3xl font-semibold text-gray-900">{topAffiliates.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center text-white">
                            <Icons.Affiliates />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg Users/Affiliate</p>
                            <p className="text-3xl font-semibold text-gray-900">
                                {topAffiliates.length > 0 ? Math.round(totalReferredUsers / topAffiliates.length) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                            <Icons.TrendingUp />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Affiliates by Referrals */}
            {topAffiliates.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Affiliates by Referrals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {topAffiliates.slice(0, 5).map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">
                                    {item.affiliate?.name?.charAt(0) || '?'}
                                </div>
                                <p className="font-medium text-gray-900 truncate">{item.affiliate?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-500 truncate">{item.affiliate?.slug || '-'}</p>
                                <p className="text-lg font-bold text-primary-600 mt-1">{item.referralCount} users</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Referred Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">All Referred Users</h3>
                    <p className="text-sm text-gray-500">Users who signed up through affiliate referral links</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Icons.Users />
                        <p className="mt-2">No referred users yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Referred By</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Affiliate Code</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{user.referredBy?.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{user.referredBy?.email || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                {user.referredBy?.slug || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize text-gray-700">{user.plan || 'free'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={user.isVerified ? 'verified' : 'unverified'} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}


// ═══════════════════════════════════════════════════════════════
// PERFORMANCE VIEW - Affiliate Performance Analytics
// ═══════════════════════════════════════════════════════════════
function PerformanceView() {
    const [performance, setPerformance] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const toast = useToast();

    useEffect(() => {
        loadPerformance();
    }, []);

    const loadPerformance = async () => {
        setLoading(true);
        try {
            const data = await api.getSuperAdminAffiliatePerformance(30);
            setPerformance(data.performance || []);
            setSummary(data.summary || null);
        } catch (error) {
            console.error('Failed to load performance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCommission = async (affiliateId, newCommission) => {
        try {
            await api.superAdminUpdateAffiliateCommission(affiliateId, newCommission);
            toast.success('Commission rate updated');
            loadPerformance();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCopyLink = (slug) => {
        navigator.clipboard.writeText(`https://aiblog.scalezix.com/?ref=${slug}`);
        toast.success('Referral link copied!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Summary Stats */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Total Affiliates</p>
                        <p className="text-2xl font-semibold text-gray-900">{summary.totalAffiliates}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Total Clicks</p>
                        <p className="text-2xl font-semibold text-primary-500">{summary.totalClicks.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Conversions</p>
                        <p className="text-2xl font-semibold text-green-600">{summary.totalConversions}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Referred Users</p>
                        <p className="text-2xl font-semibold text-primary-600">{summary.totalReferredUsers}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
                        <p className="text-2xl font-semibold text-emerald-600">₹{(summary.totalEarnings / 100).toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Total Withdrawn</p>
                        <p className="text-2xl font-semibold text-orange-600">₹{(summary.totalWithdrawn / 100).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Performance Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Affiliate Performance</h3>
                        <p className="text-sm text-gray-500">Detailed performance metrics for all approved affiliates</p>
                    </div>
                    <button
                        onClick={loadPerformance}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <Icons.Refresh />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Affiliate</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Users</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Conv. Rate</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Earnings</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Withdrawn</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {performance.map((aff) => (
                                <tr key={aff.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {aff.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{aff.name}</p>
                                                <p className="text-sm text-gray-500">{aff.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono">
                                            {aff.slug}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-primary-500">
                                        {aff.totalClicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-green-600">
                                        {aff.totalConversions}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium text-primary-600">
                                        {aff.referredUsers}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${parseFloat(aff.conversionRate) > 5 ? 'bg-green-100 text-green-700' :
                                            parseFloat(aff.conversionRate) > 2 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {aff.conversionRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                        ₹{(aff.totalEarnings / 100).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-orange-600">
                                        ₹{(aff.withdrawnBalance / 100).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => setSelectedAffiliate(aff)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <Icons.Eye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Affiliate Detail Modal */}
            <AnimatePresence>
                {selectedAffiliate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedAffiliate(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Affiliate Details</h3>
                                <button onClick={() => setSelectedAffiliate(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <Icons.X />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold">
                                        {selectedAffiliate.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-900">{selectedAffiliate.name}</h4>
                                        <p className="text-gray-500">{selectedAffiliate.email}</p>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-mono">
                                            {selectedAffiliate.slug}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Total Clicks</p>
                                        <p className="text-xl font-semibold text-primary-500">{selectedAffiliate.totalClicks}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Conversions</p>
                                        <p className="text-xl font-semibold text-green-600">{selectedAffiliate.totalConversions}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Referred Users</p>
                                        <p className="text-xl font-semibold text-primary-600">{selectedAffiliate.referredUsers}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Conversion Rate</p>
                                        <p className="text-xl font-semibold text-gray-900">{selectedAffiliate.conversionRate}%</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Total Earnings</p>
                                        <p className="text-xl font-semibold text-emerald-600">₹{(selectedAffiliate.totalEarnings / 100).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500">Available Balance</p>
                                        <p className="text-xl font-semibold text-primary-500">₹{(selectedAffiliate.availableBalance / 100).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Referral Link:</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`https://aiblog.scalezix.com/?ref=${selectedAffiliate.slug}`}
                                            className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm"
                                        />
                                        <button
                                            onClick={() => handleCopyLink(selectedAffiliate.slug)}
                                            className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-xl text-sm hover:from-primary-500 hover:to-primary-600 transition-all"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
