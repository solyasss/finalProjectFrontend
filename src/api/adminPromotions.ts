import { appendDefinedFormData, normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminListParams,
  AdminPaginatedResponse,
  AdminPromotion,
  AdminPromotionPayload,
} from './adminTypes'
import type { ApiResult } from './types'

function buildPromotionFormData(payload: AdminPromotionPayload): FormData {
  const formData = new FormData()
  appendDefinedFormData(formData, 'name', payload.name)
  appendDefinedFormData(formData, 'slug', payload.slug)
  appendDefinedFormData(formData, 'description', payload.description)
  appendDefinedFormData(formData, 'discountType', payload.discountType)
  appendDefinedFormData(formData, 'discountValue', payload.discountValue)
  appendDefinedFormData(formData, 'targetType', payload.targetType)
  appendDefinedFormData(formData, 'startDate', payload.startDate)
  appendDefinedFormData(formData, 'endDate', payload.endDate)
  appendDefinedFormData(formData, 'isActive', payload.isActive)

  payload.targetIds?.forEach((id) => formData.append('targetIds[]', String(id)))

  return formData
}

export async function getAdminPromotions(
  params?: AdminListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminPromotion>>> {
  const result = await request<unknown>('/sales/promotions/admin', {
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
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminPromotion),
  }
}

export function createAdminPromotion(
  payload: AdminPromotionPayload,
): Promise<ApiResult<AdminPromotion>> {
  return request<AdminPromotion>('/sales/promotions', {
    baseUrl: 'root',
    auth: true,
    method: 'POST',
    body: buildPromotionFormData(payload),
  })
}

export function updateAdminPromotion(
  promotionId: number,
  payload: AdminPromotionPayload,
): Promise<ApiResult<AdminPromotion>> {
  return request<AdminPromotion>(`/sales/promotions/${promotionId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: buildPromotionFormData(payload),
  })
}

export function deleteAdminPromotion(
  promotionId: number,
): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/sales/promotions/${promotionId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
