"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { promptSchema, PROMPT_CATEGORIES, type PromptFormInput } from "@/lib/validations/prompt"
import { createPrompt, updatePrompt } from "@/services/prompt-service"
import type { Prompt } from "@/types"
import { Loader2 } from "lucide-react"

export function PromptFormDialog({
  open,
  onOpenChange,
  workspaceId,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  editing: Prompt | null
  onSaved: (prompt: Prompt) => void
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormInput>({
    resolver: zodResolver(promptSchema),
    defaultValues: { status: "pending", category: "general" },
  })

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              title: editing.title,
              prompt: editing.prompt,
              category: editing.category,
              description: editing.description ?? "",
              hashtags: editing.hashtags.join(", "),
              status: editing.status,
            }
          : { title: "", prompt: "", category: "general", description: "", hashtags: "", status: "pending" }
      )
    }
  }, [open, editing, reset])

  async function onSubmit(values: PromptFormInput) {
    const hashtags = values.hashtags
      ? values.hashtags.split(",").map((h) => h.trim().replace(/^#/, "")).filter(Boolean)
      : []
    try {
      const saved = editing
        ? await updatePrompt(editing.id, {
            title: values.title,
            prompt: values.prompt,
            category: values.category,
            description: values.description || null,
            hashtags,
            status: values.status,
          })
        : await createPrompt({
            workspaceId,
            title: values.title,
            prompt: values.prompt,
            category: values.category,
            description: values.description || null,
            hashtags,
            status: values.status,
          })
      onSaved(saved)
      toast.success(editing ? "Prompt updated" : "Prompt created")
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit prompt" : "New prompt"}</DialogTitle>
          <DialogDescription>{editing ? "Update the prompt details below." : "Add a prompt to your library."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-[var(--color-danger)]">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" rows={4} {...register("prompt")} />
            {errors.prompt && <p className="text-xs text-[var(--color-danger)]">{errors.prompt.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROMPT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["pending", "generating", "generated", "posting", "posted", "failed"] as const).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hashtags">Hashtags (comma-separated)</Label>
            <Input id="hashtags" placeholder="motivation, mindset, shorts" {...register("hashtags")} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {editing ? "Save changes" : "Create prompt"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
