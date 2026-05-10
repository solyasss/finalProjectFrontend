import { request } from './client'
import type {
  ApiResult,
  CartLine,
  ImageAsset,
  Money,
  OrderDetailsResponse,
  OrderStatus,
  OrderSummary,
  OrdersResponse,
} from './types'

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

export function normalizeOrder(raw: RawOrder): OrderSummary {
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

export async function getOrders(): Promise<ApiResult<OrdersResponse>> {
  const result = await request<RawOrder[]>('/sales/orders/my', { auth: true, baseUrl: 'root' })
  if (!result.ok) return result
  const orders = result.data.map(normalizeOrder)
  return {
    ok: true,
    data: { orders, pagination: { total: orders.length, page: 1, limit: orders.length || 10 } },
  }
}

export async function getOrder(orderId: string): Promise<ApiResult<OrderDetailsResponse>> {
  const result = await request<RawOrder>(`/sales/orders/${orderId}`, {
    auth: true,
    baseUrl: 'root',
  })
  if (!result.ok) return result
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
