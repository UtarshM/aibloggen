import { useState } from 'react'
import { Check, ChevronRight, Sparkles, Users, FileText, Calendar, Upload, Download, AlertCircle, CheckCircle, X, XCircle, Edit, Trash2 } from 'lucide-react'
import { usePlan } from '../context/PlanContext'
import { useToast } from '../context/ToastContext'
import { useModal } from '../components/Modal'
import LockedFeature from '../components/LockedFeature'
import Toast from '../components/Toast'

export default function ClientOnboarding() {
    const { hasAccess } = usePlan()
    const [currentStep, setCurrentStep] = useState(1)
    const [showBulkUpload, setShowBulkUpload] = useState(false)
    const [uploadResults, setUploadResults] = useState(null)
    const [errors, setErrors] = useState({})
    const [viewMode, setViewMode] = useState('onboard') // 'onboard' or 'list'
    const [clients, setClients] = useState(() => {
        return JSON.parse(localStorage.getItem('onboardedClients') || '[]')
    })
    const [editingClient, setEditingClient] = useState(null)
    const [editFormData, setEditFormData] = useState(null)
    const [statusFilter, setStatusFilter] = useState('All')
    const [toast, setToast] = useState(null)
    const globalToast = useToast()
    const modal = useModal()

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        website: '',
        companySize: '',
        companyEmail: '',
        companyPhone: '',
        taxId: '',
        goals: [],
        budget: '',
        timeline: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactRole: ''
    })

    const canAccessOnboarding = hasAccess('client-onboarding')

    const steps = [
        { number: 1, title: 'Company Info', fields: ['companyName', 'industry', 'website', 'companyEmail'] },
        { number: 2, title: 'Goals & Budget', fields: ['goals', 'budget', 'timeline'] },
        { number: 3, title: 'Contact Details', fields: ['contactName', 'contactEmail'] },
        { number: 4, title: 'Review', fields: [] }
    ]

    const goals = ['Increase Traffic', 'Generate Leads', 'Boost Sales', 'Brand Awareness', 'Social Media Growth', 'Email Marketing']

    const validateStep = (step) => {
        const newErrors = {}
        const currentFields = steps[step - 1].fields

        currentFields.forEach(field => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                newErrors[field] = 'This field is required'
            }
        })

        // Email validation
        if (currentFields.includes('companyEmail') && formData.companyEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.companyEmail)) {
                newErrors.companyEmail = 'Invalid email format'
            }
        }

        if (currentFields.includes('contactEmail') && formData.contactEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.contactEmail)) {
                newErrors.contactEmail = 'Invalid email format'
            }
        }

        // Website validation
        if (currentFields.includes('website') && formData.website) {
            try {
                new URL(formData.website)
            } catch {
                newErrors.website = 'Invalid website URL'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const toggleGoal = (goal) => {
        setFormData({
            ...formData,
            goals: formData.goals.includes(goal)
                ? formData.goals.filter(g => g !== goal)
                : [...formData.goals, goal]
        })
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = () => {
        // Save client to localStorage
        const existingClients = JSON.parse(localStorage.getItem('onboardedClients') || '[]')
        const newClient = {
            ...formData,
            id: Date.now(),
            onboardedDate: new Date().toISOString(),
            status: 'In Progress'
        }
        existingClients.push(newClient)
        localStorage.setItem('onboardedClients', JSON.stringify(existingClients))

        showToast('Onboarding completed! Welcome aboard! Check the "View Clients" tab to see all onboarded clients.', 'success')

        // Reset form
        setFormData({
            companyName: '',
            industry: '',
            website: '',
            companySize: '',
            companyEmail: '',
            companyPhone: '',
            taxId: '',
            goals: [],
            budget: '',
            timeline: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            contactRole: ''
        })
        setCurrentStep(1)
    }

    const handleBulkUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target.result
                const lines = text.split('\n')
                const headers = lines[0].split(',').map(h => h.trim())

                const successData = []
                const failedData = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue

                    const values = lines[i].split(',').map(v => v.trim())
                    const row = {}
                    headers.forEach((header, index) => {
                        row[header] = values[index] || ''
                    })

                    // Validate row
                    const isValid = row.companyName && row.industry && row.companyEmail &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.companyEmail)

                    if (isValid) {
                        successData.push({ ...row, status: 'success' })
                    } else {
                        failedData.push({ ...row, status: 'failed', reason: 'Missing required fields or invalid email' })
                    }
                }

                // Save successful clients to localStorage
                if (successData.length > 0) {
                    const existingClients = JSON.parse(localStorage.getItem('onboardedClients') || '[]')
                    const newClients = successData.map(client => ({
                        ...client,
                        id: Date.now() + Math.random(), // Unique ID
                        onboardedDate: new Date().toISOString(),
                        status: 'In Progress',
                        goals: [], // Empty goals for bulk upload
                        budget: client.budget || 'Not specified',
                        timeline: client.timeline || 'Not specified'
                    }))
                    const allClients = [...existingClients, ...newClients]
                    localStorage.setItem('onboardedClients', JSON.stringify(allClients))

                    // Update clients state
                    setClients(allClients)
                }

                setUploadResults({
                    total: lines.length - 1,
                    success: successData.length,
                    failed: failedData.length,
                    successData,
                    failedData
                })
            } catch (error) {
                showToast('Error parsing CSV file. Please check the format.', 'error')
            }
        }
        reader.readAsText(file)
    }

    const downloadTemplate = () => {
        const template = 'companyName,industry,website,companyEmail,companyPhone,contactName,contactEmail,contactPhone\nAcme Corp,Technology,https://acme.com,info@acme.com,+91-9876543210,John Doe,john@acme.com,+91-9876543211'
        const blob = new Blob([template], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'client_onboarding_template.csv'
        a.click()
    }

    const handleEditClient = (client) => {
        setEditingClient(client)
        setEditFormData({ ...client })
    }

    const handleSaveEdit = () => {
        const updatedClients = clients.map(c =>
            c.id === editingClient.id ? { ...editFormData, id: c.id, onboardedDate: c.onboardedDate } : c
        )
        localStorage.setItem('onboardedClients', JSON.stringify(updatedClients))
        setClients(updatedClients)
        setEditingClient(null)
        setEditFormData(null)
        showToast('Client updated successfully!', 'success')
    }

    const handleDeleteClient = async (clientId) => {
        const confirmed = await modal.danger('Delete Client', 'Are you sure you want to delete this client?', { confirmText: 'Delete' })
        if (confirmed) {
            const updatedClients = clients.filter(c => c.id !== clientId)
            localStorage.setItem('onboardedClients', JSON.stringify(updatedClients))
            setClients(updatedClients)
            showToast('Client deleted successfully!', 'success')
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Client Onboarding Automation
                        </h1>
                        <p className="text-gray-600 text-lg">Streamline your client onboarding with intelligent workflows</p>
                    </div>
                    <button
                        onClick={() => setShowBulkUpload(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <Upload size={20} />
                        Bulk Upload
                    </button>
                </div>

                {/* View Toggle */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setViewMode('onboard')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${viewMode === 'onboard'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border hover:bg-gray-50'
                            }`}
                    >
                        <Users className="inline mr-2" size={18} />
                        Onboard New Client
                    </button>
                    <button
                        onClick={() => {
                            setViewMode('list')
                            setClients(JSON.parse(localStorage.getItem('onboardedClients') || '[]'))
                        }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${viewMode === 'list'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="inline mr-2" size={18} />
                        View Clients ({clients.length})
                    </button>
                </div>
            </div>

            {/* Client List View */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Onboarded Clients</h2>

                        {/* Status Filter */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-600">Filter by Status:</span>
                            <div className="flex gap-2">
                                {['All', 'In Progress', 'On Hold', 'Delivered'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${statusFilter === status
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status}
                                        {status !== 'All' && ` (${clients.filter(c => c.status === status).length})`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {clients.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto text-gray-400 mb-4" size={64} />
                            <p className="text-gray-600 text-lg mb-2">No clients onboarded yet</p>
                            <p className="text-gray-500 mb-6">Start by onboarding your first client</p>
                            <button
                                onClick={() => setViewMode('onboard')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Onboard New Client
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {clients
                                .filter(client => statusFilter === 'All' || client.status === statusFilter ||
                                    (statusFilter === 'In Progress' && client.status === 'Active') ||
                                    (statusFilter === 'On Hold' && client.status === 'Pending') ||
                                    (statusFilter === 'Delivered' && client.status === 'Completed'))
                                .map((client) => (
                                    <div key={client.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{client.companyName}</h3>
                                                <p className="text-gray-600">{client.industry}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${client.status === 'In Progress' || client.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    client.status === 'On Hold' || client.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        client.status === 'Delivered' || client.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {(client.status === 'In Progress' || client.status === 'Active') && '🟢 '}
                                                    {(client.status === 'On Hold' || client.status === 'Pending') && '🟡 '}
                                                    {(client.status === 'Delivered' || client.status === 'Completed') && '✅ '}
                                                    {client.status}
                                                </span>
                                                <button
                                                    onClick={() => handleEditClient(client)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Client"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClient(client.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Client"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Website</p>
                                                <p className="font-semibold text-blue-600">
                                                    <a href={client.website} target="_blank" rel="noopener noreferrer">
                                                        {client.website}
                                                    </a>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-semibold">{client.companyEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Contact Person</p>
                                                <p className="font-semibold">{client.contactName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Contact Email</p>
                                                <p className="font-semibold">{client.contactEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Budget</p>
                                                <p className="font-semibold">{client.budget}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Timeline</p>
                                                <p className="font-semibold">{client.timeline}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">Goals</p>
                                            <div className="flex flex-wrap gap-2">
                                                {client.goals.map((goal, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Onboarded: {new Date(client.onboardedDate).toLocaleDateString()} at {new Date(client.onboardedDate).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}

            {/* Onboarding Form View */}
            {viewMode === 'onboard' && (
                <>
                    {/* Feature Overview Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                            <Users className="text-blue-600 mb-3" size={32} />
                            <h3 className="font-semibold text-gray-900 mb-2">Smart Forms</h3>
                            <p className="text-sm text-gray-600">Collect client information efficiently with validation</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                            <FileText className="text-purple-600 mb-3" size={32} />
                            <h3 className="font-semibold text-gray-900 mb-2">Bulk Upload</h3>
                            <p className="text-sm text-gray-600">Upload multiple clients via CSV with error tracking</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                            <Calendar className="text-pink-600 mb-3" size={32} />
                            <h3 className="font-semibold text-gray-900 mb-2">Auto Validation</h3>
                            <p className="text-sm text-gray-600">Real-time validation and error detection</p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex justify-between">
                            {steps.map(step => (
                                <div key={step.number} className="flex-1">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step.number < currentStep
                                                ? 'bg-green-600 text-white'
                                                : step.number === currentStep
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {step.number < currentStep ? <Check size={20} /> : step.number}
                                        </div>
                                        {step.number < steps.length && (
                                            <div
                                                className={`flex-1 h-1 mx-2 ${step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'}`}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs mt-2 text-center font-medium">{step.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border">
                        {/* Step 1: Company Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4">Company Information</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Acme Corporation"
                                        />
                                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Industry <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.industry}
                                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.industry ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select industry...</option>
                                            <option>Technology</option>
                                            <option>Healthcare</option>
                                            <option>Finance</option>
                                            <option>Retail</option>
                                            <option>Manufacturing</option>
                                            <option>Education</option>
                                            <option>Real Estate</option>
                                            <option>Hospitality</option>
                                            <option>Other</option>
                                        </select>
                                        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Website <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="https://example.com"
                                        />
                                        {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                                        <select
                                            value={formData.companySize}
                                            onChange={e => setFormData({ ...formData, companySize: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Select size...</option>
                                            <option>1-10 employees</option>
                                            <option>11-50 employees</option>
                                            <option>51-200 employees</option>
                                            <option>201-500 employees</option>
                                            <option>500+ employees</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Company Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.companyEmail}
                                            onChange={e => setFormData({ ...formData, companyEmail: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg ${errors.companyEmail ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="info@company.com"
                                        />
                                        {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.companyPhone}
                                            onChange={e => setFormData({ ...formData, companyPhone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tax ID / GST Number</label>
                                        <input
                                            type="text"
                                            value={formData.taxId}
                                            onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm text-blue-900 font-semibold">Required Fields</p>
                                        <p className="text-sm text-blue-700">Fields marked with * are mandatory for onboarding</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Goals & Budget */}
                        {currentStep === 2 && (
                            canAccessOnboarding ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold mb-4">Goals & Budget</h2>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Marketing Goals <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {goals.map(goal => (
                                                <button
                                                    key={goal}
                                                    onClick={() => toggleGoal(goal)}
                                                    className={`p-4 border-2 rounded-lg text-left transition-all ${formData.goals.includes(goal)
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.goals.includes(goal)
                                                                ? 'bg-blue-600 border-blue-600'
                                                                : 'border-gray-300'
                                                                }`}
                                                        >
                                                            {formData.goals.includes(goal) && <Check size={14} className="text-white" />}
                                                        </div>
                                                        <span className="text-sm font-medium">{goal}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.goals && <p className="text-red-500 text-sm mt-2">{errors.goals}</p>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Monthly Budget <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select budget range...</option>
                                                <option>₹25,000 - ₹50,000</option>
                                                <option>₹50,000 - ₹1,00,000</option>
                                                <option>₹1,00,000 - ₹2,50,000</option>
                                                <option>₹2,50,000 - ₹5,00,000</option>
                                                <option>₹5,00,000+</option>
                                            </select>
                                            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Project Timeline <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={formData.timeline}
                                                onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg ${errors.timeline ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Select timeline...</option>
                                                <option>1-3 months</option>
                                                <option>3-6 months</option>
                                                <option>6-12 months</option>
                                                <option>12+ months</option>
                                                <option>Ongoing</option>
                                            </select>
                                            {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <LockedFeature
                                    title="Advanced Onboarding Features"
                                    description="Unlock goal tracking, budget planning, and timeline management"
                                    requiredPlan="Advanced or Premium"
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold mb-4">Goals & Budget</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {goals.slice(0, 4).map(goal => (
                                                <div key={goal} className="p-4 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded border"></div>
                                                        <span className="text-sm">{goal}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </LockedFeature>
                            )
                        )}

                        {/* Step 3: Contact Details */}
                        {currentStep === 3 && (
                            canAccessOnboarding ? (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Contact Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.contactName}
                                                onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="John Doe"
                                            />
                                            {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Role</label>
                                            <select
                                                value={formData.contactRole}
                                                onChange={e => setFormData({ ...formData, contactRole: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Select role...</option>
                                                <option>CEO/Founder</option>
                                                <option>Marketing Manager</option>
                                                <option>Business Owner</option>
                                                <option>Project Manager</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Contact Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="john@company.com"
                                            />
                                            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.contactPhone}
                                                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-6">
                                        <div className="flex items-start gap-4">
                                            <Sparkles className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-2">AI-Powered Insights</h4>
                                                <p className="text-sm text-blue-700 mb-3">
                                                    Our AI will analyze the client profile and suggest:
                                                </p>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    <li>• Personalized onboarding strategies</li>
                                                    <li>• Recommended service packages</li>
                                                    <li>• Optimal communication channels</li>
                                                    <li>• Success probability score</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <LockedFeature
                                    title="Contact Management & AI Insights"
                                    description="Access advanced contact management and AI-powered client insights"
                                    requiredPlan="Advanced or Premium"
                                >
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <input type="text" className="w-full px-4 py-3 border rounded-lg" placeholder="Contact Name" />
                                            <input type="email" className="w-full px-4 py-3 border rounded-lg" placeholder="Contact Email" />
                                        </div>
                                    </div>
                                </LockedFeature>
                            )
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4">Review & Confirm</h2>

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                            <Users size={20} /> Company Information
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            <p><span className="font-medium">Company:</span> {formData.companyName}</p>
                                            <p><span className="font-medium">Industry:</span> {formData.industry}</p>
                                            <p><span className="font-medium">Website:</span> {formData.website}</p>
                                            <p><span className="font-medium">Size:</span> {formData.companySize || 'Not specified'}</p>
                                            <p><span className="font-medium">Email:</span> {formData.companyEmail}</p>
                                            <p><span className="font-medium">Phone:</span> {formData.companyPhone || 'Not specified'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                                        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                            <FileText size={20} /> Goals & Budget
                                        </h3>
                                        <div className="text-sm space-y-2">
                                            <p><span className="font-medium">Goals:</span> {formData.goals.join(', ') || 'None selected'}</p>
                                            <p><span className="font-medium">Budget:</span> {formData.budget}</p>
                                            <p><span className="font-medium">Timeline:</span> {formData.timeline}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                                        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                            <Calendar size={20} /> Contact Details
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            <p><span className="font-medium">Name:</span> {formData.contactName}</p>
                                            <p><span className="font-medium">Role:</span> {formData.contactRole || 'Not specified'}</p>
                                            <p><span className="font-medium">Email:</span> {formData.contactEmail}</p>
                                            <p><span className="font-medium">Phone:</span> {formData.contactPhone || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                    <CheckCircle className="text-green-600" size={24} />
                                    <p className="text-sm text-green-900 font-medium">All information verified and ready for submission</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-8 pt-6 border-t">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-all"
                                >
                                    Back
                                </button>
                            )}
                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                                >
                                    Next Step
                                    <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                                >
                                    <CheckCircle size={20} />
                                    Complete Onboarding
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bulk Upload Modal */}
                    {showBulkUpload && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Bulk Client Upload</h2>
                                        <p className="text-white/90">Upload multiple clients via CSV file</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowBulkUpload(false)
                                            setUploadResults(null)
                                        }}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                    {!uploadResults ? (
                                        <div className="space-y-6">
                                            {/* Instructions */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
                                                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                                                    <li>Download the CSV template below</li>
                                                    <li>Fill in your client data (one client per row)</li>
                                                    <li>Required fields: companyName, industry, companyEmail</li>
                                                    <li>Upload the completed CSV file</li>
                                                </ol>
                                            </div>

                                            {/* Download Template */}
                                            <button
                                                onClick={downloadTemplate}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                            >
                                                <Download size={20} />
                                                Download CSV Template
                                            </button>

                                            {/* Upload Area */}
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
                                                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                                <p className="text-gray-700 font-semibold mb-2">Drop your CSV file here or click to browse</p>
                                                <p className="text-gray-500 text-sm mb-4">Maximum file size: 5MB</p>
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleBulkUpload}
                                                    className="hidden"
                                                    id="csv-upload"
                                                />
                                                <label
                                                    htmlFor="csv-upload"
                                                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                                                >
                                                    Select CSV File
                                                </label>
                                            </div>

                                            {/* CSV Format Example */}
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2">CSV Format Example:</h3>
                                                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                                                    {`companyName,industry,website,companyEmail,companyPhone,contactName,contactEmail,contactPhone
Acme Corp,Technology,https://acme.com,info@acme.com,+91-9876543210,John Doe,john@acme.com,+91-9876543211
Tech Solutions,IT Services,https://techsol.com,contact@techsol.com,+91-9876543212,Jane Smith,jane@techsol.com,+91-9876543213`}
                                                </pre>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Results Summary */}
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                                    <p className="text-3xl font-bold text-blue-600">{uploadResults.total}</p>
                                                    <p className="text-sm text-gray-600">Total Records</p>
                                                </div>
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                                    <p className="text-3xl font-bold text-green-600">{uploadResults.success}</p>
                                                    <p className="text-sm text-gray-600">Successful</p>
                                                </div>
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                    <p className="text-3xl font-bold text-red-600">{uploadResults.failed}</p>
                                                    <p className="text-sm text-gray-600">Failed</p>
                                                </div>
                                            </div>

                                            {/* Success Data */}
                                            {uploadResults.successData.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                                        <CheckCircle size={20} className="text-green-600" />
                                                        Successfully Uploaded ({uploadResults.successData.length})
                                                    </h3>
                                                    <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                                                        <div className="max-h-60 overflow-y-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-green-100 sticky top-0">
                                                                    <tr>
                                                                        <th className="px-4 py-2 text-left">Company</th>
                                                                        <th className="px-4 py-2 text-left">Industry</th>
                                                                        <th className="px-4 py-2 text-left">Email</th>
                                                                        <th className="px-4 py-2 text-left">Contact</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {uploadResults.successData.map((row, i) => (
                                                                        <tr key={i} className="border-t border-green-200">
                                                                            <td className="px-4 py-2">{row.companyName}</td>
                                                                            <td className="px-4 py-2">{row.industry}</td>
                                                                            <td className="px-4 py-2">{row.companyEmail}</td>
                                                                            <td className="px-4 py-2">{row.contactName}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Failed Data */}
                                            {uploadResults.failedData.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                                                        <XCircle size={20} className="text-red-600" />
                                                        Failed Records ({uploadResults.failedData.length})
                                                    </h3>
                                                    <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                                                        <div className="max-h-60 overflow-y-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-red-100 sticky top-0">
                                                                    <tr>
                                                                        <th className="px-4 py-2 text-left">Company</th>
                                                                        <th className="px-4 py-2 text-left">Email</th>
                                                                        <th className="px-4 py-2 text-left">Reason</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {uploadResults.failedData.map((row, i) => (
                                                                        <tr key={i} className="border-t border-red-200">
                                                                            <td className="px-4 py-2">{row.companyName || 'N/A'}</td>
                                                                            <td className="px-4 py-2">{row.companyEmail || 'N/A'}</td>
                                                                            <td className="px-4 py-2 text-red-700">{row.reason}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setUploadResults(null)}
                                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                                >
                                                    Upload Another File
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowBulkUpload(false)
                                                        setUploadResults(null)
                                                        // Refresh clients list
                                                        setClients(JSON.parse(localStorage.getItem('onboardedClients') || '[]'))
                                                        showToast(`${uploadResults.success} clients onboarded successfully! Click "View Clients" to see them.`, 'success')
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                                >
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Edit Client Modal */}
            {editingClient && editFormData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Edit Client</h2>
                                <p className="text-white/90">Update client information</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingClient(null)
                                    setEditFormData(null)
                                }}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Company Information */}
                            <div>
                                <h3 className="text-lg font-bold mb-4">Company Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.companyName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                                        <input
                                            type="text"
                                            value={editFormData.industry || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                                        <input
                                            type="url"
                                            value={editFormData.website || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.companyEmail || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, companyEmail: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Phone</label>
                                        <input
                                            type="tel"
                                            value={editFormData.companyPhone || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, companyPhone: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.contactName || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.contactEmail || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, contactEmail: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                                        <input
                                            type="tel"
                                            value={editFormData.contactPhone || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, contactPhone: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Project Status */}
                            <div>
                                <h3 className="text-lg font-bold mb-4">Project Status</h3>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        value={editFormData.status || 'In Progress'}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {editFormData.status === 'In Progress' && '🟢 Project is actively being worked on'}
                                        {editFormData.status === 'On Hold' && '🟡 Awaiting client feedback or resources'}
                                        {editFormData.status === 'Delivered' && '✅ Project successfully delivered to client'}
                                    </p>
                                </div>
                            </div>

                            {/* Budget & Timeline */}
                            <div>
                                <h3 className="text-lg font-bold mb-4">Budget & Timeline</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Budget</label>
                                        <select
                                            value={editFormData.budget || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select budget range...</option>
                                            <option>₹25,000 - ₹50,000</option>
                                            <option>₹50,000 - ₹1,00,000</option>
                                            <option>₹1,00,000 - ₹2,50,000</option>
                                            <option>₹2,50,000 - ₹5,00,000</option>
                                            <option>₹5,00,000+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Timeline</label>
                                        <select
                                            value={editFormData.timeline || ''}
                                            onChange={(e) => setEditFormData({ ...editFormData, timeline: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select timeline...</option>
                                            <option>1-3 months</option>
                                            <option>3-6 months</option>
                                            <option>6-12 months</option>
                                            <option>12+ months</option>
                                            <option>Ongoing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        setEditingClient(null)
                                        setEditFormData(null)
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
