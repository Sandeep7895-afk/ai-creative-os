"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { mapNotification } from "@/lib/mappers"
import type { AppNotification } from "@/types"
import { markNotificationRead, markAllNotificationsRead, deleteNotification } from "@/services/notification-service"

export function useNotifications(userId: string, initial: AppNotification[]) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initial)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => setNotifications((prev) => [mapNotification(payload.new), ...prev])
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? mapNotification(payload.new) : n))
          )
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await markNotificationRead(id)
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await markAllNotificationsRead(userId)
  }, [userId])

  const remove = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    await deleteNotification(id)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, unreadCount, markRead, markAllRead, remove }
}
