"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { signInWithEmail, signInWithGoogle } from "@/services/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/ui/google-icon"

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginInput) {
    setServerError(null)
    const result = await signInWithEmail(values.email, values.password)
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
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm text-[var(--color-muted)]">Sign in to your workspace</p>
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-[var(--color-primary-muted)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-xs text-[var(--color-danger)]">{serverError}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        No account?{" "}
        <Link href="/signup" className="text-[var(--color-primary-muted)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
