/**
 * Modal Component - MacBook Style
 * Beautiful animated modals with bounce effect
 * Replaces all confirm() and prompt() calls
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

const ModalContext = createContext(null);

// Animation variants
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 10,
        transition: {
            duration: 0.2,
        }
    }
};

// Modal types configuration
const modalConfig = {
    confirm: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        confirmBtn: 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600',
    },
    danger: {
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        confirmBtn: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
    },
    success: {
        icon: CheckCircle,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        confirmBtn: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    },
    info: {
        icon: Info,
        iconBg: 'bg-primary-100',
        iconColor: 'text-primary-600',
        confirmBtn: 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600',
    },
    prompt: {
        icon: HelpCircle,
        iconBg: 'bg-primary-100',
        iconColor: 'text-primary-600',
        confirmBtn: 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600',
    },
};

// Modal Component
function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'confirm',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true,
    inputValue,
    onInputChange,
    inputPlaceholder,
}) {
    const config = modalConfig[type] || modalConfig.confirm;
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start gap-4">
                                <div className={`${config.iconBg} p-3 rounded-2xl flex-shrink-0`}>
                                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                    <p className="text-gray-600 mt-1">{message}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Input for prompt type */}
                            {type === 'prompt' && (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => onInputChange(e.target.value)}
                                        placeholder={inputPlaceholder}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3 justify-end">
                            {showCancel && (
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className={`px-5 py-2.5 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${config.confirmBtn}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Modal Provider
export function ModalProvider({ children }) {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'confirm',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        showCancel: true,
        inputValue: '',
        inputPlaceholder: '',
        resolve: null,
    });

    const showModal = useCallback((options) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                title: options.title || 'Confirm',
                message: options.message || 'Are you sure?',
                type: options.type || 'confirm',
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                showCancel: options.showCancel !== false,
                inputValue: options.defaultValue || '',
                inputPlaceholder: options.placeholder || '',
                resolve,
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        if (modalState.resolve) {
            modalState.resolve(modalState.type === 'prompt' ? null : false);
        }
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, [modalState.resolve, modalState.type]);

    const handleConfirm = useCallback(() => {
        if (modalState.resolve) {
            modalState.resolve(modalState.type === 'prompt' ? modalState.inputValue : true);
        }
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, [modalState.resolve, modalState.type, modalState.inputValue]);

    const handleInputChange = useCallback((value) => {
        setModalState(prev => ({ ...prev, inputValue: value }));
    }, []);

    // Convenience methods
    const modal = {
        confirm: (title, message, options = {}) => showModal({
            title,
            message,
            type: 'confirm',
            ...options
        }),
        danger: (title, message, options = {}) => showModal({
            title,
            message,
            type: 'danger',
            confirmText: 'Delete',
            ...options
        }),
        success: (title, message, options = {}) => showModal({
            title,
            message,
            type: 'success',
            showCancel: false,
            confirmText: 'OK',
            ...options
        }),
        info: (title, message, options = {}) => showModal({
            title,
            message,
            type: 'info',
            showCancel: false,
            confirmText: 'Got it',
            ...options
        }),
        prompt: (title, message, options = {}) => showModal({
            title,
            message,
            type: 'prompt',
            confirmText: 'Submit',
            ...options
        }),
    };

    return (
        <ModalContext.Provider value={modal}>
            {children}
            <Modal
                isOpen={modalState.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                showCancel={modalState.showCancel}
                inputValue={modalState.inputValue}
                onInputChange={handleInputChange}
                inputPlaceholder={modalState.inputPlaceholder}
            />
        </ModalContext.Provider>
    );
}

// Hook to use modal
export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export default Modal;
