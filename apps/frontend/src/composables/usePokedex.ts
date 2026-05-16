import { ref } from 'vue'
import type { Creature } from '@org/shared-schema'
import { useUser } from './useUser'

export interface CreatureWithId extends Creature {
  id: string
}

const creatures = ref<CreatureWithId[]>([])
const loading = ref(false)

export function usePokedex() {
  const { userId } = useUser()

  async function fetchCreatures() {
    if (!userId.value) return
    loading.value = true
    try {
      const res = await fetch(`/api/creatures?userId=${userId.value}`)
      if (res.ok) creatures.value = await res.json()
    } finally {
      loading.value = false
    }
  }

  function getCreatureById(id: string): CreatureWithId | undefined {
    return creatures.value.find((c) => c.id === id)
  }

  return { creatures, loading, fetchCreatures, getCreatureById }
}
