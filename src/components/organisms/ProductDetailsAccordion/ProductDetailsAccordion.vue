<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Message from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DetailsSection, ProductDocument } from '@/api'

interface Props {
  sections: DetailsSection[]
  documents: ProductDocument[]
}

const props = defineProps<Props>()

const { t } = useI18n()

const panels = computed(() => {
  const items: Array<{ key: string; title: string; content: string }> = props.sections.map(
    (section) => ({
      key: section.key,
      title: section.title,
      content: section.content,
    }),
  )

  if (props.documents.length) {
    items.push({
      key: 'DOCUMENTS',
      title: t('pdp.documentsTitle'),
      content: '',
    })
  }

  return items
})

const expandedPanelKeys = computed(() => panels.value.map((panel) => panel.key))
</script>

<template>
  <section class="grid gap-4">
    <h2 class="text-2xl font-bold text-color md:text-3xl">
      {{ t('pdp.detailsTitle') }}
    </h2>

    <Message v-if="!panels.length" severity="secondary" variant="simple">
      {{ t('pdp.detailsEmpty') }}
    </Message>

    <Accordion v-else multiple :value="expandedPanelKeys">
      <AccordionPanel v-for="panel in panels" :key="panel.key" :value="panel.key">
        <AccordionHeader>{{ panel.title }}</AccordionHeader>
        <AccordionContent>
          <dl
            v-if="panel.key === 'ADDITIONAL_INFORMATION'"
            class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm"
          >
            <template
              v-for="[rawKey, rawValue] in Object.entries(JSON.parse(panel.content))"
              :key="rawKey"
            >
              <dt class="font-medium text-color capitalize">
                {{ (rawKey as string).replace(/([A-Z])/g, ' $1').trim() }}
              </dt>
              <dd class="text-color/70">
                {{ typeof rawValue === 'boolean' ? (rawValue ? 'Yes' : 'No') : rawValue }}
              </dd>
            </template>
          </dl>

          <div
            v-else-if="panel.key !== 'DOCUMENTS'"
            class="prose prose-sm max-w-none text-color whitespace-pre-line"
          >
            {{ panel.content }}
          </div>

          <ul v-else class="grid gap-3">
            <li v-for="document in documents" :key="document.url">
              <a
                :href="document.url"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 text-sm font-medium text-color underline-offset-4 hover:underline"
              >
                <span class="pi pi-file-pdf" aria-hidden="true" />
                <span>{{ document.label }}</span>
              </a>
            </li>
          </ul>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </section>
</template>
