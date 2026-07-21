"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"
import { sendPasswordReset } from "@/services/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(values: ForgotPasswordInput) {
    setServerError(null)
    const result = await sendPasswordReset(values.email)
    if (result.error) setServerError(result.error)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success)]/15">
          <MailCheck className="h-6 w-6 text-[var(--color-success)]" />
        </div>
        <h1 className="text-lg font-semibold">Check your inbox</h1>
        <p className="text-sm text-[var(--color-muted)]">
          We sent a password reset link. Follow it to set a new password.
        </p>
        <Link href="/login" className="mt-2 text-sm text-[var(--color-primary-muted)] hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-[var(--color-muted)]">We&apos;ll email you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
        </div>

        {serverError && <p className="text-xs text-[var(--color-danger)]">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </div>
  )
}
