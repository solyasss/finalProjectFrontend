import type { ProductFilters } from './types'

// Use php-style query parameters for filters
// TODO: possibly this will be changed
export function buildFilterQuery(filters?: ProductFilters): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {}
  if (!filters) return result
  if (filters.color) result['filters[color]'] = filters.color
  if (filters.price) result['filters[price]'] = filters.price
  if (filters.availability) result['filters[availability]'] = filters.availability
  return result
}
