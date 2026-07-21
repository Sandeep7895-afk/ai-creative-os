import Link from "next/link"
import { Clapperboard, ImageIcon, Mic, FileText, Library } from "lucide-react"
import { Card } from "@/components/ui/card"

const ACTIONS = [
  { label: "New Video", href: "/ai-video", icon: Clapperboard },
  { label: "New Image", href: "/ai-image", icon: ImageIcon },
  { label: "New Voice", href: "/ai-voice", icon: Mic },
  { label: "New PDF", href: "/pdf-ebook", icon: FileText },
  { label: "Prompt Library", href: "/prompt-library", icon: Library },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ACTIONS.map((a) => (
        <Link key={a.label} href={a.href}>
          <Card className="flex flex-col items-center justify-center gap-2 p-5 text-center transition-colors hover:border-[var(--color-primary)]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/15">
              <a.icon className="h-5 w-5 text-[var(--color-primary-muted)]" />
            </div>
            <span className="text-sm font-medium">{a.label}</span>
          </Card>
        </Link>
      ))}
    </div>
  )
}
