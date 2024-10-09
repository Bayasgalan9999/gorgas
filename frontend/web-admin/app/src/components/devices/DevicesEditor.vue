<script setup lang="ts">
import ResourceSelect from '../ResourceSelect'
import { useGatewaysStore } from '@/stores'
import { useAppI18n } from '@/i18n'

import type { Device } from '@/types'

defineProps<{
  device: Device
}>()
defineEmits<{
  (e: 'save'): void
  (e: 'close'): void
}>()

const { t } = useAppI18n()
const gatewaysStore = useGatewaysStore()
</script>

<template lang="pug">
q-form(v-if="(typeof device.gateway !== 'string')")
  q-list
    q-item
      q-item-section
        q-input(
          v-model="device.name"
          :label="t('devices.code')"
        )
    q-item
      q-item-section
        ResourceSelect(
          :store="gatewaysStore"
          :model-value="device.gateway ? { value: device.gateway, label: device.gateway?.name } : null"
          @update:model-value=`(e) => {
            device.gateway = e ? e.value : null
          }`
          clearable
          label="test"
        )
          template(#label)
            | {{ t('devices.gateway') }} - 
            span.text-italic.q-pr-xs {{ t('form.optional') }}
    q-item
      q-item-section
        q-select(
          v-model="device.status"
          :label="t('devices.status')" disable
        )
    q-item
      q-item-section
        .row.justify-between
          q-input(
            type="number"
            min="0"
            v-model.number="device.slotNumber"
            :label="t('devices.slotNumber')"
            style="flex-grow: 1; width: 120px"
          )
          q-input.q-ml-md(
            type="number"
            v-model.number="device.localNumber"
            min="0"
            max="255"
            :label="t('devices.localNumber')"
            style="flex-grow: 1; width:120px"
          )
    q-item
      q-item-section
        q-input(
          type="number"
          v-model.number="device.price"
          min="0" step="100"
          :label="t('devices.price')"
        )
    q-item
      q-item-section
        .row.justify-end
          q-btn(
            @click=`() => {
              device.gateway &&= typeof device.gateway === 'object' ? device.gateway._id : undefined;
              $emit('save')
            }`
            icon="done"
            text-color="primary"
          )
          q-btn.q-ml-md(@click="$emit('close')" icon="close" text-color="negative")
</template>
