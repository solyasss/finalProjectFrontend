import { appendDefinedFormData, normalizeAdminPaginatedResponse } from './admin'
import { request } from './client'
import type {
  AdminEntityDeleteResult,
  AdminPaginatedResponse,
  AdminReview,
  AdminReviewListParams,
  AdminReviewPayload,
} from './adminTypes'
import type { ApiResult } from './types'

export async function getAdminReviews(
  params?: AdminReviewListParams,
): Promise<ApiResult<AdminPaginatedResponse<AdminReview>>> {
  const result = await request<unknown>('/catalog/reviews/admin', {
    baseUrl: 'root',
    auth: true,
    query: {
      page: params?.page,
      limit: params?.limit,
      filter: params?.filter,
      productId: params?.productId,
    },
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: normalizeAdminPaginatedResponse(result.data, (value) => value as AdminReview),
  }
}

export function updateAdminReview(
  reviewId: number,
  payload: AdminReviewPayload,
): Promise<ApiResult<AdminReview>> {
  const formData = new FormData()
  appendDefinedFormData(formData, 'rating', payload.rating)
  appendDefinedFormData(formData, 'text', payload.text)
  appendDefinedFormData(formData, 'productId', payload.productId)
  appendDefinedFormData(formData, 'status', payload.status)

  return request<AdminReview>(`/catalog/reviews/${reviewId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'PATCH',
    body: formData,
  })
}

export function deleteAdminReview(reviewId: number): Promise<ApiResult<AdminEntityDeleteResult>> {
  return request<AdminEntityDeleteResult>(`/catalog/reviews/${reviewId}`, {
    baseUrl: 'root',
    auth: true,
    method: 'DELETE',
  })
}
