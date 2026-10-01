import { apiClient } from '@/shared/api/client'
import type {
  CompareResult,
  DuplicateCheckResult,
  DuplicateStrategy,
} from '../types/reconciliation.types'

export async function downloadTemplate(): Promise<Blob> {
  const { data } = await apiClient.get<Blob>('/api/template/product-stock', {
    responseType: 'blob',
  })
  return data
}

export async function compareFiles(
  fileApp: File,
  fileReal: File,
  duplicateStrategy: DuplicateStrategy = 'remove',
): Promise<CompareResult> {
  const form = new FormData()
  form.append('file_app', fileApp)
  form.append('file_real', fileReal)
  form.append('duplicate_strategy', duplicateStrategy)
  const { data } = await apiClient.post<CompareResult>('/api/reconciliation/compare', form)
  return data
}

export async function checkDuplicates(
  fileApp: File | null,
  fileReal: File | null,
): Promise<DuplicateCheckResult> {
  const form = new FormData()
  if (fileApp) form.append('file_app', fileApp)
  if (fileReal) form.append('file_real', fileReal)
  const { data } = await apiClient.post<DuplicateCheckResult>(
    '/api/reconciliation/check-duplicates',
    form,
  )
  return data
}

export async function exportCorrected(rows: CompareResult['rows']): Promise<Blob> {
  const { data } = await apiClient.post<Blob>(
    '/api/reconciliation/export',
    { rows },
    { responseType: 'blob' },
  )
  return data
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
