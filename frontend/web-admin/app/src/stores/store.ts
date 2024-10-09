import { ref, type Ref } from 'vue'

import type { GetParams, BaseResourse } from '@/types'
import type { api } from '@/services'

export const useResourceStore = <T extends { _id: string }>(
  client: ReturnType<typeof api<T>>
) => {
  const loading = ref(false)
  const status = ref<number>()
  const error = ref<unknown>()

  const create = (item: T) => {
    loading.value = true
    const response = ref<T>()
    client.create(item).then(res => {
      loading.value = false

      status.value = res.status

      if ('error' in res) {
        error.value = res.error
        return
      }

      get() //TODO invalidation
      response.value = ref(res.data).value
    })

    return response
  }

  const update = (item: T) => {
    loading.value = true
    const response = ref<T>()
    client.update(item).then(res => {
      loading.value = false

      status.value = res.status

      if ('error' in res) {
        error.value = res.error
        return
      }

      get() //TODO invalidation
      response.value = ref(res.data).value
    })

    return response
  }

  const rows = ref<T[]>([]) as Ref<T[]>
  const total = ref<number>(0)

  const get = (params = {} as GetParams<T>, callback?: Function) => {
    for (const key of Object.keys(params)) {
      if (!params[key as keyof typeof params]) {
        delete params[key as keyof typeof params]
      }
    }
    const response = ref<{ rows: T[]; total: number }>()
    response.value = { rows: [], total: 0 }
    loading.value = true
    client.get(params).then(res => {
      loading.value = false

      status.value = res.status

      if ('error' in res) {
        error.value = res.error
        return
      }

      response.value = {
        rows: res.data?.data ?? [],
        total: res.data?.total ?? 0,
      }

      rows.value = response.value.rows
      total.value = response.value.total

      callback && callback()
    })

    return {
      rows,
      total,
    }
  }

  const del = async (id: string) => {
    loading.value = true
    await client.delete(id)
    get() //TODO invalidation
  }

  return {
    status,
    loading,
    error,
    create,
    get,
    update,
    del,
    total
  }
}
