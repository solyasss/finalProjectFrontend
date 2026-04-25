import { request } from './client'
import type {
  ApiResult,
  CreateProductReviewRequest,
  CreateProductReviewResponse,
  ProductDetailsResponse,
  ProductAvailabilityResponse,
  ProductReviewListResponse,
  ProductReviewsSummaryResponse,
  ProductQuestionsResponse,
  GetProductParams,
  GetProductAvailabilityParams,
  GetProductQuestionsParams,
  GetProductReviewsParams,
} from './types'

export function getProduct(
  productSlug: string,
  params?: GetProductParams,
): Promise<ApiResult<ProductDetailsResponse>> {
  return request(`/products/${productSlug}`, {
    query: { variantId: params?.variantId, cityId: params?.cityId },
  })
}

export function getProductAvailability(
  productId: string,
  params?: GetProductAvailabilityParams,
): Promise<ApiResult<ProductAvailabilityResponse>> {
  return request(`/products/${productId}/availability`, {
    query: { variantId: params?.variantId, cityId: params?.cityId },
  })
}

export function getProductReviewsSummary(
  productId: string,
): Promise<ApiResult<ProductReviewsSummaryResponse>> {
  return request(`/products/${productId}/reviews/summary`)
}

export function getProductReviews(
  productId: string,
  params?: GetProductReviewsParams,
): Promise<ApiResult<ProductReviewListResponse>> {
  return request(`/products/${productId}/reviews`, {
    query: { page: params?.page, limit: params?.limit },
  })
}

export function createProductReview(
  productId: string,
  body: CreateProductReviewRequest,
): Promise<ApiResult<CreateProductReviewResponse>> {
  return request(`/products/${productId}/reviews`, {
    method: 'POST',
    body,
    auth: true,
  })
}

export function getProductQuestions(
  productId: string,
  params?: GetProductQuestionsParams,
): Promise<ApiResult<ProductQuestionsResponse>> {
  return request(`/products/${productId}/questions`, {
    query: { page: params?.page, limit: params?.limit },
  })
}
