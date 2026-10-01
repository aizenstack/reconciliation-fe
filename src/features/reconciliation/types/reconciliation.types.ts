export type IssueType = 'stock' | 'name' | 'missing_in_app' | 'missing_in_real'

export interface ComparisonRow {
  sku: string
  no_app: number | null
  no_real: number | null
  name_app: string | null
  name_real: string | null
  stock_app: number | null
  stock_real: number | null
  diff: number | null
  diff_label: string | null
  issues: IssueType[]
  highlight_name: boolean
  matched: boolean
}

export interface CompareSummary {
  total_rows: number
  matched_count: number
  stock_diff_count: number
  name_mismatch_count: number
  missing_in_app_count: number
  missing_in_real_count: number
  net_stock_diff: number
}

export interface CompareResult {
  rows: ComparisonRow[]
  summary: CompareSummary
  duplicates: DuplicateCheckResult
  duplicate_strategy: DuplicateStrategy
  duplicate_sku_count: number
  duplicate_extra_rows: number
}

export type DuplicateStrategy = 'remove' | 'merge'

export interface DuplicateSkuEntry {
  sku: string
  row_numbers: number[]
}

export interface DuplicateCheckResult {
  app: DuplicateSkuEntry[]
  real: DuplicateSkuEntry[]
}

export const ISSUE_LABELS: Record<IssueType, string> = {
  stock: 'Selisih stok',
  name: 'Nama berbeda',
  missing_in_app: 'Hanya di data real',
  missing_in_real: 'Hanya di data aplikasi',
}
