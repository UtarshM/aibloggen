/**
 * Landing Page - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * Clean, modern marketing landing page
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { api } from '../api/client';
import {
    Sparkles, ArrowRight, CheckCircle, Zap, BarChart3,
    FileText, Search, Users, Star, Play, Layers
} from 'lucide-react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            localStorage.setItem('affiliate_ref', ref);
            localStorage.setItem('affiliate_ref_time', Date.now().toString());
            api.affiliateTrackClick(ref, window.location.pathname, document.referrer).catch(() => { });
        }
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard');
    }, [navigate]);

    const features = [
        { icon: FileText, title: 'AI Content', description: 'Generate SEO-optimized content in seconds', color: 'from-primary-400 to-primary-500' },
        { icon: Search, title: 'WordPress Publishing', description: 'Auto-publish to your WordPress sites', color: 'from-secondary-400 to-secondary-500' },
        { icon: BarChart3, title: 'Analytics', description: 'Track performance in real-time', color: 'from-success-400 to-success-500' },
        { icon: Layers, title: 'Bulk Generation', description: 'Create multiple articles at once', color: 'from-accent-400 to-accent-500' },
        { icon: Users, title: 'Human Content', description: 'AI detection bypass technology', color: 'from-primary-400 to-secondary-500' },
        { icon: Zap, title: 'Automation', description: 'Automate repetitive tasks', color: 'from-secondary-400 to-primary-500' },
    ];

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '1M+', label: 'Content Created' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' },
    ];

    const testimonials = [
        { name: 'Sarah Johnson', role: 'Marketing Director', text: 'Scalezix transformed our content strategy. We create 10x more content now.', avatar: '👩‍💼' },
        { name: 'Mike Chen', role: 'Startup Founder', text: 'The AI tools are incredible. Saved us thousands in content costs.', avatar: '👨‍💻' },
        { name: 'Emily Davis', role: 'SEO Specialist', text: 'Best SEO tools I\'ve used. Rankings improved within weeks.', avatar: '👩‍🔬' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-soft border-b border-gray-100' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-button">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Scalezix</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Login
                            </motion.button>
                        </Link>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-mesh relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-400/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-medium text-primary-600">Powered by Advanced AI</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            AI Marketing<br />
                            <span className="text-gradient-primary">Made Simple</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Create content, publish to WordPress, and grow your business with powerful AI tools.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary btn-lg shadow-button hover:shadow-button-hover"
                                >
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-secondary btn-lg"
                            >
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </motion.button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 relative"
                    >
                        <div className="bg-white rounded-2xl shadow-soft-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="bg-white rounded-xl p-4 shadow-card"
                                        >
                                            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                                            <div className="h-8 w-16 bg-primary-100 rounded mb-2" />
                                            <div className="h-2 w-full bg-gray-100 rounded" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-primary-400 to-primary-500">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center text-white"
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-primary-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Everything you need
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful tools to supercharge your marketing
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-soft`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Loved by marketers
                        </h2>
                        <p className="text-xl text-gray-600">See what our users are saying</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-400 to-primary-500 rounded-3xl p-12 shadow-soft-2xl"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to transform your marketing?
                    </h2>
                    <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of marketers already using Scalezix to grow their business.
                    </p>
                    <Link to="/signup">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-soft-lg hover:shadow-soft-xl transition-all inline-flex items-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
