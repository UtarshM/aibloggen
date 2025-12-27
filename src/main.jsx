/**
 * AI Marketing Platform - Entry Point
 * 
 * @author Scalezix Venture PVT LTD
 * @copyright 2025 Scalezix Venture PVT LTD. All Rights Reserved.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Suppress console logs in production for security
if (import.meta.env.PROD) {
    const noop = () => { };
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    // Keep console.warn and console.error for critical issues
}

// Developed by: Scalezix Venture PVT LTD
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

/* Copyright © 2025 Scalezix Venture PVT LTD */
