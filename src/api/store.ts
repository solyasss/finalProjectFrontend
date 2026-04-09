import { request } from './client'
import type { ApiResult, StoreDetailsResponse } from './types'

export function getStore(): Promise<ApiResult<StoreDetailsResponse>> {
  return request('/store')
}
