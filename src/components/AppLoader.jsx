/**
 * App Loader - Professional Skeleton Loading Screen
 * Shows Scalezix logo with animated skeleton UI while app initializes
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Skeleton Line Component
const SkeletonLine = ({ width = '100%', height = '12px', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay }}
        className="bg-gray-200 rounded"
        style={{ width, height }}
    />
)

// Skeleton Card Component
const SkeletonCard = ({ delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1, duration: 0.3 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
        <div className="flex items-start gap-3">
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: delay * 0.1 }}
                className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
                <SkeletonLine width="70%" height="14px" delay={delay * 0.1} />
                <SkeletonLine width="90%" height="10px" delay={delay * 0.1 + 0.1} />
                <SkeletonLine width="50%" height="10px" delay={delay * 0.1 + 0.2} />
            </div>
        </div>
    </motion.div>
)

export default function AppLoader({ children, minLoadTime = 1200 }) {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                const increment = prev < 50 ? 8 : prev < 80 ? 4 : 2
                return Math.min(prev + increment, 100)
            })
        }, 80)

        const timer = setTimeout(() => {
            setProgress(100)
            setTimeout(() => setIsLoading(false), 400)
        }, minLoadTime)

        return () => {
            clearInterval(progressInterval)
            clearTimeout(timer)
        }
    }, [minLoadTime])

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-50 via-white to-gray-50 flex"
                    >
                        {/* Left Sidebar Skeleton */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-4"
                        >
                            {/* Logo Area */}
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <motion.div
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-10 h-10 bg-gray-200 rounded-xl"
                                />
                                <SkeletonLine width="100px" height="20px" />
                            </div>

                            {/* Nav Items */}
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.2 }}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                                    >
                                        <motion.div
                                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-5 h-5 bg-gray-200 rounded"
                                        />
                                        <SkeletonLine width={`${60 + Math.random() * 40}%`} height="12px" delay={i * 0.1} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 px-3 py-2">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-8 h-8 bg-gray-200 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <SkeletonLine width="80%" height="10px" />
                                        <div className="mt-1">
                                            <SkeletonLine width="60%" height="8px" delay={0.1} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <div className="flex-1 flex flex-col">
                            {/* Top Header Skeleton */}
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.4 }}
                                className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6"
                            >
                                <SkeletonLine width="200px" height="24px" />
                                <div className="flex items-center gap-4">
                                    <SkeletonLine width="120px" height="36px" delay={0.1} />
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-9 h-9 bg-gray-200 rounded-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Center Content - Logo & Loading */}
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="text-center">
                                    {/* Scalezix Logo */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="mb-6"
                                    >
                                        <motion.img
                                            src="/scalezix_logo.png"
                                            alt="Scalezix"
                                            className="w-24 h-24 mx-auto object-contain"
                                            animate={{
                                                scale: [1, 1.05, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>

                                    {/* Brand Name */}
                                    <motion.h1
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                        className="text-3xl font-bold bg-gradient-to-r from-[#52b2bf] to-[#3d8a94] bg-clip-text text-transparent mb-2"
                                    >
                                        Scalezix
                                    </motion.h1>

                                    <motion.p
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="text-gray-500 text-sm mb-8"
                                    >
                                        AI-Powered Content Platform
                                    </motion.p>

                                    {/* Skeleton Preview Cards */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        className="w-80 mx-auto space-y-3 mb-8"
                                    >
                                        {[1, 2, 3].map((i) => (
                                            <SkeletonCard key={i} delay={i} />
                                        ))}
                                    </motion.div>

                                    {/* Progress Bar */}
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 280, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                        className="mx-auto"
                                    >
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full rounded-full"
                                                style={{
                                                    background: 'linear-gradient(90deg, #52b2bf 0%, #3d8a94 50%, #52b2bf 100%)',
                                                    backgroundSize: '200% 100%',
                                                    animation: 'shimmer 1.5s infinite'
                                                }}
                                            />
                                        </div>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-xs text-gray-400 mt-3"
                                        >
                                            {progress < 30 && 'Initializing...'}
                                            {progress >= 30 && progress < 60 && 'Loading components...'}
                                            {progress >= 60 && progress < 90 && 'Almost ready...'}
                                            {progress >= 90 && 'Welcome!'}
                                        </motion.p>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="py-4 text-center border-t border-gray-100 bg-white"
                            >
                                <p className="text-xs text-gray-400">
                                    © 2025 Scalezix Venture PVT LTD. All Rights Reserved.
                                </p>
                            </motion.div>
                        </div>

                        {/* Right Panel Skeleton (Desktop) */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="hidden lg:flex w-72 bg-white border-l border-gray-100 flex-col p-4"
                        >
                            <div className="mb-4">
                                <SkeletonLine width="60%" height="16px" />
                            </div>

                            {/* Stats Cards */}
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 + 0.3 }}
                                        className="p-3 bg-gray-50 rounded-lg"
                                    >
                                        <SkeletonLine width="40%" height="10px" delay={i * 0.1} />
                                        <div className="mt-2">
                                            <SkeletonLine width="60%" height="20px" delay={i * 0.1 + 0.05} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chart Placeholder */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-4 p-4 bg-gray-50 rounded-lg"
                            >
                                <SkeletonLine width="50%" height="12px" />
                                <div className="mt-4 flex items-end gap-2 h-24">
                                    {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: 0.7 + i * 0.05, duration: 0.4 }}
                                            className="flex-1 bg-gray-200 rounded-t"
                                            style={{ opacity: 0.5 + (i * 0.07) }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                {children}
            </motion.div>

            {/* Shimmer Animation Style */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </>
    )
}
