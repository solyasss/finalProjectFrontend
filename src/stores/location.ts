import { ref } from 'vue'
import { defineStore } from 'pinia'

type LocationSelectionSource = 'auto' | 'manual' | null

function clearLegacyZipStorage() {
  localStorage.removeItem('app_zip')
}

function getStoredSelectionSource(): LocationSelectionSource {
  const storedValue = localStorage.getItem('app_location_source')
  return storedValue === 'auto' || storedValue === 'manual' ? storedValue : null
}

export const useLocationStore = defineStore('location', () => {
  clearLegacyZipStorage()

  // Persisted in localStorage so it survives page reloads
  const storeId = ref<string>(localStorage.getItem('app_store') ?? '')
  const selectedCityId = ref<string>(localStorage.getItem('app_city') ?? '')
  const selectionSource = ref<LocationSelectionSource>(getStoredSelectionSource())

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

  // TODO: Returns context object ready to be used in API requests
  function getContext() {
    return {
      cityId: selectedCityId.value || undefined,
      storeId: storeId.value || undefined,
    }
  }

  return {
    storeId,
    selectedCityId,
    selectionSource,
    setStoreId,
    setSelectedCity,
    getContext,
  }
})
