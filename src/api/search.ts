import { request } from './client'
import { buildFilterQuery } from './utils'
import type {
  ApiResult,
  SearchResponse,
  SearchSuggestResponse,
  SearchParams,
  SearchSuggestParams,
} from './types'

export function search(params: SearchParams): Promise<ApiResult<SearchResponse>> {
  return request('/search', {
    query: {
      q: params.q,
      page: params.page,
      limit: params.limit,
      sort: params.sort,
      ...buildFilterQuery(params.filters),
    },
  })
}

export function searchSuggest(
  params: SearchSuggestParams,
): Promise<ApiResult<SearchSuggestResponse>> {
  return request('/search/suggest', {
    query: { q: params.q, limit: params.limit },
  })
}
