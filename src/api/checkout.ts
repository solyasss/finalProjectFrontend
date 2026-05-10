import { request } from './client'
import { normalizeOrder } from './orders'
import type { ApiResult, CheckoutRequest, OrderStatus, OrderSummary } from './types'

interface RawCheckoutOrder {
  id: number
  status: OrderStatus
  totalAmount: string
  shippingAddress?: string | null
  createdAt: string
  items: Array<{
    id: number
    quantity: number
    priceAtPurchase: string
    variant: { id: string; sku: string; color?: string; images: string[] }
  }>
}

export async function checkoutOrder(body: CheckoutRequest): Promise<ApiResult<OrderSummary>> {
  const result = await request<RawCheckoutOrder>('/sales/orders/checkout', {
    method: 'POST',
    body,
    auth: true,
    baseUrl: 'root',
  })
  if (!result.ok) return result
  return { ok: true, data: normalizeOrder(result.data) }
}
