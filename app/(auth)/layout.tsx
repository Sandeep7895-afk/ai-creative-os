import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-background)] px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--color-primary)]/20 blur-[120px]"
      />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">AI Creative OS</span>
        </Link>
        <div className="glass rounded-[var(--radius-card)] p-8 shadow-2xl">{children}</div>
      </div>
    </div>
  )
}
