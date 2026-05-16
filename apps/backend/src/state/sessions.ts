import type { Socket, Server } from 'socket.io'

export const socketSessions = new Map<string, Socket>()

let _io: Server | null = null

export function setIO(instance: Server) {
  _io = instance
}

export function getIO(): Server | null {
  return _io
}
