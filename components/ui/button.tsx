import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-zinc-800 shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-zinc-800 shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-zinc-800 hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pending: "bg-orange-100 text-orange-800 shadow-sm hover:bg-orange-200",
        approved: "bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200",
        prepairing: "bg-cyan-100 text-cyan-800 shadow-sm hover:bg-cyan-200",
        way: "bg-yellow-100 text-yellow-800 shadow-sm hover:bg-yellow-200",
        out: "bg-amber-100 text-amber-800 shadow-sm hover:bg-amber-200",
        delivered: "bg-green-100 text-green-800 shadow-sm hover:bg-green-200",
        cancelled: "bg-red-100 text-red-800 shadow-sm hover:bg-red-200",
        cart: "bg-yellow-300 text-yellow-900 shadow-sm hover:bg-yellow-400 hover:shadow-md transition-all duration-150 ease-in-out",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
