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
        <button
            type="button"
            className="flex items-center p-1 rounded-full bg-surface border border-border relative cursor-pointer w-16 h-8 hover:border-text-muted transition-colors shadow-xs"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            aria-label="Changer de thème"
        >
            {/* Sliding Indicator */}
            <div
                className={`absolute top-0.5 bottom-0.5 w-[26px] bg-surface-card rounded-full shadow-xs border border-border/80 z-0 transition-transform duration-200 ease-out ${
                    isDark ? "translate-x-[30px]" : "translate-x-0"
                }`}
            />

            <div className="relative z-10 flex items-center justify-between w-full px-1">
                <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors ${
                        !isDark ? 'text-amber-500 font-bold' : 'text-text-muted/60'
                    }`}
                >
                    <Sun size={13} />
                </div>
                <div
                    className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors ${
                        isDark ? 'text-amber-400 font-bold' : 'text-text-muted/60'
                    }`}
                >
                    <Moon size={13} />
                </div>
            </div>
            <span className="sr-only">Changer de thème</span>
        </button>
    )
}
