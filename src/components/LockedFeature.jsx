/**
 * AI Marketing Platform - Locked Feature Component
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import { useState } from 'react'
import { Lock, Sparkles, ArrowRight, X, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LockedFeature({
    title = "Premium Feature",
    description = "Upgrade your plan to unlock this feature",
    requiredPlan = "Advanced",
    children
}) {
    const [showModal, setShowModal] = useState(false)

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowModal(true)
    }

    return (
        <>
            {/* Interactive Locked Content */}
            <div
                className="relative cursor-not-allowed group"
                onClick={handleClick}
            >
                {/* Content with subtle overlay */}
                <div className="relative opacity-60 pointer-events-none select-none">
                    {children}
                </div>

                {/* Hover Indicator */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 via-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-primary-200 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                            <Lock className="text-primary-500" size={20} />
                            <span className="font-semibold text-gray-900">Click to Unlock</span>
                            <Crown className="text-yellow-500" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setShowModal(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>

                        {/* Gradient Header */}
                        <div className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
                                }}></div>
                            </div>

                            <div className="relative">
                                {/* Animated Lock Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="relative bg-white/20 backdrop-blur-sm p-5 rounded-full border-2 border-white/30">
                                            <Lock className="text-white animate-bounce" size={40} />
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-center mb-2">
                                    {title}
                                </h3>
                                <p className="text-white/90 text-center text-lg">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {/* Plan Badge */}
                            <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                                <Sparkles className="text-yellow-600 animate-pulse" size={24} />
                                <span className="text-lg font-bold text-gray-900">
                                    Available in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">{requiredPlan}</span> Plan
                                </span>
                                <Crown className="text-yellow-600 animate-pulse" size={24} />
                            </div>

                            {/* Benefits */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-sm">✓</span>
                                    </div>
                                    <span>Unlock all premium features instantly</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-sm">✓</span>
                                    </div>
                                    <span>14-day free trial, no credit card required</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 font-bold text-sm">✓</span>
                                    </div>
                                    <span>Cancel anytime, 30-day money-back guarantee</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <Link
                                    to="/pricing"
                                    className="w-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
                                    Upgrade Now
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                                </Link>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="text-green-600">●</span> Secure Payment
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-primary-500">●</span> GST Compliant
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-orange-600">●</span> Made in India
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    )
}

/* Copyright © 2025 HARSH J KUHIKAR - All Rights Reserved */
