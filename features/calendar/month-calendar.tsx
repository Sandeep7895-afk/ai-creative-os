"use client"

import { useMemo, useState } from "react"
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format, isSameMonth, isSameDay, addMonths, subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { YoutubeIcon, InstagramIcon } from "@/components/ui/brand-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PublishJob } from "@/types"

const PLATFORM_ICON = { youtube: YoutubeIcon, instagram: InstagramIcon }

export function MonthCalendar({ jobs }: { jobs: PublishJob[] }) {
  const [cursor, setCursor] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor))
    const end = endOfWeek(endOfMonth(cursor))
    return eachDayOfInterval({ start, end })
  }, [cursor])

  const jobsByDay = useMemo(() => {
    const map = new Map<string, PublishJob[]>()
    for (const job of jobs) {
      const date = job.scheduledFor ?? job.createdAt
      const key = format(new Date(date), "yyyy-MM-dd")
      map.set(key, [...(map.get(key) ?? []), job])
    }
    return map
  }, [jobs])

  return (
    <div className="glass overflow-hidden rounded-[var(--radius-card)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h2 className="font-semibold">{format(cursor, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCursor((d) => subMonths(d, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCursor((d) => addMonths(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--color-border)] text-center text-xs font-medium uppercase text-[var(--color-muted)]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd")
          const dayJobs = jobsByDay.get(key) ?? []
          return (
            <div
              key={key}
              className={cn(
                "min-h-24 border-b border-r border-[var(--color-border)] p-2",
                !isSameMonth(day, cursor) && "opacity-40",
                isSameDay(day, new Date()) && "bg-[var(--color-primary)]/5"
              )}
            >
              <p className="text-xs text-[var(--color-muted)]">{format(day, "d")}</p>
              <div className="mt-1 space-y-1">
                {dayJobs.slice(0, 2).map((job) => {
                  const Icon = PLATFORM_ICON[job.platform]
                  return (
                    <div key={job.id} className="flex items-center gap-1 truncate rounded bg-white/5 px-1.5 py-0.5 text-[11px]">
                      <Icon className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{job.caption || "Untitled"}</span>
                    </div>
                  )
                })}
                {dayJobs.length > 2 && <p className="text-[10px] text-[var(--color-muted)]">+{dayJobs.length - 2} more</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
