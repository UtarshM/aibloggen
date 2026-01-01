/**
 * App Loader - Simple Logo Loading Screen
 * Shows Scalezix logo briefly while app initializes
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppLoader({ children, minLoadTime = 600 }) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, minLoadTime)

        return () => clearTimeout(timer)
    }, [minLoadTime])

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
                    >
                        <div className="text-center">
                            <motion.img
                                src="/scalezix_logo.png"
                                alt="Scalezix"
                                className="w-20 h-20 mx-auto mb-4"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl font-semibold text-[#52b2bf]"
                            >
                                Scalezix
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-sm mt-1"
                            >
                                AI-Powered Content Platform
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </>
    )
}
