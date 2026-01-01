/**
 * Skeleton Loader Components
 * Professional skeleton loading states for various UI elements
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { motion } from 'framer-motion'

// Base Skeleton with shimmer animation
const Skeleton = ({ className = '', style = {} }) => (
    <div
        className={`skeleton-shimmer bg-gray-200 rounded ${className}`}
        style={style}
    />
)

// Skeleton Line
export const SkeletonLine = ({ width = '100%', height = '12px', className = '' }) => (
    <Skeleton className={className} style={{ width, height }} />
)

// Skeleton Circle (for avatars)
export const SkeletonCircle = ({ size = '40px' }) => (
    <Skeleton className="rounded-full" style={{ width: size, height: size }} />
)

// Skeleton Card
export const SkeletonCard = ({ className = '' }) => (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}>
        <div className="flex items-start gap-4">
            <Skeleton className="rounded-lg" style={{ width: '48px', height: '48px' }} />
            <div className="flex-1 space-y-3">
                <SkeletonLine width="70%" height="16px" />
                <SkeletonLine width="100%" height="12px" />
                <SkeletonLine width="50%" height="12px" />
            </div>
        </div>
    </div>
)

// Skeleton Stats Card
export const SkeletonStatsCard = () => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
            <SkeletonLine width="100px" height="14px" />
            <Skeleton className="rounded-lg" style={{ width: '36px', height: '36px' }} />
        </div>
        <SkeletonLine width="60%" height="28px" />
        <div className="mt-3 flex items-center gap-2">
            <SkeletonLine width="50px" height="10px" />
            <SkeletonLine width="80px" height="10px" />
        </div>
    </div>
)

// Skeleton Table Row
export const SkeletonTableRow = ({ columns = 5 }) => (
    <tr className="border-b border-gray-50">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="py-4 px-4">
                <SkeletonLine width={`${50 + Math.random() * 50}%`} height="14px" />
            </td>
        ))}
    </tr>
)

// Skeleton Table
export const SkeletonTable = ({ rows = 5, columns = 5 }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <SkeletonLine key={i} width="100px" height="12px" />
                ))}
            </div>
        </div>
        {/* Body */}
        <table className="w-full">
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <SkeletonTableRow key={i} columns={columns} />
                ))}
            </tbody>
        </table>
    </div>
)

// Dashboard Skeleton
export const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <SkeletonLine width="200px" height="28px" />
                <div className="mt-2">
                    <SkeletonLine width="300px" height="14px" />
                </div>
            </div>
            <SkeletonLine width="120px" height="40px" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <SkeletonStatsCard key={i} />
            ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <SkeletonLine width="60%" height="16px" />
                    <div className="mt-4 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <SkeletonCircle size="32px" />
                                <div className="flex-1">
                                    <SkeletonLine width="80%" height="12px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
)

// Content Creation Skeleton
export const ContentCreationSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
            <SkeletonLine width="250px" height="32px" />
            <div className="flex gap-3">
                <SkeletonLine width="100px" height="40px" />
                <SkeletonLine width="120px" height="40px" />
            </div>
        </div>

        {/* Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Editor */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <SkeletonLine width="150px" height="20px" />
                <div className="mt-4">
                    <Skeleton style={{ width: '100%', height: '400px' }} className="rounded-lg" />
                </div>
            </div>

            {/* Right - Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <SkeletonLine width="100px" height="20px" />
                <div className="mt-4 space-y-4">
                    <SkeletonLine width="80%" height="24px" />
                    <SkeletonLine width="100%" height="14px" />
                    <SkeletonLine width="100%" height="14px" />
                    <SkeletonLine width="70%" height="14px" />
                    <Skeleton style={{ width: '100%', height: '200px' }} className="rounded-lg mt-4" />
                    <SkeletonLine width="100%" height="14px" />
                    <SkeletonLine width="90%" height="14px" />
                </div>
            </div>
        </div>
    </div>
)

// Profile Skeleton
export const ProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-6">
                <SkeletonCircle size="96px" />
                <div className="flex-1 space-y-3">
                    <SkeletonLine width="200px" height="24px" />
                    <SkeletonLine width="150px" height="14px" />
                    <SkeletonLine width="250px" height="14px" />
                </div>
                <SkeletonLine width="100px" height="40px" />
            </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <SkeletonLine width="150px" height="20px" />
                <div className="mt-6 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <SkeletonLine width="120px" height="14px" />
                            <SkeletonLine width="200px" height="14px" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <SkeletonLine width="100px" height="20px" />
                <div className="mt-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                        <SkeletonStatsCard key={i} />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

// Page Loading Skeleton with Logo
export const PageLoadingSkeleton = ({ title = 'Loading...' }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center"
    >
        <motion.img
            src="/scalezix_logo.png"
            alt="Scalezix"
            className="w-16 h-16 mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-[#52b2bf] to-[#3d8a94] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </div>
    </motion.div>
)

// Inline Loading Spinner with Logo
export const InlineLoader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }

    return (
        <div className="flex items-center gap-3">
            <motion.img
                src="/scalezix_logo.png"
                alt="Loading"
                className={`${sizes[size]} object-contain`}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            {text && <span className="text-gray-600 text-sm">{text}</span>}
        </div>
    )
}

// Export default with all components
export default {
    SkeletonLine,
    SkeletonCircle,
    SkeletonCard,
    SkeletonStatsCard,
    SkeletonTable,
    SkeletonTableRow,
    DashboardSkeleton,
    ContentCreationSkeleton,
    ProfileSkeleton,
    PageLoadingSkeleton,
    InlineLoader
}
