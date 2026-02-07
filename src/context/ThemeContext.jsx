/**
 * AI Marketing Platform - Theme Context
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 HARSH J KUHIKAR. All Rights Reserved.
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme] = useState('light') // Always light mode

    useEffect(() => {
        // FORCE light mode always
        const html = document.documentElement
        const body = document.body

        html.classList.remove('dark')
        body.style.backgroundColor = '#f9fafb'
        body.style.color = '#111827'
        localStorage.setItem('appTheme', 'light')

        // console.log('☀️ LIGHT MODE FORCED - Dark mode disabled')
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

/* Copyright © 2025 HARSH J KUHIKAR - All Rights Reserved */
