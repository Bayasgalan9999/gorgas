<script setup lang="ts">
import { useDevicesStore } from '@/stores'
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Ref, WritableComputedRef } from 'vue'
import type { QTableProps } from 'quasar'
import { useAppI18n } from '@/i18n'

const { t } = useAppI18n()

const columns = [
  {
    field: 'name',
    name: 'name',
    label: t('devices.code'),
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
    headerStyle: 'width: 0px',
  },
  {
    field: 'localNumber',
    name: 'localNumber',
    label: t('devices.localNumber'),
    headerStyle: 'width: 0px',
  },
  {
    field: 'createdAt',
    name: 'createdAt',
    label: t('table.createdAt'),
    format: (val: number) => new Date(val).toLocaleDateString('mn'),
    sortable: true,
    classes: 'created-at',
  },
] as QTableProps['columns']

const store = useDevicesStore()
const filters = reactive([
  { name: 'name', field: 'name', value: '' },
  { name: 'date', field: 'status', value: '' },
])

const { rows, pagination, loading } = useResource({ store, filters })

type Pagination = NonNullable<QTableProps['pagination']>

function useResource({
  store,
  filters,
}: {
  store: ReturnType<typeof useDevicesStore>
  filters: { name: string; field: string; value: any }[]
}): {
  pagination: WritableComputedRef<Pagination>
  rows: Ref<object[]>
} & ReturnType<typeof useDevicesStore> {
  const router = useRouter()
  const route = useRoute()
  const query = computed(() => route.query)

  const { rows, total } = store.get({ ...query } as any)

  const pagination = computed<Pagination>({
    get() {
      return {
        descending:
          query.value.desc === null ||
          (typeof query.value.desc === 'string' &&
            query.value.desc !== 'false'),
        page: Number(query.value.page) || 1,
        rowsNumber: total.value,
        rowsPerPage: Number(query.value.limit) || 15,
        sortBy:
          typeof query.value.sort === 'string'
            ? query.value.sort || undefined
            : undefined,
      }
    },
    set(value) {
      console.log(value.rowsPerPage)

      const newQuery = {
        ...query.value,
        desc: value?.descending && value.sortBy ? null : undefined,
        page: value?.page !== 1 ? value?.page : undefined,
        limit: value?.rowsPerPage !== 15 ? value?.rowsPerPage : undefined,
        sort: value?.sortBy ? value?.sortBy : undefined,
      }

      store.get({
        ...newQuery,
        desc: newQuery.desc === null ? true : false,
      } as any)

      router.push({
        path: route.path,
        query: newQuery,
      })
    },
  })

  watch(filters, val => {
    const newQuery = {
      ...route.query,
      ...val.reduce(
        (acc, v) => ({ ...acc, [v.name]: v.value ? v.value : undefined }),
        {}
      ),
    }
    store.get(newQuery)
    router.push({
      path: route.path,
      query: newQuery,
    })
  })

  return {
    rows,
    pagination,
    ...store,
  }
}
</script>

<template lang="pug">
q-chip(
  v-for="filter in filters"
  :key="filter.name"
  :label="filter.name + ' : ' + filter.value"
  @remove="filter.value = ''"
  :removable="!!filter.value"
  clickable
)
  q-popup-edit(
    :model-value="filter.value"
    @save="filter.value = $event"
    self="bottom left" anchor="top left" :cover="false"
  )
    template(#default="scope")
      q-input(v-model="scope.value" @keypress.enter="() => scope.set()")
q-table(
  :columns="columns"
  :rows="rows"
  :pagination="pagination"
  @update:pagination="pagination = $event"
  @request="pagination = $event.pagination"
  :loading="loading"
)
</template>
