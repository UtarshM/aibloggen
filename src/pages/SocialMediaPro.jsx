/**
 * Professional Social Media Management System
 * Real OAuth, Mandatory Media, Complete Scheduling
 * MacBook-style UI/UX with Primary Color #52b2bf
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { Twitter, Instagram, Facebook, Calendar, Clock, Image as ImageIcon, Video, Send, Trash2, CheckCircle, XCircle, Loader2, Edit, Eye, Upload, X as CloseIcon } from 'lucide-react'
import { api } from '../api/client'
import Toast from '../components/Toast'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'

export default function SocialMediaPro() {
    // State Management
    const [connectedAccounts, setConnectedAccounts] = useState([])
    const [postContent, setPostContent] = useState('')
    const [mediaFile, setMediaFile] = useState(null)
    const [mediaPreview, setMediaPreview] = useState(null)
    const [mediaType, setMediaType] = useState(null) // 'image' or 'video'
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('')
    const [scheduledPosts, setScheduledPosts] = useState([])
    const [toast, setToast] = useState(null)
    const [loading, setLoading] = useState(false)
    const globalToast = useToast()
    const modal = useModal()

    const [uploadProgress, setUploadProgress] = useState(0)
    const [showAIGenerator, setShowAIGenerator] = useState(false)
    const [aiGenerating, setAiGenerating] = useState(false)
    const [aiConfig, setAiConfig] = useState({
        topic: '',
        length: 'medium',
        customHashtags: '',
        need_hashtags: true,
        need_image: true
    })
    const [generatedContent, setGeneratedContent] = useState(null)
    const [selectedAIImages, setSelectedAIImages] = useState([]) // Multiple AI images
    const [aiImageUrl, setAiImageUrl] = useState(null) // For URL-based images

    // LinkedIn icon component
    const LinkedInIcon = ({ size = 24, className = '' }) => (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    )

    const platforms = [
        {
            id: 'twitter',
            name: 'Twitter/X',
            icon: Twitter,
            color: 'bg-black',
            textColor: 'text-white',
            supports: ['image', 'video', 'text']
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
            textColor: 'text-white',
            supports: ['image', 'video']
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600',
            textColor: 'text-white',
            supports: ['image', 'video', 'text']
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: LinkedInIcon,
            color: 'bg-blue-700',
            textColor: 'text-white',
            supports: ['image', 'video', 'text']
        }
    ]

    useEffect(() => {
        loadConnectedAccounts()
        loadScheduledPosts()
    }, [])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const loadConnectedAccounts = async () => {
        try {
            const accounts = await api.getConnectedAccounts()
            setConnectedAccounts(Array.isArray(accounts) ? accounts : [])
        } catch (error) {
            console.error('Error loading accounts:', error)
            setConnectedAccounts([])
        }
    }

    const loadScheduledPosts = async () => {
        try {
            const posts = await api.getScheduledPosts()
            setScheduledPosts(Array.isArray(posts) ? posts : [])
        } catch (error) {
            console.error('Error loading posts:', error)
            setScheduledPosts([])
        }
    }

    const handleConnectAccount = async (platform) => {
        setLoading(true)
        try {
            // Get OAuth URL from backend
            const response = await api.get(`/social/${platform.id}/connect`)
            const { authUrl } = response.data

            // Open OAuth popup
            const width = 600
            const height = 700
            const left = window.screen.width / 2 - width / 2
            const top = window.screen.height / 2 - height / 2

            const popup = window.open(
                authUrl,
                `Connect ${platform.name}`,
                `width=${width},height=${height},left=${left},top=${top}`
            )

            // Listen for OAuth callback
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup)
                    setLoading(false)
                    // Reload accounts after popup closes
                    loadConnectedAccounts()
                }
            }, 500)

            // Listen for success message from callback
            window.addEventListener('message', (event) => {
                if (event.data.type === 'oauth-success') {
                    showToast(`✅ ${platform.name} connected!`, 'success')
                    popup.close()
                    loadConnectedAccounts()
                } else if (event.data.type === 'oauth-error') {
                    showToast(`Failed to connect ${platform.name}`, 'error')
                    popup.close()
                }
            })
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Failed to initiate connection'

            // Check if it's a configuration error
            if (error.response?.data?.needsConfig) {
                showToast(`⚠️ ${errorMsg}`, 'warning')
            } else {
                showToast(errorMsg, 'error')
            }
            setLoading(false)
        }
    }

    const disconnectAccount = async (accountId) => {
        const confirmed = await modal.confirm('Disconnect Account', 'Are you sure you want to disconnect this account?')
        if (!confirmed) return

        try {
            await api.disconnectSocialAccount(accountId)
            showToast('Account disconnected', 'success')
            loadConnectedAccounts()
        } catch (error) {
            showToast('Failed to disconnect', 'error')
        }
    }

    const togglePlatform = (platformId) => {
        setSelectedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        )
    }

    const handleMediaUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')

        if (!isImage && !isVideo) {
            showToast('Please upload an image or video file', 'error')
            return
        }

        // Validate file size
        const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for image
        if (file.size > maxSize) {
            showToast(`File too large. Max size: ${isVideo ? '100MB' : '10MB'}`, 'error')
            return
        }

        setMediaFile(file)
        setMediaType(isVideo ? 'video' : 'image')

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setMediaPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const removeMedia = () => {
        setMediaFile(null)
        setMediaPreview(null)
        setMediaType(null)
        setAiImageUrl(null)
        setSelectedAIImages([])
    }

    const validatePost = () => {
        if (!postContent.trim()) {
            showToast('Please enter post content', 'warning')
            return false
        }

        // Accept either uploaded file OR AI-selected images
        if (!mediaFile && !aiImageUrl && selectedAIImages.length === 0) {
            showToast('⚠️ Media (image/video) is required!', 'error')
            return false
        }

        if (selectedPlatforms.length === 0) {
            showToast('Please select at least one platform', 'warning')
            return false
        }

        // Check if selected platforms support the media type
        const currentMediaType = mediaType || 'image'
        for (const platformId of selectedPlatforms) {
            const platform = platforms.find(p => p.id === platformId)
            if (!platform.supports.includes(currentMediaType)) {
                showToast(`${platform.name} doesn't support ${currentMediaType}s`, 'error')
                return false
            }
        }

        return true
    }

    // Check if media is available (file or AI image)
    const hasMedia = () => {
        return mediaFile || aiImageUrl || selectedAIImages.length > 0
    }

    const schedulePost = async () => {
        if (!validatePost()) return

        // Validate schedule date/time
        if (!scheduleDate || !scheduleTime) {
            showToast('⚠️ Please select date and time for scheduling', 'warning')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('content', postContent)
            formData.append('platforms', JSON.stringify(selectedPlatforms))
            formData.append('scheduleDate', scheduleDate)
            formData.append('scheduleTime', scheduleTime)

            // Handle media - either file upload or AI images
            if (mediaFile) {
                formData.append('media', mediaFile)
                formData.append('mediaType', mediaType)
            } else if (selectedAIImages.length > 0) {
                // Send AI image URLs
                formData.append('aiImages', JSON.stringify(selectedAIImages.map(img => img.url)))
                formData.append('mediaType', 'image')
            } else if (aiImageUrl) {
                formData.append('aiImageUrl', aiImageUrl)
                formData.append('mediaType', 'image')
            }

            await api.post('/social/posts/schedule', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            showToast('✅ Post scheduled successfully!', 'success')

            // Reset form
            resetForm()
            setSelectedAIImages([])
            setAiImageUrl(null)
            loadScheduledPosts()
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to schedule', 'error')
        } finally {
            setLoading(false)
        }
    }

    const postNow = async () => {
        if (!validatePost()) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('content', postContent)
            formData.append('platforms', JSON.stringify(selectedPlatforms))

            // Handle media - either file upload or AI images
            if (mediaFile) {
                formData.append('media', mediaFile)
                formData.append('mediaType', mediaType)
            } else if (selectedAIImages.length > 0) {
                // Send AI image URLs
                formData.append('aiImages', JSON.stringify(selectedAIImages.map(img => img.url)))
                formData.append('mediaType', 'image')
            } else if (aiImageUrl) {
                formData.append('aiImageUrl', aiImageUrl)
                formData.append('mediaType', 'image')
            }

            const result = await api.post('/social/posts/publish', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (result.data.success) {
                showToast('✅ Posted successfully to all platforms!', 'success')
            } else {
                const failed = result.data.results?.filter(r => !r.success) || []
                if (failed.length > 0) {
                    showToast(`⚠️ Posted but some failed: ${failed.map(f => f.platform).join(', ')}`, 'warning')
                } else {
                    showToast('✅ Post submitted!', 'success')
                }
            }

            // Reset form
            resetForm()
            setSelectedAIImages([])
            setAiImageUrl(null)
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to post', 'error')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setPostContent('')
        setMediaFile(null)
        setMediaPreview(null)
        setMediaType(null)
        setSelectedPlatforms([])
        setScheduleDate('')
        setScheduleTime('')
    }

    const deleteScheduledPost = async (postId) => {
        const confirmed = await modal.danger('Delete Post', 'Delete this scheduled post?', { confirmText: 'Delete' })
        if (!confirmed) return

        try {
            await api.deleteScheduledPost(postId)
            showToast('Post deleted', 'success')
            loadScheduledPosts()
        } catch (error) {
            showToast('Failed to delete', 'error')
        }
    }

    const isAccountConnected = (platformId) => {
        return connectedAccounts.some(acc => acc.platform === platformId && acc.connected)
    }

    const handleAIGenerate = async () => {
        if (!aiConfig.topic.trim()) {
            showToast('Please enter a topic', 'warning')
            return
        }

        setAiGenerating(true)
        setGeneratedContent(null)

        try {
            const config = {
                topic: aiConfig.topic,
                length: aiConfig.length,
                customHashtags: aiConfig.customHashtags,
                need_hashtags: aiConfig.need_hashtags,
                need_image: aiConfig.need_image,
                platforms: ['instagram', 'facebook', 'linkedin', 'twitter']
            }

            const result = await api.generateSocialContent(config)
            setGeneratedContent(result)
            showToast('✅ Content, Images & Hashtags Generated!', 'success')
        } catch (error) {
            console.error('AI Generation Error:', error)
            showToast(error.message || 'Failed to generate content', 'error')
        } finally {
            setAiGenerating(false)
        }
    }

    const useGeneratedCaption = (platform, length) => {
        if (generatedContent && generatedContent.captions[platform]) {
            setPostContent(generatedContent.captions[platform][length])

            // Auto-select first image if no images selected yet
            if (selectedAIImages.length === 0 && generatedContent.images && generatedContent.images.length > 0) {
                const firstImage = generatedContent.images[0]
                setSelectedAIImages([firstImage])
                setAiImageUrl(firstImage.url)
                setMediaType('image')
                showToast(`✅ Caption applied! First image auto-selected. Select more images or click "Save & Close"`, 'success')
            } else {
                showToast(`✅ Caption applied for ${platform}! Click "Save & Close" when ready.`, 'success')
            }
            // DON'T close the popup - let user continue selecting
        }
    }

    const saveAndCloseGenerator = () => {
        if (!postContent && !selectedAIImages.length) {
            showToast('Please select a caption and images first', 'warning')
            return
        }
        setShowAIGenerator(false)
        showToast('✅ Content saved! Now select platforms and post.', 'success')
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Social Media Management</h1>
                <p className="text-gray-600">Connect accounts, create posts with media, and schedule for optimal engagement</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Connected Accounts */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>

                        <div className="space-y-3">
                            {platforms.map(platform => {
                                const Icon = platform.icon
                                const connected = isAccountConnected(platform.id)
                                const account = connectedAccounts.find(acc => acc.platform === platform.id)

                                return (
                                    <div key={platform.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 ${platform.color} rounded-xl`}>
                                                <Icon size={24} className={platform.textColor} />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{platform.name}</p>
                                                {connected && account && (
                                                    <p className="text-xs text-gray-500">@{account.username}</p>
                                                )}
                                                {!connected && (
                                                    <p className="text-xs text-gray-400">Not connected</p>
                                                )}
                                            </div>
                                        </div>

                                        {connected ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={18} className="text-green-500" />
                                                <button
                                                    onClick={() => disconnectAccount(account._id)}
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Disconnect
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleConnectAccount(platform)}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
                                            >
                                                Connect
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 font-medium mb-2">📱 Real Social Media Posting</p>
                            <p className="text-xs text-blue-700 mb-2">
                                Connect your accounts to post directly to Twitter, Instagram, and Facebook.
                                All posts require media (image or video).
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                                ⚠️ To connect accounts, add API keys to server/.env file first.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Create Post */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Create Post Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Create Post</h2>
                            <button
                                onClick={() => setShowAIGenerator(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                AI Content Generator
                            </button>
                        </div>

                        {/* Post Content */}
                        <textarea
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                            placeholder="What's on your mind? Share your thoughts..."
                            className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                            maxLength={280}
                        />
                        <div className="text-right text-sm text-gray-500 mt-1">
                            {postContent.length}/280 characters
                        </div>

                        {/* Media Upload - Shows AI images or upload */}
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📸 Media {hasMedia() ? <span className="text-green-500">✓ Selected</span> : <span className="text-red-500">*Required</span>}
                            </label>

                            {/* Show selected AI images */}
                            {selectedAIImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Selected AI Images ({selectedAIImages.length})</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedAIImages.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={img.url}
                                                    alt={img.alt}
                                                    className="w-full h-20 object-cover rounded-lg border-2 border-green-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setSelectedAIImages(prev => prev.filter((_, i) => i !== idx))
                                                        if (selectedAIImages.length === 1) {
                                                            setAiImageUrl(null)
                                                            setMediaPreview(null)
                                                            setMediaType(null)
                                                        }
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                                >
                                                    <CloseIcon size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Single AI image preview */}
                            {aiImageUrl && selectedAIImages.length === 0 && (
                                <div className="relative mb-4">
                                    <img
                                        src={aiImageUrl}
                                        alt="AI Generated"
                                        className="w-full h-64 object-cover rounded-xl border-2 border-green-500"
                                    />
                                    <button
                                        onClick={() => {
                                            setAiImageUrl(null)
                                            setMediaPreview(null)
                                            setMediaType(null)
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                                    >
                                        <CloseIcon size={20} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                                        🤖 AI Image
                                    </div>
                                </div>
                            )}

                            {/* File upload preview */}
                            {mediaPreview && mediaFile && (
                                <div className="relative mb-4">
                                    {mediaType === 'image' ? (
                                        <img
                                            src={mediaPreview}
                                            alt="Upload preview"
                                            className="w-full h-64 object-cover rounded-xl"
                                        />
                                    ) : (
                                        <video
                                            src={mediaPreview}
                                            controls
                                            className="w-full h-64 rounded-xl"
                                        />
                                    )}
                                    <button
                                        onClick={removeMedia}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                                    >
                                        <CloseIcon size={20} />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                        {mediaType === 'image' ? '📸 Image' : '🎥 Video'}
                                    </div>
                                </div>
                            )}

                            {/* Upload area - show only if no media selected */}
                            {!hasMedia() && (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="mb-2 text-sm text-gray-600 font-medium">
                                            Click to upload or use AI Generator
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF (max 10MB) or MP4, MOV (max 100MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleMediaUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Platform Selection */}
                        <div className="mt-6">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Select Platforms</p>
                            <div className="grid grid-cols-3 gap-3">
                                {platforms.map(platform => {
                                    const Icon = platform.icon
                                    const connected = isAccountConnected(platform.id)
                                    const selected = selectedPlatforms.includes(platform.id)

                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => connected && togglePlatform(platform.id)}
                                            disabled={!connected}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selected
                                                ? `${platform.color} ${platform.textColor} border-transparent shadow-lg`
                                                : connected
                                                    ? 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                                                    : 'border-gray-200 opacity-40 cursor-not-allowed'
                                                }`}
                                        >
                                            <Icon size={24} />
                                            <span className="text-sm font-medium">{platform.name}</span>
                                            {!connected && (
                                                <span className="text-xs">Not connected</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Schedule Options */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-semibold text-gray-700 mb-3">📅 Schedule (Optional)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Calendar size={14} />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={e => setScheduleDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Clock size={14} />
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={e => setScheduleTime(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={postNow}
                                disabled={loading || !postContent || !hasMedia() || selectedPlatforms.length === 0}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                Post Now
                            </button>
                            <button
                                onClick={schedulePost}
                                disabled={loading || !postContent || !hasMedia() || selectedPlatforms.length === 0}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
                                Schedule Post
                            </button>
                        </div>

                        {!hasMedia() && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <span>⚠️</span> <strong>Media Required:</strong> Upload an image/video or use AI Generator to select images.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Scheduled Posts */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Scheduled Posts ({scheduledPosts.length})</h2>

                        {scheduledPosts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No scheduled posts yet</p>
                                <p className="text-sm mt-1">Create a post and schedule it for later</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {scheduledPosts.map(post => (
                                    <div key={post._id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            {/* Media Thumbnail */}
                                            {post.mediaUrl && (
                                                <div className="flex-shrink-0">
                                                    {post.mediaType === 'image' ? (
                                                        <img
                                                            src={post.mediaUrl}
                                                            alt="Post media"
                                                            className="w-24 h-24 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <Video size={32} className="text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Post Details */}
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(post.scheduledFor).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(post.scheduledFor).toLocaleTimeString()}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {post.platforms.map(platformId => {
                                                        const platform = platforms.find(p => p.id === platformId)
                                                        const Icon = platform?.icon
                                                        return Icon && (
                                                            <div key={platformId} className={`p-1 ${platform.color} rounded`}>
                                                                <Icon size={14} className={platform.textColor} />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <button
                                                onClick={() => deleteScheduledPost(post._id)}
                                                className="text-red-600 hover:text-red-700 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Content Generator Modal */}
            {showAIGenerator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">🤖 AI Content Generator</h2>
                                    <p className="text-purple-100 text-sm mt-1">Generate captions, images & hashtags for all platforms</p>
                                </div>
                                <button
                                    onClick={() => setShowAIGenerator(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                                >
                                    <CloseIcon size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Topic Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    🔍 Search Topic *
                                </label>
                                <input
                                    type="text"
                                    value={aiConfig.topic}
                                    onChange={e => setAiConfig({ ...aiConfig, topic: e.target.value })}
                                    placeholder="Enter any topic (e.g., Robert Downey Jr, Elon Musk, iPhone 16, Travel to Paris)"
                                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-lg"
                                />
                            </div>

                            {/* Caption Length - Words based */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📝 Caption Length (Words)
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'short', label: 'Short', words: '17-20 words' },
                                        { id: 'medium', label: 'Medium', words: '25-30 words' },
                                        { id: 'long', label: 'Long', words: '35-45 words' }
                                    ].map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => setAiConfig({ ...aiConfig, length: option.id })}
                                            className={`p-4 rounded-xl border-2 transition-all ${aiConfig.length === option.id
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <p className="font-semibold">{option.label}</p>
                                            <p className="text-xs text-gray-500">{option.words}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Hashtags Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    #️⃣ Your Hashtags (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={aiConfig.customHashtags}
                                    onChange={e => setAiConfig({ ...aiConfig, customHashtags: e.target.value })}
                                    placeholder="Add your own hashtags (e.g., #marvel #ironman #avengers)"
                                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">AI will also generate relevant hashtags automatically</p>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleAIGenerate}
                                disabled={aiGenerating || !aiConfig.topic.trim()}
                                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg text-xl transition-all transform hover:scale-[1.02]"
                            >
                                {aiGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={28} />
                                        Generating Content, Images & Hashtags...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Content, Images & Hashtags
                                    </>
                                )}
                            </button>

                            {/* Generated Content Display */}
                            {generatedContent && (
                                <div className="mt-6 space-y-6 border-t-2 pt-6">
                                    <h3 className="text-2xl font-bold text-gray-800">✨ Generated Content for "{aiConfig.topic}"</h3>

                                    {/* Generated Images - Multiple Selection */}
                                    {generatedContent.images && generatedContent.images.length > 0 && (
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-bold text-gray-800 text-lg">🖼️ Select Images ({selectedAIImages.length} selected)</h4>
                                                <span className="text-sm text-green-600 font-medium">
                                                    {selectedAIImages.length > 0 ? `✓ ${selectedAIImages.length} images selected` : 'Click to select'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">Click images to select multiple for your post</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {generatedContent.images.map((img, idx) => {
                                                    const isSelected = selectedAIImages.some(s => s.url === img.url)
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`relative group cursor-pointer ${isSelected ? 'ring-4 ring-green-500 rounded-lg' : ''}`}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    // Remove from selection
                                                                    setSelectedAIImages(prev => prev.filter(s => s.url !== img.url))
                                                                } else {
                                                                    // Add to selection
                                                                    setSelectedAIImages(prev => [...prev, img])
                                                                    setAiImageUrl(img.url)
                                                                    setMediaType('image')
                                                                }
                                                            }}
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt={img.alt || aiConfig.topic}
                                                                className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-xl transition-all"
                                                                onError={(e) => {
                                                                    e.target.src = `https://picsum.photos/seed/${aiConfig.topic}${idx}/400/300`
                                                                }}
                                                            />
                                                            {isSelected && (
                                                                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                                                    <CheckCircle size={20} />
                                                                </div>
                                                            )}
                                                            <div className={`absolute inset-0 ${isSelected ? 'bg-green-500 bg-opacity-20' : 'bg-black bg-opacity-0 group-hover:bg-opacity-30'} flex items-center justify-center transition-all rounded-lg`}>
                                                                <span className={`text-white font-semibold ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                                    {isSelected ? '✓ Selected' : 'Click to Select'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {selectedAIImages.length > 0 && (
                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedAIImages([])}
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                                                    >
                                                        Clear Selection
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedAIImages([...generatedContent.images])}
                                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
                                                    >
                                                        Select All
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Captions for All Platforms */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['instagram', 'facebook', 'linkedin', 'twitter'].map(platformId => {
                                            const platform = platforms.find(p => p.id === platformId)
                                            const Icon = platform?.icon
                                            const captions = generatedContent.captions?.[platformId]

                                            if (!captions) return null

                                            return (
                                                <div key={platformId} className="bg-gray-50 p-4 rounded-xl border">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {Icon && <Icon size={24} className={platformId === 'linkedin' ? 'text-blue-700' : ''} />}
                                                        <h4 className="font-bold text-gray-800">{platform?.name}</h4>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {['short', 'medium', 'long'].map(length => (
                                                            captions[length] && (
                                                                <div key={length} className="bg-white p-3 rounded-lg border">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex-1">
                                                                            <p className="text-xs font-bold text-purple-600 uppercase mb-1">
                                                                                {length === 'short' ? '📝 Short (17-20 words)' : length === 'medium' ? '📄 Medium (25-30 words)' : '📃 Long (35-45 words)'}
                                                                            </p>
                                                                            <p className="text-sm text-gray-700">{captions[length]}</p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => useGeneratedCaption(platformId, length)}
                                                                            className="flex-shrink-0 px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 font-bold"
                                                                        >
                                                                            Use
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Hashtags */}
                                    {generatedContent.hashtags && (
                                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                                            <h4 className="font-bold text-gray-800 mb-3 text-lg">#️⃣ Generated Hashtags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {generatedContent.hashtags.recommended?.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-200 transition-colors"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(tag)
                                                            showToast(`Copied: ${tag}`, 'success')
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {generatedContent.hashtags.recommended?.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        const allTags = generatedContent.hashtags.recommended.join(' ')
                                                        navigator.clipboard.writeText(allTags)
                                                        showToast('All hashtags copied!', 'success')
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                                                >
                                                    📋 Copy All Hashtags
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Save & Close Button */}
                                    <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-6">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowAIGenerator(false)}
                                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveAndCloseGenerator}
                                                disabled={!postContent && selectedAIImages.length === 0}
                                                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg text-lg"
                                            >
                                                ✅ Save & Close
                                            </button>
                                        </div>
                                        <p className="text-center text-sm text-gray-500 mt-2">
                                            {postContent ? '✓ Caption selected' : '○ Select a caption'} • {selectedAIImages.length > 0 ? `✓ ${selectedAIImages.length} images selected` : '○ Select images'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
