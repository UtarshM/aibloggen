import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../api/client';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState({ loading: false, message: '', error: false });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setSubscribeStatus({ loading: false, message: 'Please enter a valid email', error: true });
            return;
        }

        setSubscribeStatus({ loading: true, message: '', error: false });

        try {
            const result = await api.subscribeNewsletter(email);
            setSubscribeStatus({ loading: false, message: result.message || 'Subscribed successfully!', error: false });
            setEmail('');
            // Clear success message after 5 seconds
            setTimeout(() => setSubscribeStatus({ loading: false, message: '', error: false }), 5000);
        } catch (error) {
            setSubscribeStatus({ loading: false, message: error.message || 'Failed to subscribe', error: true });
        }
    };

    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Use Cases', href: '#' },
            { name: 'Integrations', href: '#' },
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Affiliate Program', href: '/affiliate/apply' },
        ],
        resources: [
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Community', href: '#' },
            { name: 'Support', href: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/policies' },
            { name: 'Terms of Service', href: '/policies' },
            { name: 'Cookie Policy', href: '/policies' },
            { name: 'GDPR', href: '/policies' },
        ],
    };

    const socialLinks = [
        {
            name: 'Twitter',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            ),
            href: '#',
        },
        {
            name: 'GitHub',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
            ),
            href: '#',
        },
        {
            name: 'LinkedIn',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            href: '#',
        },
        {
            name: 'YouTube',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
            href: '#',
        },
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-6"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="text-white text-2xl font-bold">AI</span>
                                    </div>
                                    <span className="text-2xl font-bold">Marketing Platform</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    Transform your marketing with cutting-edge AI tools. Create content, analyze SEO, and grow your business faster than ever.
                                </p>
                                {/* Social Links */}
                                <div className="flex space-x-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-600 rounded-lg flex items-center justify-center transition-all duration-300"
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Links Sections */}
                        {Object.entries(footerLinks).map(([category, links], index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
                                <ul className="space-y-3">
                                    {links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                to={link.href}
                                                className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                                            >
                                                <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-800 pt-12 mb-12"
                    >
                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
                            <p className="text-gray-400 mb-6">
                                Get the latest AI marketing tips and updates delivered to your inbox.
                            </p>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 text-white placeholder-gray-500"
                                    disabled={subscribeStatus.loading}
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={subscribeStatus.loading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                                >
                                    {subscribeStatus.loading ? 'Subscribing...' : 'Subscribe'}
                                </motion.button>
                            </form>
                            {subscribeStatus.message && (
                                <p className={`mt-3 text-sm ${subscribeStatus.error ? 'text-red-400' : 'text-green-400'}`}>
                                    {subscribeStatus.message}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-gray-400 text-sm">
                                © {currentYear} AI Marketing Platform. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <Link to="/policies" className="hover:text-white transition-colors duration-300">
                                    Privacy
                                </Link>
                                <Link to="/policies" className="hover:text-white transition-colors duration-300">
                                    Terms
                                </Link>
                                <Link to="/policies" className="hover:text-white transition-colors duration-300">
                                    Cookies
                                </Link>
                            </div>
                            <div className="text-gray-500 text-sm">
                                Made with ❤️ by <span className="text-white font-semibold">Scalezix Venture PVT LTD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
