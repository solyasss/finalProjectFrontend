import { request } from './client'
import type {
  ApiResult,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from './types'

function mapMessageResponse(payload: unknown): MessageResponse {
  const raw = (payload ?? {}) as Partial<MessageResponse>
  return {
    message: raw.message ?? '',
  }
}

async function requestAuthSession(
  path: string,
  options: { body?: LoginRequest | RegisterRequest; notifyOnUnauthorized?: boolean } = {},
): Promise<ApiResult<LoginResponse>> {
  return request<LoginResponse>(path, {
    method: 'POST',
    body: options.body,
    baseUrl: 'root',
    notifyOnUnauthorized: options.notifyOnUnauthorized,
  })
}

export async function register(body: RegisterRequest): Promise<ApiResult<MessageResponse>> {
  const { dateOfBirth, ...rest } = body

  // TODO: Frontend currently collects `dateOfBirth`, but `RegisterDto` in `openapi.json`
  // does not require or document it. Keep the field in the UI for now and coordinate with
  // the backend team before relaxing frontend validation or extending the backend contract.
  const payload = dateOfBirth ? { ...rest, dateOfBirth } : rest

  const result = await request<unknown>('/auth/register', {
    method: 'POST',
    body: payload,
    baseUrl: 'root',
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    data: mapMessageResponse(result.data),
  }
}

export function login(body: LoginRequest): Promise<ApiResult<LoginResponse>> {
  return requestAuthSession('/auth/login', { body })
}

// TODO: The current backend OpenAPI contract does not expose verify-email support.
export function verifyEmail(body: VerifyEmailRequest): Promise<ApiResult<MessageResponse>> {
  throw new Error('Not implemented: verifyEmail')
}

// TODO: The current backend OpenAPI contract does not expose resend-verification support.
export function resendVerification(
  body: ResendVerificationRequest,
): Promise<ApiResult<MessageResponse>> {
  throw new Error('Not implemented: resendVerification')
}

// No Authorization header - auth comes from the HttpOnly refresh-token cookie
// which the browser sends automatically for same-origin requests.
export function refreshToken(): Promise<ApiResult<LoginResponse>> {
  return requestAuthSession('/auth/refresh', { notifyOnUnauthorized: false })
}

export async function logout(): Promise<ApiResult<void>> {
  const result = await request<unknown>('/auth/logout', {
    method: 'POST',
    baseUrl: 'root',
    notifyOnUnauthorized: false,
  })

  if (!result.ok) {
    return result
  }

  return { ok: true, data: undefined }
}
