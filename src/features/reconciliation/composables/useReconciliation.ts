import { ref } from 'vue'
import {
  checkDuplicates,
  compareFiles,
  downloadTemplate,
  exportCorrected,
  triggerBlobDownload,
} from '../api/reconciliation.api'
import type { CompareResult, DuplicateCheckResult, DuplicateStrategy } from '../types/reconciliation.types'
import { getApiErrorMessage } from '@/shared/api/client'
import { useToast } from '@/shared/composables/useToast'
import { countDuplicateExtraRows, countDuplicateSkus } from '../utils/summaryFilters'

export function useReconciliation() {
  const toast = useToast()
  const fileApp = ref<File | null>(null)
  const fileReal = ref<File | null>(null)
  const compareResult = ref<CompareResult | null>(null)
  const duplicateReport = ref<DuplicateCheckResult | null>(null)
  const duplicateStrategy = ref<DuplicateStrategy>('remove')
  const loading = ref(false)
  const exporting = ref(false)
  const checkingDuplicates = ref(false)

  async function refreshDuplicateCheck() {
    if (!fileApp.value && !fileReal.value) {
      duplicateReport.value = null
      return
    }
    checkingDuplicates.value = true
    try {
      duplicateReport.value = await checkDuplicates(fileApp.value, fileReal.value)
      const sku = countDuplicateSkus(duplicateReport.value)
      if (sku > 0) {
        toast.info(
          'SKU duplikat terdeteksi',
          `${sku} SKU · ${countDuplicateExtraRows(duplicateReport.value)} baris ekstra — pilih penanganan di bawah.`,
        )
      }
    } catch {
      duplicateReport.value = null
    } finally {
      checkingDuplicates.value = false
    }
  }

  async function setFileApp(file: File | null) {
    if (file && !file.name.toLowerCase().endsWith('.xlsx')) {
      toast.warning('Format file', 'Hanya file .xlsx yang didukung untuk data aplikasi.')
      return
    }
    fileApp.value = file
    compareResult.value = null
    if (file) toast.success('File aplikasi dipilih', file.name)
    await refreshDuplicateCheck()
  }

  async function setFileReal(file: File | null) {
    if (file && !file.name.toLowerCase().endsWith('.xlsx')) {
      toast.warning('Format file', 'Hanya file .xlsx yang didukung untuk data real.')
      return
    }
    fileReal.value = file
    compareResult.value = null
    if (file) toast.info('File real dipilih', file.name)
    await refreshDuplicateCheck()
  }

  async function fetchTemplate() {
    try {
      const blob = await downloadTemplate()
      triggerBlobDownload(blob, 'product-stock-template.xlsx')
      toast.success('Template diunduh', 'Isi kolom No, SKU, Nama Product, dan Stok.')
    } catch (e) {
      toast.error('Gagal unduh template', getApiErrorMessage(e))
    }
  }

  async function runCompare() {
    if (!fileApp.value || !fileReal.value) {
      toast.warning('File belum lengkap', 'Upload data stok aplikasi dan stok real terlebih dahulu.')
      return
    }
    loading.value = true
    compareResult.value = null
    toast.info('Membandingkan…', 'Matching by SKU, mohon tunggu.')
    try {
      compareResult.value = await compareFiles(
        fileApp.value,
        fileReal.value,
        duplicateStrategy.value,
      )
      duplicateReport.value = compareResult.value.duplicates
      const s = compareResult.value.summary
      const dupMsg =
        compareResult.value.duplicate_sku_count > 0
          ? ` · duplikat: ${compareResult.value.duplicate_sku_count} SKU (${compareResult.value.duplicate_extra_rows} baris)`
          : ''
      toast.success(
        'Compare selesai',
        `${s.total_rows} baris · ${s.matched_count} match${dupMsg}`,
      )
    } catch (e) {
      toast.error('Compare gagal', getApiErrorMessage(e))
    } finally {
      loading.value = false
    }
  }

  async function runExport() {
    if (!compareResult.value?.rows.length) {
      toast.warning('Belum ada hasil', 'Jalankan Compare terlebih dahulu.')
      return
    }
    exporting.value = true
    try {
      const blob = await exportCorrected(compareResult.value.rows)
      triggerBlobDownload(blob, 'corrected-product-stock.xlsx')
      toast.success(
        'Excel berhasil dibuat',
        'File stok koreksi mengikuti data real siap diunduh.',
      )
    } catch (e) {
      toast.error('Generate gagal', getApiErrorMessage(e))
    } finally {
      exporting.value = false
    }
  }

  return {
    fileApp,
    fileReal,
    compareResult,
    duplicateReport,
    duplicateStrategy,
    checkingDuplicates,
    loading,
    exporting,
    setFileApp,
    setFileReal,
    fetchTemplate,
    runCompare,
    runExport,
    refreshDuplicateCheck,
  }
}
