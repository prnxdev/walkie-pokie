import { ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Creature } from '@org/shared-schema'
import { useSocket } from './useSocket'

export type { Creature }

const PENDING_KEY = 'explore:pending-request-id'

const isPending = ref(!!localStorage.getItem(PENDING_KEY))
const creature = ref<Creature | null>(null)
let resumeEmitted = false

export function useExplore() {
  const { socket, socketId } = useSocket()

  function setupResultListener(requestId: string) {
    socket.once('explore:result', (data: { requestId: string; creature: Creature }) => {
      if (data.requestId !== requestId) return
      creature.value = data.creature
      isPending.value = false
      localStorage.removeItem(PENDING_KEY)
    })

    socket.once('explore:error', (data: { requestId: string; error: string }) => {
      if (data.requestId !== requestId) return
      isPending.value = false
      localStorage.removeItem(PENDING_KEY)
      console.error('Explore error:', data.error)
    })
  }

  // Resume pending explore session after page reload
  watch(socketId, (id) => {
    if (!id || resumeEmitted) return
    const storedRequestId = localStorage.getItem(PENDING_KEY)
    if (!storedRequestId) return
    resumeEmitted = true
    socket.emit('explore:resume', { requestId: storedRequestId })
    setupResultListener(storedRequestId)
  }, { immediate: true })

  async function startExploring() {
    if (!socketId.value) return

    const requestId = uuidv4()
    isPending.value = true
    creature.value = null
    resumeEmitted = false
    localStorage.setItem(PENDING_KEY, requestId)

    setupResultListener(requestId)

    try {
      await fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socketId: socketId.value, requestId }),
      })
    } catch {
      isPending.value = false
      localStorage.removeItem(PENDING_KEY)
    }
  }

  return { isPending, creature, startExploring }
}
