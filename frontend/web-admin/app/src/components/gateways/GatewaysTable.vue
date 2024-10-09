<script setup lang="tsx">
import { useAppI18n } from '@/i18n'
import { useGatewaysStore, useParkingsStore } from '@/stores'

import { AppTable } from '../table'
import ResourceSelect from '../ResourceSelect.js'

import type { Gateway } from '@/types'
import type { TableColumn } from '../table/table'
import { reactive } from 'vue'
import { QInput } from 'quasar'
import type { Filter } from '../table/AppTableFilter.vue'
import { useRoute } from 'vue-router'

const { t, locale } = useAppI18n()

const gatewaysStore = useGatewaysStore()
const parkingsStore = useParkingsStore()

const columns: TableColumn<Gateway>[] = [
  {
    field: 'name',
    name: 'name',
    label: t('gateways.name'),
    sortable: true,
    align: 'left',
    headerStyle: 'width: 320px',
  },
  {
    field: 'parking',
    name: 'parking',
    label: t('gateways.parking'),
    sortable: true,
    style: 'min-width: 120px',
    align: 'left'
  },
  {
    field: 'topic',
    name: 'topic',
    label: t('gateways.topic'),
    style: 'min-width: 220px',
    align: 'left'
  },
  {
    field: 'devices',
    name: 'devices',
    label: t('gateways.devices'),
    format: val => (Array.isArray(val) ? String(val.length) : '0'),
    sortable: true,
  },
  {
    field: 'createdAt',
    name: 'createdAt',
    label: t('table.createdAt'),
    format: val => new Date(Number(val)).toLocaleDateString(locale.value),
    sortable: true,
    classes: 'created-at',
  },
]

const filters = reactive<Filter[]>([
  { name: 'name', label: t('gateways.name'), value: '' },
  { name: 'parkingId', label: t('gateways.parking'), value: '' },
  { name: 'topic', label: t('gateways.topic'), value: '' },
])
</script>

<template lang="pug">
AppTable(
  :columns="columns" :store="gatewaysStore" :filters="filters"
  :skeleton="{ _id: '', createdAt: 0, name: '', parking: null, topic: undefined, devices: [] }"
  title="Gateways"
)
  template(#body-cell-devices="props")
    q-td(:props="props")
      router-link.secondary(:to="`/devices?gatewayId=${props.row._id}`")
        q-icon.q-mx-sm.cell-action(name="search" size="xs")
        | total: {{ props.value }}

  template(#body-cell-parking="props")
    q-td(:props="props")
      router-link.secondary(
        v-if="props.value"
        :to="`/gateways?parkingId=${props.value._id}`"
      ) 
        | {{ props.value.name }}
        q-icon.q-mx-sm.cell-action(name="search" size="xs")
      template(v-else) -

  template(#edit="{ value: gateway, cancel, set }")
    q-form(v-if="gateway && typeof gateway.parking !== 'string'")
      q-list
        q-item
          q-item-section
            q-input(
              v-model="gateway.name" :label="t('gateways.name')" :rules="[name => name.length]" hide-bottom-space)
        q-item
          q-item-section
            ResourceSelect(
              :store="parkingsStore"
              @update:model-value="(e) => gateway.parking = e ? e.value : null"
              :model-value="{ value: gateway.parking, label: gateway.parking?.name }"
              :label="t('gateways.parking')"
            )
        q-item
          q-item-section
            q-input(v-model="gateway.topic" :label="t('gateways.topic')")
        q-item
          q-item-section
            q-btn(:to="`/devices?gateway=${gateway._id}`") explore devices
        
        q-item
          q-item-section
            .row.justify-end
              q-btn(
                @click=`() => {
                  gateway.parking &&= typeof gateway.parking === 'object' ? gateway.parking._id : undefined;
                  set()
                }`
                icon="done"
                text-color="primary"
              )
              q-btn.q-ml-md(@click="cancel()" icon="close" text-color="negative")


</template>
