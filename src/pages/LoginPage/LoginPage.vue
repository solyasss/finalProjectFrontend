<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/organisms/LoginForm/LoginForm.vue'
import AuthVisualPanel from '@/components/organisms/AuthVisualPanel/AuthVisualPanel.vue'
import AuthSplitTemplate from '@/components/templates/AuthSplitTemplate/AuthSplitTemplate.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

function getRedirectTarget(): string | undefined {
  const redirect = route.query.redirect

  if (typeof redirect !== 'string') {
    return undefined
  }

  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : undefined
}

async function handleSuccess() {
  const redirectTarget = getRedirectTarget()

  if (redirectTarget) {
    await router.push(redirectTarget)
    return
  }

  await router.push({ name: 'home' })
}
</script>

<template>
  <AuthSplitTemplate>
    <template #visual>
      <AuthVisualPanel
        :eyebrow="t('authLogin.eyebrow')"
        :title="t('authLogin.visualTitle')"
        :description="t('authLogin.visualDescription')"
        :image-src="'/Auth.jpg'"
      />
    </template>

    <LoginForm @success="handleSuccess" />
  </AuthSplitTemplate>
</template>
