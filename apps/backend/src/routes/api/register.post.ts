import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { createUser } from '../../lib/db'
import { logger } from '../../lib/logger'

const BodySchema = z.object({
  name: z.string().min(1).max(50).trim(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = BodySchema.safeParse(body)

  if (!result.success) {
    logger.warn({ body }, 'registration rejected: invalid payload')
    throw createError({ statusCode: 400, message: 'Name is required and must be under 50 characters' })
  }

  const { name } = result.data
  const id = crypto.randomUUID()
  createUser(id, name)

  logger.info({ userId: id, name }, 'user registered')

  return { userId: id, name }
})
