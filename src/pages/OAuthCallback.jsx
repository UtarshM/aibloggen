/**
 * OAuth Callback Page - Handles OAuth redirects
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const error = searchParams.get('error');
        const success = searchParams.get('success');

        if (error) {
            setStatus(`Login failed: ${error}`);
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (success) {
            // OAuth connection success
            setStatus(`${success.replace('_', ' ')} successfully!`);
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
        }

        if (token) {
            // OAuth login success
            localStorage.setItem('token', token);
            if (name) {
                localStorage.setItem('user', JSON.stringify({ name: decodeURIComponent(name) }));
            }
            setStatus('Login successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1000);
        } else {
            setStatus('No authentication data received');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">AI</span>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">{status}</p>
            </div>
        </div>
    );
}
