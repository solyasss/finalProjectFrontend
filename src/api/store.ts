import { request } from './client'
import type { ApiResult, StoreDetailsResponse } from './types'

// TODO: Verify that the backend API exposes a store details endpoint
export function getStore(): Promise<ApiResult<StoreDetailsResponse>> {
  return request('/store')
}
