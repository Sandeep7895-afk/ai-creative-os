"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { Profile, Workspace } from "@/types"

interface SessionContextValue {
  profile: Profile
  workspaces: Workspace[]
  activeWorkspace: Workspace
  setActiveWorkspace: (workspace: Workspace) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({
  profile,
  workspaces,
  initialWorkspaceId,
  children,
}: {
  profile: Profile
  workspaces: Workspace[]
  initialWorkspaceId: string
  children: React.ReactNode
}) {
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace>(
    () => workspaces.find((w) => w.id === initialWorkspaceId) ?? workspaces[0]
  )

  const setActiveWorkspace = useCallback((workspace: Workspace) => {
    setActiveWorkspaceState(workspace)
    document.cookie = `active_workspace_id=${workspace.id}; path=/; max-age=31536000`
  }, [])

  return (
    <SessionContext.Provider value={{ profile, workspaces, activeWorkspace, setActiveWorkspace }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession must be used within SessionProvider")
  return ctx
}
