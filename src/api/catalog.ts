import { request } from './client'
import { buildFilterQuery } from './utils'
import type {
  ApiResult,
  CategoriesResponse,
  ProductListResponse,
  ProductCompareResponse,
  GetCategoryProductsParams,
  CompareProductsParams,
} from './types'

export function getCategories(): Promise<ApiResult<CategoriesResponse>> {
  return request('/categories')
}

export function getCategoryProducts(
  categorySlug: string,
  params?: GetCategoryProductsParams,
): Promise<ApiResult<ProductListResponse>> {
  return request(`/categories/${categorySlug}/products`, {
    query: {
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
      ...buildFilterQuery(params?.filters),
    },
  })
}

export function compareProducts(
  params: CompareProductsParams,
): Promise<ApiResult<ProductCompareResponse>> {
  return request('/products/compare', {
    query: { productIds: params.productIds.join(',') },
  })
}
