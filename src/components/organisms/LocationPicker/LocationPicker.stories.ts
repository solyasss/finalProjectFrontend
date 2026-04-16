import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import LocationPicker from './LocationPicker.vue'

const baseCities = [
  { id: 'kyiv', label: 'Kyiv' },
  { id: 'lviv', label: 'Lviv' },
  { id: 'odesa', label: 'Odesa' },
]

const meta: Meta<typeof LocationPicker> = {
  title: 'Organisms/LocationPicker',
  component: LocationPicker,
  tags: ['autodocs'],
  args: {
    currentLabel: 'Choose city',
    query: '',
    cities: baseCities,
    detecting: false,
    errorKey: null,
  },
}

export default meta
type Story = StoryObj<typeof meta>

function renderPicker(args: Record<string, unknown>) {
  return {
    components: { LocationPicker },
    setup() {
      const query = ref((args.query as string) ?? '')
      const currentLabel = ref((args.currentLabel as string) ?? 'Choose city')

      function selectCity(cityId: string) {
        const city = (args.cities as Array<{ id: string; label: string }>).find(
          (item) => item.id === cityId,
        )

        if (city) {
          currentLabel.value = city.label
        }
      }

      return { args, query, currentLabel, selectCity }
    },
    template: `
      <div class="min-h-[20rem] bg-surface-0 p-6">
        <LocationPicker
          :current-label="currentLabel"
          :query="query"
          :cities="args.cities"
          :detecting="args.detecting"
          :error-key="args.errorKey"
          @update:query="query = $event"
          @select-city="selectCity"
          @retry-detect="undefined"
        />
      </div>
    `,
  }
}

export const Default: Story = {
  render: renderPicker,
}

export const AutoDetected: Story = {
  render: renderPicker,
  args: {
    currentLabel: 'Kyiv',
  },
}

export const PermissionDenied: Story = {
  render: renderPicker,
  args: {
    errorKey: 'header.locationPermissionDenied',
  },
}

export const FilteredSearch: Story = {
  render: renderPicker,
  args: {
    query: 'lv',
    cities: [{ id: 'lviv', label: 'Lviv' }],
  },
}
