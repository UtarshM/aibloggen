/**
 * Job History & Management Page
 * View and manage all bulk import jobs and published posts
 * MacBook-style UI/UX with Primary Color #52b2bf
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { History, Trash2, Download, ExternalLink, CheckCircle, XCircle, Clock, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { api } from '../api/client'
import Toast from '../components/Toast'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'

export default function JobHistory() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const [selectedJob, setSelectedJob] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [selectedPosts, setSelectedPosts] = useState([])
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
    const globalToast = useToast()
    const modal = useModal()

    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        setLoading(true)
        try {
            const data = await api.getAllBulkImportJobs()
            setJobs(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error loading jobs:', error)
            showToast('Failed to load job history', 'error')
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const handleDownloadExcel = async (jobId) => {
        try {
            showToast('📥 Downloading Excel report...', 'info')
            await api.downloadBulkImportExcel(jobId)
            showToast('✅ Excel report downloaded!', 'success')
        } catch (error) {
            showToast('Failed to download Excel report', 'error')
        }
    }

    const handleDeleteJob = async (jobId) => {
        setDeleteLoading(true)
        try {
            await api.deleteBulkImportJob(jobId)
            showToast('✅ Job deleted successfully', 'success')
            setShowDeleteModal(false)
            setSelectedJob(null)
            loadJobs()
        } catch (error) {
            showToast('Failed to delete job', 'error')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleDeletePost = async (job, post) => {
        if (!post.wordpressPostId) {
            showToast('Post has no WordPress ID', 'error')
            return
        }

        const confirmed = await modal.danger('Delete Post', `Delete "${post.title}" from WordPress? This will permanently remove the post from your WordPress site.`, { confirmText: 'Delete' })
        if (!confirmed) return

        try {
            showToast('🗑️ Deleting post from WordPress...', 'info')
            await api.deleteWordPressPost(
                'temp-id', // Not used in backend
                job.wordpressSiteId,
                post.wordpressPostId
            )
            showToast('✅ Post deleted from WordPress successfully!', 'success')

            // Reload jobs to reflect changes
            setTimeout(() => loadJobs(), 1000)
        } catch (error) {
            console.error('Delete post error:', error)
            showToast(error.message || 'Failed to delete post from WordPress', 'error')
        }
    }

    const handleBulkDelete = async () => {
        if (selectedPosts.length === 0) {
            showToast('Please select posts to delete', 'warning')
            return
        }

        const confirmed = await modal.danger('Delete Posts', `Delete ${selectedPosts.length} posts from WordPress?`, { confirmText: 'Delete All' })
        if (!confirmed) return

        setDeleteLoading(true)
        try {
            const job = jobs.find(j => j._id === selectedJob._id)

            // Get published posts with their indices
            const publishedPosts = job.posts
                .map((post, index) => ({ post, index }))
                .filter(({ post }) => post.status === 'published')

            // Map selected indices to post data
            const postIds = selectedPosts
                .map(selectedIndex => {
                    const item = publishedPosts[selectedIndex]
                    if (!item) return null
                    return {
                        wordpressPostId: item.post.wordpressPostId,
                        title: item.post.title
                    }
                })
                .filter(p => p && p.wordpressPostId)

            if (postIds.length === 0) {
                showToast('No valid posts to delete', 'warning')
                setDeleteLoading(false)
                return
            }

            showToast(`🗑️ Deleting ${postIds.length} posts from WordPress...`, 'info')
            const result = await api.bulkDeleteWordPressPosts(job.wordpressSiteId, postIds)

            if (result.results.successful > 0) {
                showToast(`✅ Successfully deleted ${result.results.successful}/${postIds.length} posts!`, 'success')
            }
            if (result.results.failed > 0) {
                showToast(`⚠️ Failed to delete ${result.results.failed} posts`, 'warning')
                console.error('Failed posts:', result.results.errors)
            }

            setShowBulkDeleteModal(false)
            setSelectedPosts([])
            loadJobs()
        } catch (error) {
            console.error('Bulk delete error:', error)
            showToast(error.message || 'Failed to bulk delete posts', 'error')
        } finally {
            setDeleteLoading(false)
        }
    }

    const togglePostSelection = (postIndex) => {
        setSelectedPosts(prev =>
            prev.includes(postIndex)
                ? prev.filter(id => id !== postIndex)
                : [...prev, postIndex]
        )
    }

    const selectAllPosts = (job) => {
        const publishedPostsCount = job.posts.filter(p => p.status === 'published').length
        const allSelected = selectedPosts.length === publishedPostsCount && publishedPostsCount > 0

        if (allSelected) {
            setSelectedPosts([])
        } else {
            // Select all published post indices (0, 1, 2, ...)
            setSelectedPosts(Array.from({ length: publishedPostsCount }, (_, i) => i))
        }
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

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <History className="text-primary-500" />
                        Job History & Management
                    </h1>
                    <p className="text-gray-600 mt-2">View and manage all your bulk import jobs and published posts</p>
                </div>
                <button
                    onClick={loadJobs}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary-500" size={48} />
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <History className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Yet</h3>
                    <p className="text-gray-500">Start a bulk import to see your job history here</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            {/* Job Header */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {job.status === 'processing' && <Loader2 className="animate-spin text-primary-500" size={24} />}
                                            {job.status === 'completed' && <CheckCircle className="text-green-600" size={24} />}
                                            {job.status === 'failed' && <XCircle className="text-red-600" size={24} />}
                                            {job.status === 'pending' && <Clock className="text-yellow-600" size={24} />}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{job.fileName}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(job.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Total:</span> {job.totalPosts}
                                            </span>
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle size={16} />
                                                <span className="font-medium">{job.successfulPosts}</span>
                                            </span>
                                            <span className="flex items-center gap-1 text-red-600">
                                                <XCircle size={16} />
                                                <span className="font-medium">{job.failedPosts}</span>
                                            </span>
                                            {job.status === 'processing' && (
                                                <span className="flex items-center gap-1 text-primary-500">
                                                    <Clock size={16} />
                                                    <span className="font-medium">Processing...</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {job.status === 'completed' && (
                                            <>
                                                <button
                                                    onClick={() => handleDownloadExcel(job._id)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                    title="Download Excel Report"
                                                >
                                                    <Download size={18} />
                                                    Excel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(job)
                                                        setShowBulkDeleteModal(true)
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                    title="Bulk Delete Posts"
                                                >
                                                    <Trash2 size={18} />
                                                    Bulk Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedJob(job)
                                                setShowDeleteModal(true)
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete Job"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Posts List */}
                            <div className="p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Published Posts ({job.successfulPosts})</h4>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {job.posts.filter(p => p.status === 'published').map((post, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{post.title}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span>{post.contentLength || 0} words</span>
                                                    {post.publishedAt && (
                                                        <span>{new Date(post.publishedAt).toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {post.wordpressPostUrl && (
                                                    <a
                                                        href={post.wordpressPostUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1 bg-primary-400 text-white rounded hover:bg-primary-500 text-sm"
                                                    >
                                                        <ExternalLink size={14} />
                                                        View
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDeletePost(job, post)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete from WordPress"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {job.posts.filter(p => p.status === 'published').length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No published posts yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Job Modal */}
            {showDeleteModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-red-600" size={24} />
                            <h3 className="text-xl font-bold">Delete Job?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this job? This will only delete the job record, not the WordPress posts.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteJob(selectedJob._id)}
                                disabled={deleteLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Modal */}
            {showBulkDeleteModal && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b bg-gradient-to-r from-red-600 to-pink-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Bulk Delete Posts from WordPress</h3>
                                <button
                                    onClick={() => {
                                        setShowBulkDeleteModal(false)
                                        setSelectedPosts([])
                                    }}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Select posts to delete from WordPress
                                </p>
                                <button
                                    onClick={() => selectAllPosts(selectedJob)}
                                    className="text-sm text-primary-500 hover:text-purple-700 font-medium"
                                >
                                    {selectedPosts.length === selectedJob.posts.filter(p => p.status === 'published').length
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {selectedJob.posts.filter(p => p.status === 'published').map((post, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(idx)}
                                            onChange={() => togglePostSelection(idx)}
                                            className="w-4 h-4 text-primary-500"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{post.title}</p>
                                            <p className="text-sm text-gray-600">
                                                {post.contentLength || 0} words
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowBulkDeleteModal(false)
                                        setSelectedPosts([])
                                    }}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={deleteLoading || selectedPosts.length === 0}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleteLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete {selectedPosts.length} Posts
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
