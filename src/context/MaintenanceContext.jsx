/**
 * Maintenance Context - Checks and manages maintenance mode status
 * 
 * WORKAROUND: Uses localStorage-based sync since backend CORS is not deployed
 * When SuperAdmin enables maintenance, it saves to localStorage
 * All browser tabs/windows check localStorage for maintenance status
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://blogapi.scalezix.com/api' : 'http://localhost:3001/api');

const MaintenanceContext = createContext();

// Keys for maintenance status
const MAINTENANCE_ENABLED_KEY = 'maintenanceEnabled';
const MAINTENANCE_MESSAGE_KEY = 'maintenanceMessage';

export function MaintenanceProvider({ children }) {
    // Check localStorage for maintenance status (instant, no network needed)
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(() => {
        try {
            const flag = localStorage.getItem(MAINTENANCE_ENABLED_KEY);
            return flag === 'true';
        } catch (e) {
            return false;
        }
    });

    const [maintenanceMessage, setMaintenanceMessage] = useState(() => {
        try {
            return localStorage.getItem(MAINTENANCE_MESSAGE_KEY) ||
                'We are currently performing maintenance. Please check back soon.';
        } catch (e) {
            return 'We are currently performing maintenance. Please check back soon.';
        }
    });

    const [loading] = useState(false);
    const [apiAvailable, setApiAvailable] = useState(false);

    // Try to sync with API (non-blocking, just for cross-device sync)
    const checkMaintenanceStatus = useCallback(async () => {
        // Always read from localStorage first (instant)
        try {
            const flag = localStorage.getItem(MAINTENANCE_ENABLED_KEY);
            const msg = localStorage.getItem(MAINTENANCE_MESSAGE_KEY);

            if (flag === 'true') {
                setIsMaintenanceMode(true);
                if (msg) setMaintenanceMessage(msg);
            } else if (flag === 'false') {
                setIsMaintenanceMode(false);
            }
        } catch (e) {
            // Ignore
        }

        // Try API sync (don't retry on failure to avoid spam)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${API_BASE}/maintenance/status`, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' },
                mode: 'cors',
                credentials: 'omit'
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                setApiAvailable(true);

                // Sync localStorage with API response
                if (typeof data.maintenanceMode === 'boolean') {
                    localStorage.setItem(MAINTENANCE_ENABLED_KEY, data.maintenanceMode ? 'true' : 'false');
                    setIsMaintenanceMode(data.maintenanceMode);

                    if (data.maintenanceMessage) {
                        localStorage.setItem(MAINTENANCE_MESSAGE_KEY, data.maintenanceMessage);
                        setMaintenanceMessage(data.maintenanceMessage);
                    }
                }
            }
        } catch (error) {
            // API not available - use localStorage only
            setApiAvailable(false);
        }
    }, []);

    // Listen for localStorage changes (cross-tab sync)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === MAINTENANCE_ENABLED_KEY) {
                setIsMaintenanceMode(e.newValue === 'true');
            }
            if (e.key === MAINTENANCE_MESSAGE_KEY && e.newValue) {
                setMaintenanceMessage(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Check on mount (once)
    useEffect(() => {
        checkMaintenanceStatus();
    }, []);

    // Check periodically (every 2 minutes - reduced to avoid rate limiting)
    useEffect(() => {
        const interval = setInterval(checkMaintenanceStatus, 120000);
        return () => clearInterval(interval);
    }, [checkMaintenanceStatus]);

    // Check if user should bypass maintenance (SuperAdmin)
    const canBypassMaintenance = useCallback(() => {
        return !!localStorage.getItem('superAdminToken');
    }, []);

    // Enable maintenance mode (called by SuperAdmin settings)
    const enableMaintenance = useCallback((message) => {
        localStorage.setItem(MAINTENANCE_ENABLED_KEY, 'true');
        localStorage.setItem(MAINTENANCE_MESSAGE_KEY, message || 'We are currently performing maintenance. Please check back soon.');
        setIsMaintenanceMode(true);
        setMaintenanceMessage(message || 'We are currently performing maintenance. Please check back soon.');
    }, []);

    // Disable maintenance mode (called by SuperAdmin settings)
    const disableMaintenance = useCallback(() => {
        localStorage.setItem(MAINTENANCE_ENABLED_KEY, 'false');
        setIsMaintenanceMode(false);
    }, []);

    const value = {
        isMaintenanceMode,
        maintenanceMessage,
        loading,
        apiAvailable,
        checkMaintenanceStatus,
        canBypassMaintenance,
        enableMaintenance,
        disableMaintenance
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
