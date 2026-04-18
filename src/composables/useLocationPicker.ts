import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  UKRAINE_REGION_CAPITALS,
  findNearestCity,
  getCityLabel,
} from '@/data/ukraineRegionCapitals'
import type { AppLocale } from '@/i18n'
import { useLocationStore } from '@/stores'
import { useAuthStore } from '@/stores/auth'

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
  const authStore = useAuthStore()
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

  function matchCityFromString(cityName: string): string | null {
    const normalized = cityName.trim().toLocaleLowerCase()
    const match = UKRAINE_REGION_CAPITALS.find(
      (city) =>
        city.labelUk.toLocaleLowerCase() === normalized ||
        city.labelEn.toLocaleLowerCase() === normalized,
    )
    return match?.id ?? null
  }

  async function runAutoDetectionOnLoad() {
    if (locationStore.selectionSource === 'manual') {
      return
    }

    // If the authenticated user has a city on their profile, try to match it first
    const userCity = authStore.user?.address?.city
    if (userCity) {
      const matchedId = matchCityFromString(userCity)
      if (matchedId) {
        selectCity(matchedId, 'auto')
        return
      }
      // City from profile doesn't match any known Ukrainian city — fall through to geo-detection
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

  // Re-apply city from profile whenever the authenticated user changes
  // (e.g. after login or session restore), unless the user already made a manual choice
  watch(
    () => authStore.user?.address?.city,
    (userCity) => {
      if (locationStore.selectionSource === 'manual' || !userCity) return
      const matchedId = matchCityFromString(userCity)
      if (matchedId) {
        selectCity(matchedId, 'auto')
      }
    },
  )

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
