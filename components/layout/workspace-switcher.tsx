"use client"

import { ChevronsUpDown, Check, Plus } from "lucide-react"
import { useSession } from "@/providers/session-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm hover:border-[var(--color-primary)]/50">
        <span className="truncate font-medium">{activeWorkspace.name}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem key={workspace.id} onClick={() => setActiveWorkspace(workspace)}>
            <span className="flex-1 truncate">{workspace.name}</span>
            {workspace.id === activeWorkspace.id && <Check className="h-3.5 w-3.5 text-[var(--color-primary-muted)]" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="h-3.5 w-3.5" /> New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
