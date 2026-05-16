import { request } from './client'
import type { ApiResult } from './types'

export function triggerAdminReindex(): Promise<ApiResult<unknown>> {
  return request('/admin/search/reindex-all', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
  })
}
