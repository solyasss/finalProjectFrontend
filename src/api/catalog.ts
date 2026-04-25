import { request } from './client'
import { buildFilterQuery } from './utils'
import type {
  ApiResult,
  CategoriesResponse,
  ProductListResponse,
  GetCategoryProductsParams,
} from './types'

export function getCategories(): Promise<ApiResult<CategoriesResponse>> {
  return request('/catalog/categories', { baseUrl: 'root' })
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

// TODO: Product compare is not supported by the backend API yet.
// To enable once backend supports it.
// export function compareProducts(
//   params: CompareProductsParams,
// ): Promise<ApiResult<ProductCompareResponse>> {
//   return request('/products/compare', {
//     query: { productIds: params.productIds.join(',') },
//   })
// }
