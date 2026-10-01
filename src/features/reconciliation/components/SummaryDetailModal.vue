<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { ComparisonRow, DuplicateCheckResult } from '../types/reconciliation.types'
import { ISSUE_LABELS } from '../types/reconciliation.types'
import type { SummaryModalKind } from '../utils/summaryFilters'
import { SUMMARY_MODAL_TITLES } from '../utils/summaryFilters'

const props = defineProps<{
  open: boolean
  kind: SummaryModalKind | null
  rows: ComparisonRow[]
  duplicates: DuplicateCheckResult | null
}>()

const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

function issueLabels(row: ComparisonRow) {
  return row.issues.map((i) => ISSUE_LABELS[i]).join(', ') || '—'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open && kind"
        class="fixed inset-0 z-[150] flex items-end justify-center p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        :aria-label="SUMMARY_MODAL_TITLES[kind]"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          aria-label="Tutup"
          @click="emit('close')"
        />

        <div
          class="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
        >
          <div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <h2 class="text-lg font-semibold text-white">{{ SUMMARY_MODAL_TITLES[kind] }}</h2>
              <p v-if="kind === 'duplicates'" class="mt-1 text-sm text-slate-400">
                Perbaiki file Excel sebelum compare — satu SKU hanya boleh satu baris.
              </p>
              <p v-else class="mt-1 text-sm text-slate-400">{{ rows.length }} baris ditampilkan</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto p-5">
            <template v-if="kind === 'duplicates' && duplicates">
              <div v-if="!duplicates.app.length && !duplicates.real.length" class="py-8 text-center text-sm text-slate-500">
                Tidak ada SKU duplikat.
              </div>
              <div v-if="duplicates.app.length" class="mb-6">
                <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">File aplikasi</h3>
                <ul class="space-y-2">
                  <li
                    v-for="entry in duplicates.app"
                    :key="'app-' + entry.sku"
                    class="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-red-500/20"
                  >
                    <span class="font-mono text-sm text-white">{{ entry.sku }}</span>
                    <span class="mt-1 block text-xs text-slate-400">
                      Baris Excel: {{ entry.row_numbers.join(', ') }}
                    </span>
                  </li>
                </ul>
              </div>
              <div v-if="duplicates.real.length">
                <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-sky-400">File real</h3>
                <ul class="space-y-2">
                  <li
                    v-for="entry in duplicates.real"
                    :key="'real-' + entry.sku"
                    class="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-red-500/20"
                  >
                    <span class="font-mono text-sm text-white">{{ entry.sku }}</span>
                    <span class="mt-1 block text-xs text-slate-400">
                      Baris Excel: {{ entry.row_numbers.join(', ') }}
                    </span>
                  </li>
                </ul>
              </div>
            </template>

            <template v-else>
              <div v-if="!rows.length" class="py-8 text-center text-sm text-slate-500">
                Tidak ada data untuk kategori ini.
              </div>
              <div v-else class="overflow-x-auto rounded-xl ring-1 ring-white/10">
                <table class="min-w-full text-left text-sm">
                  <thead class="bg-white/5 text-xs uppercase text-slate-400">
                    <tr>
                      <th class="px-3 py-2">SKU</th>
                      <th class="px-3 py-2">Stok app</th>
                      <th class="px-3 py-2">Stok real</th>
                      <th class="px-3 py-2">Selisih</th>
                      <th class="px-3 py-2">Masalah</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr v-for="row in rows" :key="row.sku" class="hover:bg-white/[0.02]">
                      <td class="px-3 py-2 font-mono text-xs text-emerald-300">{{ row.sku }}</td>
                      <td class="px-3 py-2 tabular-nums">{{ row.stock_app ?? '—' }}</td>
                      <td class="px-3 py-2 tabular-nums">{{ row.stock_real ?? '—' }}</td>
                      <td class="px-3 py-2 tabular-nums">{{ row.diff_label ?? '—' }}</td>
                      <td class="px-3 py-2 text-xs text-slate-300">{{ issueLabels(row) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
