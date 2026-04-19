import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getMe, login, refreshToken, setAuthToken, setRefreshHandler } from '@/api'
import type { ApiResult, LoginRequest, LoginResponse, MeResponse } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<MeResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let initializePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)
  const firstName = computed(() => user.value?.firstName ?? null)

  // Runs before app mount to restore session
  async function initialize() {
    if (initialized.value) {
      return
    }

    initializePromise ??= (async () => {
      const res = await refreshToken()

      if (res.ok) {
        setAuthToken(res.data.token)
        user.value = res.data.user
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

    if (res.ok) {
      setAuthToken(res.data.token)
      user.value = res.data.user
      return res
    }

    user.value = null
    setAuthToken(null)
    error.value = res.error.message
    return res
  }

  function logout() {
    setUser(null)
    setAuthToken(null)
  }

  setRefreshHandler(async () => {
    const res = await refreshToken()
    if (res.ok) {
      setAuthToken(res.data.token)
      user.value = res.data.user
      return true
    }
    logout()
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
