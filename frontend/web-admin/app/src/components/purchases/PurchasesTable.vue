<script setup lang="tsx">
import { reactive, ref } from 'vue'

import { useAppI18n } from '@/i18n'

import { usePurchasesStore } from '@/stores'

import { AppTable } from '@/components/table'

import type { Purchase } from '@/types'
import type { TableColumn } from '@/components/table/table'
import type { Filter } from '@/components/table/AppTableFilter.vue'

const { t } = useAppI18n()

const purchasesStore = usePurchasesStore()

const columns: TableColumn<Purchase>[] = [
  {
    field: 'status',
    name: 'status',
    label: t('purchases.status'),
    sortable: true,
    align: 'left',
  },
  {
    field: 'method',
    name: 'method',
    label: t('purchases.method'),
    sortable: true,
    align: 'left',
  },
  {
    field: 'price',
    name: 'price',
    label: t('purchases.price'),
    sortable: true,
  },
  {
    field: 'device',
    name: 'device',
    format: (val) => val !== null && typeof val === 'object' && val.name || '',
    label: t('purchases.device'),
    sortable: true,
    align: 'left',
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

const filters = reactive<Filter[]>([
])

</script>

<template lang="pug">
AppTable(
  read-only
  :columns="columns" :store="purchasesStore" :filters="filters"
  :skeleton="{ _id: '', createdAt: 0, code: '', gateway: '', localNumber: undefined, price: undefined }"
  title="Purchases"
)
</template>
