import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Creature } from '@org/shared-schema'
import { useSocket } from './useSocket'

export type { Creature }

const isPending = ref(false)
const creature = ref<Creature | null>(null)

export function useExplore() {
  const { socket, socketId } = useSocket()

  async function startExploring() {
    if (!socketId.value) return

    const requestId = uuidv4()
    isPending.value = true
    creature.value = null

    socket.once('explore:result', (data: { requestId: string; creature: Creature }) => {
      if (data.requestId !== requestId) return
      creature.value = data.creature
      isPending.value = false
    })

    socket.once('explore:error', (data: { requestId: string; error: string }) => {
      if (data.requestId !== requestId) return
      isPending.value = false
      console.error('Explore error:', data.error)
    })

    try {
      await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socketId: socketId.value, requestId }),
      })
    } catch {
      isPending.value = false
    }
  }

  return { isPending, creature, startExploring }
}
