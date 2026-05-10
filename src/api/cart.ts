import { request } from './client'
import type { ApiResult, Cart, AddCartLineRequest } from './types'

async function requestCart(path: string, options: Parameters<typeof request<Cart>>[1] = {}) {
  return request<Cart>(path, {
    ...options,
    auth: true,
    baseUrl: 'root',
  })
}

export function getCart(): Promise<ApiResult<Cart>> {
  return requestCart('/sales/carts/my')
}

export function addCartLine(body: AddCartLineRequest): Promise<ApiResult<Cart>> {
  return requestCart('/sales/carts/my/items', { method: 'POST', body })
}

export function updateCartLine(itemId: number, quantity: number): Promise<ApiResult<Cart>> {
  return requestCart(`/sales/carts/my/items/${itemId}`, {
    method: 'PATCH',
    body: { quantity },
  })
}

export function removeCartLine(itemId: number): Promise<ApiResult<Cart>> {
  return requestCart(`/sales/carts/my/items/${itemId}`, { method: 'DELETE' })
}

