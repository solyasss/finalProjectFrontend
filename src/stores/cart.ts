import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCart, addCartLine, updateCartLine, removeCartLine } from '@/api'
import type { Cart, AddCartLineRequest } from '@/api'

function formatUAH(amount: number): string {
  return `${amount.toLocaleString('uk-UA')} ₴`
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => cart.value?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0)

  const subtotalAmount = computed(
    () => cart.value?.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0) ?? 0,
  )

  const discountAmount = computed(
    () => cart.value?.items.reduce((sum, i) => sum + i.discountAmount * i.quantity, 0) ?? 0,
  )

  const grandTotalAmount = computed(() => subtotalAmount.value - discountAmount.value)

  const subtotal = computed(() => formatUAH(subtotalAmount.value))
  const discountTotal = computed(() =>
    discountAmount.value > 0 ? formatUAH(discountAmount.value) : null,
  )
  const grandTotal = computed(() => formatUAH(grandTotalAmount.value))

  const isEmpty = computed(() => !cart.value || cart.value.items.length === 0)

  async function fetchCart() {
    loading.value = true
    error.value = null
    const res = await getCart()
    if (res.ok) {
      cart.value = res.data
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  async function addItem(payload: AddCartLineRequest) {
    loading.value = true
    error.value = null
    const res = await addCartLine(payload)
    if (res.ok) {
      cart.value = res.data
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  async function updateQuantity(itemId: number, quantity: number) {
    loading.value = true
    error.value = null
    const res = await updateCartLine(itemId, quantity)
    if (res.ok) {
      cart.value = res.data
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  async function removeLine(itemId: number) {
    loading.value = true
    error.value = null
    const res = await removeCartLine(itemId)
    if (res.ok) {
      cart.value = res.data
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  return {
    cart,
    loading,
    error,
    itemCount,
    subtotal,
    discountTotal,
    grandTotal,
    isEmpty,
    fetchCart,
    addItem,
    updateQuantity,
    removeLine,
  }
})
