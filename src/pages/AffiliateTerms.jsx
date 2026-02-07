/**
 * Affiliate Terms & Conditions Page
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import { Link } from 'react-router-dom'
import { DollarSign, ArrowLeft } from 'lucide-react'

export default function AffiliateTerms() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/affiliate/apply" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
                        <ArrowLeft size={20} />
                        Back to Application
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Affiliate Program Terms & Conditions</h1>
                            <p className="text-gray-500">Last updated: December 2025</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Program Overview</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The Scalezix Affiliate Program allows approved affiliates to earn <strong>20% lifetime recurring commission</strong> on all payments made by customers they refer to our platform. This commission applies to all subscription plans and is paid for as long as the referred customer remains a paying subscriber.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Commission Structure</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li><strong>Commission Rate:</strong> 20% of all payments made by referred customers</li>
                            <li><strong>Commission Type:</strong> Lifetime recurring (as long as customer pays)</li>
                            <li><strong>Cookie Duration:</strong> 30 days from first click</li>
                            <li><strong>Minimum Payout:</strong> ₹50,000 (INR)</li>
                            <li><strong>Payout Schedule:</strong> Monthly (processed within 5 business days)</li>
                            <li><strong>Payment Methods:</strong> Bank Transfer, UPI, PayPal</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Eligibility & Approval</h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            All affiliate applications are manually reviewed by our team. We reserve the right to approve or reject any application at our sole discretion. Factors we consider include:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Quality and relevance of your audience</li>
                            <li>Your promotion methods and channels</li>
                            <li>Alignment with our brand values</li>
                            <li>Previous affiliate marketing experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Prohibited Activities</h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            The following activities are strictly prohibited and may result in immediate termination:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Self-referrals or referring your own accounts</li>
                            <li>Using paid ads that bid on our brand name or trademarks</li>
                            <li>Spam, unsolicited emails, or deceptive marketing</li>
                            <li>Creating fake accounts or fraudulent referrals</li>
                            <li>Misrepresenting our products or services</li>
                            <li>Using cookie stuffing or other fraudulent techniques</li>
                            <li>Promoting on adult, illegal, or harmful content sites</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Referral Tracking</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Referrals are tracked using a unique referral link provided to each affiliate. When a visitor clicks your link, a 30-day cookie is set. If they sign up and become a paying customer within this period, you receive credit for the referral. The referral must be the first-click attribution (first affiliate link clicked gets credit).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">6. Payment Terms</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Commissions are calculated at the end of each month</li>
                            <li>Minimum withdrawal amount is ₹50,000</li>
                            <li>Withdrawals are processed within 3-5 business days</li>
                            <li>You are responsible for any applicable taxes on your earnings</li>
                            <li>Chargebacks or refunds will result in commission reversal</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">7. Termination</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Either party may terminate this agreement at any time. Upon termination, you will receive any outstanding commissions for valid referrals made before termination. We reserve the right to withhold commissions if we suspect fraudulent activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">8. Modifications</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Significant changes will be communicated via email. Continued participation in the program after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">9. Contact</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For questions about the affiliate program, contact us at <a href="mailto:affiliates@scalezix.com" className="text-primary-500 hover:underline">affiliates@scalezix.com</a>
                        </p>
                    </section>

                    <div className="pt-6 border-t">
                        <p className="text-sm text-gray-500 text-center">
                            By joining our affiliate program, you agree to these terms and conditions.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <Link
                        to="/affiliate/apply"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-400 to-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Apply Now <DollarSign size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
