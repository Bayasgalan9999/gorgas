<script setup lang="ts">
import { ref } from 'vue'
import type { Filter } from './AppTableFilter.vue'

const props = defineProps<{
  modelValue: Filter
}>()
const emit = defineEmits<{
  (e: 'update:model-value', filter: Filter): void
}>()

const input = ref(
  typeof props.modelValue.value === 'string'
    ? props.modelValue.value
    : undefined
)

function submit(value: unknown) {
  emit('update:model-value', {
    ...props.modelValue,
    value: value === null ? null : value ?? props.modelValue.value ?? input,
  })
  input.value = ''
}
</script>

<template lang="pug">
slot(
  :filter="modelValue"
  :submit="(val: unknown) => submit(val)"
  :close="() => submit(modelValue.value)"
  :value="modelValue.value"
)
  q-item
    q-item-section(v-if="typeof modelValue.value === 'string' || !modelValue.value")
      q-form(
        @submit="() => submit(input)"
      )
        q-input(
          v-model="input"
          :label="modelValue.label"
          dense
          autofocus
        )
    q-item-section(v-else) provide a `filter-form-{{modelValue.name}}` slot for complex values such as {{modelValue.value}}
</template>
