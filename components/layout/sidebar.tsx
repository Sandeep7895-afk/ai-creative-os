"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants/nav"
import { useSession } from "@/providers/session-provider"
import { cn } from "@/lib/utils"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { profile } = useSession()

  return (
    <aside className={cn("glass flex h-full w-64 shrink-0 flex-col border-r border-[var(--color-border)]", className)}>
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold">AI Creative OS</span>
      </div>

      <div className="px-3">
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-muted)]"
                  : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-foreground)]"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        {profile.role === "ADMIN" && (
          <>
            <div className="my-3 h-px bg-[var(--color-border)]" />
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Admin</p>
            {ADMIN_NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-muted)]"
                      : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-foreground)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>
    </aside>
  )
}
