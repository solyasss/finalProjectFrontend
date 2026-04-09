import { request } from './client'
import type {
  ApiResult,
  Cart,
  AddCartLineRequest,
  UpdateCartLineRequest,
  ValidateFulfillmentRequest,
  ValidateFulfillmentResponse,
} from './types'

export function getCart(): Promise<ApiResult<Cart>> {
  return request('/cart', { auth: true })
}

export function addCartLine(body: AddCartLineRequest): Promise<ApiResult<Cart>> {
  return request('/cart/lines', { method: 'POST', body, auth: true })
}

export function updateCartLine(
  lineId: string,
  body: UpdateCartLineRequest,
): Promise<ApiResult<Cart>> {
  return request(`/cart/lines/${lineId}`, { method: 'PATCH', body, auth: true })
}

export function removeCartLine(lineId: string): Promise<ApiResult<Cart>> {
  return request(`/cart/lines/${lineId}`, { method: 'DELETE', auth: true })
}

export function validateCartFulfillment(
  body: ValidateFulfillmentRequest,
): Promise<ApiResult<ValidateFulfillmentResponse>> {
  return request('/cart/validate-fulfillment', { method: 'POST', body, auth: true })
}
