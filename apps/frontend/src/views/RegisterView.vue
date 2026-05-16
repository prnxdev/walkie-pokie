<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUser } from '../composables/useUser'

const { register } = useUser()

const name = ref('')
const isPending = ref(false)
const error = ref('')

const canSubmit = computed(() => name.value.trim().length > 0 && !isPending.value)

async function handleRegister() {
  if (!canSubmit.value) return
  isPending.value = true
  error.value = ''
  try {
    await register(name.value.trim())
  } catch {
    error.value = 'Something went wrong. Please try again.'
    isPending.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full gap-10 px-8">

    <!-- Logo -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-widest text-app-accent">WalkiePokie</h1>
      <p class="text-sm text-app-muted">Catch creatures hiding in the wild.</p>
    </div>

    <!-- Form -->
    <div class="w-full max-w-sm space-y-4">
      <div class="space-y-2">
        <label class="text-xs uppercase tracking-widest text-app-muted" for="name">
          Your name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          maxlength="50"
          placeholder="e.g. Ash Ketchum"
          autocomplete="off"
          class="w-full rounded-xl bg-app-surface border border-app-border px-4 py-3 text-slate-100 placeholder:text-app-muted/60 outline-none focus:border-app-accent transition-colors duration-150"
          @keydown.enter="handleRegister"
        />
      </div>

      <p v-if="error" class="text-xs text-red-400">{{ error }}</p>

      <button
        :disabled="!canSubmit"
        class="w-full py-3 rounded-xl bg-app-accent text-app-bg font-semibold tracking-wide text-sm shadow-[0_0_20px_4px_#60a5fa40] transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-100"
        @click="handleRegister"
      >
        {{ isPending ? 'Registering…' : 'Register' }}
      </button>
    </div>

  </div>
</template>
