import { useEffect, useRef, useState } from 'react'
import { tripSocket } from '../lib/ws.js'

export default function useTripSocket(tripId) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState(null)

  useEffect(() => {
    if (!tripId) return undefined
    const socket = tripSocket(tripId, {
      onOpen: () => setConnected(true),
      onClose: () => setConnected(false),
      onMessage: (message) => {
        if (message.type === 'trip_event') setLastEvent(message)
      },
    })
    socketRef.current = socket
    return () => socket?.close()
  }, [tripId])

  const send = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload))
      return true
    }
    return false
  }

  return { connected, lastEvent, send }
}
