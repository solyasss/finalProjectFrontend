import { request } from './client'
import type {
  ApiResult,
  MeResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  OrdersResponse,
  OrderDetailsResponse,
  OrderTrackingResponse,
  GetOrdersParams,
} from './types'

export function getMe(): Promise<ApiResult<MeResponse>> {
  return request('/me', { auth: true })
}

export function updateProfile(body: UpdateProfileRequest): Promise<ApiResult<MeResponse>> {
  return request('/me/profile', { method: 'PATCH', body, auth: true })
}

export function changePassword(body: ChangePasswordRequest): Promise<ApiResult<void>> {
  return request('/me/password', { method: 'PATCH', body, auth: true })
}

export function deleteAccount(body: { password: string }): Promise<ApiResult<void>> {
  return request('/me/account', { method: 'DELETE', body, auth: true })
}

// TODO: no dedicated location endpoint in the current API spec.
// When the backend exposes it, replace this stub with the real request.
export function updateLocation(_payload: {
  zipCode?: string
  storeId?: string
}): Promise<ApiResult<void>> {
  return Promise.resolve({ ok: true, data: undefined })
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
