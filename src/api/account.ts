import { request } from './client'
import type { ApiResult, ChangePasswordRequest, MeResponse, UpdateProfileRequest } from './types'

export function getMe(): Promise<ApiResult<MeResponse>> {
  return request<MeResponse>('/auth/me', { auth: true, baseUrl: 'root' })
}

export function updateProfile(body: UpdateProfileRequest): Promise<ApiResult<MeResponse>> {
  return request<MeResponse>('/users/me', {
    method: 'PATCH',
    body,
    auth: true,
    baseUrl: 'root',
  })
}

export async function deleteAccount(): Promise<ApiResult<void>> {
  const result = await request<unknown>('/users/me', {
    method: 'DELETE',
    auth: true,
    baseUrl: 'root',
  })
  if (!result.ok) return result
  return { ok: true, data: undefined }
}

export function updateLocation(_payload: {
  cityId?: string
  storeId?: string
}): Promise<ApiResult<void>> {
  throw new Error('Not implemented: updateLocation')
}

export function changePassword(_body: ChangePasswordRequest): Promise<ApiResult<void>> {
  throw new Error('Not implemented: changePassword')
}
