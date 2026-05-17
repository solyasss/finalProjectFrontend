import type { ApiResult, StoreDetailsResponse } from './types'

// TODO: Verify that the backend API exposes a store details endpoint
export function getStore(): Promise<ApiResult<StoreDetailsResponse>> {
  // TODO: Temporary stub until the new store backend endpoint is available/migrated.
  return Promise.resolve({
    ok: true,
    data: {
      name: '',
      address: '',
      hours: [],
      services: [],
    },
  })
}
