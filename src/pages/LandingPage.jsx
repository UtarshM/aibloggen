import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { api } from '../api/client';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Track affiliate referral on page load
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            // Save referral to localStorage (persists for 30 days worth of sessions)
            localStorage.setItem('affiliate_ref', ref);
            localStorage.setItem('affiliate_ref_time', Date.now().toString());

            // Track the click on backend
            api.affiliateTrackClick(ref, window.location.pathname, document.referrer)
                .then(() => console.log('[Affiliate] Click tracked for:', ref))
                .catch(err => console.log('[Affiliate] Track error:', err));
        }
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const features = [
        {
            icon: '✨',
            title: 'AI Content Generation',
            description: 'Create human-like, SEO-optimized content in seconds with our advanced AI engine.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: '📊',
            title: 'SEO Analysis',
            description: 'Get detailed insights and recommendations to boost your website rankings.',
            gradient: 'from-cyan-500 to-blue-400'
        },
        {
            icon: '📱',
            title: 'Social Media Manager',
            description: 'Schedule and manage posts across all your social media platforms.',
            gradient: 'from-blue-600 to-indigo-500'
        },
        {
            icon: '🎯',
            title: 'Lead Management',
            description: 'Track, score, and nurture leads with AI-powered insights.',
            gradient: 'from-indigo-500 to-blue-500'
        },
        {
            icon: '💬',
            title: 'AI Chat Assistant',
            description: 'Get instant answers and marketing advice from our intelligent chatbot.',
            gradient: 'from-cyan-400 to-blue-500'
        },
        {
            icon: '📈',
            title: 'Campaign Analytics',
            description: 'Monitor performance and optimize your marketing campaigns in real-time.',
            gradient: 'from-blue-500 to-cyan-600'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '1M+', label: 'Content Generated' },
        { number: '99.9%', label: 'Uptime' },
        { number: '24/7', label: 'Support' }
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>

                {/* Animated Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
                />

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Mouse Follow Effect */}
                <motion.div
                    className="absolute w-64 h-64 bg-blue-400/5 rounded-full blur-2xl pointer-events-none"
                    animate={{
                        x: mousePosition.x - 128,
                        y: mousePosition.y - 128,
                    }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 200,
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
                        : 'bg-transparent'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl font-bold">AI</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Marketing Platform
                            </span>
                        </motion.div>

                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Sign Up
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent leading-tight">
                                AI-Powered Marketing
                                <br />
                                Made Simple
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Transform your marketing with cutting-edge AI tools. Create content, analyze SEO, manage campaigns, and grow your business faster than ever.
                            </p>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Hero Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="mt-16 relative"
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100">
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <motion.div
                                            animate={{ width: ['60%', '75%', '60%'] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="h-4 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg"
                                        />
                                        <motion.div
                                            animate={{ width: ['80%', '100%', '80%'] }}
                                            transition={{ duration: 3.5, repeat: Infinity }}
                                            className="h-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg"
                                        />
                                        <motion.div
                                            animate={{ width: ['70%', '85%', '70%'] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center text-white"
                                >
                                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                    <div className="text-blue-100 text-sm md:text-base">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Powerful Features
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Everything you need to supercharge your marketing efforts
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-md`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 px-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds' },
                                { step: '2', title: 'Choose Tools', desc: 'Select from our powerful AI tools' },
                                { step: '3', title: 'Grow Business', desc: 'Watch your marketing soar' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Marketing?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of marketers already using our platform
                        </p>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                Start Free Trial
                            </motion.button>
                        </Link>
                    </motion.div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
