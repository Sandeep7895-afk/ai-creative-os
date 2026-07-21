"use client"

import { useState } from "react"
import { Search, Plus, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { GeneratePopup } from "./generate-popup"
import { NotificationCenter } from "./notification-center"
import { useSession } from "@/providers/session-provider"
import { signOut } from "@/services/auth-service"
import type { AppNotification } from "@/types"
import Link from "next/link"

export function Topbar({ initialNotifications }: { initialNotifications: AppNotification[] }) {
  const [generateOpen, setGenerateOpen] = useState(false)
  const { profile } = useSession()
  const initials = (profile.fullName ?? profile.email).slice(0, 2).toUpperCase()

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--color-border)] px-6">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <Input placeholder="Search prompts, assets, projects…" className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button onClick={() => setGenerateOpen(true)} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Generate
        </Button>

        <NotificationCenter userId={profile.id} initialNotifications={initialNotifications} />

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            <Avatar>
              <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.fullName ?? profile.email} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium">{profile.fullName ?? "Unnamed"}</p>
              <p className="truncate text-xs text-[var(--color-muted)]">{profile.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings"><User className="h-3.5 w-3.5" /> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"><Settings className="h-3.5 w-3.5" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="text-[var(--color-danger)]">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <GeneratePopup open={generateOpen} onOpenChange={setGenerateOpen} />
    </header>
  )
}
