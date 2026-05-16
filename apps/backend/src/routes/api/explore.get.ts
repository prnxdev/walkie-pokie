import { defineEventHandler, getHeader, createError } from 'h3'
import { exploreState } from '../../state/explore'

export default defineEventHandler((event) => {
  const deviceId = getHeader(event, 'x-device-id')
  if (!deviceId) throw createError({ statusCode: 400, message: 'Missing X-Device-Id header' })

  return { exploring: exploreState.get(deviceId) ?? false }
})
