import { normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminRoom,
  AdminRoomPayload,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminRooms(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminRoom>>> {
  const result = await request<unknown>('/catalog/rooms/admin', {
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
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminRoom),
  }
}

export function createAdminRoom(payload: AdminRoomPayload): Promise<ApiResult<AdminRoom>> {
  return request<AdminRoom>('/catalog/rooms', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: payload,
  })
}

export function updateAdminRoom(
  roomId: number,
  payload: AdminRoomPayload,
): Promise<ApiResult<AdminRoom>> {
  return request<AdminRoom>(`/catalog/rooms/${roomId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: payload,
  })
}

export function deleteAdminRoom(roomId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/rooms/${roomId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
