"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export interface AuthResult {
  error: string | null
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect("/dashboard")
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }
  redirect("/dashboard")
}

export async function signInWithGoogle(): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) return { url: null, error: error.message }
  return { url: data.url, error: null }
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/settings`,
  })
  if (error) return { error: error.message }
  return { error: null }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
