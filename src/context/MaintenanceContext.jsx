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

// Cache key for maintenance status
const MAINTENANCE_CACHE_KEY = 'maintenanceStatus';
const MAINTENANCE_CACHE_DURATION = 30 * 1000; // 30 seconds (reduced from 5 minutes)

export function MaintenanceProvider({ children }) {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
        // Check cached status on initial load
        try {
            const cached = localStorage.getItem(MAINTENANCE_CACHE_KEY);
            if (cached) {
                const { status, timestamp } = JSON.parse(cached);
                // Use cached value if less than 30 seconds old
                if (Date.now() - timestamp < MAINTENANCE_CACHE_DURATION) {
                    console.log('[Maintenance] Using cached status:', status);
                    return status;
                }
            }
        } catch (e) {
            // Ignore cache errors
        }
        return false;
    });
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState(null);
    const [apiCallFailed, setApiCallFailed] = useState(false);

    // Check maintenance status with retry
    const checkMaintenanceStatus = useCallback(async (retry = 0) => {
        console.log('[Maintenance] Checking status... (retry:', retry, ')');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${API_BASE}/maintenance/status`, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                credentials: 'omit' // Don't send credentials for this public endpoint
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[Maintenance] API Response:', data);

            const maintenanceStatus = data.maintenanceMode === true;
            setIsMaintenanceMode(maintenanceStatus);
            setMaintenanceMessage(data.maintenanceMessage || '');
            setLastChecked(new Date());
            setApiCallFailed(false);

            // Cache the status
            try {
                localStorage.setItem(MAINTENANCE_CACHE_KEY, JSON.stringify({
                    status: maintenanceStatus,
                    message: data.maintenanceMessage || '',
                    timestamp: Date.now()
                }));
            } catch (e) {
                // Ignore cache errors
            }

            return maintenanceStatus;
        } catch (error) {
            console.error('[Maintenance] Check failed:', error.message);
            setApiCallFailed(true);

            // Retry up to 3 times with exponential backoff
            if (retry < 3) {
                const delay = Math.pow(2, retry) * 1000; // 1s, 2s, 4s
                console.log(`[Maintenance] Retrying in ${delay}ms...`);
                setTimeout(() => {
                    checkMaintenanceStatus(retry + 1);
                }, delay);
                return isMaintenanceMode; // Return current state while retrying
            }

            // After all retries fail, check cached status
            try {
                const cached = localStorage.getItem(MAINTENANCE_CACHE_KEY);
                if (cached) {
                    const { status, message } = JSON.parse(cached);
                    console.log('[Maintenance] Using cached status after API failure:', status);
                    setIsMaintenanceMode(status);
                    setMaintenanceMessage(message || '');
                    return status;
                }
            } catch (e) {
                // Ignore cache errors
            }

            // If no cache and API failed, default to false (allow access)
            // This is a trade-off: we don't want to block users if the API is down
            console.log('[Maintenance] No cache, defaulting to false');
            setIsMaintenanceMode(false);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isMaintenanceMode]);

    // Check on mount
    useEffect(() => {
        checkMaintenanceStatus();
    }, []);

    // Periodically check maintenance status (every 15 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            checkMaintenanceStatus();
        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, [checkMaintenanceStatus]);

    // Check if user should bypass maintenance (SuperAdmin)
    const canBypassMaintenance = useCallback(() => {
        const superAdminToken = localStorage.getItem('superAdminToken');
        return !!superAdminToken;
    }, []);

    // Force clear cache and recheck (called when SuperAdmin changes settings)
    const forceRefresh = useCallback(() => {
        console.log('[Maintenance] Force refresh triggered');
        localStorage.removeItem(MAINTENANCE_CACHE_KEY);
        return checkMaintenanceStatus();
    }, [checkMaintenanceStatus]);

    const value = {
        isMaintenanceMode,
        maintenanceMessage,
        loading,
        lastChecked,
        apiCallFailed,
        checkMaintenanceStatus,
        canBypassMaintenance,
        forceRefresh
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
