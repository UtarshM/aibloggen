/**
 * Home Dashboard - MacBook Style Premium UI 2025
 * Multi-Color Scheme: Primary (Teal), Secondary (Purple), Accent (Amber), Success (Emerald)
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FileText,
    ArrowRight, Sparkles, Plus, Calendar, MoreHorizontal, CheckCircle, Coins, RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePlan } from '../context/PlanContext'
import { api } from '../api/client'

// Tools/Projects data with different colors for variety
const tools = [
    {
        name: 'Content Creation',
        path: '/tools/content-creation',
        icon: FileText,
        description: 'Create AI-powered content',
        color: 'from-primary-400 to-primary-500',
        bgColor: 'bg-primary-50',
        iconColor: 'text-primary-500',
        progress: 75,
    },
]

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
}

export default function Home() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [dashboardStats, setDashboardStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const { tokenBalance, refreshBalance, getPlanDisplayName } = usePlan()

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            setLoading(true)
            const stats = await api.getDashboardStats()
            setDashboardStats(stats)
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    // Dynamic stats based on real data
    const stats = [
        {
            label: 'Content Created',
            value: dashboardStats?.contentCreated?.toString() || '0',
            icon: FileText,
            color: 'text-primary-500',
            bgColor: 'bg-primary-50',
            borderColor: 'border-primary-200',
            change: 'Blog posts'
        },
        {
            label: 'WordPress Posts',
            value: dashboardStats?.wordpressPosts?.toString() || '0',
            icon: CheckCircle,
            color: 'text-success-500',
            bgColor: 'bg-success-50',
            borderColor: 'border-success-200',
            change: 'Published'
        },
        {
            label: 'Social Posts',
            value: dashboardStats?.socialPosts?.toString() || '0',
            icon: Share2,
            color: 'text-secondary-500',
            bgColor: 'bg-secondary-50',
            borderColor: 'border-secondary-200',
            change: 'Scheduled'
        },
    ]

    // Recent activity from API or default
    const recentActivity = dashboardStats?.recentActivity?.length > 0
        ? dashboardStats.recentActivity.map(a => ({
            user: a.type === 'content' ? 'Content AI' : 'WordPress',
            action: a.action,
            time: a.time,
            avatar: a.icon || '📝',
            color: a.type === 'content' ? 'bg-primary-100' : 'bg-success-100'
        }))
        : [
            { user: 'System', action: 'Welcome! Start creating content', time: 'Just now', avatar: '👋', color: 'bg-primary-100' },
            { user: 'Tip', action: 'Use Content Creation to generate blogs', time: '', avatar: '💡', color: 'bg-accent-100' },
        ]

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* Token Balance Banner */}
                {tokenBalance && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-400 rounded-2xl p-6 text-white shadow-button"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Coins className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-white/80 text-sm">Token Balance</p>
                                    <p className="text-3xl font-bold">{tokenBalance.current.toLocaleString()}</p>
                                    <p className="text-white/70 text-sm">{getPlanDisplayName()} Plan</p>
                                </div>
                            </div>
                            <div className="text-right flex-1 min-w-[200px]">
                                <div className="mb-2">
                                    <span className="text-white/80 text-sm">Used: </span>
                                    <span className="font-semibold">{tokenBalance.used.toLocaleString()} / {tokenBalance.total.toLocaleString()}</span>
                                </div>
                                <div className="w-full max-w-[200px] ml-auto bg-white/20 rounded-full h-3">
                                    <div
                                        className="bg-white h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(tokenBalance.percentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-white/70 text-xs mt-1">{tokenBalance.percentage}% used this month</p>
                            </div>
                            <button
                                onClick={() => { fetchDashboardStats(); refreshBalance(); }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`bg-white rounded-2xl p-6 border ${stat.borderColor} shadow-card hover:shadow-card-hover transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-4xl font-bold ${stat.color}`}>
                                                {stat.value}
                                            </span>
                                            <span className="text-gray-400 text-sm">{stat.label}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Projects Section - Left Side */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Projects in Progress */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Projects in Progress</h2>
                                <Link to="/tools/content-creation" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-xl text-sm font-medium hover:shadow-button transition-all">
                                    <Plus className="w-4 h-4" />
                                    New Project
                                </Link>
                            </div>
                            <div className="p-4 space-y-3">
                                {tools.slice(0, 4).map((tool, index) => {
                                    const Icon = tool.icon
                                    return (
                                        <Link key={tool.path} to={tool.path}>
                                            <motion.div
                                                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                                            >
                                                <div className={`w-10 h-10 rounded-lg ${tool.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                    <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                                                            {tool.name}
                                                        </h3>
                                                        <span className="text-sm text-gray-500">{tool.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${tool.progress}%` }}
                                                            transition={{ duration: 0.8, delay: index * 0.1 }}
                                                            className={`h-full rounded-full bg-gradient-to-r ${tool.color}`}
                                                        />
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Quick Access Tools */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {tools.map((tool) => {
                                    const Icon = tool.icon
                                    return (
                                        <Link key={tool.path} to={tool.path}>
                                            <motion.div
                                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                whileTap={{ scale: 0.98 }}
                                                className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-soft transition-all group text-center"
                                            >
                                                <div className={`w-12 h-12 mx-auto rounded-xl ${tool.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                    <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                                                </div>
                                                <h3 className="font-medium text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                                                    {tool.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1 truncate">
                                                    {tool.description}
                                                </p>
                                            </motion.div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Sidebar */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* Calendar Widget */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h3>
                                <Calendar className="w-5 h-5 text-secondary-400" />
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="py-2 text-gray-400 font-medium">{day}</div>
                                ))}
                                {Array.from({ length: 35 }, (_, i) => {
                                    const day = i - new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 1
                                    const isToday = day === currentDate.getDate()
                                    const isCurrentMonth = day > 0 && day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
                                    return (
                                        <div
                                            key={i}
                                            className={`py-2 rounded-lg text-sm ${isToday
                                                ? 'bg-gradient-to-r from-primary-400 to-secondary-500 text-white font-medium'
                                                : isCurrentMonth
                                                    ? 'text-gray-700 hover:bg-gray-50'
                                                    : 'text-gray-300'
                                                }`}
                                        >
                                            {isCurrentMonth ? day : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                                <Link to="/tools/job-history" className="text-sm text-primary-500 hover:text-primary-600">
                                    View All
                                </Link>
                            </div>
                            <div className="p-4 space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-sm flex-shrink-0`}>
                                            {activity.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">{activity.user}</span>
                                                {' '}{activity.action}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats - Gradient Card */}
                        <div className="bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-400 rounded-2xl p-6 text-white shadow-button">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Overall Progress</h3>
                                <Sparkles className="w-5 h-5 opacity-80" />
                            </div>
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="12"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="white"
                                        strokeWidth="12"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: '0 352' }}
                                        animate={{ strokeDasharray: `${(tokenBalance?.percentage || 75) * 3.52} 352` }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold">{tokenBalance?.percentage || 0}%</span>
                                </div>
                            </div>
                            <p className="text-center text-white/80 text-sm">
                                {tokenBalance?.percentage < 50
                                    ? 'Great! Plenty of tokens remaining.'
                                    : tokenBalance?.percentage < 80
                                        ? 'Good progress! Keep creating.'
                                        : 'Running low on tokens. Consider upgrading.'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
