import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form"

export const metadata: Metadata = { title: "Reset password — AI Creative OS" }

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
