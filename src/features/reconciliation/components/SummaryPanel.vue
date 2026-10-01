<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComparisonRow, CompareSummary, DuplicateCheckResult } from '../types/reconciliation.types'
import SummaryDetailModal from './SummaryDetailModal.vue'
import {
  countDuplicateSkus,
  countProblemRows,
  filterRowsForSummary,
  type SummaryModalKind,
} from '../utils/summaryFilters'

const props = defineProps<{
  summary: CompareSummary
  rows: ComparisonRow[]
  duplicates: DuplicateCheckResult | null
  duplicateExtraRows?: number
}>()

const modalOpen = ref(false)
const activeKind = ref<SummaryModalKind | null>(null)

const problemCount = computed(() => countProblemRows(props.rows))
const duplicateCount = computed(() => countDuplicateSkus(props.duplicates))

const modalRows = computed(() => {
  if (!activeKind.value || activeKind.value === 'duplicates') return []
  return filterRowsForSummary(activeKind.value, props.rows)
})

type CardDef = {
  kind: SummaryModalKind
  label: string
  accent: string
  count: number
}

const cards = computed((): CardDef[] => {
  const s = props.summary
  const list: CardDef[] = [
    { kind: 'problem_count', label: 'Data bermasalah', accent: 'from-red-500/25 to-red-600/5 ring-red-500/30', count: problemCount.value },
    { kind: 'total_rows', label: 'Total baris', accent: 'from-slate-500/20 to-slate-600/5 ring-white/10', count: s.total_rows },
    { kind: 'matched_count', label: 'SKU match', accent: 'from-emerald-500/20 to-emerald-600/5 ring-emerald-500/20', count: s.matched_count },
    { kind: 'stock_diff_count', label: 'Selisih stok', accent: 'from-amber-500/20 to-amber-600/5 ring-amber-500/20', count: s.stock_diff_count },
    { kind: 'name_mismatch_count', label: 'Nama berbeda', accent: 'from-orange-500/20 to-orange-600/5 ring-orange-500/20', count: s.name_mismatch_count },
    { kind: 'missing_in_real_count', label: 'Hanya di app', accent: 'from-violet-500/20 to-violet-600/5 ring-violet-500/20', count: s.missing_in_real_count },
    { kind: 'missing_in_app_count', label: 'Hanya di real', accent: 'from-sky-500/20 to-sky-600/5 ring-sky-500/20', count: s.missing_in_app_count },
  ]
  if (duplicateCount.value > 0) {
    list.unshift({
      kind: 'duplicates',
      label: 'Duplikat SKU',
      accent: 'from-rose-500/25 to-rose-600/5 ring-rose-500/40',
      count: duplicateCount.value,
    })
  }
  return list
})

function openModal(kind: SummaryModalKind) {
  activeKind.value = kind
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  activeKind.value = null
}

function netClass(net: number) {
  if (net > 0) return 'text-emerald-400'
  if (net < 0) return 'text-red-400'
  return 'text-slate-300'
}
</script>

<template>
  <div class="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
    <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-400">Ringkasan</h3>
      <p class="text-xs text-slate-500">Klik kartu untuk detail baris yang salah / duplikat</p>
    </div>
    <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="card in cards"
        :key="card.kind"
        type="button"
        class="rounded-2xl bg-gradient-to-br p-4 text-left ring-1 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        :class="card.accent"
        :disabled="card.count === 0 && card.kind !== 'total_rows'"
        @click="openModal(card.kind)"
      >
        <p class="text-xs font-medium text-slate-400">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold tabular-nums text-white">{{ card.count }}</p>
        <p v-if="card.kind === 'duplicates' && duplicateExtraRows" class="mt-1 text-xs text-rose-200/80">
          {{ duplicateExtraRows }} baris ekstra
        </p>
        <p v-else-if="card.count > 0" class="mt-2 text-xs text-slate-400">Lihat detail →</p>
      </button>
      <div
        class="rounded-2xl bg-gradient-to-br from-emerald-500/15 to-red-500/10 p-4 ring-1 ring-white/10 sm:col-span-2 lg:col-span-3"
      >
        <p class="text-xs font-medium text-slate-400">Total selisih stok (real − aplikasi)</p>
        <p class="mt-2 text-3xl font-bold tabular-nums" :class="netClass(summary.net_stock_diff)">
          {{ summary.net_stock_diff > 0 ? '+' : '' }}{{ summary.net_stock_diff }}
        </p>
      </div>
    </div>
  </div>

  <SummaryDetailModal
    :open="modalOpen"
    :kind="activeKind"
    :rows="modalRows"
    :duplicates="duplicates"
    @close="closeModal"
  />
</template>

<style scoped>
button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
