/**
 * AI Marketing Platform - Policies Page
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import { useState } from 'react'
import { Shield, FileText, Cookie, Lock, Eye, AlertCircle, CheckCircle } from 'lucide-react'

export default function Policies() {
    const [activeTab, setActiveTab] = useState('privacy')

    const tabs = [
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'terms', label: 'Terms of Service', icon: FileText },
        { id: 'cookie', label: 'Cookie Policy', icon: Cookie },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'gdpr', label: 'GDPR Compliance', icon: Eye }
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Legal & Policies</h1>
                <p className="text-gray-600">Our commitment to your privacy and security</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-primary-500 border-b-2 border-primary-400 bg-primary-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                <div className="p-8">
                    {/* Privacy Policy */}
                    {activeTab === 'privacy' && (
                        <div className="prose max-w-none">
                            <h2 className="text-3xl font-bold mb-4">Privacy Policy</h2>
                            <p className="text-gray-600 mb-6">Last updated: January 20, 2025</p>

                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">1. Information We Collect</h3>
                                    <p className="text-gray-700 mb-3">We collect information that you provide directly to us, including:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Personal identification information (Name, email address, phone number)</li>
                                        <li>Professional information (Company name, job title, department)</li>
                                        <li>Account credentials and authentication data</li>
                                        <li>Payment and billing information</li>
                                        <li>Usage data and analytics</li>
                                        <li>Communication preferences</li>
                                        <li>Marketing campaign data</li>
                                        <li>Client and customer information you input</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Provide, maintain, and improve our services</li>
                                        <li>Process transactions and send related information</li>
                                        <li>Send technical notices and support messages</li>
                                        <li>Respond to your comments and questions</li>
                                        <li>Generate analytics and insights</li>
                                        <li>Personalize your experience</li>
                                        <li>Detect and prevent fraud</li>
                                        <li>Comply with legal obligations</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">3. Data Sharing and Disclosure</h3>
                                    <p className="text-gray-700 mb-3">We may share your information in the following circumstances:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>With your consent or at your direction</li>
                                        <li>With service providers who perform services on our behalf</li>
                                        <li>For legal compliance and protection</li>
                                        <li>In connection with a merger, sale, or acquisition</li>
                                        <li>With AI service providers (Google AI, OpenRouter) for processing</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">4. Data Security</h3>
                                    <p className="text-gray-700">We implement appropriate technical and organizational measures to protect your data, including:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                                        <li>Encryption of data in transit and at rest</li>
                                        <li>Regular security audits and assessments</li>
                                        <li>Access controls and authentication</li>
                                        <li>Secure data centers and infrastructure</li>
                                        <li>Employee training on data protection</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">5. Your Rights</h3>
                                    <p className="text-gray-700 mb-3">You have the right to:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Access your personal data</li>
                                        <li>Correct inaccurate data</li>
                                        <li>Request deletion of your data</li>
                                        <li>Object to processing of your data</li>
                                        <li>Data portability</li>
                                        <li>Withdraw consent at any time</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">6. Contact Us</h3>
                                    <p className="text-gray-700">For privacy-related questions, contact us at:</p>
                                    <p className="text-gray-700 mt-2">Email: privacy@aimarketing.com</p>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* Terms of Service */}
                    {activeTab === 'terms' && (
                        <div className="prose max-w-none">
                            <h2 className="text-3xl font-bold mb-4">Terms of Service</h2>
                            <p className="text-gray-600 mb-6">Last updated: January 20, 2025</p>

                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h3>
                                    <p className="text-gray-700">By accessing and using AI Marketing Platform, you accept and agree to be bound by these Terms of Service.</p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">2. Service Description</h3>
                                    <p className="text-gray-700 mb-3">AI Marketing Platform provides:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>AI-powered content creation and publishing tools</li>
                                        <li>WordPress auto-publishing integration</li>
                                        <li>Bulk content generation</li>
                                        <li>Human content engine (AI detection bypass)</li>
                                        <li>Job history and analytics</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">3. User Responsibilities</h3>
                                    <p className="text-gray-700 mb-3">You agree to:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Provide accurate and complete information</li>
                                        <li>Maintain the security of your account</li>
                                        <li>Use the service in compliance with applicable laws</li>
                                        <li>Not misuse or abuse the platform</li>
                                        <li>Not attempt to gain unauthorized access</li>
                                        <li>Respect intellectual property rights</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">4. Subscription and Payment</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Subscriptions are billed monthly or annually</li>
                                        <li>Prices are in Indian Rupees (INR)</li>
                                        <li>Automatic renewal unless cancelled</li>
                                        <li>30-day money-back guarantee</li>
                                        <li>Refunds processed within 7-10 business days</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">5. Intellectual Property</h3>
                                    <p className="text-gray-700">All content, features, and functionality are owned by Scalezix Venture PVT LTD and protected by copyright, trademark, and other intellectual property laws.</p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h3>
                                    <p className="text-gray-700">We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">7. Termination</h3>
                                    <p className="text-gray-700">We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.</p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">8. Governing Law</h3>
                                    <p className="text-gray-700">These Terms shall be governed by the laws of India, without regard to conflict of law provisions.</p>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* Cookie Policy */}
                    {activeTab === 'cookie' && (
                        <div className="prose max-w-none">
                            <h2 className="text-3xl font-bold mb-4">Cookie Policy</h2>
                            <p className="text-gray-600 mb-6">Last updated: January 20, 2025</p>

                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">What Are Cookies?</h3>
                                    <p className="text-gray-700">Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Types of Cookies We Use</h3>
                                    <div className="space-y-4">
                                        <div className="bg-primary-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-blue-900 mb-2">Essential Cookies</h4>
                                            <p className="text-gray-700 text-sm">Required for the website to function properly. Cannot be disabled.</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-green-900 mb-2">Analytics Cookies</h4>
                                            <p className="text-gray-700 text-sm">Help us understand how visitors interact with our website.</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-purple-900 mb-2">Functional Cookies</h4>
                                            <p className="text-gray-700 text-sm">Remember your preferences and settings.</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-orange-900 mb-2">Marketing Cookies</h4>
                                            <p className="text-gray-700 text-sm">Track your activity to deliver relevant advertisements.</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Managing Cookies</h3>
                                    <p className="text-gray-700">You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.</p>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <div className="prose max-w-none">
                            <h2 className="text-3xl font-bold mb-4">Security Measures</h2>
                            <p className="text-gray-600 mb-6">How we protect your data</p>

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Data Encryption', desc: 'AES-256 encryption for data at rest and TLS 1.3 for data in transit', icon: Lock },
                                        { title: 'Access Control', desc: 'Role-based access control and multi-factor authentication', icon: Shield },
                                        { title: 'Regular Audits', desc: 'Third-party security audits and penetration testing', icon: CheckCircle },
                                        { title: 'Monitoring', desc: '24/7 security monitoring and incident response', icon: Eye },
                                        { title: 'Backup', desc: 'Daily automated backups with 30-day retention', icon: FileText },
                                        { title: 'Compliance', desc: 'GDPR, SOC 2, and ISO 27001 compliant', icon: AlertCircle }
                                    ].map((item, i) => {
                                        const Icon = item.icon
                                        return (
                                            <div key={i} className="bg-gray-50 p-6 rounded-lg border">
                                                <Icon className="text-primary-500 mb-3" size={32} />
                                                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                                                <p className="text-gray-600 text-sm">{item.desc}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <section className="mt-8">
                                    <h3 className="text-2xl font-semibold mb-3">Incident Response</h3>
                                    <p className="text-gray-700 mb-3">In the event of a security breach:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Immediate containment and investigation</li>
                                        <li>Notification within 72 hours</li>
                                        <li>Detailed incident report</li>
                                        <li>Remediation and prevention measures</li>
                                    </ul>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* GDPR Compliance */}
                    {activeTab === 'gdpr' && (
                        <div className="prose max-w-none">
                            <h2 className="text-3xl font-bold mb-4">GDPR Compliance</h2>
                            <p className="text-gray-600 mb-6">Our commitment to data protection</p>

                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Your GDPR Rights</h3>
                                    <div className="space-y-3">
                                        {[
                                            { title: 'Right to Access', desc: 'Request a copy of your personal data' },
                                            { title: 'Right to Rectification', desc: 'Correct inaccurate or incomplete data' },
                                            { title: 'Right to Erasure', desc: 'Request deletion of your data' },
                                            { title: 'Right to Restrict Processing', desc: 'Limit how we use your data' },
                                            { title: 'Right to Data Portability', desc: 'Receive your data in a structured format' },
                                            { title: 'Right to Object', desc: 'Object to processing of your data' },
                                            { title: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time' }
                                        ].map((right, i) => (
                                            <div key={i} className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                                                <CheckCircle className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{right.title}</h4>
                                                    <p className="text-gray-600 text-sm">{right.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Data Processing</h3>
                                    <p className="text-gray-700 mb-3">We process your data based on:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Your consent</li>
                                        <li>Contract performance</li>
                                        <li>Legal obligations</li>
                                        <li>Legitimate interests</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Data Retention</h3>
                                    <p className="text-gray-700">We retain your data only as long as necessary for the purposes outlined in our Privacy Policy, typically:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                                        <li>Account data: Duration of account + 90 days</li>
                                        <li>Transaction records: 7 years (legal requirement)</li>
                                        <li>Marketing data: Until consent is withdrawn</li>
                                        <li>Analytics data: 26 months</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-semibold mb-3">Contact Our DPO</h3>
                                    <p className="text-gray-700">For GDPR-related inquiries, contact our Data Protection Officer:</p>
                                    <p className="text-gray-700 mt-2">Email: dpo@aimarketing.com</p>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
