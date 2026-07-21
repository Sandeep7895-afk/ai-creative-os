import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)]/15 text-[var(--color-primary-muted)]",
        success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
        warning: "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
        info: "bg-[var(--color-info)]/15 text-[var(--color-info)]",
        muted: "bg-white/5 text-[var(--color-muted)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
