<script setup lang="ts">
import { computed, useId } from 'vue'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { useI18n } from 'vue-i18n'

interface Props {
  placeholder?: string
  disabled?: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  (event: 'submit', value: string): void
}>()

const searchInputId = useId()
const placeholder = computed(() => props.placeholder ?? t('searchBar.placeholder'))
const disabled = computed(() => props.disabled ?? false)

function handleSubmit() {
  emit('submit', model.value.trim())
}
</script>

<template>
  <form class="searchbar-form" role="search" @submit.prevent="handleSubmit">
    <label :for="searchInputId" class="sr-only">{{ t('a11y.searchLabel') }}</label>
    <IconField iconPosition="left" class="searchbar-field">
      <InputIcon class="pi pi-search searchbar-icon" aria-hidden="true" />
      <InputText
        :id="searchInputId"
        v-model="model"
        type="search"
        fluid
        variant="filled"
        :pt="{
          root: {
            class: 'searchbar-input',
          },
        }"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
      />
    </IconField>
  </form>
</template>

<style scoped>
.searchbar-form,
.searchbar-field {
  width: 100%;
}

.searchbar-icon {
  color: var(--color-gray-700);
}

.searchbar-input::placeholder {
  color: var(--color-gray-500);
}

.searchbar-input:focus {
  box-shadow: 0 0 0 2px var(--p-primary-color, #0058a3);
}

.searchbar-input {
  height: 3.25rem;
  width: 100%;
  border: 0;
  border-radius: 9999px;
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  box-shadow: none;
}
</style>
