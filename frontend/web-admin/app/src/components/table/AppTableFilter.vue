<script setup lang="ts">
import { ref } from 'vue'
import { QMenu } from 'quasar'

import FilterForm from './FilterForm.vue'

export interface Filter {
  name: string
  label: string
  value: any
  initialValue?: any
  format?(val: any): any
}

defineProps<{
  modelValue: Filter[]
}>()

defineEmits<{
  (e: 'update:model-value', filters: Filter[]): void
}>()

const chipPopupRefs = ref<QMenu[]>()
function closePopups() {
  if (!chipPopupRefs.value) return
  for (const chipPopup of chipPopupRefs.value) {
    chipPopup.hide()
  }
}

const chipValue = (filter: Filter) =>
  typeof filter.format === 'function'
    ? filter.format(filter.value)
    : filter.value
</script>

<template lang="pug">
q-tr
  q-th(colspan="1000" style="padding: 4px 16px 3px 16px;")
    .row.no-wrap.items-center
      q-btn(
        :ripple="false"
        flat
        icon="filter_list"
        size="md"
      )
      .chips.row.full-width
        q-chip(
          v-for="filter in modelValue" :key="filter.name"
          clickable :removable="true"
          @remove="filter.value = filter.initialValue ? JSON.parse(JSON.stringify(filter.initialValue)) : undefined"
        )
          | {{ filter.label }} {{ chipValue(filter) }}
          q-menu(ref="chipPopupRefs" no-refocus style="min-width: 200px;")
            FilterForm(:model-value="filter" @update:model-value="filter.value = $event.value")
              template(#="scope")
                slot(:name="filter.name" :="scope")

      q-btn(
        v-if="true"
        icon="clear"
        size="md" flat
        @click=""
      )

</template>
