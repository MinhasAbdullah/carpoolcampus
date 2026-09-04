import { tokenStore } from './api.js'

function wsBase() {
  const configured = import.meta.env.VITE_WS_BASE_URL
  if (configured) return configured.replace(/\/$/, '')
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
}

export function createSocket(path, { onOpen, onMessage, onClose, onError } = {}) {
  const token = tokenStore.getAccess()
  if (!token) return null
  const cleanPath = path.replace(/^\//, '')
  const socket = new WebSocket(`${wsBase()}/${cleanPath}?token=${encodeURIComponent(token)}`)
  if (onOpen) socket.addEventListener('open', onOpen)
  if (onClose) socket.addEventListener('close', onClose)
  if (onError) socket.addEventListener('error', onError)
  if (onMessage) {
    socket.addEventListener('message', (event) => {
      try { onMessage(JSON.parse(event.data), socket) } catch { /* ignore malformed frames */ }
    })
  }
  return socket
}

export const notificationSocket = (handlers) => createSocket('notifications/', handlers)
export const tripSocket = (tripId, handlers) => createSocket(`trips/${tripId}/`, handlers)
