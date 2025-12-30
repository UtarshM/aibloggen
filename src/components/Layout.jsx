/**
 * Layout Component - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * Clean sidebar navigation with smooth animations
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Menu, X, FileText,
    ChevronLeft, DollarSign,
    User, Settings, LogOut, HelpCircle, History,
    Sparkles, LayoutDashboard
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { usePlan } from '../context/PlanContext'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api')

// Navigation items - Multi-color scheme for visual variety
const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'primary' },
    { name: 'Content Creation', path: '/tools/content-creation', icon: FileText, color: 'primary' },
    { name: 'Job History', path: '/tools/job-history', icon: History, color: 'secondary' },
]

const bottomNavItems = [
    { name: 'Pricing', path: '/pricing', icon: DollarSign, color: 'accent' },
    { name: 'Settings', path: '/settings', icon: Settings, color: 'primary' },
]

// Color mapping for icons
const colorMap = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-500', activeBg: 'bg-primary-100', activeText: 'text-primary-600' },
    secondary: { bg: 'bg-secondary-50', text: 'text-secondary-500', activeBg: 'bg-secondary-100', activeText: 'text-secondary-600' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-500', activeBg: 'bg-accent-100', activeText: 'text-accent-600' },
    success: { bg: 'bg-success-50', text: 'text-success-500', activeBg: 'bg-success-100', activeText: 'text-success-600' },
}

// Animation variants
const sidebarItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 4, transition: { duration: 0.2 } }
}

const dropdownVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }
}

export default function Layout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const toast = useToast()
    const { currentPlan } = usePlan()
    const dropdownRef = useRef(null)

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [userName, setUserName] = useState('User')
    const [userInitials, setUserInitials] = useState('U')
    const [userProfileImage, setUserProfileImage] = useState(null)

    useEffect(() => {
        loadUserData()
        window.addEventListener('profileUpdated', loadUserData)
        return () => window.removeEventListener('profileUpdated', loadUserData)
    }, [])

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) { navigate('/login'); return }
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.data) {
                const firstName = response.data.profile?.firstName || response.data.name?.split(' ')[0] || 'User'
                const lastName = response.data.profile?.lastName || response.data.name?.split(' ')[1] || ''
                setUserName(`${firstName} ${lastName}`.trim())
                setUserInitials(`${firstName[0]}${lastName[0] || ''}`.toUpperCase())
                setUserProfileImage(response.data.profile?.profileImage || null)
            }
        } catch (error) {
            if (error.response && [403, 401, 404].includes(error.response.status)) {
                localStorage.clear()
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setProfileDropdownOpen(false)
        toast.success('Logged out successfully')
        navigate('/login')
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 256 : 80 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-sm z-40 hidden lg:flex flex-col"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-button"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-xl font-bold text-gray-900"
                            >
                                Scalezix
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <div className="space-y-1">
                        {navItems.map((item, index) => {
                            const Icon = item.icon
                            const active = isActive(item.path)
                            const colors = colorMap[item.color]
                            return (
                                <motion.div
                                    key={item.path}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                    variants={sidebarItemVariants}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                                            ? `${colors.activeBg} ${colors.activeText}`
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${active ? colors.activeBg : colors.bg
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${active ? colors.activeText : colors.text}`} />
                                        </motion.div>
                                        <AnimatePresence>
                                            {sidebarOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-sm font-medium"
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 p-3">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)
                        const colors = colorMap[item.color]
                        return (
                            <motion.div key={item.path} whileHover={{ x: 4 }}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                                        ? `${colors.activeBg} ${colors.activeText}`
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? colors.activeBg : colors.bg
                                        }`}>
                                        <Icon className={`w-5 h-5 ${active ? colors.activeText : colors.text}`} />
                                    </div>
                                    <AnimatePresence>
                                        {sidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-sm font-medium"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </motion.div>
                        )
                    })}

                    {/* Logout */}
                    <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-1"
                    >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-50">
                            <LogOut className="w-5 h-5 text-gray-500" />
                        </div>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-sm font-medium"
                                >
                                    Log Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Collapse Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-colors"
                >
                    <motion.div
                        animate={{ rotate: sidebarOpen ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                    </motion.div>
                </motion.button>
            </motion.aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </motion.button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Scalezix</span>
                    </div>
                </div>

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center gap-2"
                    >
                        {userProfileImage ? (
                            <img src={userProfileImage} alt={userName} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-100" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-medium text-sm">
                                {userInitials}
                            </div>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {profileDropdownOpen && (
                            <motion.div
                                variants={dropdownVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-dropdown overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                                    <p className="font-medium text-gray-900">{userName}</p>
                                    <p className="text-xs text-primary-600 capitalize">{currentPlan} Plan</p>
                                </div>
                                <div className="py-1">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                        <User className="w-4 h-4 text-primary-500" />
                                        <span>Profile</span>
                                    </Link>
                                    <Link to="/settings" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                        <Settings className="w-4 h-4 text-primary-500" />
                                        <span>Settings</span>
                                    </Link>
                                    <div className="border-t border-gray-100 my-1" />
                                    <button onClick={handleLogout} className="dropdown-item w-full text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-white z-50 flex flex-col shadow-xl"
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900">Scalezix</span>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </motion.button>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="flex-1 overflow-y-auto py-4 px-3">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon
                                    const active = isActive(item.path)
                                    return (
                                        <motion.div
                                            key={item.path}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                to={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? 'bg-primary-100' : 'bg-primary-50'
                                                    }`}>
                                                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-primary-500'}`} />
                                                </div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </nav>

                            {/* Mobile Bottom */}
                            <div className="border-t border-gray-100 p-3">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                                >
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">Log Out</span>
                                </motion.button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarOpen ? 256 : 80 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:block"
            >
                {/* Top Header - Desktop */}
                <header className="flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {getGreeting()}, <span className="text-primary-500">{userName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </motion.div>

                    {/* Profile Section */}
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                {userProfileImage ? (
                                    <img src={userProfileImage} alt={userName} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-medium shadow-sm">
                                        {userInitials}
                                    </div>
                                )}
                                <div className="text-left hidden xl:block">
                                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                                    <p className="text-xs text-primary-500 capitalize">{currentPlan} Plan</p>
                                </div>
                            </motion.button>

                            <AnimatePresence>
                                {profileDropdownOpen && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-dropdown overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                                            <p className="font-medium text-gray-900">{userName}</p>
                                            <p className="text-xs text-primary-600 capitalize">{currentPlan} Plan</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                                <User className="w-4 h-4 text-primary-500" />
                                                <span>Profile</span>
                                            </Link>
                                            <Link to="/settings" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                                <Settings className="w-4 h-4 text-primary-500" />
                                                <span>Settings</span>
                                            </Link>
                                            <Link to="/policies" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                                                <HelpCircle className="w-4 h-4 text-primary-500" />
                                                <span>Help & Policies</span>
                                            </Link>
                                            <div className="border-t border-gray-100 my-1" />
                                            <button onClick={handleLogout} className="dropdown-item w-full text-red-600 hover:bg-red-50">
                                                <LogOut className="w-4 h-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                >
                    {children}
                </motion.div>
            </motion.main>

            {/* Mobile Main Content */}
            <main className="lg:hidden pt-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}
