"use client"

import { useRouter } from "next/navigation"
import { Clapperboard, ImageIcon, Mic, FileText, PenLine } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const OPTIONS = [
  { label: "Generate Video", href: "/ai-video", icon: Clapperboard, desc: "Prompt-to-video with preview before publish" },
  { label: "Generate Image", href: "/ai-image", icon: ImageIcon, desc: "Prompt-to-image, multiple styles" },
  { label: "Generate Voice", href: "/ai-voice", icon: Mic, desc: "Text-to-speech narration" },
  { label: "Generate PDF", href: "/pdf-ebook", icon: FileText, desc: "Turn a prompt into an eBook or PDF" },
  { label: "Generate Blog", href: "/pdf-ebook", icon: PenLine, desc: "Long-form written content" },
]

export function GeneratePopup({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate</DialogTitle>
          <DialogDescription>Pick what you want to create</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                onOpenChange(false)
                router.push(opt.href)
              }}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-3 text-left transition-colors hover:border-[var(--color-primary)]/50 hover:bg-white/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/15">
                <opt.icon className="h-4.5 w-4.5 text-[var(--color-primary-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-[var(--color-muted)]">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
