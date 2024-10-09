import type { AuthResponse } from '@/types'
import { handleError, handleResponse } from './api'
import { client } from './client'

export const auth = {
  async login(params: { email: string; password: string }) {

    const res = await client.post<AuthResponse>('/login', params)
      .then(handleResponse)
      .catch(handleError)

    if ('data' in res) {
      client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    }
    return res
  },
  async logout() {},
  async refreshToken(token?: string) {

    const res = await client.post<AuthResponse>('/me', {}, {
      headers: (token ? {
        'Authorization': `Bearer ${token}`
      } : {})
    })
      .then(handleResponse)
      .catch(handleError)

    if ('data' in res) {
      client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    }
    return res
  },
}
