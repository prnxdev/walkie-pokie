import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'wp-device-id'

function getOrCreate(): string {
  const existing = localStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const id = uuidv4()
  localStorage.setItem(STORAGE_KEY, id)
  return id
}

const deviceId = ref(getOrCreate())

export function useDeviceId() {
  return { deviceId }
}
