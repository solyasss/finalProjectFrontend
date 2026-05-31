import { request } from './client'
import type { ApiResult, Promotion } from './types'

export function getActivePromotions(): Promise<ApiResult<Promotion[]>> {
  return request('/sales/promotions/active', { baseUrl: 'root' })
}
