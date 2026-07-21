import {
  LayoutDashboard,
  Library,
  Clapperboard,
  ImageIcon,
  Mic,
  FileText,
  Send,
  BarChart3,
  Calendar,
  FolderOpen,
  Settings,
  KeyRound,
  ScrollText,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Prompt Library", href: "/prompt-library", icon: Library },
  { label: "AI Video", href: "/ai-video", icon: Clapperboard },
  { label: "AI Image", href: "/ai-image", icon: ImageIcon },
  { label: "AI Voice", href: "/ai-voice", icon: Mic },
  { label: "PDF / eBook", href: "/pdf-ebook", icon: FileText },
  { label: "Publish", href: "/publish", icon: Send },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Assets", href: "/assets", icon: FolderOpen },
  { label: "Settings", href: "/settings", icon: Settings },
]

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "API Manager", href: "/admin/api-manager", icon: KeyRound, adminOnly: true },
  { label: "System Logs", href: "/admin/system-logs", icon: ScrollText, adminOnly: true },
]
