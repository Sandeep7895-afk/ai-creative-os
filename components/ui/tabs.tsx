"use client"
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex h-10 items-center gap-1 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1", className)}
      {...props}
    />
  )
}
function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-[var(--color-muted)] transition-colors data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white",
        className
      )}
      {...props}
    />
  )
}
function TabsContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("mt-4 focus-visible:outline-none", className)} {...props} />
}
export { Tabs, TabsList, TabsTrigger, TabsContent }
