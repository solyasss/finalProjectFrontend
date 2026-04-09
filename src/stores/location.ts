import { ref } from 'vue'
import { defineStore } from 'pinia'
import { updateLocation } from '@/api'

export const useLocationStore = defineStore('location', () => {
  // Persisted in localStorage so it survives page reloads
  const zipCode = ref<string>(localStorage.getItem('app_zip') ?? '')
  const storeId = ref<string>(localStorage.getItem('app_store') ?? '')

  function setZipCode(zip: string) {
    zipCode.value = zip
    localStorage.setItem('app_zip', zip)
  }

  function setStoreId(id: string) {
    storeId.value = id
    localStorage.setItem('app_store', id)
  }

  // Persists ZIP to backend for signed-in users
  async function syncZipCode(zip: string) {
    setZipCode(zip)
    await updateLocation({ zipCode: zip })
  }

  // Returns context object ready to be ysed in API requests
  function getContext() {
    return {
      zipCode: zipCode.value || undefined,
      storeId: storeId.value || undefined,
    }
  }

  return {
    zipCode,
    storeId,
    setZipCode,
    setStoreId,
    syncZipCode,
    getContext,
  }
})
