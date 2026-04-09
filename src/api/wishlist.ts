import { request } from './client'
import type {
  ApiResult,
  WishlistResponse,
  AddWishlistItemRequest,
  GetWishlistParams,
} from './types'

export function getWishlist(params?: GetWishlistParams): Promise<ApiResult<WishlistResponse>> {
  return request('/wishlist', {
    query: { page: params?.page, limit: params?.limit },
    auth: true,
  })
}

export function addWishlistItem(
  body: AddWishlistItemRequest,
): Promise<ApiResult<WishlistResponse>> {
  return request('/wishlist/items', { method: 'POST', body, auth: true })
}

export function removeWishlistItem(wishlistItemId: string): Promise<ApiResult<WishlistResponse>> {
  return request(`/wishlist/items/${wishlistItemId}`, { method: 'DELETE', auth: true })
}
