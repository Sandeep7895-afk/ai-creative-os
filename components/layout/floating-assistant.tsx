"use client"

import { useState } from "react"
import { Sparkles, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Floating AI assistant entry point. Opens a lightweight chat panel;
 * wire `handleSend` to your assistant backend (a Route Handler that
 * streams from your LLM provider) when ready.
 */
export function FloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="glass-strong mb-3 flex h-96 w-80 flex-col rounded-[var(--radius-card)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-primary-muted)]" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm text-[var(--color-muted)]">
            Ask me to draft a prompt, summarize analytics, or plan your next post.
          </div>
          <form
            className="flex gap-2 border-t border-[var(--color-border)] p-3"
            onSubmit={(e) => {
              e.preventDefault()
              setMessage("")
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <Button type="submit" size="icon" className="h-8 w-8">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)] transition-transform hover:scale-105"
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  )
}
