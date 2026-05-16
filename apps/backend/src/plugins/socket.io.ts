import { defineNitroPlugin } from 'nitropack/runtime'
import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import { socketSessions, setIO } from '../state/sessions'
import { logger } from '../lib/logger'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)
  setIO(io)

  io.on('connection', (socket) => {
    socketSessions.set(socket.id, socket)
    socket.emit('session', { socketId: socket.id })
    logger.info({ socketId: socket.id }, 'client connected')

    socket.on('disconnect', (reason) => {
      socketSessions.delete(socket.id)
      logger.info({ socketId: socket.id, reason }, 'client disconnected')
    })
  })

  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq)
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
      },
    },
  }))
})
