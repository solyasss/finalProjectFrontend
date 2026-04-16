import type { ProductFilters } from './types'

// Use php-style query parameters for filters
// TODO: possibly this will be changed
export function buildFilterQuery(filters?: ProductFilters): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}
  if (!filters) return result

  for (const [key, value] of Object.entries(filters)) {
    if (!value) {
      continue
    }

    result[`filters[${key}]`] = value
  }

  return result
}
