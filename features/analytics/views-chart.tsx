"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { AnalyticsDailyPoint } from "@/types"

export function ViewsChart({ data }: { data: AnalyticsDailyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--color-foreground)]">Views over time</CardTitle>
      </CardHeader>
      <div className="h-64 px-2 pb-4">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
            No analytics data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#26262f" vertical={false} />
              <XAxis dataKey="date" stroke="#9a9aa8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9a9aa8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a24", border: "1px solid #26262f", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} fill="url(#viewsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
