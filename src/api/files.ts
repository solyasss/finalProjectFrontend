import { appendDefinedFormData } from './admin'
import { request } from './client'
import type { TempFileUploadPayload, TempFileUploadResponse } from './adminTypes'

function buildTempUploadFormData(payload: TempFileUploadPayload): FormData {
  const formData = new FormData()
  appendDefinedFormData(formData, 'file', payload.file)
  appendDefinedFormData(formData, 'title', payload.title)
  appendDefinedFormData(formData, 'context', payload.context)
  return formData
}

export async function uploadTempFile(
  payload: TempFileUploadPayload,
): Promise<{ ok: true; data: TempFileUploadResponse } | { ok: false; error: unknown }> {
  const formData = buildTempUploadFormData(payload)
  const result = await request('/files/upload', {
    method: 'POST',
    auth: true,
    baseUrl: 'root',
    body: formData,
  })
  if (!result.ok) return result
  // Normalize response – server may return { url } or { imageUrl } or { fileUrl }
  const raw = result.data as Record<string, unknown>
  const imageUrl =
    (raw.imageUrl as string | undefined) ??
    (raw.url as string | undefined) ??
    (raw.fileUrl as string | undefined) ??
    ''
  return { ok: true, data: { imageUrl } }
}
