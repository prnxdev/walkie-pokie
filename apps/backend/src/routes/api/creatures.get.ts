import { defineEventHandler, getQuery, createError } from 'h3'
import { getCreaturesByUser } from '../../lib/db'
import { logger } from '../../lib/logger'

export default defineEventHandler((event) => {
  const { userId } = getQuery(event)

  if (!userId || typeof userId !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing userId' })
  }

  const creatures = getCreaturesByUser(userId)
  logger.info({ userId, count: creatures.length }, 'creatures fetched')
  return creatures
})
