/**
 * Maintenance Context - Checks and manages maintenance mode status
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 All Rights Reserved
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api');

const MaintenanceContext = createContext();

export function MaintenanceProvider({ children }) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState(null);

    // Check maintenance status
    const checkMaintenanceStatus = useCallback(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(`${API_BASE}/maintenance/status`, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch maintenance status');
            }

            const data = await response.json();

            setIsMaintenanceMode(data.maintenanceMode || false);
            setMaintenanceMessage(data.maintenanceMessage || '');
            setLastChecked(new Date());

            return data.maintenanceMode;
        } catch (error) {
            // Silently handle errors - don't block the app
            if (error.name === 'AbortError') {
                console.log('Maintenance check timed out');
            } else {
                console.log('Maintenance check failed:', error.message);
            }
            // On error, assume not in maintenance mode to not block users
            setIsMaintenanceMode(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check on mount
    useEffect(() => {
        checkMaintenanceStatus();
    }, [checkMaintenanceStatus]);

    // Periodically check maintenance status (every 60 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            checkMaintenanceStatus();
        }, 60000);

        return () => clearInterval(interval);
    }, [checkMaintenanceStatus]);

    // Check if user should bypass maintenance (SuperAdmin)
    const canBypassMaintenance = useCallback(() => {
        const superAdminToken = localStorage.getItem('superAdminToken');
        return !!superAdminToken;
    }, []);

    const value = {
        isMaintenanceMode,
        maintenanceMessage,
        loading,
        lastChecked,
        checkMaintenanceStatus,
        canBypassMaintenance
    };

    return (
        <MaintenanceContext.Provider value={value}>
            {children}
        </MaintenanceContext.Provider>
    );
}

export function useMaintenance() {
    const context = useContext(MaintenanceContext);
    if (!context) {
        throw new Error('useMaintenance must be used within a MaintenanceProvider');
    }
    return context;
}

export default MaintenanceContext;
