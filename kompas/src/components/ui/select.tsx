import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-surface-card px-4 py-2.5 text-sm ring-offset-background placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 focus:border-accent-yellow disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-text-primary cursor-pointer shadow-xs transition-all",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
