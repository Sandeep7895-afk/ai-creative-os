import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/login-form"

export const metadata: Metadata = { title: "Sign in — AI Creative OS" }

export default function LoginPage() {
  return <LoginForm />
}
