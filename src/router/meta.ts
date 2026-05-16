import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}

export const authRouteMeta = {
  requiresAuth: true,
} as const

export const adminRouteMeta = {
  requiresAuth: true,
  requiresAdmin: true,
} as const
