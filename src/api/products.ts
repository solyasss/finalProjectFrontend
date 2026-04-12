import { request } from './client'
import type {
  ApiResult,
  ProductDetailsResponse,
  ProductAvailabilityResponse,
  ProductReviewsSummaryResponse,
  ProductQuestionsResponse,
  GetProductParams,
  GetProductAvailabilityParams,
  GetProductQuestionsParams,
} from './types'

export function getProduct(
  productSlug: string,
  params?: GetProductParams,
): Promise<ApiResult<ProductDetailsResponse>> {
  return request(`/products/${productSlug}`, {
    query: { variantId: params?.variantId, zipCode: params?.zipCode },
  })
}

export function getProductAvailability(
  productId: string,
  params?: GetProductAvailabilityParams,
): Promise<ApiResult<ProductAvailabilityResponse>> {
  return request(`/products/${productId}/availability`, {
    query: { variantId: params?.variantId, zipCode: params?.zipCode },
  })
}

export function getProductReviewsSummary(
  productId: string,
): Promise<ApiResult<ProductReviewsSummaryResponse>> {
  return request(`/products/${productId}/reviews/summary`)
}

export function getProductQuestions(
  productId: string,
  params?: GetProductQuestionsParams,
): Promise<ApiResult<ProductQuestionsResponse>> {
  return request(`/products/${productId}/questions`, {
    query: { page: params?.page, limit: params?.limit },
  })
}
