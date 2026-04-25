import { request } from './client'
import type {
  ApiResult,
  CartLine,
  ChangePasswordRequest,
  ImageAsset,
  MeResponse,
  Money,
  OrderDetailsResponse,
  OrderStatus,
  OrderSummary,
  OrdersResponse,
  UpdateProfileRequest,
} from './types'

// Raw shape returned by the backend for an order in the list
interface RawOrderItem {
  id: number
  quantity: number
  priceAtPurchase: string
  variant: {
    id: string
    sku: string
    color?: string
    images: string[]
  }
}

interface RawOrder {
  id: number
  status: OrderStatus
  totalAmount: string
  shippingAddress?: string | null
  createdAt: string
  items: RawOrderItem[]
}

function parseMoney(amount: string): Money {
  const amountMinor = Math.round(parseFloat(amount) * 100)
  return {
    amountMinor,
    currency: 'UAH',
    formatted: `${parseFloat(amount).toFixed(2)} UAH`,
  }
}

function normalizeOrder(raw: RawOrder): OrderSummary {
  return {
    orderId: String(raw.id),
    status: raw.status,
    total: parseMoney(raw.totalAmount),
    createdAt: raw.createdAt,
    itemCount: raw.items.length,
  }
}

function normalizeOrderLine(item: RawOrderItem): CartLine {
  const imageUrl = item.variant.images[0] ?? null
  const image: ImageAsset | null = imageUrl
    ? { url: imageUrl, alt: item.variant.sku, width: 0, height: 0 }
    : null

  const unitPrice = parseMoney(item.priceAtPurchase)
  const lineTotalAmount = (parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)

  return {
    id: item.id,
    name: item.variant.color ? `${item.variant.sku} · ${item.variant.color}` : item.variant.sku,
    image,
    quantity: item.quantity,
    unitPrice,
    lineTotal: parseMoney(lineTotalAmount),
  }
}

export function getMe(): Promise<ApiResult<MeResponse>> {
  return request<MeResponse>('/auth/me', { auth: true, baseUrl: 'root' })
}

export function updateProfile(body: UpdateProfileRequest): Promise<ApiResult<MeResponse>> {
  return request<MeResponse>('/users/me', {
    method: 'PATCH',
    body,
    auth: true,
    baseUrl: 'root',
  })
}

export async function deleteAccount(): Promise<ApiResult<void>> {
  const result = await request<unknown>('/users/me', {
    method: 'DELETE',
    auth: true,
    baseUrl: 'root',
  })

  if (!result.ok) {
    return result
  }

  return { ok: true, data: undefined }
}

// TODO: no dedicated location endpoint in the current API spec.
// When the backend exposes it, replace this stub with the real request.
export function updateLocation(_payload: {
  cityId?: string
  storeId?: string
}): Promise<ApiResult<void>> {
  return Promise.resolve({ ok: true, data: undefined })
}

// TODO: OpenAPI does not currently document password change. Keep the legacy helper until
// frontend/backend teams agree on the new endpoint rather than silently removing the feature.
export function changePassword(body: ChangePasswordRequest): Promise<ApiResult<void>> {
  return request('/me/password', { method: 'PATCH', body, auth: true })
}

export async function getOrders(): Promise<ApiResult<OrdersResponse>> {
  const result = await request<RawOrder[]>('/sales/orders/my', {
    auth: true,
    baseUrl: 'root',
  })

  if (!result.ok) {
    return result
  }

  const orders = result.data.map(normalizeOrder)

  return {
    ok: true,
    data: {
      orders,
      pagination: {
        total: orders.length,
        page: 1,
        limit: orders.length || 10,
      },
    },
  }
}

export async function getOrder(orderId: string): Promise<ApiResult<OrderDetailsResponse>> {
  const result = await request<RawOrder>(`/sales/orders/${orderId}`, {
    auth: true,
    baseUrl: 'root',
  })

  if (!result.ok) {
    return result
  }

  const raw = result.data

  return {
    ok: true,
    data: {
      order: normalizeOrder(raw),
      lines: raw.items.map(normalizeOrderLine),
      shippingAddress: raw.shippingAddress ?? null,
    },
  }
}

// TODO: Uncomment tracking support after the backend documents `/sales/orders/{id}/tracking`.
// export function getOrderTracking(orderId: string) {}
