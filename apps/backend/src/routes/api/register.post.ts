import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { users } from '../../state/users'
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
  users.set(id, { id, name, createdAt: new Date() })

  logger.info({ userId: id, name }, 'user registered')

  return { userId: id, name }
})
