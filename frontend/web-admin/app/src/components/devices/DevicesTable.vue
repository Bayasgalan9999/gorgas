<script setup lang="tsx">
import { ref, watch } from 'vue'

import { useAppI18n } from '@/i18n'

import { useDevicesStore, useGatewaysStore, useParkingsStore } from '@/stores'

import { AppTable } from '@/components/table'
import ResourceSelect from '@/components/ResourceSelect'

import type { Device } from '@/types'
import type { TableColumn } from '@/components/table/table'
import type { Filter } from '@/components/table/AppTableFilter.vue'
import DevicesEditor from './DevicesEditor.vue'
import AppTableFilter from '../table/AppTableFilter.vue'

const { t } = useAppI18n()

const devicesStore = useDevicesStore()
const gatewaysStore = useGatewaysStore()
const parkingsStore = useParkingsStore()

const columns: TableColumn<Device>[] = [
  {
    field: 'name',
    name: 'name',
    label: t('devices.name'),
    sortable: true,
    align: 'left',
    headerStyle: 'width: 320px',
  },
  {
    field: 'price',
    name: 'price',
    label: t('devices.price'),
    sortable: true,
    style: 'width: 0',
  },
  {
    field: 'status',
    name: 'status',
    label: t('devices.status'),
    sortable: true,
  },
  // {
  //   field: 'gateway',
  //   name: 'parking',
  //   label: t('devices.parking'),
  //   sortable: true,
  //   align: 'left',
  // },
  {
    field: 'gateway',
    name: 'gateway',
    label: t('devices.gateway'),
    align: 'left',
  },
  {
    field: 'slotNumber',
    name: 'slotNumber',
    label: t('devices.slotNumber'),
    sortable: true,
    headerStyle: 'width: 0px',
  },
  {
    field: 'localNumber',
    name: 'localNumber',
    label: t('devices.localNumber'),
    sortable: true,
    headerStyle: 'width: 0px',
  },
  {
    field: 'createdAt',
    name: 'createdAt',
    label: t('table.createdAt'),
    format: val => new Date(Number(val)).toLocaleDateString('mn'),
    sortable: true,
    classes: 'created-at',
  },
]

const filters = ref<Filter[]>([
  {
    name: 'name',
    label: t('devices.name'),
    value: undefined,
  },
  {
    name: 'status',
    label: t('devices.status'),
    value: [],
    initialValue: [],
    format: (val: []) => val.length ? val.slice(0, 2).join(', ') + (val.length > 2 ? ' + ' + (val.length - 2): '') : ''
  },
  {
    name: 'gateway',
    label: t('devices.gateway'),
    value: undefined,
  },
  {
    name: 'parking',
    label: t('devices.parking'),
    value: undefined,
    format: val => val?.name ?? '',
  },
])

const statuses = ref<string[]>([])
watch(statuses, newValue => {
  if (newValue.length === 5) statuses.value = []
})
</script>

<template lang="pug">
AppTable(
  :columns="columns" :store="devicesStore" :filters="filters"
  :skeleton="{ _id: '', createdAt: 0, name: '', gateway: null, localNumber: undefined, price: undefined }"
  title="Devices"
)
  template(#toolbar)
    AppTableFilter(:model-value="filters")
      template(#status="scope")
        q-list.column
          q-item(dense)
            q-item-section
              .row.justify-end
                q-btn(@click="scope.close()" icon="close" text-color="negative" round flat)
          q-separator
          q-item(v-for="status in ['UNLOCKED', 'LOCKED', 'UNLOCKING', 'LOCKING', 'ERROR']" dense clickable)
            q-item-section
              q-checkbox(
                :val="status"
                v-model="scope.value"
              )
                | {{ status }}
          q-separator
          q-item
            q-item-section
              .row
                q-btn(@click="scope.submit(scope.value)" icon="done" text-color="primary")
      
      template(#gateway="{ value, submit }")
        q-item
          q-item-section
            q-form
              ResourceSelect(
                :store="gatewaysStore"
                :model-value="{ value, label: value.name }"
                @update:model-value="submit($event.value)"
                dense autofocus
              )

      template(#parking="{ value, submit }")
        q-item
          q-item-section
            q-form
              ResourceSelect(
                clearable
                :store="parkingsStore"
                :model-value="{ value, label: value.name }"
                @update:model-value="submit($event?.value ?? null)"
                dense autofocus
              )

  template(#body-cell-parking="props")
    q-td(:props="props")
      router-link.secondary(v-if="props.value" :to="`/devices?parkingId=${props.value._id}`")
        | {{ props.value.name }}
        q-icon.q-mx-sm.cell-action(name="search" size="xs")

  template(#body-cell-gateway="props")
    q-td(:props="props")
      router-link.secondary(v-if="props.value" :to="`/devices?gatewayId=${props.value._id}`")
        | {{ props.value.name }}
        q-icon.q-mx-sm.cell-action(name="search" size="xs")


  template(#edit="{ value: device, cancel, set }")
    DevicesEditor(:device="device" @close="cancel()" @save="set()")


</template>
