<script setup lang="ts">
import { ref } from 'vue'
import AppCreditFooter from '@/shared/components/AppCreditFooter.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import DuplicateHandlingPanel from '../components/DuplicateHandlingPanel.vue'
import FileUploadPair from '../components/FileUploadPair.vue'
import SummaryDetailModal from '../components/SummaryDetailModal.vue'
import SummaryPanel from '../components/SummaryPanel.vue'
import { useReconciliation } from '../composables/useReconciliation'

const {
  fileApp,
  fileReal,
  compareResult,
  duplicateReport,
  duplicateStrategy,
  loading,
  exporting,
  setFileApp,
  setFileReal,
  fetchTemplate,
  runCompare,
  runExport,
} = useReconciliation()

const duplicateModalOpen = ref(false)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
    <header class="mb-10 text-center sm:text-left">
      <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Stock reconciliation
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Data Reconciliation</h1>
      <p class="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-400 sm:mx-0">
        Bandingkan stok aplikasi dengan stok real via Excel. Lihat selisih
        <span class="text-emerald-400">(+)</span>/<span class="text-red-400">(−)</span>, highlight nama yang beda, lalu generate file koreksi.
      </p>
      <button type="button" class="group mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-white" @click="fetchTemplate">
        <svg class="h-4 w-4 text-emerald-400 transition group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download template Excel
      </button>
    </header>

    <FileUploadPair
      :file-app="fileApp"
      :file-real="fileReal"
      :loading="loading"
      @update:file-app="setFileApp"
      @update:file-real="setFileReal"
      @compare="runCompare"
    />

    <DuplicateHandlingPanel
      v-model="duplicateStrategy"
      :duplicates="duplicateReport"
      class="mt-6"
      @view-duplicates="duplicateModalOpen = true"
    />

    <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="translate-y-4 opacity-0" enter-to-class="translate-y-0 opacity-100">
      <section v-if="compareResult" class="mt-12 space-y-8">
        <div>
          <p class="text-xs font-medium uppercase tracking-widest text-sky-400/90">Langkah 2</p>
          <h2 class="mt-1 text-2xl font-semibold text-white">Hasil perbandingan</h2>
          <p class="mt-1 text-sm text-slate-400">
            {{ compareResult.summary.total_rows }} baris · match by SKU
            <span v-if="compareResult.duplicate_sku_count > 0" class="text-rose-300">
              · duplikat {{ compareResult.duplicate_sku_count }} SKU ({{ compareResult.duplicate_extra_rows }} baris)
              · mode:
              {{ compareResult.duplicate_strategy === 'merge' ? 'kurangi/gabung' : 'hapus' }}
            </span>
          </p>
        </div>
        <ComparisonTable :rows="compareResult.rows" />
        <SummaryPanel
          :summary="compareResult.summary"
          :rows="compareResult.rows"
          :duplicates="compareResult.duplicates"
          :duplicate-extra-rows="compareResult.duplicate_extra_rows"
        />
        <div class="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 p-6 sm:p-8">
          <p class="text-xs font-medium uppercase tracking-widest text-emerald-400/90">Langkah 3</p>
          <h3 class="mt-2 text-lg font-semibold text-white">Generate data real stok</h3>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Excel output memperbarui stok dan nama sesuai data real untuk SKU yang match, menambah SKU baru dari data real, dan mempertahankan baris yang hanya ada di aplikasi.
          </p>
          <button type="button" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-black/20 transition hover:bg-slate-100 disabled:opacity-50" :disabled="exporting" @click="runExport">
            {{ exporting ? 'Membuat file…' : 'Unduh Excel koreksi' }}
          </button>
        </div>
      </section>
    </Transition>

    <SummaryDetailModal
      :open="duplicateModalOpen"
      kind="duplicates"
      :rows="[]"
      :duplicates="duplicateReport"
      @close="duplicateModalOpen = false"
    />

    <AppCreditFooter />
  </div>
</template>
