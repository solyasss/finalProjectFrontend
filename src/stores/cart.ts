import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getCart, addCartLine, updateCartLine, removeCartLine } from '@/api'
import type { Cart, AddCartLineRequest } from '@/api'

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => cart.value?.itemCount ?? 0)
  const grandTotal = computed(() => cart.value?.grandTotal ?? null)
  const isEmpty = computed(() => !cart.value || cart.value.lines.length === 0)

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

  async function updateQuantity(lineId: string, quantity: number) {
    loading.value = true
    error.value = null
    const res = await updateCartLine(lineId, { quantity })
    if (res.ok) {
      cart.value = res.data
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  async function removeLine(lineId: string) {
    loading.value = true
    error.value = null
    const res = await removeCartLine(lineId)
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
    grandTotal,
    isEmpty,
    fetchCart,
    addItem,
    updateQuantity,
    removeLine,
  }
})
