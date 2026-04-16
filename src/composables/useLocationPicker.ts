import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  UKRAINE_REGION_CAPITALS,
  findNearestCity,
  getCityLabel,
} from '@/data/ukraineRegionCapitals'
import type { AppLocale } from '@/i18n'
import { useLocationStore } from '@/stores'

type SelectionSource = 'auto' | 'manual'
type PermissionStateValue = PermissionState | 'unsupported' | 'unknown'

export interface LocationPickerCityOption {
  id: string
  label: string
}

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 1_800_000,
}

export function useLocationPicker() {
  const { t, locale } = useI18n()
  const locationStore = useLocationStore()
  const currentLocale = computed(() => locale.value as AppLocale)

  const query = ref('')
  const detecting = ref(false)
  const permissionState = ref<PermissionStateValue>('unknown')
  const errorKey = ref<string | null>(null)

  let requestSequence = 0
  let manualOverrideSequence = 0

  const selectedCity = computed(() => {
    return UKRAINE_REGION_CAPITALS.find((city) => city.id === locationStore.selectedCityId) ?? null
  })

  const currentLabel = computed(() => {
    if (selectedCity.value) {
      return getCityLabel(selectedCity.value, currentLocale.value)
    }

    if (locationStore.zipCode) {
      return locationStore.zipCode
    }

    return t('header.locationFallback')
  })

  const filteredCities = computed<LocationPickerCityOption[]>(() => {
    const normalizedQuery = query.value.trim().toLocaleLowerCase(currentLocale.value)

    return UKRAINE_REGION_CAPITALS.map((city) => ({
      id: city.id,
      label: getCityLabel(city, currentLocale.value),
    })).filter((city) => {
      return (
        !normalizedQuery ||
        city.label.toLocaleLowerCase(currentLocale.value).includes(normalizedQuery)
      )
    })
  })

  function selectCity(cityId: string, source: SelectionSource) {
    if (source === 'manual') {
      manualOverrideSequence += 1
      errorKey.value = null
    }

    locationStore.setSelectedCity(cityId, source)
  }

  async function requestCurrentLocation(source: SelectionSource = 'auto'): Promise<boolean> {
    const geolocation = globalThis.navigator?.geolocation

    if (!geolocation) {
      permissionState.value = 'unsupported'
      errorKey.value = 'header.locationUnsupported'
      return false
    }

    const currentRequestId = ++requestSequence
    const manualSnapshot = manualOverrideSequence
    detecting.value = true
    errorKey.value = null

    const cityId = await new Promise<string | null>((resolve) => {
      geolocation.getCurrentPosition(
        (position) => {
          const nearestCity = findNearestCity(position.coords.latitude, position.coords.longitude)
          resolve(nearestCity.id)
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            permissionState.value = 'denied'
            errorKey.value = 'header.locationPermissionDenied'
            resolve(null)
            return
          }

          errorKey.value = 'header.locationDetectionFailed'
          resolve(null)
        },
        GEOLOCATION_OPTIONS,
      )
    })

    if (currentRequestId !== requestSequence) {
      detecting.value = false
      return false
    }

    if (source === 'auto' && manualSnapshot !== manualOverrideSequence) {
      detecting.value = false
      return false
    }

    detecting.value = false

    if (!cityId) {
      return false
    }

    selectCity(cityId, source)
    permissionState.value = 'granted'
    return true
  }

  async function runAutoDetectionOnLoad() {
    if (locationStore.selectionSource === 'manual') {
      return
    }

    const permissionsApi = globalThis.navigator?.permissions

    if (!permissionsApi?.query) {
      await requestCurrentLocation('auto')
      return
    }

    try {
      const status = await permissionsApi.query({ name: 'geolocation' })
      permissionState.value = status.state

      status.onchange = () => {
        permissionState.value = status.state
      }

      if (status.state === 'denied') {
        errorKey.value = 'header.locationPermissionDenied'
        return
      }

      await requestCurrentLocation('auto')
    } catch {
      permissionState.value = 'unknown'
      await requestCurrentLocation('auto')
    }
  }

  return {
    query,
    filteredCities,
    currentLabel,
    detecting,
    permissionState,
    errorKey,
    selectedCity,
    selectCity,
    requestCurrentLocation,
    runAutoDetectionOnLoad,
  }
}
