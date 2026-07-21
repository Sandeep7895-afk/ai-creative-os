import { z } from "zod"

export const promptSchema = z.object({
  title: z.string().min(1, "Title required").max(200),
  prompt: z.string().min(1, "Prompt text required"),
  category: z.string().min(1, "Pick a category"),
  description: z.string().optional(),
  hashtags: z.string().optional(), // comma-separated in the form, split before submit
  status: z.enum(["pending", "generating", "generated", "posting", "posted", "failed"]),
})
export type PromptFormInput = z.infer<typeof promptSchema>

export const PROMPT_CATEGORIES = ["general", "motivation", "facts", "story", "product", "education"] as const
