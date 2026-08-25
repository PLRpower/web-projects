import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-text-primary text-background hover:bg-text-primary/90 shadow-sm border border-transparent font-medium",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 shadow-sm font-medium",
                outline:
                    "border border-border bg-surface-card hover:bg-surface text-text-primary hover:border-text-secondary/40 shadow-xs",
                secondary:
                    "bg-surface text-text-primary hover:bg-surface-highlight border border-border/60",
                ghost:
                    "hover:bg-surface-highlight text-text-secondary hover:text-text-primary",
                link:
                    "text-accent-yellow underline-offset-4 hover:underline",
                premium:
                    "bg-accent-yellow text-black hover:brightness-105 font-bold shadow-md shadow-accent-yellow/20 border border-amber-500/30",
                glass:
                    "glass text-text-primary hover:bg-surface-highlight/40",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 rounded-lg px-3.5 text-xs",
                lg: "h-13 rounded-2xl px-8 text-base font-bold",
                icon: "h-10 w-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
