import { request } from './client'
import type {
  ApiResult,
  SearchApiResponse,
  SearchSuggestResponse,
  SearchParams,
  SearchSuggestParams,
} from './types'

export function search(params: SearchParams): Promise<ApiResult<SearchApiResponse>> {
  const query: Record<string, string | number | boolean | undefined> = {
    q: params.q,
    page: params.page,
    limit: params.limit,
    sort: params.sort,
  }

  const filters = params.filters ?? {}

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue

    if (key === 'price') {
      const parts = value.split('-')
      query.price_min = parts[0]
      query.price_max = parts[1]
    } else if (key === 'availability') {
      if (value === 'in_stock') {
        query.inStock = 'true'
      }
    } else if (key === 'color' || key === 'categoryIds') {
      query[key] = value
    } else {
      query[`attr_${key}`] = value
    }
  }

  return request('/search', { baseUrl: 'root', query })
}

// TODO: Verify that the backend expose a search suggest endpoint
export function searchSuggest(
  params: SearchSuggestParams,
): Promise<ApiResult<SearchSuggestResponse>> {
  void params.limit

  // TODO: Temporary stub until the new search suggest backend endpoint is available/migrated.
  return Promise.resolve({
    ok: true,
    data: {
      query: params.q,
      suggestions: [],
      categories: [],
      products: [],
    },
  })
}
