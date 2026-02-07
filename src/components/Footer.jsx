/**
 * Footer Component - MacBook Style Premium UI 2025
 * Primary Color: #52B2BF
 * Clean, modern footer design
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../api/client';
import { Sparkles, Send, Twitter, Github, Linkedin, Youtube } from 'lucide-react';

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
            setSubscribeStatus({ loading: false, message: result.message || 'Subscribed!', error: false });
            setEmail('');
            setTimeout(() => setSubscribeStatus({ loading: false, message: '', error: false }), 5000);
        } catch (error) {
            setSubscribeStatus({ loading: false, message: error.message || 'Failed to subscribe', error: true });
        }
    };

    const footerLinks = {
        Product: [
            { name: 'Features', href: '#' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Integrations', href: '#' },
        ],
        Company: [
            { name: 'About', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Affiliate', href: '/affiliate/apply' },
        ],
        Resources: [
            { name: 'Documentation', href: '#' },
            { name: 'Support', href: '#' },
            { name: 'API', href: '#' },
        ],
        Legal: [
            { name: 'Privacy', href: '/policies' },
            { name: 'Terms', href: '/policies' },
            { name: 'Cookies', href: '/policies' },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Scalezix</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            AI-powered marketing tools to create content, analyze SEO, and grow your business.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-9 h-9 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold mb-4 text-sm">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-400 hover:text-white text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-semibold mb-1">Subscribe to our newsletter</h4>
                            <p className="text-gray-400 text-sm">Get the latest updates and tips.</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:border-primary-400 focus:outline-none transition-colors"
                                disabled={subscribeStatus.loading}
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={subscribeStatus.loading}
                                className="px-4 py-2.5 bg-primary-400 hover:bg-primary-500 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </form>
                    </div>
                    {subscribeStatus.message && (
                        <p className={`mt-2 text-sm text-center md:text-right ${subscribeStatus.error ? 'text-red-400' : 'text-emerald-400'}`}>
                            {subscribeStatus.message}
                        </p>
                    )}
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                    <p>© {currentYear} HARSH J KUHIKAR. All rights reserved.</p>
                    <p>Made with ❤️ for marketers worldwide</p>
                </div>
            </div>
        </footer>
    );
}
