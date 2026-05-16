import { request } from './client'
import type {
  ApiResult,
  CreateProductReviewRequest,
  CreateProductReviewResponse,
  ProductDetailsResponse,
  ProductReviewListResponse,
  GetProductReviewsParams,
} from './types'

export function getProduct(productId: number): Promise<ApiResult<ProductDetailsResponse>> {
  return request(`/catalog/products/${productId}`, { baseUrl: 'root' })
}

// TODO: Product availability is not supported by the backend API yet.
// To enable once backend supports it.
// export function getProductAvailability(
//   productId: string,
//   params?: GetProductAvailabilityParams,
// ): Promise<ApiResult<ProductAvailabilityResponse>> {
//   return request(`/products/${productId}/availability`, {
//     query: { variantId: params?.variantId, cityId: params?.cityId },
//   })
// }

export function getProductReviews(
  productId: number,
  params?: GetProductReviewsParams,
): Promise<ApiResult<ProductReviewListResponse>> {
  return request('/catalog/reviews', {
    baseUrl: 'root',
    query: { productId, page: params?.page, limit: params?.limit },
  })
}

export function createProductReview(
  body: CreateProductReviewRequest,
): Promise<ApiResult<CreateProductReviewResponse>> {
  return request('/catalog/reviews', {
    baseUrl: 'root',
    method: 'POST',
    body,
    auth: true,
  })
}

// TODO: Product Q&A is not supported by the backend API yet.
// To enable once backend supports it.
// export function getProductQuestions(
//   productId: string,
//   params?: GetProductQuestionsParams,
// ): Promise<ApiResult<ProductQuestionsResponse>> {
//   return request(`/products/${productId}/questions`, {
//     query: { page: params?.page, limit: params?.limit },
//   })
// }
