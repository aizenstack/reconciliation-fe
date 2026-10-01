<script setup lang="ts">
import type { ComparisonRow } from '../types/reconciliation.types'
import { ISSUE_LABELS } from '../types/reconciliation.types'

defineProps<{
  rows: ComparisonRow[]
}>()

function diffClass(label: string | null) {
  if (!label || label === '0') return 'text-slate-400'
  if (label.startsWith('+')) return 'font-semibold text-emerald-400'
  return 'font-semibold text-red-400'
}

function issueBadges(issues: ComparisonRow['issues']) {
  return issues.map((i) => ISSUE_LABELS[i])
}

function badgeClass(issues: ComparisonRow['issues']) {
  if (issues.includes('missing_in_app') || issues.includes('missing_in_real')) {
    return 'bg-violet-500/15 text-violet-200 ring-violet-500/30'
  }
  if (issues.includes('name')) return 'bg-amber-500/15 text-amber-200 ring-amber-500/30'
  if (issues.includes('stock')) return 'bg-red-500/15 text-red-200 ring-red-500/30'
  return 'bg-slate-500/15 text-slate-300 ring-white/10'
}
</script>

<template>
  <div class="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl shadow-black/30">
    <div class="border-b border-white/5 px-4 py-3 sm:px-6">
      <p class="text-xs text-slate-500">
        Baris dengan nama berbeda (SKU sama) ditandai
        <span class="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-200">highlight</span>
      </p>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-white/5 bg-white/[0.03] text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th class="px-4 py-4 sm:px-6">SKU</th>
            <th class="px-4 py-4">Nama (app)</th>
            <th class="px-4 py-4">Nama (real)</th>
            <th class="px-4 py-4 text-right">Stok app</th>
            <th class="px-4 py-4 text-right">Stok real</th>
            <th class="px-4 py-4 text-right">Selisih</th>
            <th class="px-4 py-4 sm:pr-6">Info</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="row in rows" :key="row.sku" class="transition-colors hover:bg-white/[0.02]">
            <td class="whitespace-nowrap px-4 py-3 font-mono text-xs text-emerald-300/90 sm:px-6">{{ row.sku }}</td>
            <td class="max-w-[160px] truncate px-4 py-3 text-slate-200" :class="row.highlight_name ? 'bg-amber-500/10 ring-1 ring-inset ring-amber-500/25' : ''">{{ row.name_app ?? '—' }}</td>
            <td class="max-w-[160px] truncate px-4 py-3 text-slate-200" :class="row.highlight_name ? 'bg-amber-500/10 ring-1 ring-inset ring-amber-500/25' : ''">{{ row.name_real ?? '—' }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-300">{{ row.stock_app ?? '—' }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-slate-300">{{ row.stock_real ?? '—' }}</td>
            <td class="px-4 py-3 text-right tabular-nums" :class="diffClass(row.diff_label)">{{ row.diff_label ?? '—' }}</td>
            <td class="px-4 py-3 sm:pr-6">
              <div v-if="row.issues.length" class="flex flex-wrap gap-1">
                <span v-for="label in issueBadges(row.issues)" :key="label" class="rounded-lg px-2 py-0.5 text-xs ring-1" :class="badgeClass(row.issues)">{{ label }}</span>
              </div>
              <span v-else class="inline-flex items-center gap-1 text-xs text-emerald-500/80">
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                Sesuai
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
