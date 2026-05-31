import { request } from './client'
import { buildFilterQuery } from './utils'
import type {
  ApiResult,
  CategoriesResponse,
  CategoriesTreeResponse,
  RoomListResponse,
  RoomDetailsResponse,
  ProductSetListResponse,
  ProductSetDetailsResponse,
  ProductListResponse,
  CatalogImagesResponse,
  GetCategoryProductsParams,
  GetCatalogImagesParams,
} from './types'

export function getCategories(): Promise<ApiResult<CategoriesResponse>> {
  return request('/catalog/categories', { baseUrl: 'root' })
}

export function getCategoriesTree(): Promise<ApiResult<CategoriesTreeResponse>> {
  return request('/catalog/categories/tree', { baseUrl: 'root' })
}

export function getCategoryProducts(
  categoryId: number,
  params?: GetCategoryProductsParams,
): Promise<ApiResult<ProductListResponse>> {
  return request('/catalog/products', {
    baseUrl: 'root',
    query: {
      categoryId,
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
      ...buildFilterQuery(params?.filters),
    },
  })
}

export function getProducts(
  params?: GetCategoryProductsParams,
): Promise<ApiResult<ProductListResponse>> {
  return request('/catalog/products', {
    baseUrl: 'root',
    query: {
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
      ...buildFilterQuery(params?.filters),
    },
  })
}

export function getRooms(): Promise<ApiResult<RoomListResponse>> {
  return request('/catalog/rooms', { baseUrl: 'root' })
}

export function getRoom(roomId: number): Promise<ApiResult<RoomDetailsResponse>> {
  return request(`/catalog/rooms/${roomId}`, { baseUrl: 'root' })
}

export function getProductSets(params?: {
  page?: number
  limit?: number
}): Promise<ApiResult<ProductSetListResponse>> {
  return request('/catalog/product-sets', {
    baseUrl: 'root',
    query: {
      page: params?.page,
      limit: params?.limit,
    },
  })
}

export function getProductSet(productSetId: number): Promise<ApiResult<ProductSetDetailsResponse>> {
  return request(`/catalog/product-sets/${productSetId}`, { baseUrl: 'root' })
}

export function getCatalogImages(
  params?: GetCatalogImagesParams,
): Promise<ApiResult<CatalogImagesResponse>> {
  return request('/catalog/images', {
    baseUrl: 'root',
    query: {
      page: params?.page,
      limit: params?.limit,
      variantId: params?.variantId,
    },
  })
}
