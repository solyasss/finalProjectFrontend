import type { ApiError, ApiResult } from './types'

const BASE_URL = '/api/v1'

// In-memory token
let _token: string | null = null

export function setAuthToken(token: string | null): void {
  _token = token
}

// Registered by the auth store to perform a silent token refresh.
let _refreshHandler: (() => Promise<boolean>) | null = null

// Use for dependency injection of the refresh handler from the auth store
// Because the client should have no direct dependency on the auth store
// Same for the unauthorized handler below
export function setRefreshHandler(handler: () => Promise<boolean>): void {
  _refreshHandler = handler
}

// Registered once at app bootstrap to handle 401 redirects
let _onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  _onUnauthorized = handler
}

// Prevents multiple concurrent requests from each triggering a refresh race
let _refreshPromise: Promise<boolean> | null = null

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      sp.set(key, String(value))
    }
  }
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

function buildHeaders(auth: boolean): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  // Token is injected here and only here - never exposed elsewhere
  if (auth && _token !== null) {
    headers.set('Authorization', `Bearer ${_token}`)
  }
  return headers
}

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  // success with no body (changePassword, deleteAccount)
  if (response.status === 204) {
    return { ok: true, data: undefined as T }
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return {
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Invalid response from server' },
    }
  }

  if (response.ok) {
    return { ok: true, data: body as T }
  }

  const err = body as Partial<ApiError>
  return {
    ok: false,
    error: {
      code: err.code ?? 'INTERNAL_ERROR',
      message: err.message ?? 'An unexpected error occurred',
      fields: err.fields ?? null,
    },
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  // Whether to attach the Authorization header for this request
  auth?: boolean
  // Whether a 401 should trigger the global unauthorized redirect handler
  notifyOnUnauthorized?: boolean
}

async function executeRequest(
  url: string,
  method: string,
  headers: Headers,
  body: unknown,
): Promise<Response | null> {
  try {
    return await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      // cookies are included so the HttpOnly refresh-token cookie is sent automatically
      credentials: 'same-origin',
    })
  } catch {
    return null
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const { method = 'GET', body, query, auth = false, notifyOnUnauthorized = true } = options

  const qs = query ? buildQueryString(query) : ''
  const url = `${BASE_URL}${path}${qs}`

  const response = await executeRequest(url, method, buildHeaders(auth), body)

  if (response === null) {
    return {
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Network error - please check your connection' },
    }
  }

  if (response.status === 401 && auth && _refreshHandler !== null) {
    // Only one refresh request fires at a time
    _refreshPromise ??= _refreshHandler().finally(() => {
      _refreshPromise = null
    })

    const refreshed = await _refreshPromise

    if (refreshed) {
      // Retry the original request once with the new token
      const retryResponse = await executeRequest(url, method, buildHeaders(auth), body)
      if (retryResponse !== null) {
        return parseResponse<T>(retryResponse)
      }
    }

    // Refresh failed - session is gone
    _onUnauthorized?.()
    return {
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Session expired - please log in again' },
    }
  }

  if (response.status === 401) {
    _token = null
    if (notifyOnUnauthorized) {
      _onUnauthorized?.()
    }
    return {
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Session expired - please log in again' },
    }
  }

  return parseResponse<T>(response)
}
