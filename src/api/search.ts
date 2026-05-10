import { request } from './client'
import { buildFilterQuery } from './utils'
import type {
  ApiResult,
  SearchResponse,
  SearchSuggestResponse,
  SearchParams,
  SearchSuggestParams,
} from './types'

// TODO: Verify that the backend supports all the query parameters
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

// TODO: Verify that the backend expose a search suggest endpoint
export function searchSuggest(
  params: SearchSuggestParams,
): Promise<ApiResult<SearchSuggestResponse>> {
  return request('/search/suggest', {
    query: { q: params.q, limit: params.limit },
  })
}
