import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 120_000,
})

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data instanceof Blob) {
      return 'Permintaan gagal — periksa file dan koneksi API'
    }
    const detail = (data as { detail?: unknown })?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((d: { msg?: string }) => d.msg ?? String(d)).join('; ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Terjadi kesalahan'
}
