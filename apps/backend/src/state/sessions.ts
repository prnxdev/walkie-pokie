import type { Socket, Server } from 'socket.io'

export const socketSessions = new Map<string, Socket>()
export const pendingExploreRequests = new Map<string, string>() // requestId -> socketId

let _io: Server | null = null

export function setIO(instance: Server) {
  _io = instance
}

export function getIO(): Server | null {
  return _io
}
