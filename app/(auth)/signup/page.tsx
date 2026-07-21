import type { Metadata } from "next"
import { SignupForm } from "@/features/auth/signup-form"

export const metadata: Metadata = { title: "Create account — AI Creative OS" }

export default function SignupPage() {
  return <SignupForm />
}
