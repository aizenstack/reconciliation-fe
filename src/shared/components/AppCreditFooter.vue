<script setup lang="ts">
const GITHUB_URL = 'https://github.com/aizenstack'
</script>

<template>
  <footer class="mt-16 border-t border-white/5 pt-8 text-center">
    <p class="text-xs text-slate-500">
      by
      <a
        :href="GITHUB_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-slate-400 underline-offset-2 transition hover:text-emerald-400 hover:underline"
      >
        Febrian Yosi Pangestu
      </a>
      <span class="mx-1 text-slate-700">·</span>
      <a
        :href="GITHUB_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="text-slate-500 transition hover:text-sky-400 hover:underline"
      >
        @aizenstack
      </a>
    </p>
  </footer>
</template>
