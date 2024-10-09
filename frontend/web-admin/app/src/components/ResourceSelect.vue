<script setup lang="ts">
import type { useResourceStore } from '@/stores/store'
import type { BaseResourse } from '@/types'
import type { QSelectProps } from 'quasar'
import { reactive, ref, useSlots } from 'vue'

const props = defineProps<{
  modelValue?: { value: BaseResourse, label: string }
  store: ReturnType<typeof useResourceStore<any>>
}>()

defineEmits<{
  (e: 'update:modelValue', value: BaseResourse): void
}>()

const options = reactive<{ value: unknown; label: string }[]>([])

const { loading } = props.store

const limit = 30

const nextPage = ref(1)

const { rows, total } = props.store.get({ page: 1, limit }, () => {
  options.push(
    ...rows.value.map(val => ({
      value: val,
      label: val.name,
    }))
  )
})

const handleScroll: QSelectProps['onVirtualScroll'] = ({ to, ref }) => {
  let lastIndex = options.length - 1

  if (loading.value) return

  if (to !== lastIndex) return

  if (total.value <= options.length) return

  props.store.get(
    {
      page: nextPage.value,
      limit,
    },
    () => {
      nextPage.value += 1
      options.push(
        ...rows.value.map(val => ({
          value: val,
          label: val.name,
        }))
      )
    }
  )
}

const slots = useSlots() as {}

</script>

<template lang="pug">
q-select(
  :model-value="modelValue"
  @update:model-value="$emit('update:modelValue', $event);"
  @clear="$emit('update:modelValue', null)"
  :options="options"
  :loading="loading"
  @virtual-scroll="handleScroll"
  :placeholder="$attrs.placeholder"
  :="$attrs"
)
  //- template(#label)
    slot(name="label")
  template(v-for="(_, slot) of slots" #[slot]="props")
    slot(:name="slot" :="props ?? {}")
</template>