/**
 * Content Creation & Publishing Tool
 * MacBook-style UI/UX with Primary Color #52b2bf
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState, useEffect } from 'react'
import { Bold, Italic, List, Link as LinkIcon, Save, Eye, Download, Sparkles, Loader2, RefreshCw, FileText, Settings, Upload, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { api } from '../api/client'
import Toast from '../components/Toast'
import ContentGenerationModal from '../components/ContentGenerationModal'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'
import jsPDF from 'jspdf'
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx'
import { saveAs } from 'file-saver'

export default function ContentCreation() {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [preview, setPreview] = useState(false)
    const [saved, setSaved] = useState([])
    const [aiLoading, setAiLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const [generationStep, setGenerationStep] = useState(0)
    const [generationProgress, setGenerationProgress] = useState('')
    const [showModal, setShowModal] = useState(false)
    const globalToast = useToast()
    const modal = useModal()

    // WordPress state
    const [showWordPressModal, setShowWordPressModal] = useState(false)
    const [showBulkImportModal, setShowBulkImportModal] = useState(false)
    const [wordpressSites, setWordPressSites] = useState([])
    const [selectedWordPressSite, setSelectedWordPressSite] = useState(null)
    const [wordpressLoading, setWordpressLoading] = useState(false)
    const [bulkImportFile, setBulkImportFile] = useState(null)
    const [bulkImportJob, setBulkImportJob] = useState(null)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [pollingInterval, setPollingInterval] = useState(null)

    // Load content from localStorage on mount
    useEffect(() => {
        loadContent()

        // Load persisted content from localStorage
        const savedContent = localStorage.getItem('contentCreation_content')
        const savedTitle = localStorage.getItem('contentCreation_title')

        if (savedContent) setContent(savedContent)
        if (savedTitle) setTitle(savedTitle)

        // Check for ongoing bulk import job after page refresh
        checkForOngoingJob()
    }, [])

    // Cleanup polling interval on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval)
            }
        }
    }, [pollingInterval])

    // Save content to localStorage whenever it changes
    useEffect(() => {
        if (content) {
            localStorage.setItem('contentCreation_content', content)
        }
    }, [content])

    useEffect(() => {
        if (title) {
            localStorage.setItem('contentCreation_title', title)
        }
    }, [title])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const loadContent = async () => {
        try {
            const data = await api.getContent()
            if (Array.isArray(data)) {
                setSaved(data.map(item => ({
                    id: item._id,
                    title: item.title,
                    content: item.content,
                    date: new Date(item.createdAt).toLocaleDateString()
                })))
            } else {
                setSaved([])
            }
        } catch (error) {
            console.error('Error loading content:', error)
            setSaved([])
        }
    }

    const clearContent = () => {
        setContent('')
        setTitle('')
        localStorage.removeItem('contentCreation_content')
        localStorage.removeItem('contentCreation_title')
        showToast('Content cleared', 'success')
    }

    // WordPress State
    const [wpSiteName, setWpSiteName] = useState('')
    const [wpSiteUrl, setWpSiteUrl] = useState('')
    const [wpUsername, setWpUsername] = useState('')
    const [wpPassword, setWpPassword] = useState('')
    const [wpTestLoading, setWpTestLoading] = useState(false)

    // WordPress Functions
    const loadWordPressSites = async () => {
        try {
            const sites = await api.getWordPressSites()
            if (Array.isArray(sites)) {
                setWordPressSites(sites)
                if (sites.length > 0) {
                    setSelectedWordPressSite(sites[0]._id)
                }
            } else {
                setWordPressSites([])
            }
        } catch (error) {
            console.error('Error loading WordPress sites:', error)
            setWordPressSites([])
        }
    }

    const testWordPressConnection = async () => {
        if (!wpSiteUrl || !wpUsername || !wpPassword) {
            showToast('Please fill all fields', 'warning')
            return
        }

        setWpTestLoading(true)
        try {
            const result = await api.testWordPressSite({
                siteUrl: wpSiteUrl,
                username: wpUsername,
                applicationPassword: wpPassword
            })

            if (result.success) {
                showToast(`✅ Connected! Site: ${result.siteName}`, 'success')
            }
        } catch (error) {
            showToast(error.message || 'Connection failed', 'error')
        } finally {
            setWpTestLoading(false)
        }
    }

    const addWordPressSite = async () => {
        if (!wpSiteName || !wpSiteUrl || !wpUsername || !wpPassword) {
            showToast('Please fill all fields', 'warning')
            return
        }

        setWordpressLoading(true)
        try {
            const result = await api.addWordPressSite({
                siteName: wpSiteName,
                siteUrl: wpSiteUrl,
                username: wpUsername,
                applicationPassword: wpPassword
            })

            if (result.success) {
                showToast('✅ WordPress site added!', 'success')
                setWpSiteName('')
                setWpSiteUrl('')
                setWpUsername('')
                setWpPassword('')
                await loadWordPressSites()
            }
        } catch (error) {
            showToast(error.message || 'Failed to add site', 'error')
        } finally {
            setWordpressLoading(false)
        }
    }

    const deleteWordPressSite = async (siteId) => {
        const confirmed = await modal.danger('Remove Site', 'Are you sure you want to remove this WordPress site?', { confirmText: 'Remove' })
        if (!confirmed) return

        try {
            await api.deleteWordPressSite(siteId)
            showToast('Site removed', 'success')
            await loadWordPressSites()
        } catch (error) {
            showToast('Failed to remove site', 'error')
        }
    }

    const publishToWordPress = async () => {
        if (!selectedWordPressSite) {
            showToast('Please select a WordPress site', 'warning')
            return
        }

        if (!title || !content) {
            showToast('Please generate content first', 'warning')
            return
        }

        setWordpressLoading(true)
        try {
            const result = await api.publishToWordPress({
                siteId: selectedWordPressSite,
                title,
                content,
                images: []
            })

            if (result.success) {
                showToast('✅ Published successfully!', 'success')
                setShowPublishModal(false)
                if (result.postUrl) {
                    window.open(result.postUrl, '_blank')
                }
            }
        } catch (error) {
            showToast(error.message || 'Failed to publish', 'error')
        } finally {
            setWordpressLoading(false)
        }
    }

    const handleBulkImport = async () => {
        if (!selectedWordPressSite) {
            showToast('Please select a WordPress site', 'warning')
            return
        }

        if (!bulkImportFile) {
            showToast('Please select an Excel file', 'warning')
            return
        }

        setWordpressLoading(true)
        try {
            const formData = new FormData()
            formData.append('excel', bulkImportFile)
            formData.append('siteId', selectedWordPressSite)

            const result = await api.bulkImportToWordPress(formData)

            if (result.success) {
                showToast(`✅ Started processing ${result.totalPosts} posts!`, 'success')
                setBulkImportJob(result)
                pollBulkImportProgress(result.jobId)
            }
        } catch (error) {
            showToast(error.message || 'Failed to start bulk import', 'error')
        } finally {
            setWordpressLoading(false)
        }
    }

    // Check for ongoing job after page refresh
    const checkForOngoingJob = async () => {
        const savedJobId = localStorage.getItem('bulkImportJobId')
        if (savedJobId) {
            try {
                const job = await api.getBulkImportJob(savedJobId)

                // If job is still processing, resume tracking
                if (job.status === 'processing' || job.status === 'pending') {
                    console.log('[RESUME] Found ongoing job:', savedJobId)
                    setBulkImportJob(job)
                    setShowBulkImportModal(true)
                    showToast('📋 Resumed tracking bulk import job', 'info')
                    pollBulkImportProgress(savedJobId)
                } else if (job.status === 'completed') {
                    // Job completed while user was away
                    setBulkImportJob(job)
                    showToast(`✅ Job completed! ${job.successfulPosts}/${job.totalPosts} posts published`, 'success')
                    localStorage.removeItem('bulkImportJobId')
                } else {
                    // Job failed or other status
                    localStorage.removeItem('bulkImportJobId')
                }
            } catch (error) {
                console.error('[RESUME] Error checking job:', error)
                localStorage.removeItem('bulkImportJobId')
            }
        }
    }

    const pollBulkImportProgress = async (jobId) => {
        // Clear any existing interval
        if (pollingInterval) {
            clearInterval(pollingInterval)
        }

        // Save job ID to localStorage for persistence across refreshes
        localStorage.setItem('bulkImportJobId', jobId)

        const interval = setInterval(async () => {
            try {
                const job = await api.getBulkImportJob(jobId)
                setBulkImportJob(job)

                if (job.status === 'completed' || job.status === 'failed') {
                    clearInterval(interval)
                    setPollingInterval(null)
                    localStorage.removeItem('bulkImportJobId')

                    if (job.status === 'completed') {
                        showToast(`✅ Completed! ${job.successfulPosts}/${job.totalPosts} posts published`, 'success')
                    } else {
                        showToast('❌ Bulk import failed', 'error')
                    }
                }
            } catch (error) {
                console.error('[POLLING] Error:', error)
                // Don't clear interval on network error - keep trying
                // Only clear if job not found (404)
                if (error.message && error.message.includes('404')) {
                    clearInterval(interval)
                    setPollingInterval(null)
                    localStorage.removeItem('bulkImportJobId')
                }
            }
        }, 3000) // Poll every 3 seconds

        setPollingInterval(interval)
    }

    useEffect(() => {
        loadWordPressSites()
    }, [])

    const generateFromScratch = async (config) => {
        // Clear previous content before generating new
        clearContent()

        setAiLoading(true)
        setGenerationStep(1)

        try {
            // SINGLE STEP: Generate 100% HUMAN content
            setGenerationProgress('Generating 100% human content...')
            showToast('✨ Generating truly human content...', 'info')

            // SINGLE STEP - Call API to generate 100% human content
            const result = await api.generateHumanContent(config)

            setTitle(result.title || config.topic)
            setContent(result.content)

            setGenerationStep(0)
            setGenerationProgress('')
            showToast('✅ Complete! 100% human content ready!', 'success')

        } catch (error) {
            console.error('Content generation error:', error)
            const errorMessage = error.message || 'An unexpected error occurred, please retry.'
            showToast(errorMessage, 'error')
            setGenerationStep(0)
            setGenerationProgress('')
        } finally {
            setAiLoading(false)
        }
    }

    const improveContent = async () => {
        if (!content.trim()) {
            showToast('Please write some content first!', 'warning')
            return
        }

        setAiLoading(true)
        try {
            const promptText = `Improve and enhance this content to make it more engaging, professional, and comprehensive:

${content}

Make it:
- More detailed and informative
- Better structured with clear sections
- Include relevant examples
- Add statistics and data points
- More engaging and readable
- SEO-optimized
- At least 50% longer with valuable information`

            const result = await api.generateContent(promptText)
            setContent(result.content)
            showToast('✨ Content improved successfully!', 'success')
        } catch (error) {
            console.error('AI generation error:', error)
            showToast('Error improving content. Please try again.', 'error')
        } finally {
            setAiLoading(false)
        }
    }

    const saveDraft = async () => {
        if (!title.trim() && !content.trim()) {
            showToast('Please add a title or content first', 'warning')
            return
        }

        try {
            const newContent = await api.saveContent({ title: title || 'Untitled', content })
            setSaved([{
                id: newContent._id,
                title: newContent.title,
                content: newContent.content,
                date: new Date(newContent.createdAt).toLocaleDateString()
            }, ...saved])
            showToast('✅ Draft saved successfully!', 'success')
        } catch (error) {
            console.error('Error saving content:', error)
            showToast('Error saving draft. Please try again.', 'error')
        }
    }

    const downloadContent = () => {
        if (!content.trim()) {
            showToast('No content to download', 'warning')
            return
        }

        const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title || 'content'}.md`
        a.click()
        showToast('📥 Content downloaded as Markdown!', 'success')
    }

    const downloadAsPDF = async () => {
        if (!content.trim()) {
            showToast('No content to download', 'warning')
            return
        }

        try {
            showToast('📄 Generating PDF...', 'info')

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 20
            const contentWidth = pageWidth - (margin * 2)
            let yPosition = margin

            // Header with gradient effect (simulated with rectangles)
            pdf.setFillColor(82, 178, 191) // Primary color #52b2bf
            pdf.rect(0, 0, pageWidth, 40, 'F')

            // Company/Author name
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(12)
            pdf.text('Scalezix Venture PVT LTD', margin, 15)

            // Title
            pdf.setFontSize(24)
            pdf.setFont('helvetica', 'bold')
            const titleLines = pdf.splitTextToSize(title || 'Untitled Document', contentWidth)
            pdf.text(titleLines, margin, 30)

            yPosition = 50

            // Date and metadata
            pdf.setFontSize(10)
            pdf.setTextColor(100, 100, 100)
            pdf.setFont('helvetica', 'normal')
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            pdf.text(`Generated on: ${currentDate}`, margin, yPosition)
            yPosition += 10

            // Separator line
            pdf.setDrawColor(82, 178, 191)
            pdf.setLineWidth(0.5)
            pdf.line(margin, yPosition, pageWidth - margin, yPosition)
            yPosition += 10

            // Content processing
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'normal')

            // Split content into paragraphs and process
            const paragraphs = content.split('\n\n')

            for (let i = 0; i < paragraphs.length; i++) {
                let paragraph = paragraphs[i].trim()
                if (!paragraph) continue

                // Check if it's a heading (starts with #)
                const isHeading = paragraph.startsWith('#')

                if (isHeading) {
                    yPosition += 5
                    pdf.setFont('helvetica', 'bold')
                    pdf.setFontSize(14)
                    pdf.setTextColor(82, 178, 191)
                    const headingText = paragraph.replace(/^#+\s*/, '')
                    const headingLines = pdf.splitTextToSize(headingText, contentWidth)

                    // Check if we need a new page
                    if (yPosition + (headingLines.length * 7) > pageHeight - margin) {
                        pdf.addPage()
                        yPosition = margin
                    }

                    pdf.text(headingLines, margin, yPosition)
                    yPosition += headingLines.length * 7 + 3
                    pdf.setFont('helvetica', 'normal')
                    pdf.setFontSize(11)
                    pdf.setTextColor(0, 0, 0)
                } else {
                    // Regular paragraph
                    if (paragraph) {
                        const lines = pdf.splitTextToSize(paragraph, contentWidth)

                        // Check if we need a new page
                        if (yPosition + (lines.length * 6) > pageHeight - margin) {
                            pdf.addPage()
                            yPosition = margin
                        }

                        pdf.text(lines, margin, yPosition)
                        yPosition += lines.length * 6 + 5
                    }
                }
            }

            // Footer on last page
            const totalPages = pdf.internal.pages.length - 1
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i)
                pdf.setFontSize(8)
                pdf.setTextColor(150, 150, 150)
                pdf.text(
                    `Page ${i} of ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                )
                pdf.text(
                    '© 2025 Scalezix Venture PVT LTD - All Rights Reserved',
                    pageWidth / 2,
                    pageHeight - 5,
                    { align: 'center' }
                )
            }

            // Save the PDF
            const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'content'}.pdf`
            pdf.save(fileName)

            showToast('📄 PDF downloaded successfully!', 'success')
        } catch (error) {
            console.error('Error generating PDF:', error)
            showToast('Error generating PDF. Please try again.', 'error')
        }
    }

    const downloadAsWord = async () => {
        if (!content.trim()) {
            showToast('No content to download', 'warning')
            return
        }

        try {
            showToast('📄 Generating Word document...', 'info')

            const docChildren = []

            // Add title
            docChildren.push(
                new Paragraph({
                    text: title || 'Untitled Document',
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            )

            // Add metadata
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            docChildren.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `By: Scalezix Venture PVT LTD | Generated on: ${currentDate}`,
                            size: 20,
                            color: '666666'
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            )

            // Add separator
            docChildren.push(
                new Paragraph({
                    text: '_______________________________________________',
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            )

            // Process content
            const paragraphs = content.split('\n\n')

            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i].trim()
                if (!paragraph) continue

                // Check if it's a heading
                const isHeading = paragraph.startsWith('#')

                if (isHeading) {
                    const headingText = paragraph.replace(/^#+\s*/, '')
                    docChildren.push(
                        new Paragraph({
                            text: headingText,
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 300, after: 200 }
                        })
                    )
                } else {
                    // Regular paragraph
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: paragraph,
                                    size: 24
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    )
                }
            }

            // Add footer
            docChildren.push(
                new Paragraph({
                    text: '',
                    spacing: { before: 400 }
                })
            )
            docChildren.push(
                new Paragraph({
                    text: '_______________________________________________',
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 }
                })
            )
            docChildren.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: '© 2025 Scalezix Venture PVT LTD - All Rights Reserved',
                            size: 20,
                            color: '666666'
                        })
                    ],
                    alignment: AlignmentType.CENTER
                })
            )

            // Create document
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: docChildren
                }]
            })

            // Generate and save
            const blob = await Packer.toBlob(doc)
            const fileName = `${(title || 'content').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`
            saveAs(blob, fileName)

            showToast('📄 Word document downloaded successfully!', 'success')
        } catch (error) {
            console.error('Error generating Word document:', error)
            showToast('Error generating Word document. Please try again.', 'error')
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Content Generation Modal */}
            <ContentGenerationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onGenerate={generateFromScratch}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Background Job Indicator */}
            {bulkImportJob && bulkImportJob.status === 'processing' && !showBulkImportModal && (
                <div className="mb-6 bg-gradient-to-r from-primary-400 to-primary-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={24} />
                        <div>
                            <p className="font-bold text-lg">✅ Bulk Import Running in Background</p>
                            <p className="text-sm opacity-90">
                                {bulkImportJob.processedPosts} / {bulkImportJob.totalPosts} posts processed •
                                {bulkImportJob.successfulPosts} successful •
                                {bulkImportJob.failedPosts} failed
                            </p>
                            <p className="text-xs opacity-75 mt-1">
                                {bulkImportJob.currentStep || 'Processing...'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowBulkImportModal(true)}
                        className="px-4 py-2 bg-white text-primary-500 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        View Progress
                    </button>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-2">Content Creation & Publishing</h1>
            <p className="text-gray-600 mb-8">Create rich, well-researched content with AI assistance (Google AI)</p>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <input
                            type="text"
                            placeholder="Content Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full text-2xl font-bold mb-4 px-2 py-1 border-b focus:outline-none focus:border-primary-400"
                        />

                        <div className="flex gap-2 mb-4 pb-4 border-b flex-wrap">
                            <button className="p-2 hover:bg-gray-100 rounded" title="Bold">
                                <Bold size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded" title="Italic">
                                <Italic size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded" title="List">
                                <List size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded" title="Link">
                                <LinkIcon size={18} />
                            </button>
                            <div className="flex-1" />
                            <button
                                onClick={() => setShowModal(true)}
                                disabled={aiLoading}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded hover:from-primary-500 hover:to-primary-600 disabled:opacity-50"
                            >
                                {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                AI Generate
                            </button>
                            <button
                                onClick={improveContent}
                                disabled={aiLoading || !content}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded hover:from-green-700 hover:to-teal-700 disabled:opacity-50"
                            >
                                {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                                AI Improve
                            </button>
                            {content && (
                                <button
                                    onClick={clearContent}
                                    disabled={aiLoading}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                    title="Clear all content"
                                >
                                    <FileText size={16} />
                                    Clear
                                </button>
                            )}
                            <div className="flex-1" />
                            <button
                                onClick={() => setShowWordPressModal(true)}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded hover:from-primary-500 hover:to-primary-600"
                                title="WordPress Settings"
                            >
                                <Settings size={16} />
                                WordPress
                            </button>
                            {content && title && (
                                <button
                                    onClick={() => setShowPublishModal(true)}
                                    disabled={wordpressLoading || wordpressSites.length === 0}
                                    className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                                    title="Publish to WordPress"
                                >
                                    <ExternalLink size={16} />
                                    Publish
                                </button>
                            )}
                            <button
                                onClick={() => setShowBulkImportModal(true)}
                                disabled={wordpressSites.length === 0}
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded hover:from-primary-500 hover:to-primary-600 disabled:opacity-50"
                                title="Bulk Import from Excel"
                            >
                                <Upload size={16} />
                                Bulk Import
                            </button>
                        </div>

                        {!preview ? (
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Start writing your content or use AI Generate to create comprehensive articles with research, examples, and statistics..."
                                className="w-full h-[500px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 font-mono text-sm"
                            />
                        ) : (
                            <div className="prose max-w-none p-4 border rounded-md h-[500px] overflow-auto">
                                <h1>{title}</h1>
                                <div
                                    className="whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: content.replace(/\n/g, '<br />')
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex gap-2 mt-4 flex-wrap">
                            <button
                                onClick={() => setPreview(!preview)}
                                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                <Eye size={16} />
                                {preview ? 'Edit' : 'Preview'}
                            </button>
                            <button
                                onClick={saveDraft}
                                disabled={!title && !content}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 disabled:opacity-50"
                            >
                                <Save size={16} />
                                Save Draft
                            </button>
                            <button
                                onClick={downloadContent}
                                disabled={!content}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                <Download size={16} />
                                Markdown
                            </button>
                            <button
                                onClick={downloadAsPDF}
                                disabled={!content}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md hover:from-red-700 hover:to-pink-700 disabled:opacity-50 font-medium"
                            >
                                <FileText size={16} />
                                PDF
                            </button>
                            <button
                                onClick={downloadAsWord}
                                disabled={!content}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-md hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 font-medium"
                            >
                                <FileText size={16} />
                                Word
                            </button>
                        </div>
                    </div>

                    {/* Generation Progress */}
                    {aiLoading && generationStep > 0 && (
                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg shadow-lg border-2 border-primary-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Loader2 className="animate-spin text-primary-500" size={24} />
                                <div>
                                    <h3 className="text-lg font-bold text-primary-900">AI Content Generation in Progress</h3>
                                    <p className="text-sm text-primary-700">{generationProgress}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Step 1 */}
                                <div className={`flex items-center gap-3 p-3 rounded-lg ${generationStep >= 1 ? 'bg-white border-2 border-primary-200' : 'bg-gray-100'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${generationStep > 1 ? 'bg-green-500 text-white' : generationStep === 1 ? 'bg-primary-400 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                        {generationStep > 1 ? '✓' : '1'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">Generate Human Content</p>
                                        <p className="text-xs text-gray-600">Creating comprehensive article with research and examples</p>
                                    </div>
                                    {generationStep === 1 && <Loader2 className="animate-spin text-primary-500" size={20} />}
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg">
                                <p className="text-xs text-center text-primary-900 font-medium">
                                    ✨ Creating 100% human-like content
                                </p>
                            </div>
                        </div>
                    )}

                    {/* WordPress Settings Modal */}
                    {showWordPressModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b bg-gradient-to-r from-primary-400 to-primary-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Settings className="text-white" size={24} />
                                            <h2 className="text-2xl font-bold text-white">WordPress Settings</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowWordPressModal(false)}
                                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Add New Site Form */}
                                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg border-2 border-primary-200">
                                        <h3 className="text-lg font-semibold text-primary-900 mb-4">Add WordPress Site</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Site Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wpSiteName}
                                                    onChange={(e) => setWpSiteName(e.target.value)}
                                                    placeholder="My Blog"
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    WordPress URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={wpSiteUrl}
                                                    onChange={(e) => setWpSiteUrl(e.target.value)}
                                                    placeholder="https://yourblog.com"
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={wpUsername}
                                                    onChange={(e) => setWpUsername(e.target.value)}
                                                    placeholder="admin"
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Application Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={wpPassword}
                                                    onChange={(e) => setWpPassword(e.target.value)}
                                                    placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Generate in WordPress: Users → Profile → Application Passwords
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={testWordPressConnection}
                                                    disabled={wpTestLoading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50"
                                                >
                                                    {wpTestLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                                    Test Connection
                                                </button>
                                                <button
                                                    onClick={addWordPressSite}
                                                    disabled={wordpressLoading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {wordpressLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                                    Add Site
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connected Sites List */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Connected Sites</h3>
                                        {wordpressSites.length === 0 ? (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <Settings className="mx-auto text-gray-400 mb-2" size={32} />
                                                <p className="text-gray-500">No WordPress sites connected</p>
                                                <p className="text-sm text-gray-400 mt-1">Add your first site above</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {wordpressSites.map((site) => (
                                                    <div key={site._id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{site.name}</h4>
                                                            <p className="text-sm text-gray-500">{site.url}</p>
                                                            <p className="text-xs text-gray-400 mt-1">Username: {site.username}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteWordPressSite(site._id)}
                                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Publish to WordPress Modal */}
                    {showPublishModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <div className="p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ExternalLink className="text-white" size={24} />
                                            <h2 className="text-2xl font-bold text-white">Publish to WordPress</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowPublishModal(false)}
                                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select WordPress Site
                                        </label>
                                        <select
                                            value={selectedWordPressSite || ''}
                                            onChange={(e) => setSelectedWordPressSite(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            {wordpressSites.map((site) => (
                                                <option key={site._id} value={site._id}>
                                                    {site.name} ({site.url})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg border border-primary-200">
                                        <h4 className="font-semibold text-primary-900 mb-2">Content Preview</h4>
                                        <p className="text-sm text-primary-800"><strong>Title:</strong> {title}</p>
                                        <p className="text-sm text-primary-800 mt-1"><strong>Words:</strong> ~{content.split(' ').length}</p>
                                    </div>

                                    <button
                                        onClick={publishToWordPress}
                                        disabled={wordpressLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 font-medium"
                                    >
                                        {wordpressLoading ? <Loader2 className="animate-spin" size={20} /> : <ExternalLink size={20} />}
                                        {wordpressLoading ? 'Publishing...' : 'Publish Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bulk Import Modal */}
                    {showBulkImportModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b bg-gradient-to-r from-primary-400 to-primary-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Upload className="text-white" size={24} />
                                            <h2 className="text-2xl font-bold text-white">Bulk Import from Excel</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowBulkImportModal(false)}
                                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {!bulkImportJob ? (
                                        <>
                                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg border-2 border-primary-200">
                                                <h3 className="text-lg font-semibold text-primary-900 mb-3">📋 How It Works</h3>
                                                <ol className="text-sm text-primary-800 space-y-2 list-decimal list-inside">
                                                    <li>Upload Excel file with "Title" column</li>
                                                    <li>AI generates content for each title</li>
                                                    <li>Content is humanized automatically</li>
                                                    <li>Posts are published to WordPress</li>
                                                </ol>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select WordPress Site
                                                </label>
                                                <select
                                                    value={selectedWordPressSite || ''}
                                                    onChange={(e) => setSelectedWordPressSite(e.target.value)}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                >
                                                    {wordpressSites.map((site) => (
                                                        <option key={site._id} value={site._id}>
                                                            {site.name} ({site.url})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Upload Excel File
                                                </label>
                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    onChange={(e) => setBulkImportFile(e.target.files[0])}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Excel file must have a "Title" column with blog post titles
                                                </p>
                                            </div>

                                            {bulkImportFile && (
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                    <p className="text-sm text-green-800">
                                                        <strong>Selected:</strong> {bulkImportFile.name}
                                                    </p>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleBulkImport}
                                                disabled={wordpressLoading || !bulkImportFile}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 font-medium"
                                            >
                                                {wordpressLoading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                                {wordpressLoading ? 'Starting...' : 'Start Bulk Import'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Progress Display */}
                                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg border-2 border-primary-200">
                                                {/* Resume Indicator */}
                                                {localStorage.getItem('bulkImportJobId') && bulkImportJob.status === 'processing' && (
                                                    <div className="mb-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                                                        <RefreshCw size={18} className="animate-spin" />
                                                        <span className="text-sm font-medium">
                                                            ✅ Job resumed after page refresh - Processing continues in background
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3 mb-4">
                                                    {bulkImportJob.status === 'processing' && <Loader2 className="animate-spin text-primary-500" size={24} />}
                                                    {bulkImportJob.status === 'completed' && <CheckCircle className="text-green-600" size={24} />}
                                                    {bulkImportJob.status === 'failed' && <XCircle className="text-red-600" size={24} />}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {bulkImportJob.status === 'processing' && 'Processing...'}
                                                            {bulkImportJob.status === 'completed' && 'Completed!'}
                                                            {bulkImportJob.status === 'failed' && 'Failed'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {bulkImportJob.processedPosts} / {bulkImportJob.totalPosts} posts processed
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                                    <div
                                                        className="bg-gradient-to-r from-primary-400 to-primary-500 h-4 rounded-full transition-all duration-500"
                                                        style={{ width: `${(bulkImportJob.processedPosts / bulkImportJob.totalPosts) * 100}%` }}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-white p-3 rounded-lg">
                                                        <p className="text-gray-600">Successful</p>
                                                        <p className="text-2xl font-bold text-green-600">{bulkImportJob.successfulPosts}</p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg">
                                                        <p className="text-gray-600">Failed</p>
                                                        <p className="text-2xl font-bold text-red-600">{bulkImportJob.failedPosts}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Results Table with Live Links */}
                                            {bulkImportJob.posts && bulkImportJob.posts.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                        <FileText size={20} />
                                                        Published Posts with Live Links
                                                    </h3>
                                                    <div className="max-h-96 overflow-y-auto border rounded-lg">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-50 sticky top-0">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">#</th>
                                                                    <th className="px-4 py-2 text-left">Title</th>
                                                                    <th className="px-4 py-2 text-left">Status</th>
                                                                    <th className="px-4 py-2 text-left">Live Blog Link</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {bulkImportJob.posts.map((post, index) => (
                                                                    <tr key={index} className="border-t hover:bg-gray-50">
                                                                        <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                                                                        <td className="px-4 py-2 font-medium">{post.title}</td>
                                                                        <td className="px-4 py-2">
                                                                            {post.status === 'published' ? (
                                                                                <span className="text-green-600 flex items-center gap-1 font-semibold">
                                                                                    <CheckCircle size={14} /> Published
                                                                                </span>
                                                                            ) : post.status === 'failed' ? (
                                                                                <span className="text-red-600 flex items-center gap-1">
                                                                                    <XCircle size={14} /> Failed
                                                                                </span>
                                                                            ) : post.status === 'generating' ? (
                                                                                <span className="text-primary-500 flex items-center gap-1">
                                                                                    <Loader2 size={14} className="animate-spin" /> Generating
                                                                                </span>
                                                                            ) : post.status === 'publishing' ? (
                                                                                <span className="text-primary-600 flex items-center gap-1">
                                                                                    <Loader2 size={14} className="animate-spin" /> Publishing
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-gray-600 flex items-center gap-1">
                                                                                    <Clock size={14} /> Pending
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            {post.wordpressPostUrl ? (
                                                                                <a
                                                                                    href={post.wordpressPostUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-primary-500 hover:underline flex items-center gap-1 font-medium"
                                                                                >
                                                                                    <ExternalLink size={14} /> View Post
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-gray-400">-</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {bulkImportJob.status !== 'processing' && (
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                showToast('📥 Downloading Excel report...', 'info')
                                                                await api.downloadBulkImportExcel(bulkImportJob._id)
                                                                showToast('✅ Excel report downloaded with live blog links!', 'success')
                                                            } catch (error) {
                                                                showToast('Failed to download Excel', 'error')
                                                            }
                                                        }}
                                                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold flex items-center justify-center gap-2"
                                                    >
                                                        <Download size={20} />
                                                        Download Excel Report with Live Links
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setBulkImportJob(null)
                                                            setBulkImportFile(null)
                                                        }}
                                                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                                    >
                                                        Start New Import
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
