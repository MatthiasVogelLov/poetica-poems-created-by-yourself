
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-sm hover:from-indigo-600 hover:to-purple-700",
        secondary:
          "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-sm hover:from-pink-600 hover:to-rose-600",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-sm hover:from-red-600 hover:to-orange-600",
        success:
          "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-sm hover:from-emerald-600 hover:to-teal-600",
        warning:
          "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:shadow-sm hover:from-amber-600 hover:to-yellow-600",
        info:
          "border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-sm hover:from-blue-600 hover:to-cyan-600",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
