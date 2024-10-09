<script setup lang="ts">
import { computed, useSlots, watch } from 'vue'
import { useAppI18n } from '@/i18n'
import RowActions from './RowActions.vue'
import { useRoute, useRouter } from 'vue-router'

import type { useResourceStore } from '@/stores/store'
import type { QTableColumn, QTableProps } from 'quasar'
import type { Ref, WritableComputedRef } from 'vue'
import type { Filter } from './AppTableFilter.vue'

const props = defineProps<{
  readOnly?: boolean
  columns: QTableColumn[]
  store: ReturnType<typeof useResourceStore>
  filters: { name: string; label: string; value: unknown }[]
  skeleton: object
  title: string
}>()

const { t } = useAppI18n()

const slots = useSlots()

const tableSlots = computed(() =>
  Object.keys(slots)
    .filter(key => !key.startsWith('filter-'))
    .reduce((acc, key) => ({ ...acc, [key]: slots[key] }), {})
)

const paginationLabel = (
  firstRowIndex: number,
  endRowIndex: number,
  totalRowsNumber: number
) =>
  t('table.pagination.total_rows', {
    firstRowIndex,
    endRowIndex,
    totalRowsNumber,
  })

const newValue = computed(() => JSON.parse(JSON.stringify(props.skeleton)))

const firstColSlot = `body-cell-${props.columns[0].name}`

const { rows, pagination, total } = useResource({
  store: props.store,
  filters: props.filters,
})

type Pagination = NonNullable<QTableProps['pagination']>

function useResource({
  store,
  filters,
}: {
  store: ReturnType<typeof useResourceStore>
  filters: Filter[]
}): {
  pagination: WritableComputedRef<Pagination>
  rows: Ref<object[]>
} & ReturnType<typeof useResourceStore> {
  const router = useRouter()
  const route = useRoute()
  const query = computed(() => route.query)

  const { rows, total } = store.get({ ...query } as any)

  const pagination = computed<Pagination>({
    get: () => ({
      descending:
        query.value.desc === null ||
        (typeof query.value.desc === 'string' && query.value.desc !== 'false'),
      page: Number(query.value.page) || 1,
      rowsNumber: total.value,
      rowsPerPage: Number(query.value.limit) || 15,
      sortBy:
        typeof query.value.sort === 'string'
          ? query.value.sort || undefined
          : undefined,
    }),
    set: value => {
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

  watch(filters, () => {
    const newQuery = {
      ...route.query,
      ...filters.reduce(
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
q-table.app-table(
  square flat
  table-style="table-layout: fixed"
  :grid="$q.screen.lt.md"

  :columns="columns"
  :rows="rows" row-key="_id"
  
  v-model:pagination="pagination"
  @request="pagination = $event.pagination"

  :rows-per-page-options="[10, 15, 20, 25, 50]"

  :loading="store.loading.value"

  :pagination-label="paginationLabel"
  :rows-per-page-label="t('table.pagination.rows_per_page')"

  :no-data-label="t('table.nodata')"
  :loading-label="t('table.loading')"
  title="Title"
)
  template(#top-left="{ pagination }")
    .row
      .q-table__title {{ title }}: {{ total }}

  template(#top-right v-if="!readOnly")
    q-btn(icon="add")
      q-popup-edit(
        ref="editPopup"
        :model-value="newValue"
        @save="(newValue) => store.create(newValue)"
        :cover="false"
        anchor="bottom left"
        self="top left"
      )
        template(#="scope")
          slot(name="edit" :="scope") `edit` slot

  template(#header="props")
    slot(name="toolbar")
    slot(name="header" :="props")
      q-tr(:props="props")
        slot(v-for="col in props.cols" name="header-cell" :="props" :key="col.name")
          slot(:name="`header-cell-${col.name}`" :="props")
            q-th(:props="{ ...props, col }")
              | {{ col.label }}
  
  template(#[firstColSlot]="props")
    q-td.row.justify-between.items-center.no-wrap
      | {{ props.value }}
      RowActions(:read-only="readOnly" :row="props.row")
        template(#="scope")
          slot(name="edit" :="scope") `edit` slot

  
  template(#loading)
    q-inner-loading(showing)

  template(v-for="(_, slot) of tableSlots" #[slot]="props")
    slot(:name="slot" :="props")

</template>

<style lang="scss">
$primary: #101010;
$secondary: #535353;
.app-table {
  /* height or max-height is important */
  max-height: calc(100vh - 120px);

  .q-table__top,
  .q-table__bottom,
  thead tr th {
    /* bg color is important for th; just specify one */
    background-color: white;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
    font-weight: 600;
    color: $secondary;
    &.sorted,
    &.sortable:hover {
      color: $primary;
    }
  }
  thead tr:last-child th {
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  .created-at {
    width: 0px;
  }

  .q-btn,
  .secondary {
    color: $secondary;
    &.q-btn {
      opacity: 0.66;
    }
    &:hover,
    &:focus {
      color: $primary;
      opacity: 1;
    }
  }
}

.cell-action {
  opacity: 0;
  td:hover & {
    opacity: 1;
  }
}
</style>
