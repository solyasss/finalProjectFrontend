import type { CatalogImage } from '@/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalizedValue = value.trim()
  return normalizedValue || null
}

export function extractImageUrl(image: unknown, depth = 0): string | null {
  const directUrl = normalizeString(image)

  if (directUrl) {
    return directUrl
  }

  if (!isRecord(image) || depth > 2) {
    return null
  }

  const candidateValues = [image.url, image.imageUrl, image.src, image.image]

  for (const candidateValue of candidateValues) {
    const normalizedUrl = extractImageUrl(candidateValue, depth + 1)

    if (normalizedUrl) {
      return normalizedUrl
    }
  }

  return null
}

export function extractImageEntries(
  response: unknown,
): Array<CatalogImage | string | Record<string, unknown>> {
  if (Array.isArray(response)) {
    return response.filter(
      (entry): entry is CatalogImage | string | Record<string, unknown> =>
        typeof entry === 'string' || isRecord(entry),
    )
  }

  if (!isRecord(response)) {
    return []
  }

  const rawEntries = [response.data, response.images, response.items].find(Array.isArray)

  if (!rawEntries) {
    return []
  }

  return rawEntries.filter(
    (entry): entry is CatalogImage | string | Record<string, unknown> =>
      typeof entry === 'string' || isRecord(entry),
  )
}

export function normalizeImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) {
    return []
  }

  const normalizedUrls = images.map(extractImageUrl).filter((url): url is string => Boolean(url))
  return [...new Set(normalizedUrls)]
}
