import { ref } from 'vue'
import { uploadTempFile } from '@/api'

export function useAdminTempFileUpload() {
  const selectedFile = ref<File | null>(null)
  const uploading = ref(false)
  const uploadError = ref<string | null>(null)

  function selectFile(file: File | null) {
    selectedFile.value = file
  }

  function clearFile() {
    selectedFile.value = null
  }

  async function uploadIfSelected(
    setFieldError: (key: string, msg: string) => void,
    setFormError: (msg: string) => void,
    t: (key: string) => string,
  ): Promise<string | null> {
    if (!selectedFile.value) return null

    uploading.value = true
    uploadError.value = null

    const result = await uploadTempFile({ file: selectedFile.value })

    uploading.value = false

    if (!result.ok) {
      const err = result.error as Record<string, unknown> | null
      const fields =
        err && typeof err === 'object'
          ? (err.fields as Record<string, string> | undefined)
          : undefined
      if (fields?.file) {
        setFieldError('file', fields.file)
      } else {
        setFormError(t('admin.upload.error'))
      }
      return null
    }

    return result.data.imageUrl
  }

  return { selectedFile, uploading, uploadError, selectFile, clearFile, uploadIfSelected }
}
