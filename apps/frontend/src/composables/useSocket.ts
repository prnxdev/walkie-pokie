import { ref, readonly } from 'vue'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null
const socketId = ref<string | null>(null)
const isConnected = ref(false)

export function initSocket() {
  if (socket) return

  socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] })

  socket.on('connect', () => {
    isConnected.value = true
  })

  socket.on('session', ({ socketId: id }: { socketId: string }) => {
    socketId.value = id
  })

  socket.on('disconnect', () => {
    isConnected.value = false
    socketId.value = null
  })
}

export function useSocket() {
  return {
    socket: socket as Socket,
    socketId: readonly(socketId),
    isConnected: readonly(isConnected),
  }
}
