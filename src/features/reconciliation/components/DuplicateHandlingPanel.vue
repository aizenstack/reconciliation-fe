<script setup lang="ts">
import { computed } from 'vue'
import type { DuplicateCheckResult, DuplicateStrategy } from '../types/reconciliation.types'
import { countDuplicateExtraRows, countDuplicateSkus } from '../utils/summaryFilters'

const props = defineProps<{
  duplicates: DuplicateCheckResult | null
  modelValue: DuplicateStrategy
}>()

const emit = defineEmits<{
  'update:modelValue': [DuplicateStrategy]
  'view-duplicates': []
}>()

const skuCount = computed(() => countDuplicateSkus(props.duplicates))
const extraRows = computed(() => countDuplicateExtraRows(props.duplicates))

const strategyLabels: Record<DuplicateStrategy, { title: string; desc: string }> = {
  remove: {
    title: 'Hapus duplikasi',
    desc: 'Pakai baris pertama per SKU, baris duplikat diabaikan saat compare.',
  },
  merge: {
    title: 'Kurangi duplikasi',
    desc: 'Gabung baris SKU sama — stok dijumlahkan, nama dari baris pertama.',
  },
}
</script>

<template>
  <div
    v-if="skuCount > 0"
    class="mb-6 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 sm:p-6"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 class="text-sm font-semibold text-rose-100">Penanganan SKU duplikat</h3>
        <p class="mt-1 text-xs text-rose-200/80">
          File tetap bisa di-compare. Pilih cara mengolah duplikat sebelum compare.
        </p>
      </div>
      <button
        type="button"
        class="shrink-0 text-xs font-medium text-rose-100 underline-offset-2 hover:underline"
        @click="emit('view-duplicates')"
      >
        Lihat daftar duplikat
      </button>
    </div>

    <div
      class="mt-4 flex flex-col items-center justify-center rounded-xl bg-black/25 px-4 py-5 ring-1 ring-white/10 sm:flex-row sm:gap-6"
    >
      <div class="text-center sm:text-left">
        <p class="text-xs uppercase tracking-wider text-slate-400">Jumlah duplikasi</p>
        <p class="mt-1 text-2xl font-bold tabular-nums text-white">{{ skuCount }} SKU</p>
        <p class="text-xs text-slate-400">{{ extraRows }} baris ekstra di Excel</p>
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      <label
        v-for="(meta, key) in strategyLabels"
        :key="key"
        class="flex cursor-pointer gap-3 rounded-xl border p-4 transition"
        :class="
          modelValue === key
            ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        "
      >
        <input
          type="radio"
          class="mt-1 accent-emerald-500"
          :value="key"
          :checked="modelValue === key"
          @change="emit('update:modelValue', key as DuplicateStrategy)"
        />
        <span>
          <span class="block text-sm font-semibold text-white">{{ meta.title }}</span>
          <span class="mt-1 block text-xs leading-relaxed text-slate-400">{{ meta.desc }}</span>
        </span>
      </label>
    </div>
  </div>
</template>
