<script setup lang="ts">
import { useExplore } from '../composables/useExplore'

const { isPending, creature, startExploring } = useExplore()
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="min-h-full flex flex-col items-center justify-center gap-8 px-8 py-10">

      <!-- Icon: radar (idle + hunting) -->
      <div v-if="!creature" class="relative flex items-center justify-center w-40 h-40 shrink-0">
        <div class="absolute w-28 h-28 rounded-full border border-app-accent/40 animate-ring-ping" />
        <div class="absolute w-28 h-28 rounded-full border border-app-accent/40 animate-ring-ping-delay" />
        <div class="absolute w-28 h-28 rounded-full border border-app-accent/40 animate-ring-ping-delay2" />

        <div class="absolute w-28 h-28 rounded-full border border-app-border" />
        <div class="absolute w-20 h-20 rounded-full border border-app-border" />
        <div class="absolute w-12 h-12 rounded-full border border-app-border" />

        <div class="absolute w-28 h-28 rounded-full overflow-hidden animate-radar-sweep">
          <div class="absolute inset-0 origin-center"
            style="background: conic-gradient(from 0deg, transparent 75%, #60a5fa44 90%, #60a5fa 100%)" />
        </div>

        <div class="w-2 h-2 rounded-full bg-app-accent shadow-[0_0_8px_2px_#60a5fa80]" />
      </div>

      <!-- Icon: caught -->
      <div v-else class="relative flex items-center justify-center w-40 h-40 shrink-0">
        <!-- Pulsing outer glow -->
        <div class="absolute w-36 h-36 rounded-full bg-app-accent/10 animate-ping" style="animation-duration:2.4s" />

        <!-- Sparkles -->
        <div class="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_3px_#fde047] animate-pulse" style="animation-delay:0ms" />
        <div class="absolute top-4 right-5 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_2px_#facc15] animate-pulse" style="animation-delay:300ms" />
        <div class="absolute top-1/2 right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-app-accent shadow-[0_0_8px_3px_#60a5fa] animate-pulse" style="animation-delay:600ms" />
        <div class="absolute bottom-4 right-5 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_2px_#fde047] animate-pulse" style="animation-delay:900ms" />
        <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_3px_#facc15] animate-pulse" style="animation-delay:1200ms" />
        <div class="absolute bottom-4 left-5 w-1.5 h-1.5 rounded-full bg-app-accent shadow-[0_0_6px_2px_#60a5fa] animate-pulse" style="animation-delay:1500ms" />
        <div class="absolute top-1/2 left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_3px_#fde047] animate-pulse" style="animation-delay:1800ms" />
        <div class="absolute top-4 left-5 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_2px_#facc15] animate-pulse" style="animation-delay:2100ms" />

        <!-- Orb -->
        <div class="w-24 h-24 rounded-full bg-app-accent/10 border border-app-accent/60 shadow-[0_0_32px_8px_#60a5fa30] flex items-center justify-center">
          <svg class="w-11 h-11 text-app-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold tracking-wide text-slate-100">
          <template v-if="isPending">On the Hunt</template>
          <template v-else-if="creature">Something's Caught!</template>
          <template v-else>Venture Out</template>
        </h2>
        <p class="text-sm text-app-muted leading-relaxed">
          <template v-if="isPending">
            Scanning the wild…<br>This might take a moment.
          </template>
          <template v-else-if="creature">
            You encountered a wild creature.<br>Add it to your collection!
          </template>
          <template v-else>
            Monsters are hiding nearby.<br>Step outside and start hunting.
          </template>
        </p>
      </div>

      <!-- Hunting indicator -->
      <div v-if="isPending" class="flex items-center gap-2 text-app-accent text-sm font-medium">
        <span class="w-2 h-2 rounded-full bg-app-accent animate-pulse" />
        Hunting…
      </div>

      <!-- Creature card -->
      <div
        v-if="creature"
        class="w-full max-w-sm rounded-2xl border border-app-border bg-app-surface px-6 py-5 space-y-4 shadow-lg"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-lg font-bold text-slate-100 leading-tight">{{ creature.name }}</span>
          <span
            class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
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

        <div class="flex gap-6 text-sm">
          <div>
            <p class="text-app-muted text-xs uppercase tracking-widest mb-0.5">Height</p>
            <p class="text-slate-200 font-semibold">{{ creature.height }} m</p>
          </div>
          <div>
            <p class="text-app-muted text-xs uppercase tracking-widest mb-0.5">Weight</p>
            <p class="text-slate-200 font-semibold">{{ creature.weight }} kg</p>
          </div>
        </div>

        <p class="text-sm text-app-muted leading-relaxed">{{ creature.description }}</p>

        <div class="space-y-2">
          <p class="text-xs uppercase tracking-widest text-app-muted">Attacks</p>
          <div
            v-for="attack in creature.attacks"
            :key="attack.name"
            class="flex items-center justify-between rounded-lg bg-app-bg px-3 py-2 gap-3"
          >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-100 truncate">{{ attack.name }}</p>
              <p class="text-xs text-app-muted truncate">{{ attack.description }}</p>
            </div>
            <span class="shrink-0 text-xs font-bold text-app-accent">{{ attack.power }} PWR</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <button
        v-if="creature"
        class="px-10 py-3 rounded-full border border-app-accent/40 text-app-accent font-semibold tracking-wide text-sm active:scale-95 transition-transform duration-100"
        @click="startExploring"
      >
        I want to go further
      </button>

      <button
        v-else-if="!isPending"
        class="px-10 py-3 rounded-full bg-app-accent text-app-bg font-semibold tracking-wide text-sm shadow-[0_0_20px_4px_#60a5fa40] active:scale-95 transition-transform duration-100"
        @click="startExploring"
      >
        Explore
      </button>

    </div>
  </div>
</template>
