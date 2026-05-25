import { request } from './client'
import { normalizeAdminPaginatedResponse } from './admin'
import type {
  AdminCategory,
  AdminCategoryPayload,
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminCategories(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminCategory>>> {
  const result = await request<unknown>('/catalog/categories/admin', {
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
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminCategory),
  }
}

export function getAdminCategory(categoryId: number): Promise<ApiResult<AdminCategory>> {
  return request<AdminCategory>(`/catalog/categories/${categoryId}`, {
    baseUrl: 'root',
    auth: true,
  })
}

export function createAdminCategory(
  payload: AdminCategoryPayload,
): Promise<ApiResult<AdminCategory>> {
  return request<AdminCategory>('/catalog/categories', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: payload,
  })
}

export function updateAdminCategory(
  categoryId: number,
  payload: AdminCategoryPayload,
): Promise<ApiResult<AdminCategory>> {
  return request<AdminCategory>(`/catalog/categories/${categoryId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: payload,
  })
}

export function deleteAdminCategory(
  categoryId: number,
): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/categories/${categoryId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
