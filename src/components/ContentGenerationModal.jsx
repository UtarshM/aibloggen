/**
 * Content Generation Modal - Advanced Configuration
 * Professional Journalist Style Content Generation
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState } from 'react'
import { X, FileText, Target, Zap, BookOpen, Users, AlertTriangle } from 'lucide-react'

export default function ContentGenerationModal({ isOpen, onClose, onGenerate }) {
    const [formData, setFormData] = useState({
        topic: '',
        minWords: '5000',
        tone: 'journalistic',
        targetAudience: 'professional',
        includeStats: true,
        // Advanced fields
        headings: '',
        keywords: '',
        references: '',
        eeat: ''
    })
    const [showAdvanced, setShowAdvanced] = useState(false)

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onGenerate(formData)
        onClose()
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-400 to-primary-500 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Human-Style Content Generator</h2>
                            <p className="text-purple-100 text-sm mt-1">Professional journalist-quality content that bypasses AI detection</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-amber-800">
                            <p className="font-semibold">What makes this different:</p>
                            <ul className="mt-1 space-y-1 text-amber-700">
                                <li>• Writes like a skeptical journalist, not a helpful AI</li>
                                <li>• Uses burstiness (varied sentence lengths) to avoid detection</li>
                                <li>• Automatically removes 50+ AI marker words</li>
                                <li>• Never uses "rule of three" lists</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Topic */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <FileText size={20} className="text-primary-500" />
                            Content Topic *
                        </label>
                        <input
                            type="text"
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                            placeholder="e.g., Best Project Management Tools for Remote Teams 2025"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none transition-colors"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Be specific. "Best X for Y in 2025" works better than just "X"</p>
                    </div>

                    {/* Word Count */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <BookOpen size={20} className="text-primary-500" />
                            Minimum Word Count *
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            {['3000', '5000', '7500', '10000'].map(count => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => handleChange('minWords', count)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.minWords === count
                                        ? 'bg-primary-400 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {parseInt(count).toLocaleString()}+
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            value={formData.minWords}
                            onChange={(e) => handleChange('minWords', e.target.value)}
                            min="1000"
                            max="15000"
                            step="500"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Deep dive articles: 5,000-10,000+ words recommended for authority</p>
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <Zap size={20} className="text-yellow-600" />
                            Writing Style *
                        </label>
                        <select
                            value={formData.tone}
                            onChange={(e) => handleChange('tone', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-600 focus:outline-none transition-colors"
                        >
                            <option value="journalistic">Journalistic (Skeptical & Direct)</option>
                            <option value="conversational">Conversational (Friendly but Expert)</option>
                            <option value="professional">Professional (Business & Formal)</option>
                            <option value="educational">Educational (Teacher-like)</option>
                            <option value="storytelling">Storytelling (Narrative & Personal)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Journalistic style scores best on AI detection tests</p>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <Users size={20} className="text-green-600" />
                            Target Audience *
                        </label>
                        <select
                            value={formData.targetAudience}
                            onChange={(e) => handleChange('targetAudience', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                        >
                            <option value="professional">Professional Peers (Industry Experts)</option>
                            <option value="general">General Audience</option>
                            <option value="beginners">Beginners (No Prior Knowledge)</option>
                            <option value="intermediate">Intermediate (Some Experience)</option>
                            <option value="business">Business Decision Makers</option>
                            <option value="technical">Technical Audience (Developers/Engineers)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Professional peers = no basic explanations, more nuance</p>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-2 text-primary-500 font-medium hover:bg-purple-50 rounded-lg transition-colors"
                    >
                        {showAdvanced ? '▼ Hide Advanced Options' : '▶ Show Advanced Options (Custom Headings, Keywords, E-E-A-T)'}
                    </button>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                            {/* Custom Headings */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Custom Headings (Optional)
                                </label>
                                <textarea
                                    value={formData.headings}
                                    onChange={(e) => handleChange('headings', e.target.value)}
                                    placeholder="Enter headings separated by | or new lines:&#10;Why This Matters | Getting Started | Advanced Tips | Common Mistakes | Parting Thoughts"
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate. Use 4-5 or 7-8 headings (never 3 or 6)</p>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    SEO Keywords (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => handleChange('keywords', e.target.value)}
                                    placeholder="e.g., project management, remote work tools, team collaboration"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Comma-separated. Will be woven naturally into content</p>
                            </div>

                            {/* E-E-A-T */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    E-E-A-T Authority (Optional)
                                </label>
                                <textarea
                                    value={formData.eeat}
                                    onChange={(e) => handleChange('eeat', e.target.value)}
                                    placeholder="e.g., Written by a project manager with 12 years experience at Fortune 500 companies. Tested 47 tools over 6 months."
                                    rows={2}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Expertise signals to include. Specific numbers and dates work best</p>
                            </div>

                            {/* References */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Reference URLs (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.references}
                                    onChange={(e) => handleChange('references', e.target.value)}
                                    placeholder="e.g., https://example.com/study, https://research.com/report"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sources to cite or draw information from</p>
                            </div>
                        </div>
                    )}

                    {/* Summary Box */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg border-2 border-purple-200">
                        <h3 className="font-semibold text-purple-900 mb-2">📋 Generation Summary</h3>
                        <div className="text-sm text-primary-800 space-y-1">
                            <p>• Topic: <span className="font-medium">{formData.topic || 'Not specified'}</span></p>
                            <p>• Length: <span className="font-medium">{parseInt(formData.minWords).toLocaleString()}+ words</span></p>
                            <p>• Style: <span className="font-medium capitalize">{formData.tone}</span></p>
                            <p>• Audience: <span className="font-medium capitalize">{formData.targetAudience.replace('-', ' ')}</span></p>
                            {formData.headings && <p>• Custom Headings: <span className="font-medium text-green-700">✓ Yes</span></p>}
                            {formData.keywords && <p>• Keywords: <span className="font-medium text-green-700">✓ Yes</span></p>}
                            {formData.eeat && <p>• E-E-A-T: <span className="font-medium text-green-700">✓ Yes</span></p>}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.topic.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-400 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            Generate Human Content
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
