import type { useResourceStore } from '@/stores/store'
import type { BaseResourse } from '@/types'
import type { StoreDefinition } from 'pinia'
import type { QTableProps, QTableColumn, QTableSlots } from 'quasar'
import type { VNode } from 'vue'
import type { Filter } from './AppTableFilter.vue'

export type Table = new <T extends object>(props: TableProps<T>) => {
  $props: TableProps<T>
  $slots: TableSlots<T>
}

export interface TableColumn<T = object>
  extends Omit<QTableColumn, 'field' | 'sort'> {
  readonly field: keyof T
  sort?: (a: T[string], b: T[string], rowA: T, rowB: T) => number
  format?: (val: T[TableColumn<T>['field']], row?: T) => string
}

export interface Pagination {
  sortBy: string
  descending: boolean
  page: number
  rowsPerPage: number
  rowsNumber?: number
}

type TableProps<T extends object> = Omit<QTableProps, 'rows' | 'columns'> & {
  readOnly?: boolean
  columns: TableColumn<T>[]
  store: ReturnType<typeof useResourceStore<T>> | any
  skeleton: any
}

type TableSlots<T extends object> = {
  [S in keyof QTableSlots]: TableSlot<T, S>
} & {
  [key: `filter-chip-${string}`]: (scope: {
    filter: Filter<T[typeof key]>
  }) => VNode
  [key: `filter-form-${string}`]: (scope: {
    filter: Filter<T[typeof key]>
    submit(value?: any): void
    close(): void
    value: any
  }) => VNode
  edit: (scope: {
    value: T
    cancel(): void
    set(): void
  }) => VNode
  toolbar: (scope: {}) => VNode
}

type TableSlot<T extends object, S> = (
  scope: Omit<
    Parameters<QTableSlots[S]>[0],
    'cols' | 'rows' | 'row' | 'colsMap' | 'sort'
  > & {
    cols: TableColumn<T>[]
    rows: T[]
    row: T
    colsMap: { [K in keyof T]?: TableColumn<T> }
    sort: (col: TableColumn<T> | string) => void
  }
) => VNode[]
