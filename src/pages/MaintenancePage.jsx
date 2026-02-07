/**
 * Maintenance Page - Shown when platform is under maintenance
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react';
import { Settings, Clock, Mail, RefreshCw } from 'lucide-react';

export default function MaintenancePage({ message }) {
    const [dots, setDots] = useState('');
    const [progress, setProgress] = useState(0);

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Fake progress animation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 10;
                return prev + Math.random() * 5;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#52b2bf]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#52b2bf]/5 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#52b2bf] to-[#3d8a94] rounded-2xl shadow-2xl shadow-[#52b2bf]/20 mb-4">
                        <Settings className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <span className="bg-gradient-to-r from-[#52b2bf] to-purple-400 bg-clip-text text-transparent">
                            Scalezix
                        </span>
                    </h1>
                </div>

                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            {/* Pulsing ring */}
                            <div className="absolute inset-0 w-24 h-24 bg-orange-400/30 rounded-full animate-ping" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                        We're Under Maintenance{dots}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-300 text-center text-lg mb-8 leading-relaxed">
                        {message || "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!"}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Maintenance in progress
                            </span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#52b2bf] to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#52b2bf]/20 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-[#52b2bf]" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Expected Duration</p>
                                    <p className="text-gray-400 text-sm">Usually under 30 minutes</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Need Help?</p>
                                    <p className="text-gray-400 text-sm">support@scalezix.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={handleRefresh}
                        className="w-full py-4 bg-gradient-to-r from-[#52b2bf] to-[#3d8a94] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#52b2bf]/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Check Again
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    © 2025 HARSH J KUHIKAR. All rights reserved.
                </p>
            </div>
        </div>
    );
}
