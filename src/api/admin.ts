import type { AdminListMeta, AdminPaginatedResponse, AdminImage } from './adminTypes'
import type { Pagination } from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeAdminPagination(meta: unknown): Pagination {
  const record = isRecord(meta) ? meta : {}
  const total = Number(record.totalItems ?? record.total ?? 0)
  const limit = Number(record.itemsPerPage ?? record.limit ?? 10)
  const page = Number(record.currentPage ?? record.page ?? 1)

  return {
    total: Number.isFinite(total) ? total : 0,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

export function normalizeAdminListMeta(meta: unknown): AdminListMeta {
  const pagination = normalizeAdminPagination(meta)

  return {
    totalItems: pagination.total,
    itemsPerPage: pagination.limit,
    currentPage: pagination.page,
    totalPages:
      pagination.limit > 0 ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1,
  }
}

export function normalizeAdminPaginatedResponse<T>(
  payload: unknown,
  extractor: (value: unknown) => T,
): AdminPaginatedResponse<T> {
  const record = isRecord(payload) ? payload : {}
  const rawItems = Array.isArray(record.data)
    ? record.data
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.images)
        ? record.images
        : Array.isArray(payload)
          ? payload
          : []

  const rawMeta = record.meta ??
    record.pagination ?? {
      totalItems: rawItems.length,
      itemsPerPage: rawItems.length || 10,
      currentPage: 1,
    }

  return {
    data: rawItems.map(extractor),
    meta: normalizeAdminListMeta(rawMeta),
  }
}

export function normalizeAdminImage(value: unknown): AdminImage {
  const record = isRecord(value) ? value : {}

  return {
    id: Number(record.id ?? 0),
    url:
      typeof record.url === 'string'
        ? record.url
        : typeof record.imageUrl === 'string'
          ? record.imageUrl
          : null,
    variantId: typeof record.variantId === 'string' ? record.variantId : null,
    sortOrder: typeof record.sortOrder === 'number' ? record.sortOrder : null,
    isPrimary: typeof record.isPrimary === 'boolean' ? record.isPrimary : null,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : null,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : null,
    deletedAt: typeof record.deletedAt === 'string' ? record.deletedAt : null,
  }
}

export function appendDefinedFormData(formData: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null || value === '') {
    return
  }

  if (value instanceof File) {
    formData.append(key, value)
    return
  }

  formData.append(key, String(value))
}
