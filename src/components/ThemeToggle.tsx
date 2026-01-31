"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="flex items-center p-1 rounded-full bg-surface-highlight/50 border border-border relative h-9 w-16">
                <div className="w-4 h-4 rounded-full border-2 border-text-secondary opacity-50 mx-auto"></div>
            </div>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <div
            className="flex items-center p-1 rounded-full bg-surface-highlight/50 border border-border relative cursor-pointer w-16 h-9"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    setTheme(isDark ? "light" : "dark")
                }
            }}
        >
            {/* Background Indicator (Static, no animation) */}
            <div
                className={`absolute top-1 bottom-1 w-[28px] bg-surface rounded-full shadow-sm z-0 transition-transform duration-0 ${isDark ? "translate-x-[100%]" : "translate-x-0"
                    }`}
            />

            <div className="relative z-10 flex items-center justify-between w-full pl-0.5 pr-0">
                <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${!isDark ? 'text-amber-500' : 'text-text-secondary/50'}`}
                >
                    <Sun size={14} />
                </div>
                <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${isDark ? 'text-blue-400' : 'text-text-secondary/50'}`}
                >
                    <Moon size={14} />
                </div>
            </div>
            <span className="sr-only">Toggle theme</span>
        </div>
    )
}
