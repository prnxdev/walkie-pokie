import { z } from 'zod'

export const AttackSchema = z.object({
  name: z.string(),
  power: z.number().int().min(1).max(200),
  description: z.string(),
})

export const CreatureSchema = z.object({
  name: z.string(),
  types: z.array(z.string()).min(1).max(3),
  rarity: z.enum(['Common', 'Rare', 'Legendary']),
  attacks: z.array(AttackSchema).min(1).max(4),
  weight: z.number().describe('Weight in kilograms'),
  height: z.number().describe('Height in meters'),
  description: z.string(),
})

export const creatureJsonSchema = z.toJSONSchema(CreatureSchema)

export type Attack = z.infer<typeof AttackSchema>
export type Creature = z.infer<typeof CreatureSchema>
