import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getMe,
  login,
  logout as logoutRequest,
  refreshToken,
  setAuthToken,
  setRefreshHandler,
} from '@/api'
import type { ApiResult, LoginRequest, LoginResponse, MeResponse } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<MeResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let initializePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)
  const firstName = computed(() => user.value?.firstName ?? null)

  async function hydrateUserFromToken(preloadedUser?: MeResponse | null): Promise<boolean> {
    if (preloadedUser) {
      user.value = preloadedUser
      return true
    }

    const meResult = await getMe()

    if (meResult.ok) {
      user.value = meResult.data
      return true
    }

    user.value = null
    return false
  }

  // Runs before app mount to restore session
  async function initialize() {
    if (initialized.value) {
      return
    }

    initializePromise ??= (async () => {
      const res = await refreshToken()

      if (res.ok && res.data.accessToken) {
        setAuthToken(res.data.accessToken)
        const hydrated = await hydrateUserFromToken(res.data.user)

        if (!hydrated) {
          setAuthToken(null)
        }
      } else {
        user.value = null
        setAuthToken(null)
      }

      initialized.value = true
    })().finally(() => {
      initializePromise = null
    })

    await initializePromise
  }

  async function fetchMe() {
    loading.value = true
    error.value = null
    const res = await getMe()
    if (res.ok) {
      user.value = res.data
    } else {
      // 401 is expected when unauthenticated
      if (res.error.code !== 'UNAUTHORIZED') {
        error.value = res.error.message
      }
      user.value = null
    }
    loading.value = false
  }

  function setToken(token: string) {
    setAuthToken(token)
  }

  function setUser(nextUser: MeResponse | null) {
    user.value = nextUser
  }

  function applyProfileUpdate(nextUser: MeResponse) {
    user.value = nextUser
  }

  async function signIn(payload: LoginRequest): Promise<ApiResult<LoginResponse>> {
    error.value = null

    const res = await login(payload)

    if (res.ok && res.data.accessToken) {
      setAuthToken(res.data.accessToken)
      const hydrated = await hydrateUserFromToken(res.data.user)

      if (!hydrated) {
        setAuthToken(null)
        error.value = 'Unable to load account profile'
        return {
          ok: false,
          error: { code: 'INTERNAL_ERROR', message: 'Unable to load account profile' },
        }
      }

      return res
    }

    user.value = null
    setAuthToken(null)

    if (res.ok) {
      error.value = 'Invalid auth response from server'
      return {
        ok: false,
        error: { code: 'INTERNAL_ERROR', message: 'Invalid auth response from server' },
      }
    }

    error.value = res.error.message
    return res
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
    setAuthToken(null)
  }

  setRefreshHandler(async () => {
    const res = await refreshToken()
    if (res.ok && res.data.accessToken) {
      setAuthToken(res.data.accessToken)
      return hydrateUserFromToken(res.data.user)
    }
    await logout()
    return false
  })

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    firstName,
    initialize,
    fetchMe,
    setToken,
    setUser,
    applyProfileUpdate,
    signIn,
    logout,
  }
})
