import { request } from './client'
import type {
  ApiResult,
  ChangePasswordRequest,
  MeResponse,
  OrderDetailsResponse,
  OrdersResponse,
  OrderTrackingResponse,
  UpdateProfileRequest,
  GetOrdersParams,
} from './types'

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

// TODO: `openapi.json` currently documents `/users/me` delete, but does not define a
// password-confirmation request body. The frontend still requires password confirmation.
// Keep the UX for now and align the final contract with the backend team before removing it.
export async function deleteAccount(_body: { password: string }): Promise<ApiResult<void>> {
  const result = await request<unknown>('/users/me', {
    method: 'DELETE',
    auth: true,
    baseUrl: 'root',
  })

  if (!result.ok) {
    return result
  }

  return { ok: true, data: undefined }
}

// TODO: no dedicated location endpoint in the current API spec.
// When the backend exposes it, replace this stub with the real request.
export function updateLocation(_payload: {
  zipCode?: string
  storeId?: string
}): Promise<ApiResult<void>> {
  return Promise.resolve({ ok: true, data: undefined })
}

// TODO: OpenAPI does not currently document password change. Keep the legacy helper until
// frontend/backend teams agree on the new endpoint rather than silently removing the feature.
export function changePassword(body: ChangePasswordRequest): Promise<ApiResult<void>> {
  return request('/me/password', { method: 'PATCH', body, auth: true })
}

export function getOrders(params?: GetOrdersParams): Promise<ApiResult<OrdersResponse>> {
  return request('/orders', {
    query: { page: params?.page, limit: params?.limit },
    auth: true,
  })
}

export function getOrder(orderId: string): Promise<ApiResult<OrderDetailsResponse>> {
  return request(`/orders/${orderId}`, { auth: true })
}

export function getOrderTracking(orderId: string): Promise<ApiResult<OrderTrackingResponse>> {
  return request(`/orders/${orderId}/tracking`, { auth: true })
}
