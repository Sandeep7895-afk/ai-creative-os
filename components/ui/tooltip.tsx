"use client"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({ className, sideOffset = 6, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn("glass-strong z-50 rounded-md px-2.5 py-1.5 text-xs text-[var(--color-foreground)] shadow-lg", className)}
      {...props}
    />
  )
}
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
