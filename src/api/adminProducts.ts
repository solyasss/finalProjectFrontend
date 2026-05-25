import { request } from './client'
import { normalizeAdminPaginatedResponse } from './admin'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminProduct,
  AdminProductListItem,
  AdminProductPayload,
} from './adminTypes'
import type { ApiResult, ProductDetailsResponse } from './types'

export async function getAdminProducts(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminProductListItem>>> {
  const result = await request<unknown>('/catalog/products/admin', {
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
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminProductListItem),
  }
}

export function getAdminProduct(productId: number): Promise<ApiResult<AdminProduct>> {
  return request<ProductDetailsResponse>(`/catalog/products/${productId}`, {
    baseUrl: 'root',
    auth: true,
  }) as Promise<ApiResult<AdminProduct>>
}

export function createAdminProduct(payload: AdminProductPayload): Promise<ApiResult<AdminProduct>> {
  return request<AdminProduct>('/catalog/products', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: payload,
  })
}

export function updateAdminProduct(
  productId: number,
  payload: AdminProductPayload,
): Promise<ApiResult<AdminProduct>> {
  return request<AdminProduct>(`/catalog/products/${productId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: payload,
  })
}

export function deleteAdminProduct(productId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/products/${productId}/hard`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
