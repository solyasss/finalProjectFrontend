import { appendDefinedFormData, normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminProductSet,
  AdminProductSetPayload,
} from './adminTypes'
import type { ApiResult } from './types'

function buildProductSetFormData(payload: AdminProductSetPayload): FormData {
  const formData = new FormData()
  appendDefinedFormData(formData, 'name', payload.name)
  appendDefinedFormData(formData, 'slug', payload.slug)
  appendDefinedFormData(formData, 'file', payload.file)
  appendDefinedFormData(formData, 'imageUrl', payload.imageUrl)
  appendDefinedFormData(formData, 'roomId', payload.roomId)

  if (payload.variantIds?.length) {
    payload.variantIds.forEach((id) => formData.append('variantIds[]', id))
  }

  return formData
}

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
    body: buildProductSetFormData(payload),
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
    body: buildProductSetFormData(payload),
  })
}

export function deleteAdminProductSet(setId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/product-sets/${setId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
