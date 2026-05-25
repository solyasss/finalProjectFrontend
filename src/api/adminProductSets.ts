import { normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminProductSet,
  AdminProductSetPayload,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminProductSets(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminProductSet>>> {
  const result = await request<unknown>('/catalog/product-sets/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
      filter: params?.filter,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminProductSet),
  }
}

export function createAdminProductSet(
  payload: AdminProductSetPayload,
): Promise<ApiResult<AdminProductSet>> {
  return request<AdminProductSet>('/catalog/product-sets', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: payload,
  })
}

export function updateAdminProductSet(
  setId: number,
  payload: AdminProductSetPayload,
): Promise<ApiResult<AdminProductSet>> {
  return request<AdminProductSet>(`/catalog/product-sets/${setId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: payload,
  })
}

export function deleteAdminProductSet(setId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/product-sets/${setId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
