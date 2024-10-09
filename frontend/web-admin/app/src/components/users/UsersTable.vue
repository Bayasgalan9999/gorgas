<script setup lang="tsx">
import { useAppI18n } from '@/i18n'
import { useUsersStore } from '@/stores'

import { AppTable } from '../table'

import type { User } from '@/types'
import type { TableColumn } from '../table/table'
import { reactive } from 'vue'
import type { Filter } from '../table/AppTableFilter.vue'

const { t, locale } = useAppI18n()

const usersStore = useUsersStore()

const columns: TableColumn<User>[] = [
  {
    field: 'name',
    name: 'name',
    label: t('users.name'),
    sortable: true,
    align: 'left',
    headerStyle: 'width: 320px',
  },
  {
    field: 'email',
    name: 'email',
    label: t('users.email'),
    sortable: true,
  },
  {
    field: 'roleId',
    name: 'role',
    label: t('users.role'),
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
  { name: 'name', label: t('users.name'), value: '' },
  { name: 'email', label: t('users.email'), value: '' },
  {
    name: 'role',
    label: t('users.role'),
    value: { min: 0, max: null },
  },
  {
    name: 'date',
    label: t('parkings.table'),
    value: { min: 0, max: null },
  },
])
</script>

<template lang="pug">
AppTable(
  :columns="columns" :store="usersStore" :filters="filters"
  :skeleton="{ _id: '', createdAt: 0, gatewayCode: '', parkingId: undefined, topic: undefined, devices: [] }"
  title="Users"
)  
</template>
