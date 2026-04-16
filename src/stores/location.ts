import { ref } from 'vue'
import { defineStore } from 'pinia'
import { updateLocation } from '@/api'

type LocationSelectionSource = 'auto' | 'manual' | null

function getStoredSelectionSource(): LocationSelectionSource {
  const storedValue = localStorage.getItem('app_location_source')
  return storedValue === 'auto' || storedValue === 'manual' ? storedValue : null
}

export const useLocationStore = defineStore('location', () => {
  // Persisted in localStorage so it survives page reloads
  const zipCode = ref<string>(localStorage.getItem('app_zip') ?? '')
  const storeId = ref<string>(localStorage.getItem('app_store') ?? '')
  const selectedCityId = ref<string>(localStorage.getItem('app_city') ?? '')
  const selectionSource = ref<LocationSelectionSource>(getStoredSelectionSource())

  function setZipCode(zip: string) {
    zipCode.value = zip
    localStorage.setItem('app_zip', zip)
  }

  function setStoreId(id: string) {
    storeId.value = id
    localStorage.setItem('app_store', id)
  }

  function setSelectedCity(cityId: string, source: Exclude<LocationSelectionSource, null>) {
    selectedCityId.value = cityId
    selectionSource.value = source
    localStorage.setItem('app_city', cityId)
    localStorage.setItem('app_location_source', source)
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
    selectedCityId,
    selectionSource,
    setZipCode,
    setStoreId,
    setSelectedCity,
    syncZipCode,
    getContext,
  }
})
