import { normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminUser,
  AdminUserCreatePayload,
  AdminUserUpdatePayload,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminUsers(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminUser>>> {
  const result = await request<unknown>('/users/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminUser),
  }
}

export function getAdminUser(userId: number): Promise<ApiResult<AdminUser>> {
  return request<AdminUser>(`/users/${userId}/admin`, {
    baseUrl: 'root',
    auth: true,
  })
}

export function createAdminUser(payload: AdminUserCreatePayload): Promise<ApiResult<AdminUser>> {
  return request<AdminUser>('/users', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: payload,
  })
}

export function updateAdminUser(
  userId: number,
  payload: AdminUserUpdatePayload,
): Promise<ApiResult<AdminUser>> {
  return request<AdminUser>(`/users/${userId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: payload,
  })
}

export function deleteAdminUser(userId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/users/${userId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
