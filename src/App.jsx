/**
 * AI Marketing Platform - Main Application
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 * @license Proprietary
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PlanProvider } from './context/PlanContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import PlanSelector from './components/PlanSelector'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Home from './pages/Home'
import ContentCreation from './pages/ContentCreation'
import ClientReporting from './pages/ClientReporting'
import SEOAutomation from './pages/SEOAutomation'
import CampaignOptimization from './pages/CampaignOptimization'
import ClientOnboarding from './pages/ClientOnboarding'
import SocialMediaPro from './pages/SocialMediaPro'
import JobHistory from './pages/JobHistory'
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Policies from './pages/Policies'
import OAuthCallback from './pages/OAuthCallback'
import AffiliateLogin from './pages/AffiliateLogin'
import AffiliateApply from './pages/AffiliateApply'
import AffiliateDashboard from './pages/AffiliateDashboard'
import AffiliateAdmin from './pages/AffiliateAdmin'

// Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
}

// Created by: Scalezix Venture PVT LTD
function App() {
    return (
        <ThemeProvider>
            <PlanProvider>
                <Router
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true
                    }}
                >
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/oauth/callback" element={<OAuthCallback />} />

                        {/* Affiliate Routes */}
                        <Route path="/affiliate/login" element={<AffiliateLogin />} />
                        <Route path="/affiliate/apply" element={<AffiliateApply />} />
                        <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />

                        {/* Protected Dashboard Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <PlanSelector />
                                <Layout>
                                    <Home />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/content-creation" element={
                            <ProtectedRoute>
                                <Layout><ContentCreation /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/client-reporting" element={
                            <ProtectedRoute>
                                <Layout><ClientReporting /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/seo-automation" element={
                            <ProtectedRoute>
                                <Layout><SEOAutomation /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/campaign-optimization" element={
                            <ProtectedRoute>
                                <Layout><CampaignOptimization /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/client-onboarding" element={
                            <ProtectedRoute>
                                <Layout><ClientOnboarding /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/social-media" element={
                            <ProtectedRoute>
                                <Layout><SocialMediaPro /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/job-history" element={
                            <ProtectedRoute>
                                <Layout><JobHistory /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/pricing" element={
                            <ProtectedRoute>
                                <Layout><Pricing /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Layout><Profile /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <Layout><Settings /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/policies" element={
                            <ProtectedRoute>
                                <Layout><Policies /></Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tools/affiliate-admin" element={
                            <ProtectedRoute>
                                <Layout><AffiliateAdmin /></Layout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </PlanProvider>
        </ThemeProvider>
    )
}

export default App

/* Copyright © 2025 Scalezix Venture PVT LTD - All Rights Reserved */
