import { ref, computed } from 'vue'

const USER_ID_KEY = 'wp-user-id'
const USER_NAME_KEY = 'wp-user-name'

const userId = ref<string | null>(localStorage.getItem(USER_ID_KEY))
const userName = ref<string | null>(localStorage.getItem(USER_NAME_KEY))

export function useUser() {
  const isRegistered = computed(() => !!userId.value)

  async function register(name: string) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) throw new Error('Registration failed')

    const data: { userId: string; name: string } = await res.json()
    userId.value = data.userId
    userName.value = data.name
    localStorage.setItem(USER_ID_KEY, data.userId)
    localStorage.setItem(USER_NAME_KEY, data.name)
  }

  return { userId, userName, isRegistered, register }
}
