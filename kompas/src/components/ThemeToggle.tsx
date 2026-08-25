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
            <div className="flex items-center p-1 rounded-full bg-surface border border-border relative h-8 w-14 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-surface-card border border-border/80" />
            </div>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <button
            type="button"
            className="flex items-center p-1 rounded-full bg-surface border border-border relative cursor-pointer w-14 h-8 hover:border-text-muted transition-colors shadow-xs select-none"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            aria-label="Changer de thème"
        >
            {/* Sliding Indicator */}
            <div
                className={`absolute top-1 left-1 w-6 h-6 bg-surface-card rounded-full shadow-xs border border-border/80 z-0 transition-transform duration-200 ease-out ${
                    isDark ? "translate-x-6" : "translate-x-0"
                }`}
            />

            <div className="relative z-10 grid grid-cols-2 w-full h-full pointer-events-none">
                <div
                    className={`flex items-center justify-center transition-colors ${
                        !isDark ? 'text-amber-500 font-bold' : 'text-text-muted/60'
                    }`}
                >
                    <Sun size={14} className="translate-x-[0.5px]" />
                </div>
                <div
                    className={`flex items-center justify-center transition-colors ${
                        isDark ? 'text-amber-400 font-bold' : 'text-text-muted/60'
                    }`}
                >
                    <Moon size={14} className="translate-x-[1px]" />
                </div>
            </div>
            <span className="sr-only">Changer de thème</span>
        </button>
    )
}

