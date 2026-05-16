<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUser } from '../composables/useUser'
import RegisterView from '../views/RegisterView.vue'

const route = useRoute()
const { isRegistered } = useUser()

const tabClass = (prefix: string) =>
  computed(() =>
    route.path.startsWith(prefix)
      ? 'text-app-accent'
      : 'text-app-muted'
  )

const pokedexClass = tabClass('/pokedex')
const exploreClass = tabClass('/explore')
</script>

<template>
  <div class="flex flex-col h-dvh max-w-[480px] mx-auto">

    <template v-if="!isRegistered">
      <RegisterView />
    </template>

    <template v-else>
      <header class="shrink-0 flex items-center justify-center h-14 bg-app-bg border-b border-app-border">
        <h1 class="text-xl font-bold tracking-widest text-app-accent">WalkiePokie</h1>
      </header>

      <main class="flex-1 overflow-y-auto min-h-0">
        <RouterView />
      </main>

      <nav class="shrink-0 flex h-16 bg-app-surface border-t border-app-border pb-[env(safe-area-inset-bottom,0px)]">
        <RouterLink
          to="/pokedex"
          class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150"
          :class="pokedexClass"
        >
          <svg class="w-[22px] h-[22px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span class="text-[0.7rem] font-medium tracking-wide">Pokedex</span>
        </RouterLink>

        <RouterLink
          to="/explore"
          class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150"
          :class="exploreClass"
        >
          <svg class="w-[22px] h-[22px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span class="text-[0.7rem] font-medium tracking-wide">Explore</span>
        </RouterLink>
      </nav>
    </template>

  </div>
</template>
