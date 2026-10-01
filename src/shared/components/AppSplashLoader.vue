<script setup lang="ts">
import splashLogo from '@/assets/dc_f.png'

const GITHUB_URL = 'https://github.com/aizenstack'
</script>

<template>
  <div
    class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black px-6"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_35%,rgb(37_99_235/0.12),transparent)]"
    />

    <div class="relative flex flex-col items-center text-center">
      <img
        :src="splashLogo"
        alt="Data Comparison"
        class="splash-logo mb-10 h-auto w-full max-w-[280px] object-contain sm:max-w-[320px]"
        width="320"
        height="320"
        decoding="async"
      />

      <p class="text-sm text-slate-400">Menyiapkan aplikasi…</p>

      <div class="mt-8 w-48">
        <div class="h-1 overflow-hidden rounded-full bg-white/10">
          <div class="progress-bar h-full w-2/5 rounded-full bg-gradient-to-r from-blue-600 to-sky-400" />
        </div>
        <p class="mt-3 text-xs text-slate-500">Loading…</p>
      </div>

      <p class="mt-16 text-xs text-slate-500">
        by
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="pointer-events-auto ml-1 font-medium text-slate-300 underline-offset-2 transition hover:text-sky-400 hover:underline"
        >
          Febrian Yosi Pangestu
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.splash-logo {
  animation: splash-logo-in 0.7s ease-out both;
}

@keyframes splash-logo-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.progress-bar {
  animation: splash-progress 1.1s ease-in-out infinite;
}

@keyframes splash-progress {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
</style>
