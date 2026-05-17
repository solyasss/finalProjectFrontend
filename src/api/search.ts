import type {
  ApiResult,
  SearchResponse,
  SearchSuggestResponse,
  SearchParams,
  SearchSuggestParams,
} from './types'

// TODO: Verify that the backend supports all the query parameters
export function search(params: SearchParams): Promise<ApiResult<SearchResponse>> {
  // TODO: Temporary stub until the new search backend endpoint is available/migrated.
  return Promise.resolve({
    ok: true,
    data: {
      query: params.q,
      filters: [],
      products: [],
      pagination: {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 0,
      },
    },
  })
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
