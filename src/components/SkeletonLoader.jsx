/**
 * Skeleton Loader Components
 * Simple skeleton placeholders for loading states
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

// Simple skeleton line
export const SkeletonLine = ({ width = '100%', height = '12px', className = '' }) => (
    <div
        className={`bg-gray-200 rounded animate-pulse ${className}`}
        style={{ width, height }}
    />
)

// Skeleton circle for avatars
export const SkeletonCircle = ({ size = '40px' }) => (
    <div
        className="bg-gray-200 rounded-full animate-pulse"
        style={{ width: size, height: size }}
    />
)

// Simple card skeleton
export const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
        <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    </div>
)

// Page loading with logo
export const PageLoadingSkeleton = ({ text = 'Loading...' }) => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <img
            src="/scalezix_logo.png"
            alt="Loading"
            className="w-12 h-12 mb-3 animate-pulse"
        />
        <p className="text-gray-400 text-sm">{text}</p>
    </div>
)

export default { SkeletonLine, SkeletonCircle, SkeletonCard, PageLoadingSkeleton }
