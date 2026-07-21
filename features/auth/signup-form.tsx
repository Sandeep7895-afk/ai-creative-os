"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupInput } from "@/lib/validations/auth"
import { signUpWithEmail, signInWithGoogle } from "@/services/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/ui/google-icon"

export function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(values: SignupInput) {
    setServerError(null)
    const result = await signUpWithEmail(values.email, values.password, values.fullName)
    if (result?.error) setServerError(result.error)
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    const { url, error } = await signInWithGoogle()
    if (url) window.location.href = url
    else {
      setServerError(error ?? "Could not start Google sign-in")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-[var(--color-muted)]">Start creating with AI in minutes</p>
      </div>

      <Button variant="secondary" size="lg" onClick={handleGoogle} disabled={googleLoading} type="button">
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        or continue with email
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" placeholder="Sandeep Kumar" {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-[var(--color-danger)]">{errors.fullName.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-xs text-[var(--color-danger)]">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="text-xs text-[var(--color-danger)]">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-primary-muted)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
