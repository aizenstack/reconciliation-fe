<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  fileApp: File | null
  fileReal: File | null
  loading: boolean
}>()

const emit = defineEmits<{
  'update:fileApp': [File | null]
  'update:fileReal': [File | null]
  compare: []
}>()

const dragOver = ref<'app' | 'real' | null>(null)
const inputApp = ref<HTMLInputElement | null>(null)
const inputReal = ref<HTMLInputElement | null>(null)

function pickFile(side: 'app' | 'real') {
  if (side === 'app') inputApp.value?.click()
  else inputReal.value?.click()
}

function onFile(side: 'app' | 'real', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (side === 'app') emit('update:fileApp', file)
  else emit('update:fileReal', file)
}

function onDrop(side: 'app' | 'real', event: DragEvent) {
  event.preventDefault()
  dragOver.value = null
  const file = event.dataTransfer?.files?.[0] ?? null
  if (side === 'app') emit('update:fileApp', file)
  else emit('update:fileReal', file)
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

const canCompare = () => props.fileApp && props.fileReal && !props.loading
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-emerald-400/90">Langkah 1</p>
        <h2 class="mt-1 text-xl font-semibold text-white">Upload file Excel</h2>
        <p class="mt-1 text-sm text-slate-400">Drag & drop atau pilih file .xlsx untuk kedua sisi</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="inline-flex h-2 w-2 rounded-full" :class="fileApp ? 'bg-emerald-400' : 'bg-slate-600'" />
        Aplikasi
        <span class="mx-1 text-slate-700">·</span>
        <span class="inline-flex h-2 w-2 rounded-full" :class="fileReal ? 'bg-sky-400' : 'bg-slate-600'" />
        Real
      </div>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <div
        class="group relative rounded-2xl border-2 border-dashed transition-all duration-200"
        :class="
          dragOver === 'app'
            ? 'border-emerald-400/60 bg-emerald-500/10'
            : fileApp
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/60'
        "
        @dragover.prevent="dragOver = 'app'"
        @dragleave.prevent="dragOver = null"
        @drop="onDrop('app', $event)"
      >
        <input ref="inputApp" type="file" accept=".xlsx" class="hidden" @change="onFile('app', $event)" />
        <div class="flex flex-col items-center px-6 py-10 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-white/10">
            <svg class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6M5 21h14a2 2 0 002-2V7l-4-4H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white">Stok aplikasi</h3>
          <p class="mt-1 text-xs text-slate-400">No · SKU · Nama Product · Stok</p>
          <button type="button" class="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:bg-slate-100" @click="pickFile('app')">
            Pilih file
          </button>
          <div v-if="fileApp" class="mt-4 w-full rounded-xl bg-black/30 px-3 py-2 text-left ring-1 ring-emerald-500/20">
            <p class="truncate text-sm font-medium text-emerald-100">{{ fileApp.name }}</p>
            <p class="text-xs text-slate-500">{{ formatSize(fileApp.size) }}</p>
          </div>
        </div>
      </div>

      <div
        class="group relative rounded-2xl border-2 border-dashed transition-all duration-200"
        :class="
          dragOver === 'real'
            ? 'border-sky-400/60 bg-sky-500/10'
            : fileReal
              ? 'border-sky-500/40 bg-sky-500/5'
              : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/60'
        "
        @dragover.prevent="dragOver = 'real'"
        @dragleave.prevent="dragOver = null"
        @drop="onDrop('real', $event)"
      >
        <input ref="inputReal" type="file" accept=".xlsx" class="hidden" @change="onFile('real', $event)" />
        <div class="flex flex-col items-center px-6 py-10 text-center">
          <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-white/10">
            <svg class="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white">Stok real</h3>
          <p class="mt-1 text-xs text-slate-400">SKU harus match untuk perbandingan</p>
          <button type="button" class="mt-5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition hover:brightness-110" @click="pickFile('real')">
            Pilih file
          </button>
          <div v-if="fileReal" class="mt-4 w-full rounded-xl bg-black/30 px-3 py-2 text-left ring-1 ring-sky-500/20">
            <p class="truncate text-sm font-medium text-sky-100">{{ fileReal.name }}</p>
            <p class="text-xs text-slate-500">{{ formatSize(fileReal.size) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-xs text-slate-500">
        Compare menggunakan <span class="font-medium text-slate-300">SKU</span> sebagai kunci utama.
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40"
        :class="canCompare() ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-900/40 hover:brightness-110' : 'bg-slate-700'"
        :disabled="!canCompare()"
        @click="emit('compare')"
      >
        {{ loading ? 'Membandingkan…' : 'Compare data' }}
      </button>
    </div>
  </div>
</template>
