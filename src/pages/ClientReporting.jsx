import { useState } from 'react'
import { Download, Calendar, Lock } from 'lucide-react'
import { usePlan } from '../context/PlanContext'
import { useToast } from '../context/ToastContext'
import LockedFeature from '../components/LockedFeature'
import { jsPDF } from 'jspdf'

export default function ClientReporting() {
    const { hasAccess } = usePlan()
    const [dateRange, setDateRange] = useState('30')
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const canAccessReporting = hasAccess('client-reporting')
    const toast = useToast()

    const metrics = [
        { label: 'Total Visitors', value: '45,231', rawValue: 45231, change: '+12.5%', positive: true },
        { label: 'Conversions', value: '1,234', rawValue: 1234, change: '+8.2%', positive: true },
        { label: 'Bounce Rate', value: '42.3%', rawValue: 42.3, change: '-3.1%', positive: true },
        { label: 'Avg. Session', value: '3m 24s', rawValue: 204, change: '+15.3%', positive: true },
    ]

    const trafficData = [
        { source: 'Organic Search', visitors: 18500, percentage: 41 },
        { source: 'Direct', visitors: 13500, percentage: 30 },
        { source: 'Social Media', visitors: 9000, percentage: 20 },
        { source: 'Referral', visitors: 4231, percentage: 9 },
    ]

    const conversionFunnel = [
        { stage: 'Visitors', count: 45231, width: 100 },
        { stage: 'Engaged', count: 12500, width: 75 },
        { stage: 'Leads', count: 3200, width: 50 },
        { stage: 'Customers', count: 1234, width: 25 },
    ]

    const topContent = [
        { title: 'Ultimate Guide to SEO', views: 8234 },
        { title: '10 Marketing Tips', views: 6521 },
        { title: 'Social Media Strategy', views: 5432 },
        { title: 'Email Marketing Best Practices', views: 4123 },
    ]

    const exportReport = () => {
        // Check if user has access to reporting
        if (!canAccessReporting) {
            setShowUpgradeModal(true)
            return
        }

        try {
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 14

            // Header Background
            doc.setFillColor(59, 130, 246)
            doc.rect(0, 0, pageWidth, 45, 'F')

            // Title
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(28)
            doc.setFont('helvetica', 'bold')
            doc.text('AI Marketing Platform', pageWidth / 2, 20, { align: 'center' })

            doc.setFontSize(16)
            doc.setFont('helvetica', 'normal')
            doc.text('Client Analytics Report', pageWidth / 2, 32, { align: 'center' })

            // Date
            doc.setFontSize(10)
            const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            doc.text(`Generated: ${today} | Period: Last ${dateRange} days`, pageWidth / 2, 40, { align: 'center' })

            // Reset
            doc.setTextColor(0, 0, 0)
            let yPos = 55

            // Key Metrics Section
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(37, 99, 235)
            doc.text('Key Performance Metrics', margin, yPos)
            yPos += 8

            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont('helvetica', 'normal')

            metrics.forEach(metric => {
                doc.setFont('helvetica', 'bold')
                doc.text(`${metric.label}:`, margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(`${metric.value} (${metric.change})`, margin + 50, yPos)
                yPos += 6
            })

            yPos += 8

            // Traffic Sources
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(37, 99, 235)
            doc.text('Traffic Sources', margin, yPos)
            yPos += 8

            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont('helvetica', 'normal')

            trafficData.forEach(item => {
                doc.setFont('helvetica', 'bold')
                doc.text(`${item.source}:`, margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(`${item.visitors.toLocaleString()} visitors (${item.percentage}%)`, margin + 50, yPos)
                yPos += 6
            })

            yPos += 8

            // Conversion Funnel
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(37, 99, 235)
            doc.text('Conversion Funnel', margin, yPos)
            yPos += 8

            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont('helvetica', 'normal')

            conversionFunnel.forEach((stage, i) => {
                const rate = i === 0 ? '100%' : `${((stage.count / conversionFunnel[0].count) * 100).toFixed(1)}%`
                doc.setFont('helvetica', 'bold')
                doc.text(`${stage.stage}:`, margin, yPos)
                doc.setFont('helvetica', 'normal')
                doc.text(`${stage.count.toLocaleString()} (${rate})`, margin + 50, yPos)
                yPos += 6
            })

            yPos += 8

            // Check if we need a new page
            if (yPos > pageHeight - 60) {
                doc.addPage()
                yPos = 20
            }

            // Top Content
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(37, 99, 235)
            doc.text('Top Performing Content', margin, yPos)
            yPos += 8

            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)
            doc.setFont('helvetica', 'normal')

            topContent.forEach((content, i) => {
                doc.text(`${i + 1}. ${content.title}`, margin, yPos)
                doc.text(`${content.views.toLocaleString()} views`, pageWidth - margin - 30, yPos)
                yPos += 6
            })

            // Footer
            doc.setFontSize(8)
            doc.setTextColor(128, 128, 128)
            doc.text('© 2025 AI Marketing Platform - Confidential Report', pageWidth / 2, pageHeight - 10, { align: 'center' })

            // Save
            const fileName = `Analytics_Report_${dateRange}days_${new Date().toISOString().split('T')[0]}.pdf`
            doc.save(fileName)

            toast.success('PDF Report downloaded successfully!')

        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error(`Error: ${error.message}`)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Automated Client Reporting</h1>
                    <p className="text-gray-600">Visual analytics and performance metrics</p>
                </div>
                <button
                    onClick={exportReport}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${canAccessReporting
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-400'
                        }`}
                >
                    {canAccessReporting ? <Download size={16} /> : <Lock size={16} />}
                    Export PDF
                </button>
            </div>

            {/* Upgrade Modal for PDF Export */}
            {showUpgradeModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowUpgradeModal(false)}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                                    <Lock className="text-white" size={32} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                PDF Export Locked
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Upgrade to Advanced or Premium plan to export detailed analytics reports as PDF
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="/pricing"
                                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    View Pricing Plans
                                </a>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex gap-4">
                <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <select
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {metrics.map(metric => (
                    <div key={metric.label} className="bg-white p-6 rounded-lg shadow-sm border">
                        <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                        <p className="text-3xl font-bold mb-2">{metric.value}</p>
                        <p className={`text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Traffic Over Time</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[32, 45, 38, 52, 48, 61, 55, 68, 72, 65, 78, 82, 75, 88].map((height, i) => (
                            <div key={i} className="flex-1 bg-blue-600 rounded-t hover:bg-blue-700 transition-colors"
                                style={{ height: `${height}%` }}
                                title={`Day ${i + 1}: ${Math.floor(height * 100)} visitors`} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Week 1</span>
                        <span>Week 2</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
                    <div className="space-y-4">
                        {trafficData.map(item => (
                            <div key={item.source}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{item.source}</span>
                                    <span className="text-sm text-gray-600">{item.visitors.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {canAccessReporting ? (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-xl font-semibold mb-4">Conversion Funnel</h2>
                            <div className="space-y-3">
                                {conversionFunnel.map(stage => (
                                    <div key={stage.stage}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{stage.stage}</span>
                                            <span className="text-sm text-gray-600">{stage.count.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded"
                                            style={{ width: `${stage.width}%`, height: '32px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
                            <div className="space-y-3">
                                {topContent.map((content, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border rounded">
                                        <span className="text-sm font-medium">{content.title}</span>
                                        <span className="text-sm text-gray-600">{content.views.toLocaleString()} views</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <LockedFeature
                                title="Advanced Analytics & Reporting"
                                description="Unlock conversion funnels, content performance tracking, and detailed analytics"
                                requiredPlan="Advanced or Premium"
                            >
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h2 className="text-xl font-semibold mb-4">Conversion Funnel</h2>
                                    <div className="space-y-3">
                                        {[100, 75, 50, 25].map((width, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">Stage {i + 1}</span>
                                                    <span className="text-sm text-gray-600">0</span>
                                                </div>
                                                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded"
                                                    style={{ width: `${width}%`, height: '32px' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </LockedFeature>
                        </div>

                        <div className="relative">
                            <LockedFeature
                                title="Content Performance Insights"
                                description="Track your top performing content and optimize your strategy"
                                requiredPlan="Advanced or Premium"
                                blur={false}
                            >
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h2 className="text-xl font-semibold mb-4">Top Performing Content</h2>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="flex justify-between items-center p-3 border rounded">
                                                <span className="text-sm font-medium">Content Title {i}</span>
                                                <span className="text-sm text-gray-600">0 views</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </LockedFeature>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
