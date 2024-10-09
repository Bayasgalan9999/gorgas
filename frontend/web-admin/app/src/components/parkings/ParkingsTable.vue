<script setup lang="tsx">
import { useAppI18n } from '@/i18n'
import { useParkingsStore } from '@/stores'

import { AppTable } from '../table'

import type { Parking } from '@/types'
import type { TableColumn } from '../table/table'
import { reactive } from 'vue'
import type { Filter } from '../table/AppTableFilter.vue'

const { t, locale } = useAppI18n()

const parkingsStore = useParkingsStore()

const columns: TableColumn<Parking>[] = [
  {
    field: 'name',
    name: 'name',
    label: t('parkings.name'),
    sortable: true,
    align: 'left',
    headerStyle: 'width: 320px',
  },
  {
    field: 'gateways',
    name: 'gateways',
    label: t('parkings.gateways'),
    format: val => (Array.isArray(val) ? String(val.length) : '0'),
    sortable: true,
  },
  {
    field: 'devices',
    name: 'devices',
    label: t('parkings.devices'),
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
  {
    name: 'name',
    label: t('parkings.name'),
    value: '',
  },
  { name: 'gateways', label: t('parkings.gateways'), value: '' },
  {
    name: 'devices',
    label: t('parkings.devices'),
    value: { min: 0, max: null },
  },
  {
    name: 'createdAt',
    label: t('table.createdAt'),
    value: { from: null, to: null },
  },
])

</script>

<template lang="pug">
AppTable(
  :columns="columns" :store="parkingsStore" :filters="filters"
  :skeleton="{ _id: '', createdAt: 0, name: '', gateways: [] }"
  title="Parkings"
)
  template(#body-cell-gateways="props")
    q-td(:props="props")
      router-link.secondary(v-if="props.value" :to="`/gateways?parkingId=${props.row._id}`")
        q-icon.q-mr-sm.cell-action(name="search" size="xs")
        | total: {{ props.value }}

  template(#body-cell-devices="props")
    q-td(:props="props")
      router-link.secondary(v-if="props.value" :to="`/devices?parkingId=${props.row._id}`")
        q-icon.q-mr-sm.cell-action(name="search" size="xs")
        | total: {{ props.value }}

  template(#filter-form-createdAt="{ close, submit, value }")
    q-date(
      :model-value="value"
      @update:model-value="value.from = $event.from; value.to = $event.to"
      range
      first-day-of-week="1"
      years-in-month-view square
    )
        q-btn(@click="submit()" icon="done" text-color="primary")
        q-btn.q-ml-sm(@click="close()" icon="close" text-color="negative")

  template(#edit="{ value: parking, cancel, set }")
    q-form
      q-list
        q-item
          q-item-section
            q-input(
              v-model="parking.name"
              :label="t('parking.name')"
              :rules="[name => name.length]"
            )
        q-item(v-if="parking._id")
          q-item-section
            q-btn(:to="`/gateways?parkingId=${parking._id}`") {{ t('parkings.gateways') }}
        q-item(v-if="parking._id")
          q-item-section
            q-btn(:to="`/devices?parkingId=${parking._id}`") {{ t('parkings.devices') }}
        q-item
          q-item-section
            .row.justify-end
              q-btn(@click="set()" icon="done" text-color="primary")
              q-btn.q-ml-sm(@click="cancel()" icon="close" text-color="negative")

</template>
