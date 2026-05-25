import { appendDefinedFormData, normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminCart,
  AdminCartListParams,
  AdminEntityDeleteResult,
  AdminOrder,
  AdminOrderListParams,
  AdminOrderStatus,
  AdminPaginatedResponse,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminOrders(
  params?: AdminOrderListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminOrder>>> {
  const result = await request<unknown>('/sales/orders/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
      userId: params?.userId,
      status: params?.status,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminOrder),
  }
}

export function updateAdminOrderStatus(
  orderId: number,
  status: AdminOrderStatus,
): Promise<ApiResult<AdminOrder>> {
  const formData = new FormData()
  appendDefinedFormData(formData, 'status', status)

  return request<AdminOrder>(`/sales/orders/${orderId}/status`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: formData,
  })
}

export function deleteAdminOrder(orderId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/sales/orders/${orderId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}

export async function getAdminCarts(
  params?: AdminCartListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminCart>>> {
  const result = await request<unknown>('/sales/carts/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
      userId: params?.userId,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminCart),
  }
}

export function deleteAdminCart(cartId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/sales/carts/${cartId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
