import {
  appendDefinedFormData,
  normalizeAdminImage,
  normalizeAdminPaginatedResponse,
} from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminImage,
  AdminImagePayload,
  AdminListParams,
  AdminPaginatedResponse,
} from './adminTypes'
import type { ApiResult } from './types'

function buildImageFormData(payload: AdminImagePayload): FormData {
  const formData = new FormData()

  appendDefinedFormData(formData, 'file', payload.file)
  appendDefinedFormData(formData, 'url', payload.url?.trim())
  appendDefinedFormData(formData, 'variantId', payload.variantId?.trim())
  appendDefinedFormData(formData, 'sortOrder', payload.sortOrder)
  appendDefinedFormData(formData, 'isPrimary', payload.isPrimary)

  return formData
}

export async function getAdminImages(
  params?: AdminListParams & { variantId?: string },
): Promise<ApiResult<AdminPaginatedResponse<AdminImage>>> {
  const result = await request<unknown>('/catalog/images/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
      filter: params?.filter,
      variantId: params?.variantId,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, normalizeAdminImage),
  }
}

export function createAdminImage(payload: AdminImagePayload): Promise<ApiResult<AdminImage>> {
  return request<AdminImage>('/catalog/images', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: buildImageFormData(payload),
  })
}

export function updateAdminImage(
  imageId: number,
  payload: AdminImagePayload,
): Promise<ApiResult<AdminImage>> {
  return request<AdminImage>(`/catalog/images/${imageId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: buildImageFormData(payload),
  })
}

export function deleteAdminImage(imageId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/images/${imageId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
