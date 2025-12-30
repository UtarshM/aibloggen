/**
 * AI Marketing Platform - Settings Page
 * MacBook-style UI/UX with Primary Color #52b2bf
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Key, Mail, Smartphone, Download, Upload, Trash2, Zap, Volume2, Monitor, Save, CheckCircle, Copy } from 'lucide-react'
import { usePlan } from '../context/PlanContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'

export default function Settings() {
    const { currentPlan } = usePlan()
    const [activeTab, setActiveTab] = useState('general')
    const [saveStatus, setSaveStatus] = useState('')
    const [apiKeyCopied, setApiKeyCopied] = useState(false)
    const toast = useToast()
    const modal = useModal()

    const [settings, setSettings] = useState({
        // General Settings
        language: 'English',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12-hour',
        currency: 'INR',

        // Appearance
        colorScheme: 'blue',
        fontSize: 'medium',
        compactMode: false,
        animations: true,

        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        desktopNotifications: true,
        soundEnabled: true,
        notifyOnNewClient: true,
        notifyOnContentComplete: true,
        notifyOnReportReady: true,
        weeklyDigest: true,
        monthlyReport: true,

        // Privacy & Security
        twoFactorAuth: false,
        sessionTimeout: 30,
        loginAlerts: true,
        dataEncryption: true,
        activityLog: true,
        ipWhitelist: false,

        // Data & Storage
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: 90,
        exportFormat: 'PDF',

        // API & Integrations
        apiAccess: true,
        webhooksEnabled: false,
        rateLimitPerHour: 1000,

        // Performance
        cacheEnabled: true,
        lazyLoading: true,
        imageOptimization: true,
        offlineMode: false
    })

    // Load settings from localStorage on mount ONCE
    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings')
        if (savedSettings) {
            const loaded = JSON.parse(savedSettings)
            setSettings(loaded)
        }

        // FORCE light mode
        document.documentElement.classList.remove('dark')
        document.body.style.backgroundColor = '#f9fafb'
        document.body.style.color = '#111827'
    }, [])

    // Apply font size in real-time
    useEffect(() => {
        const sizes = { small: '14px', medium: '16px', large: '18px' }
        const newSize = sizes[settings.fontSize.toLowerCase()] || '16px'
        document.documentElement.style.fontSize = newSize
        console.log(`📏 FONT SIZE CHANGED TO: ${newSize}`)
    }, [settings.fontSize])

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings))

        // Show success message
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 3000)

        // Show browser notification if enabled
        if (settings.desktopNotifications && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Settings Saved', {
                    body: 'Your preferences have been updated successfully.',
                    icon: '/favicon.ico'
                })
            }
        }
    }

    const handleExportData = () => {
        const dataStr = JSON.stringify(settings, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`
        link.click()
        toast.success('Settings exported successfully!')
    }

    const handleImportData = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result)
                setSettings(imported)
                toast.success('Settings imported successfully!')
            } catch (error) {
                toast.error('Error importing settings. Please check the file format.')
            }
        }
        reader.readAsText(file)
    }

    const handleDeleteAllData = async () => {
        const confirmed = await modal.danger('Delete All Data', 'Are you sure you want to delete all data? This action cannot be undone.', { confirmText: 'Delete All' })
        if (!confirmed) return

        const finalConfirm = await modal.danger('Final Confirmation', 'This will permanently delete all your data!', { confirmText: 'Yes, Delete Everything' })
        if (!finalConfirm) return

        localStorage.clear()
        toast.success('All data has been deleted.')
        window.location.reload()
    }

    const copyApiKey = () => {
        navigator.clipboard.writeText('your-api-key-here')
        setApiKeyCopied(true)
        setTimeout(() => setApiKeyCopied(false), 2000)
    }

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                toast.success('Notification permission granted!')
            }
        }
    }

    const toggleSetting = (key) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: !prev[key] }
            const newValue = !prev[key]
            console.log(`✅ Toggled ${key}:`, newValue)

            // Show visual feedback
            const toast = document.createElement('div')
            toast.className = 'fixed top-4 right-4 bg-primary-400 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            toast.innerHTML = `✅ ${key}: ${newValue ? 'ON' : 'OFF'}`
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 2000)

            return newSettings
        })
    }

    const updateSetting = (key, value) => {
        console.log(`🔧 Settings: updateSetting called with ${key}:`, value)

        // If theme is being updated, apply DIRECTLY to DOM first
        if (key === 'theme') {
            console.log(`🎨 Settings: Applying theme DIRECTLY to DOM:`, value)

            const html = document.documentElement
            const body = document.body

            // FORCE apply theme to DOM immediately
            if (value === 'light') {
                html.classList.remove('dark')
                body.style.backgroundColor = '#f9fafb'
                body.style.color = '#111827'
                // console.log('☀️ LIGHT MODE FORCED ON DOM')
                console.log('HTML has dark class:', html.classList.contains('dark'))
            } else if (value === 'dark') {
                html.classList.add('dark')
                body.style.backgroundColor = '#1a1a1a'
                body.style.color = '#ffffff'
                console.log('🌙 DARK MODE FORCED ON DOM')
                console.log('HTML has dark class:', html.classList.contains('dark'))
            }

            // Save to localStorage immediately
            localStorage.setItem('appTheme', value)

            // Then update context
            setGlobalTheme(value)
        }

        setSettings(prev => {
            const newSettings = { ...prev, [key]: value }
            console.log(`✅ Settings: Updated ${key}:`, value)

            // Show visual feedback
            const toast = document.createElement('div')
            toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce'
            toast.innerHTML = `✅ ${key} changed to: ${value}`
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 2000)

            return newSettings
        })
    }

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'data', label: 'Data & Storage', icon: Database },
        { id: 'api', label: 'API', icon: Key },
        { id: 'performance', label: 'Performance', icon: Zap }
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and configurations</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border p-2 sticky top-4">
                        {tabs.map(tab => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-500 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border p-8">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">General Settings</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => updateSetting('language', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => updateSetting('timezone', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                            <option value="America/New_York">America/New York (EST)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                            <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                            <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
                                        <select
                                            value={settings.dateFormat}
                                            onChange={(e) => updateSetting('dateFormat', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Preview: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time Format</label>
                                        <select
                                            value={settings.timeFormat}
                                            onChange={(e) => updateSetting('timeFormat', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="12-hour">12-hour</option>
                                            <option value="24-hour">24-hour</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Preview: {new Date().toLocaleTimeString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => updateSetting('currency', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="INR">INR - ₹ (Indian Rupee)</option>
                                            <option value="USD">USD - $ (US Dollar)</option>
                                            <option value="EUR">EUR - € (Euro)</option>
                                            <option value="GBP">GBP - £ (British Pound)</option>
                                            <option value="JPY">JPY - ¥ (Japanese Yen)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Appearance</h2>

                                <div className="space-y-6">
                                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-900 font-semibold">
                                            ☀️ Light Mode Active
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">
                                            The application is set to light mode for optimal visibility.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Color Scheme</label>
                                        <div className="flex gap-4">
                                            {[
                                                { name: 'blue', color: 'bg-primary-400' },
                                                { name: 'purple', color: 'bg-primary-400' },
                                                { name: 'green', color: 'bg-green-600' },
                                                { name: 'orange', color: 'bg-orange-600' }
                                            ].map(({ name, color }) => (
                                                <button
                                                    key={name}
                                                    onClick={() => updateSetting('colorScheme', name)}
                                                    className={`w-14 h-14 rounded-full ${color} transition-all hover:scale-110 ${settings.colorScheme === name ? 'ring-4 ring-offset-2 ring-primary-400 scale-110' : ''
                                                        }`}
                                                    title={name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size</label>
                                        <select
                                            value={settings.fontSize}
                                            onChange={(e) => updateSetting('fontSize', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option value="Small">Small (14px)</option>
                                            <option value="Medium">Medium (16px)</option>
                                            <option value="Large">Large (18px)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold">Compact Mode</p>
                                            <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('compactMode')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.compactMode ? 'bg-primary-400' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.compactMode ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold">Animations</p>
                                            <p className="text-sm text-gray-600">Enable smooth transitions</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('animations')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.animations ? 'bg-primary-400' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.animations ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Notifications</h2>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
                                        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text message alerts', icon: Smartphone },
                                        { key: 'desktopNotifications', label: 'Desktop Notifications', desc: 'System notifications', icon: Monitor },
                                        { key: 'soundEnabled', label: 'Sound', desc: 'Play sound for notifications', icon: Volume2 },
                                        { key: 'notifyOnNewClient', label: 'New Client', desc: 'Alert when new client signs up', icon: Bell },
                                        { key: 'notifyOnContentComplete', label: 'Content Complete', desc: 'Alert when content generation finishes', icon: Bell },
                                        { key: 'notifyOnReportReady', label: 'Report Ready', desc: 'Alert when report is generated', icon: Bell },
                                        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of weekly activity', icon: Mail },
                                        { key: 'monthlyReport', label: 'Monthly Report', desc: 'Detailed monthly analytics', icon: Mail }
                                    ].map(item => {
                                        const Icon = item.icon
                                        return (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Icon className="text-gray-600" size={20} />
                                                    <div>
                                                        <p className="font-semibold">{item.label}</p>
                                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleSetting(item.key)}
                                                    className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings[item.key] ? 'bg-primary-400' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings[item.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Shield className="text-green-600" size={20} />
                                            <div>
                                                <p className="font-semibold">Two-Factor Authentication</p>
                                                <p className="text-sm text-gray-600">Add extra security layer</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('twoFactorAuth')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
                                        <input
                                            type="number"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        />
                                    </div>

                                    {[
                                        { key: 'loginAlerts', label: 'Login Alerts', desc: 'Notify on new device login' },
                                        { key: 'dataEncryption', label: 'Data Encryption', desc: 'Encrypt sensitive data' },
                                        { key: 'activityLog', label: 'Activity Log', desc: 'Track account activity' },
                                        { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access by IP' }
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-semibold">{item.label}</p>
                                                <p className="text-sm text-gray-600">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting(item.key)}
                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings[item.key] ? 'bg-primary-400' : 'bg-gray-300'}`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings[item.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}

                                    <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                        Change Password
                                    </button>

                                    {/* Delete Account Section */}
                                    <div className="mt-8 pt-6 border-t border-red-200">
                                        <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Danger Zone</h3>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-sm text-red-800 mb-4">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    const confirmed = await modal.danger('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', { confirmText: 'Delete Account' })
                                                    if (!confirmed) return;

                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const API_URL = (import.meta.env.VITE_API_URL ||
                                                            (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api')).replace('/api', '');

                                                        // First check if user is Google OAuth user
                                                        const typeResponse = await fetch(`${API_URL}/api/auth/account-type`, {
                                                            headers: { 'Authorization': `Bearer ${token}` }
                                                        });
                                                        const typeData = await typeResponse.json();

                                                        let deleteBody = {};

                                                        if (typeData.isGoogleUser) {
                                                            // Google user - ask to type DELETE
                                                            const confirmText = await modal.prompt('Confirm Deletion', 'You signed in with Google. Type "DELETE" to confirm account deletion:', { placeholder: 'Type DELETE' });
                                                            if (confirmText !== 'DELETE') {
                                                                toast.error('You must type DELETE exactly to confirm.');
                                                                return;
                                                            }
                                                            deleteBody = { confirmText };
                                                        } else {
                                                            // Email/password user - ask for password
                                                            const password = await modal.prompt('Confirm Deletion', 'Enter your password to confirm deletion:', { placeholder: 'Your password' });
                                                            if (!password) return;
                                                            deleteBody = { password };
                                                        }

                                                        const response = await fetch(`${API_URL}/api/auth/delete-account`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify(deleteBody)
                                                        });

                                                        const data = await response.json();

                                                        if (response.ok) {
                                                            toast.success('Account deleted successfully');
                                                            localStorage.clear();
                                                            window.location.href = '/';
                                                        } else {
                                                            toast.error(data.error || 'Failed to delete account');
                                                        }
                                                    } catch (error) {
                                                        toast.error('Error deleting account. Please try again.');
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                                            >
                                                <Trash2 size={20} /> Delete My Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data & Storage */}
                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Data & Storage</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Database className="text-primary-500" size={20} />
                                            <div>
                                                <p className="font-semibold">Auto Backup</p>
                                                <p className="text-sm text-gray-600">Automatic data backup</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('autoBackup')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.autoBackup ? 'bg-primary-400' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.autoBackup ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Backup Frequency</label>
                                        <select
                                            value={settings.backupFrequency}
                                            onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option>daily</option>
                                            <option>weekly</option>
                                            <option>monthly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Data Retention (days)</label>
                                        <input
                                            type="number"
                                            value={settings.dataRetention}
                                            onChange={(e) => updateSetting('dataRetention', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
                                        <select
                                            value={settings.exportFormat}
                                            onChange={(e) => updateSetting('exportFormat', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        >
                                            <option>PDF</option>
                                            <option>CSV</option>
                                            <option>Excel</option>
                                            <option>JSON</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleExportData}
                                            className="flex items-center justify-center gap-2 bg-primary-400 text-white py-3 rounded-lg font-semibold hover:bg-primary-500 transition-all hover:shadow-lg"
                                        >
                                            <Download size={20} /> Export Data
                                        </button>
                                        <label className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all hover:shadow-lg cursor-pointer">
                                            <Upload size={20} /> Import Data
                                            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                                        </label>
                                    </div>

                                    <button
                                        onClick={handleDeleteAllData}
                                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all hover:shadow-lg"
                                    >
                                        <Trash2 size={20} /> Delete All Data
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* API Settings */}
                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">API & Integrations</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold">API Access</p>
                                            <p className="text-sm text-gray-600">Enable API endpoints</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('apiAccess')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.apiAccess ? 'bg-primary-400' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.apiAccess ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold">Webhooks</p>
                                            <p className="text-sm text-gray-600">Enable webhook notifications</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('webhooksEnabled')}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings.webhooksEnabled ? 'bg-primary-400' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.webhooksEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rate Limit (per hour)</label>
                                        <input
                                            type="number"
                                            value={settings.rateLimitPerHour}
                                            onChange={(e) => updateSetting('rateLimitPerHour', e.target.value)}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white text-gray-900"
                                        />
                                    </div>

                                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                                        <p className="font-semibold text-blue-900 mb-2">API Key</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="password"
                                                value="your-api-key-here"
                                                readOnly
                                                className="flex-1 px-4 py-2 border rounded-lg bg-white font-mono text-sm text-gray-900"
                                            />
                                            <button
                                                onClick={copyApiKey}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${apiKeyCopied
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-primary-400 text-white hover:bg-primary-500'
                                                    }`}
                                            >
                                                {apiKeyCopied ? (
                                                    <><CheckCircle size={18} /> Copied!</>
                                                ) : (
                                                    <><Copy size={18} /> Copy</>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Keep your API key secure. Never share it publicly.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Settings */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-6">Performance</h2>

                                <div className="space-y-4">
                                    {[
                                        { key: 'cacheEnabled', label: 'Cache', desc: 'Enable caching for faster load times' },
                                        { key: 'lazyLoading', label: 'Lazy Loading', desc: 'Load content as needed' },
                                        { key: 'imageOptimization', label: 'Image Optimization', desc: 'Compress images automatically' },
                                        { key: 'offlineMode', label: 'Offline Mode', desc: 'Work without internet connection' }
                                    ].map(item => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-semibold">{item.label}</p>
                                                <p className="text-sm text-gray-600">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting(item.key)}
                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${settings[item.key] ? 'bg-primary-400' : 'bg-gray-300'}`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings[item.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t">
                            {saveStatus === 'success' && (
                                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                    <CheckCircle className="text-green-600" size={24} />
                                    <div>
                                        <p className="font-semibold text-green-900">Settings Saved!</p>
                                        <p className="text-sm text-green-700">Your preferences have been updated successfully.</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleSave}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${saveStatus === 'success'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gradient-to-r from-primary-400 to-primary-500 text-white hover:shadow-lg'
                                    }`}
                            >
                                {saveStatus === 'success' ? (
                                    <><CheckCircle size={24} /> Saved Successfully!</>
                                ) : (
                                    <><Save size={24} /> Save All Settings</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
