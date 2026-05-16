<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePokedex } from '../composables/usePokedex'

const router = useRouter()
const { creatures, loading, fetchCreatures } = usePokedex()

onMounted(fetchCreatures)

function goExplore() {
  router.push('/explore?autostart=1')
}
</script>

<template>
  <div class="h-full overflow-y-auto">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-full text-app-muted text-sm">
      Loading…
    </div>

    <!-- Empty state -->
    <div
      v-else-if="creatures.length === 0"
      class="flex flex-col items-center justify-center gap-6 h-full px-8 text-center"
    >
      <div class="w-20 h-20 rounded-full bg-app-surface border border-app-border flex items-center justify-center">
        <svg class="w-9 h-9 text-app-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div class="space-y-2">
        <p class="text-slate-200 font-semibold text-lg">No creatures caught yet</p>
        <p class="text-app-muted text-sm leading-relaxed">Step outside and start hunting.<br>Your collection awaits.</p>
      </div>
      <button
        class="px-8 py-3 rounded-full bg-app-accent text-app-bg font-semibold tracking-wide text-sm shadow-[0_0_20px_4px_#60a5fa40] active:scale-95 transition-transform duration-100"
        @click="goExplore"
      >
        Let's Explore
      </button>
    </div>

    <!-- Creature list -->
    <ul v-else class="divide-y divide-app-border">
      <li v-for="creature in creatures" :key="creature.id">
        <button
          class="w-full flex items-center gap-4 px-4 py-4 text-left active:bg-app-surface transition-colors duration-100"
          @click="router.push(`/pokedex/${creature.id}`)"
        >
          <!-- Rarity dot -->
          <span
            class="shrink-0 w-2.5 h-2.5 rounded-full"
            :class="{
              'bg-yellow-400 shadow-[0_0_6px_2px_#facc1580]': creature.rarity === 'Legendary',
              'bg-blue-400 shadow-[0_0_6px_2px_#60a5fa80]': creature.rarity === 'Rare',
              'bg-slate-500': creature.rarity === 'Common',
            }"
          />

          <div class="flex-1 min-w-0 space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="text-slate-100 font-semibold truncate">{{ creature.name }}</span>
              <span
                class="shrink-0 text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full"
                :class="{
                  'bg-yellow-500/20 text-yellow-400': creature.rarity === 'Legendary',
                  'bg-blue-500/20 text-blue-400': creature.rarity === 'Rare',
                  'bg-slate-500/20 text-slate-400': creature.rarity === 'Common',
                }"
              >{{ creature.rarity }}</span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="t in creature.types"
                :key="t"
                class="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full bg-app-accent/15 text-app-accent uppercase tracking-wide"
              >{{ t }}</span>
            </div>
          </div>

          <!-- Chevron -->
          <svg class="shrink-0 w-4 h-4 text-app-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </li>
    </ul>

  </div>
</template>
