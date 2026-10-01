import type { ComparisonRow, DuplicateCheckResult, IssueType } from '../types/reconciliation.types'

export type SummaryModalKind =
  | 'total_rows'
  | 'matched_count'
  | 'stock_diff_count'
  | 'name_mismatch_count'
  | 'missing_in_real_count'
  | 'missing_in_app_count'
  | 'problem_count'
  | 'duplicates'

export const SUMMARY_MODAL_TITLES: Record<SummaryModalKind, string> = {
  total_rows: 'Semua baris (union SKU)',
  matched_count: 'SKU match — sesuai pasangan',
  stock_diff_count: 'Selisih stok',
  name_mismatch_count: 'Nama product berbeda',
  missing_in_real_count: 'Hanya ada di data aplikasi',
  missing_in_app_count: 'Hanya ada di data real',
  problem_count: 'Semua data bermasalah',
  duplicates: 'SKU duplikat di file Excel',
}

export function filterRowsForSummary(
  kind: SummaryModalKind,
  rows: ComparisonRow[],
): ComparisonRow[] {
  switch (kind) {
    case 'total_rows':
      return rows
    case 'matched_count':
      return rows.filter((r) => r.matched)
    case 'stock_diff_count':
      return rows.filter((r) => r.issues.includes('stock'))
    case 'name_mismatch_count':
      return rows.filter((r) => r.issues.includes('name') || r.highlight_name)
    case 'missing_in_real_count':
      return rows.filter((r) => r.issues.includes('missing_in_real'))
    case 'missing_in_app_count':
      return rows.filter((r) => r.issues.includes('missing_in_app'))
    case 'problem_count':
      return rows.filter((r) => r.issues.length > 0)
    default:
      return rows
  }
}

export function countProblemRows(rows: ComparisonRow[]): number {
  return rows.filter((r) => r.issues.length > 0).length
}

export function countDuplicateSkus(report: DuplicateCheckResult | null): number {
  if (!report) return 0
  return report.app.length + report.real.length
}

export function countDuplicateExtraRows(report: DuplicateCheckResult | null): number {
  if (!report) return 0
  let extra = 0
  for (const entry of [...report.app, ...report.real]) {
    extra += Math.max(0, entry.row_numbers.length - 1)
  }
  return extra
}

export function hasIssue(row: ComparisonRow, issue: IssueType): boolean {
  return row.issues.includes(issue)
}
