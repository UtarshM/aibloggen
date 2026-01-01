/**
 * App Loader - Logo with Progress Bar
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react'

export default function AppLoader({ children }) {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Animate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 50)

        // Check if page loaded
        const handleLoad = () => {
            setProgress(100)
            setTimeout(() => setIsLoading(false), 300)
        }

        if (document.readyState === 'complete') {
            setTimeout(handleLoad, 800)
        } else {
            window.addEventListener('load', handleLoad)
        }

        return () => {
            clearInterval(interval)
            window.removeEventListener('load', handleLoad)
        }
    }, [])

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => setIsLoading(false), 300)
        }
    }, [progress])

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
                <div className="flex flex-col items-center">
                    {/* Logo in a container/box */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#52b2bf] to-[#3d9aa6] rounded-2xl flex items-center justify-center shadow-lg mb-8 animate-bounce">
                        <img
                            src="/scalezix_logo.png"
                            alt="Scalezix"
                            className="w-12 h-12 object-contain"
                        />
                    </div>

                    {/* Progress Bar */}
                    <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#52b2bf] to-[#3d9aa6] rounded-full transition-all duration-100 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return children
}
