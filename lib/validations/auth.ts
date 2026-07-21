import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email required").email("Enter a valid email"),
  password: z.string().min(1, "Password required"),
})
export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
export type SignupInput = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email required").email("Enter a valid email"),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
