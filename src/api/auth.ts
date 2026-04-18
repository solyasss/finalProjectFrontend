import { request } from './client'
import type {
  ApiResult,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  ResendVerificationRequest,
  MessageResponse,
} from './types'

export function register(body: RegisterRequest): Promise<ApiResult<MessageResponse>> {
  return request('/auth/register', { method: 'POST', body })
}

export function login(body: LoginRequest): Promise<ApiResult<LoginResponse>> {
  return request('/auth/login', { method: 'POST', body })
}

export function verifyEmail(body: VerifyEmailRequest): Promise<ApiResult<MessageResponse>> {
  return request('/auth/verify-email', { method: 'POST', body })
}

export function resendVerification(
  body: ResendVerificationRequest,
): Promise<ApiResult<MessageResponse>> {
  return request('/auth/resend-verification', { method: 'POST', body })
}

// No Authorization header - auth comes from the HttpOnly refresh-token cookie
// which the browser sends automatically for same-origin requests.
// The server validates the cookie and returns a fresh access token + user.
export function refreshToken(): Promise<ApiResult<LoginResponse>> {
  return request('/auth/refresh', { method: 'POST', notifyOnUnauthorized: false })
}
