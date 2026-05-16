import { defineEventHandler, readBody, createError } from 'h3'
import { Ollama } from 'ollama'
import { CreatureSchema, creatureJsonSchema } from '@org/shared-schema'
import { socketSessions, pendingExploreRequests } from '../../state/sessions'
import { logger } from '../../lib/logger'

const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' })
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { socketId, requestId } = body ?? {}

  if (!socketId || !requestId) {
    logger.warn({ socketId, requestId }, 'explore request rejected: missing fields')
    throw createError({ statusCode: 400, message: 'Missing socketId or requestId' })
  }

  const socket = socketSessions.get(socketId)
  if (!socket) {
    logger.warn({ socketId, requestId }, 'explore request rejected: socket session not found')
    throw createError({ statusCode: 404, message: 'Socket session not found' })
  }

  pendingExploreRequests.set(requestId, socketId)
  logger.info({ socketId, requestId, model: OLLAMA_MODEL }, 'explore request accepted')
  generateCreature(requestId)

  return { accepted: true, requestId }
})

async function generateCreature(requestId: string) {
  try {
    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      format: creatureJsonSchema,
      messages: [
        {
          role: 'user',
          content:
            'Generate a random fantasy creature. Be creative and varied — mix elemental, mythological, and bizarre archetypes. Provide realistic weight and height for the creature type. Give it 1–4 unique attacks.',
        },
      ],
    })

    const creature = CreatureSchema.parse(JSON.parse(response.message.content))
    logger.info({ requestId, name: creature.name, rarity: creature.rarity }, 'creature generated')
    const currentSocketId = pendingExploreRequests.get(requestId)
    const socket = currentSocketId ? socketSessions.get(currentSocketId) : undefined
    socket?.emit('explore:result', { requestId, creature })
  } catch (error: any) {
    logger.error({ requestId, err: error }, 'creature generation failed')
    const currentSocketId = pendingExploreRequests.get(requestId)
    const socket = currentSocketId ? socketSessions.get(currentSocketId) : undefined
    socket?.emit('explore:error', { requestId, error: error?.message || 'Failed to generate creature' })
  } finally {
    pendingExploreRequests.delete(requestId)
  }
}
