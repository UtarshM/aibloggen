/**
 * Toast Notification Component - MacBook Style
 * This is a standalone component for backward compatibility
 * For new code, use useToast() hook from ToastContext
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const config = {
    success: {
        icon: CheckCircle,
        bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    },
    error: {
        icon: XCircle,
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
    },
    warning: {
        icon: AlertCircle,
        bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
    info: {
        icon: Info,
        bg: 'bg-gradient-to-r from-primary-400 to-primary-500',
    }
}

export default function Toast({ message, type = 'success', onClose }) {
    const { icon: Icon, bg } = config[type] || config.success

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-6 right-6 z-[9999]"
        >
            <div className={`${bg} rounded-2xl shadow-2xl overflow-hidden min-w-[320px] max-w-md`}>
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <p className="text-white font-medium leading-relaxed">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 4, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                    className="h-1 bg-white/30"
                />
            </div>
        </motion.div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
