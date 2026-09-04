import { useCallback, useEffect, useRef, useState } from 'react'
import { notificationsApi } from '../lib/api.js'
import { notificationSocket } from '../lib/ws.js'

export default function useNotifications(enabled = true) {
  const [items, setItems] = useState([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  const refresh = useCallback(async () => {
    if (!enabled) return
    const { data } = await notificationsApi.list()
    setItems(Array.isArray(data) ? data : data?.results || [])
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined
    refresh().catch(() => {})
    const socket = notificationSocket({
      onOpen: () => setConnected(true),
      onClose: () => setConnected(false),
      onMessage: (message) => {
        if (message.type === 'notification' && message.notification) {
          setItems((prev) => [message.notification, ...prev.filter((item) => item.id !== message.notification.id)])
        }
      },
    })
    socketRef.current = socket
    return () => socket?.close()
  }, [enabled, refresh])

  const markRead = async (id) => {
    await notificationsApi.markRead(id)
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)))
  }

  const markAllRead = async () => {
    await notificationsApi.markAllRead()
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })))
  }

  return {
    items,
    unreadCount: items.filter((item) => !item.is_read).length,
    connected,
    refresh,
    markRead,
    markAllRead,
  }
}
