import type {
  ApiResult,
  WishlistResponse,
  AddWishlistItemRequest,
  GetWishlistParams,
} from './types'

// TODO: Verify that the backend API exposes wishlist endpoints
export function getWishlist(params?: GetWishlistParams): Promise<ApiResult<WishlistResponse>> {
  const page = params?.page && params.page > 0 ? params.page : 1
  const limit = params?.limit && params.limit > 0 ? params.limit : 1

  // TODO: Temporary stub until the new wishlist backend endpoints are available/migrated.
  return Promise.resolve({
    ok: true,
    data: {
      items: [],
      pagination: {
        total: 0,
        page,
        limit,
      },
    },
  })
}

export function addWishlistItem(
  body: AddWishlistItemRequest,
): Promise<ApiResult<WishlistResponse>> {
  void body

  // TODO: Temporary stub until the new wishlist backend endpoints are available/migrated.
  return Promise.resolve({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        'Wishlist add is temporarily unavailable until the new backend endpoint is migrated.',
    },
  })
}

export function removeWishlistItem(wishlistItemId: string): Promise<ApiResult<WishlistResponse>> {
  void wishlistItemId

  // TODO: Temporary stub until the new wishlist backend endpoints are available/migrated.
  return Promise.resolve({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        'Wishlist removal is temporarily unavailable until the new backend endpoint is migrated.',
    },
  })
}
