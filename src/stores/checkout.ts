import { ref } from 'vue'
import { defineStore } from 'pinia'
import { checkoutOrder } from '@/api'
import type { CardDetails, OrderSummary } from '@/api'

export const useCheckoutStore = defineStore('checkout', () => {
  const cardDetails = ref<CardDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  const shippingAddress = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastOrder = ref<OrderSummary | null>(null)

  async function placeOrder(): Promise<OrderSummary | null> {
    loading.value = true
    error.value = null
    const res = await checkoutOrder({
      shippingAddress: shippingAddress.value,
      card: cardDetails.value,
    })
    if (res.ok) {
      lastOrder.value = res.data
      loading.value = false
      return res.data
    } else {
      error.value = res.error.message
      loading.value = false
      return null
    }
  }

  function resetCard() {
    cardDetails.value = {
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    }
    shippingAddress.value = ''
  }

  return { cardDetails, shippingAddress, loading, error, lastOrder, placeOrder, resetCard }
})
