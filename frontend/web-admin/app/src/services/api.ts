import type { GetParams } from '@/types'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { client } from './client'

export const api = <T extends { _id: string }>(url: string) => {
  return {
    create: (value: T) =>
      client.post<T>(url, value).then(handleResponse).catch(handleError),
    get: (params?: GetParams<T>) =>
      client
        .get<{ data: T[]; total: number; page: number }>(url, {
          params: { ...params },
        })
        .then(handleResponse)
        .catch(handleError),
    update: (value: T) =>
      client
        .put<T>(`${url}/${value._id}`, value)
        .then(handleResponse)
        .catch(handleError),
    delete: (id: string) =>
      client.delete<T>(`${url}/${id}`).then(handleResponse).catch(handleError),
  }
}

export function handleError(err: unknown): { error: unknown; status?: number } {
  if (!axios.isAxiosError(err)) return { error: 'Unknown error' }
  if (err.response) {
    const res = err.response
    let error
    if (
      typeof res.data === 'object' &&
      res.data !== null &&
      'message' in res.data
    ) {
      error = res.data.message
    } else if (navigator.onLine) {
      error = 'Server error'
    } else {
      error = 'Browser is offline'
    }
    return { status: res.status, error }
  } else if (err.request) {
    return { error: 'Client error' }
  } else {
    return { error: err.message }
  }
}

export const handleResponse = <T>(res: AxiosResponse<T>) => ({
  data: res.data,
  status: res.status,
})

// client.delete('/devices/:id')
// client.put('/devices/:id', { name })
// client.post('/devices', { name })
// client.get('/devices?sort=asc&..')
// client.get('/devices/:id?')
