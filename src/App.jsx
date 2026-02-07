/**
 * AI Marketing Platform - Main Application
 * MacBook-style UI/UX with Primary Color #52b2bf
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 * @license Proprietary
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { PlanProvider } from './context/PlanContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext'
import { ModalProvider } from './components/Modal'
import AppLoader from './components/AppLoader'
import Layout from './components/Layout'
import PlanSelector from './components/PlanSelector'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Home from './pages/Home'
import ContentCreation from './pages/ContentCreation'
import JobHistory from './pages/JobHistory'
import Pricing from './pages/Pricing'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Policies from './pages/Policies'
import OAuthCallback from './pages/OAuthCallback'
import AffiliateLogin from './pages/AffiliateLogin'
import AffiliateApply from './pages/AffiliateApply'
import AffiliateTerms from './pages/AffiliateTerms'
import AffiliateDashboard from './pages/AffiliateDashboard'
import AffiliateAdmin from './pages/AffiliateAdmin'
import SuperAdminLogin from './pages/SuperAdminLogin'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import MaintenancePage from './pages/MaintenancePage'

// Protected Route Component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
}

// Maintenance Wrapper - Shows maintenance page when enabled (but not for SuperAdmin routes)
function MaintenanceWrapper({ children }) {
    const { isMaintenanceMode, maintenanceMessage, loading, canBypassMaintenance } = useMaintenance();
    const location = useLocation();

    // SuperAdmin routes should ALWAYS bypass maintenance
    const isSuperAdminRoute = location.pathname.startsWith('/superadmin');

    // Show loading spinner while checking maintenance status (but not for superadmin)
    if (loading && !isSuperAdminRoute) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#52b2bf] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // SuperAdmin routes always bypass maintenance
    if (isSuperAdminRoute) {
        return children;
    }

    // If in maintenance mode and user can't bypass, show maintenance page
    if (isMaintenanceMode && !canBypassMaintenance()) {
        return <MaintenancePage message={maintenanceMessage} />;
    }

    return children;
}

// Created by: HARSH J KUHIKAR
function AppRoutes() {
    return (
        <MaintenanceWrapper>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* Affiliate Routes */}
                <Route path="/affiliate/login" element={<AffiliateLogin />} />
                <Route path="/affiliate/apply" element={<AffiliateApply />} />
                <Route path="/affiliate/terms" element={<AffiliateTerms />} />
                <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />

                {/* SuperAdmin Routes - Always accessible (bypass maintenance) */}
                <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

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
        </MaintenanceWrapper>
    );
}

function AppContent() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <AppRoutes />
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <PlanProvider>
                <ToastProvider>
                    <MaintenanceProvider>
                        <ModalProvider>
                            <AppLoader minLoadTime={1000}>
                                <AppContent />
                            </AppLoader>
                        </ModalProvider>
                    </MaintenanceProvider>
                </ToastProvider>
            </PlanProvider>
        </ThemeProvider>
    )
}

export default App

/* Copyright © 2025 HARSH J KUHIKAR - All Rights Reserved */
