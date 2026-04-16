<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Rating from 'primevue/rating'
import Textarea from 'primevue/textarea'
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CreateProductReviewRequest } from '@/api'

interface Props {
  authenticated: boolean
  submitting?: boolean
  submitError?: string | null
  success?: boolean
}

interface FieldErrors {
  rating?: string
  body?: string
}

interface ReviewDraft {
  rating: number
  title: string
  body: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'request-auth'): void
  (event: 'submit', payload: CreateProductReviewRequest): void
}>()

const { t } = useI18n()

const visible = ref(false)
const draft = reactive<ReviewDraft>({
  rating: 0,
  title: '',
  body: '',
})
const fieldErrors = reactive<FieldErrors>({})

function resetForm() {
  draft.rating = 0
  draft.title = ''
  draft.body = ''
  fieldErrors.rating = undefined
  fieldErrors.body = undefined
}

function openDialog() {
  if (!props.authenticated) {
    emit('request-auth')
    return
  }

  visible.value = true
}

function closeDialog() {
  visible.value = false
}

function validate() {
  fieldErrors.rating = draft.rating > 0 ? undefined : t('pdp.reviewForm.errors.required')
  fieldErrors.body =
    draft.body.trim().length >= 10 ? undefined : t('pdp.reviewForm.errors.minLength')

  return !fieldErrors.rating && !fieldErrors.body
}

function handleSubmit() {
  if (!validate()) {
    return
  }

  emit('submit', {
    rating: draft.rating,
    title: draft.title.trim(),
    body: draft.body.trim(),
  })
}

watch(
  () => props.success,
  (success) => {
    if (!success) {
      return
    }

    resetForm()
    closeDialog()
  },
)

watch(visible, (isVisible) => {
  if (!isVisible) {
    resetForm()
  }
})
</script>

<template>
  <div class="grid gap-3">
    <Button :label="t('pdp.writeReview')" @click="openDialog" />
    <p v-if="!authenticated" class="m-0 text-sm text-muted-color">
      {{ t('pdp.reviewForm.signInToWrite') }}
    </p>

    <Dialog
      v-model:visible="visible"
      modal
      :header="t('pdp.writeReviewTitle')"
      :style="{ width: 'min(100%, 36rem)' }"
    >
      <form class="grid gap-5" @submit.prevent="handleSubmit">
        <Message v-if="submitError" severity="error">
          {{ submitError }}
        </Message>

        <div>
          <label for="review-rating" class="mb-2 block text-sm font-bold text-color">
            {{ t('pdp.reviewForm.ratingLabel') }}
          </label>
          <Rating
            v-model="draft.rating"
            input-id="review-rating"
            :stars="5"
            :pt="{ root: { style: { gap: '0.25rem' } } }"
          >
            <template #onicon>
              <i
                class="pi pi-star-fill"
                :style="{ color: 'var(--p-surface-900)', fontSize: '1rem' }"
                aria-hidden="true"
              />
            </template>
            <template #officon>
              <i
                class="pi pi-star-fill"
                :style="{ color: 'var(--p-surface-300)', fontSize: '1rem' }"
                aria-hidden="true"
              />
            </template>
          </Rating>
          <Message v-if="fieldErrors.rating" severity="error" size="small" variant="simple">
            {{ fieldErrors.rating }}
          </Message>
        </div>

        <div>
          <label for="review-title" class="mb-2 block text-sm font-bold text-color">
            {{ t('pdp.reviewForm.titleLabel') }}
          </label>
          <InputText id="review-title" v-model="draft.title" fluid />
        </div>

        <div>
          <label for="review-body" class="mb-2 block text-sm font-bold text-color">
            {{ t('pdp.reviewForm.bodyLabel') }}
          </label>
          <Textarea
            id="review-body"
            v-model="draft.body"
            fluid
            auto-resize
            rows="5"
            :invalid="Boolean(fieldErrors.body)"
          />
          <Message v-if="fieldErrors.body" severity="error" size="small" variant="simple">
            {{ fieldErrors.body }}
          </Message>
        </div>

        <div class="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            severity="secondary"
            text
            :label="t('pdp.reviewForm.cancel')"
            @click="closeDialog"
          />
          <Button
            type="submit"
            :loading="submitting"
            :label="submitting ? t('pdp.reviewForm.submitting') : t('pdp.reviewForm.submit')"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>
