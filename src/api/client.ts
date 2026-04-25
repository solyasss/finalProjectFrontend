import type { ApiError, ApiResult } from './types'

const LEGACY_API_BASE_URL = '/api/v1'
const NEW_API_BASE_URL = '/backend'

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

type RawApiError = Partial<ApiError> & {
  code?: string
  message?: string
  path?: string
  timestamp?: string
  error?: Partial<ApiError> & {
    code?: string
    message?: string
    path?: string
    timestamp?: string
  }
  success?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeErrorCode(rawCode: unknown, status: number): ApiError['code'] {
  if (typeof rawCode === 'string') {
    switch (rawCode) {
      case 'VALIDATION_ERROR':
      case 'NOT_FOUND':
      case 'UNAUTHORIZED':
      case 'FORBIDDEN':
      case 'CONFLICT':
      case 'RATE_LIMITED':
      case 'INTERNAL_ERROR':
        return rawCode
      case 'ERR_400':
      case 'ERR_422':
        return 'VALIDATION_ERROR'
      case 'ERR_401':
        return 'UNAUTHORIZED'
      case 'ERR_403':
        return 'FORBIDDEN'
      case 'ERR_404':
        return 'NOT_FOUND'
      case 'ERR_409':
        return 'CONFLICT'
      case 'ERR_429':
        return 'RATE_LIMITED'
      default:
        break
    }
  }

  switch (status) {
    case 400:
    case 422:
      return 'VALIDATION_ERROR'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 409:
      return 'CONFLICT'
    case 429:
      return 'RATE_LIMITED'
    default:
      return 'INTERNAL_ERROR'
  }
}

function extractApiError(body: unknown, status: number): ApiError {
  // TODO: When moved to new API, rework
  const payload = isRecord(body) ? (body as RawApiError) : null
  const nestedError = payload && isRecord(payload.error) ? payload.error : null

  const rawCode =
    typeof nestedError?.code === 'string'
      ? nestedError.code
      : typeof payload?.code === 'string'
        ? payload.code
        : null

  const message =
    typeof nestedError?.message === 'string'
      ? nestedError.message
      : typeof payload?.message === 'string'
        ? payload.message
        : 'An unexpected error occurred'

  const fieldsSource = nestedError?.fields ?? payload?.fields
  const fields = isRecord(fieldsSource)
    ? Object.fromEntries(
        Object.entries(fieldsSource).filter(([, value]) => typeof value === 'string') as Array<
          [string, string]
        >,
      )
    : null

  const path =
    typeof nestedError?.path === 'string'
      ? nestedError.path
      : typeof payload?.path === 'string'
        ? payload.path
        : null

  const timestamp =
    typeof nestedError?.timestamp === 'string'
      ? nestedError.timestamp
      : typeof payload?.timestamp === 'string'
        ? payload.timestamp
        : null

  return {
    code: normalizeErrorCode(rawCode, status),
    rawCode,
    message,
    path,
    timestamp,
    fields,
  }
}

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

  const contentLength = response.headers.get('content-length')
  if (contentLength === '0') {
    return response.ok
      ? { ok: true, data: undefined as T }
      : {
          ok: false,
          error: { code: 'INTERNAL_ERROR', message: 'Unexpected empty error response from server' },
        }
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    if (response.ok) {
      return { ok: true, data: undefined as T }
    }

    return {
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Invalid response from server' },
    }
  }

  if (response.ok) {
    return { ok: true, data: body as T }
  }

  return {
    ok: false,
    error: extractApiError(body, response.status),
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  baseUrl?: 'legacy' | 'root'
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

function getRequestUrl(
  path: string,
  query: Record<string, string | number | boolean | undefined> | undefined,
  baseUrl: RequestOptions['baseUrl'],
): string {
  const qs = query ? buildQueryString(query) : ''
  const resolvedBaseUrl = baseUrl === 'root' ? NEW_API_BASE_URL : LEGACY_API_BASE_URL
  return `${resolvedBaseUrl}${path}${qs}`
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const {
    method = 'GET',
    body,
    query,
    baseUrl = 'legacy',
    auth = false,
    notifyOnUnauthorized = true,
  } = options

  const url = getRequestUrl(path, query, baseUrl)

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
    _token = null
    _onUnauthorized?.()
    return parseResponse<T>(response)
  }

  if (response.status === 401 && auth) {
    _token = null
    if (notifyOnUnauthorized) {
      _onUnauthorized?.()
    }
  }

  return parseResponse<T>(response)
}
