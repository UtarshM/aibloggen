/**
 * Toast Notification Context
 * Global notification system with bounce animations
 * Replaces all alert() calls with beautiful popups
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
    success: {
        icon: CheckCircle,
        bgClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        iconBg: 'bg-white/20',
        progressClass: 'bg-white/30',
    },
    error: {
        icon: XCircle,
        bgClass: 'bg-gradient-to-r from-red-500 to-rose-500',
        iconBg: 'bg-white/20',
        progressClass: 'bg-white/30',
    },
    warning: {
        icon: AlertTriangle,
        bgClass: 'bg-gradient-to-r from-amber-500 to-orange-500',
        iconBg: 'bg-white/20',
        progressClass: 'bg-white/30',
    },
    info: {
        icon: Info,
        bgClass: 'bg-gradient-to-r from-primary-400 to-primary-500',
        iconBg: 'bg-white/20',
        progressClass: 'bg-white/30',
    },
};

// Animation variants
const toastVariants = {
    initial: {
        opacity: 0,
        y: -20,
        scale: 0.9,
        x: 100
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        x: 100,
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    },
};

// Single Toast Component
function Toast({ id, message, type = 'success', duration = 4000, onClose }) {
    const config = toastConfig[type] || toastConfig.success;
    const Icon = config.icon;

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${config.bgClass} rounded-2xl shadow-2xl overflow-hidden min-w-[320px] max-w-md`}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className={`${config.iconBg} p-2 rounded-xl flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-white font-medium leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={() => onClose(id)}
                        className="flex-shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
                className={`h-1 ${config.progressClass}`}
            />
        </motion.div>
    );
}

// Toast Provider Component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();

        setToasts(prev => [...prev, { id, message, type, duration }]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Convenience methods
    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <Toast
                            key={t.id}
                            id={t.id}
                            message={t.message}
                            type={t.type}
                            duration={t.duration}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastContext;
