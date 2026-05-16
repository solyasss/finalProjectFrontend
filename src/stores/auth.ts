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

export const FRONTEND_ROLES = ['ADMIN', 'MANAGER', 'USER', 'UNKNOWN'] as const

export type FrontendRole = (typeof FRONTEND_ROLES)[number]

export function normalizeFrontendRole(role?: string | null): FrontendRole {
  const normalizedRole = role?.trim().toUpperCase()

  switch (normalizedRole) {
    case 'ADMIN':
    case 'MANAGER':
    case 'USER':
      return normalizedRole
    default:
      return 'UNKNOWN'
  }
}

export function hasFrontendRole(role: FrontendRole, expectedRole: FrontendRole): boolean {
  return role === expectedRole
}

export function hasAnyFrontendRole(
  role: FrontendRole,
  expectedRoles: readonly FrontendRole[],
): boolean {
  return expectedRoles.includes(role)
}

export function isAdminFrontendRole(role: FrontendRole): boolean {
  return hasFrontendRole(role, 'ADMIN')
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<MeResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let initializePromise: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)
  const firstName = computed(() => user.value?.firstName ?? null)
  const role = computed<FrontendRole>(() => normalizeFrontendRole(user.value?.role))
  const isAdmin = computed(() => isAdminFrontendRole(role.value))

  function getAuthPayload(result: ApiResult<LoginResponse>): LoginResponse | null {
    if (!result.ok || typeof result.data !== 'object' || result.data === null) {
      return null
    }

    return result.data
  }

  function getAccessToken(result: ApiResult<LoginResponse>): string | null {
    const authPayload = getAuthPayload(result)

    if (authPayload === null) {
      return null
    }

    const { accessToken } = authPayload as Partial<LoginResponse>

    if (typeof accessToken !== 'string') {
      return null
    }

    const normalizedAccessToken = accessToken.trim()
    return normalizedAccessToken === '' ? null : normalizedAccessToken
  }

  function clearSession() {
    user.value = null
    setAuthToken(null)
  }

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
      try {
        const res = await refreshToken()
        const authPayload = getAuthPayload(res)
        const accessToken = getAccessToken(res)

        if (authPayload !== null && accessToken !== null) {
          setAuthToken(accessToken)
          const hydrated = await hydrateUserFromToken(authPayload.user)

          if (!hydrated) {
            clearSession()
          }

          return
        }

        clearSession()
      } catch {
        clearSession()
      } finally {
        initialized.value = true
      }
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
    const authPayload = getAuthPayload(res)
    const accessToken = getAccessToken(res)

    if (res.ok && authPayload !== null && accessToken !== null) {
      setAuthToken(accessToken)
      const hydrated = await hydrateUserFromToken(authPayload.user)

      if (!hydrated) {
        clearSession()
        error.value = 'Unable to load account profile'
        return {
          ok: false,
          error: { code: 'INTERNAL_ERROR', message: 'Unable to load account profile' },
        }
      }

      return res
    }

    clearSession()

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
    clearSession()
  }

  function hasRole(expectedRole: FrontendRole): boolean {
    return hasFrontendRole(role.value, expectedRole)
  }

  function hasAnyRole(expectedRoles: readonly FrontendRole[]): boolean {
    return hasAnyFrontendRole(role.value, expectedRoles)
  }

  setRefreshHandler(async () => {
    const res = await refreshToken()
    const authPayload = getAuthPayload(res)
    const accessToken = getAccessToken(res)

    if (res.ok && authPayload !== null && accessToken !== null) {
      setAuthToken(accessToken)
      return hydrateUserFromToken(authPayload.user)
    }

    clearSession()
    return false
  })

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    firstName,
    role,
    isAdmin,
    initialize,
    fetchMe,
    setToken,
    setUser,
    applyProfileUpdate,
    signIn,
    logout,
    hasRole,
    hasAnyRole,
  }
})
