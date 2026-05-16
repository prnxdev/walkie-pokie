<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokedex } from '../composables/usePokedex'

const route = useRoute()
const router = useRouter()
const { creatures, loading, fetchCreatures, getCreatureById } = usePokedex()

onMounted(() => {
  if (creatures.value.length === 0) fetchCreatures()
})

const creature = computed(() => getCreatureById(route.params.id as string))
</script>

<template>
  <div class="h-full overflow-y-auto">

    <!-- Loading / not found -->
    <div v-if="!creature" class="flex items-center justify-center h-full text-app-muted text-sm">
      {{ loading ? 'Loading…' : 'Creature not found.' }}
    </div>

    <div v-else class="px-5 py-6 space-y-6">

      <!-- Back -->
      <button
        class="flex items-center gap-1.5 text-app-muted text-sm active:text-slate-200 transition-colors"
        @click="router.push('/pokedex')"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Pokédex
      </button>

      <!-- Header -->
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-3">
          <h1 class="text-2xl font-bold text-slate-100 leading-tight">{{ creature.name }}</h1>
          <span
            class="shrink-0 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="{
              'bg-yellow-500/20 text-yellow-400': creature.rarity === 'Legendary',
              'bg-blue-500/20 text-blue-400': creature.rarity === 'Rare',
              'bg-slate-500/20 text-slate-400': creature.rarity === 'Common',
            }"
          >{{ creature.rarity }}</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="t in creature.types"
            :key="t"
            class="text-xs font-medium px-2 py-0.5 rounded-full bg-app-accent/15 text-app-accent uppercase tracking-wide"
          >{{ t }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex gap-6 rounded-2xl border border-app-border bg-app-surface px-5 py-4">
        <div>
          <p class="text-app-muted text-xs uppercase tracking-widest mb-0.5">Height</p>
          <p class="text-slate-200 font-semibold">{{ creature.height }} m</p>
        </div>
        <div>
          <p class="text-app-muted text-xs uppercase tracking-widest mb-0.5">Weight</p>
          <p class="text-slate-200 font-semibold">{{ creature.weight }} kg</p>
        </div>
      </div>

      <!-- Description -->
      <div class="rounded-2xl border border-app-border bg-app-surface px-5 py-4 space-y-1.5">
        <p class="text-xs uppercase tracking-widest text-app-muted">About</p>
        <p class="text-sm text-slate-300 leading-relaxed">{{ creature.description }}</p>
      </div>

      <!-- Attacks -->
      <div class="space-y-3">
        <p class="text-xs uppercase tracking-widest text-app-muted px-1">Attacks</p>
        <div
          v-for="attack in creature.attacks"
          :key="attack.name"
          class="flex items-center justify-between rounded-2xl border border-app-border bg-app-surface px-5 py-4 gap-3"
        >
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-100 truncate">{{ attack.name }}</p>
            <p class="text-xs text-app-muted mt-0.5 leading-relaxed">{{ attack.description }}</p>
          </div>
          <span class="shrink-0 text-sm font-bold text-app-accent">{{ attack.power }} PWR</span>
        </div>
      </div>

    </div>
  </div>
</template>
