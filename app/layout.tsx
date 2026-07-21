import type { Metadata } from "next"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "AI Creative OS — Create • Automate • Publish",
  description: "Generate, manage, and publish AI video, image, voice, and written content across platforms.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#1a1a24", border: "1px solid #26262f", color: "#f4f4f6" } }} />
        </TooltipProvider>
      </body>
    </html>
  )
}
