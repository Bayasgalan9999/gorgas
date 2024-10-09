import { defineStore } from 'pinia';
import { useLocalStorage, type RemovableRef } from '@vueuse/core';
import { api, auth } from '../services';

import type { Menu, User } from '@/types';


interface AuthState {
  isAuthenticated: boolean;
  token: RemovableRef<string | undefined>;
  user: User | null;
  menus: Menu[];
  loading: boolean;
  error: any;
  redirect: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: useLocalStorage('token', undefined),
    user: null,
    menus: [],
    loading: false,
    error: '',
    redirect: ''
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      
      const res =  await auth.login({ email, password })
      this.loading = false

      if ('error' in res) {{
        this.error = res.error
        return
      }}

      if (!res.data) {
        if ('message' in res) {
          this.error = res.message
        } else {
          this.error = 'Unknown error'
        }
        return
      }

      const { menus, token, user } = res.data
      
      this.isAuthenticated = true
      this.token = token;
      this.user = user
      
      this.router.push(this.redirect || '/')
      
      const menusRes = await api<Menu>('menus').get({ _id: menus.join() })
      if ('data' in menusRes) {
        this.menus = menusRes.data.data ?? []
      }
    },
    async refreshToken() {
      const res =  await auth.refreshToken(this.token)

      if ('error' in res) {{
        this.isAuthenticated = false
        this.token = ''
        return
      }}

      const { menus, token, user } = res.data
      
      this.isAuthenticated = true
      this.token = token;
      this.user = user

      const menusRes = await api<Menu>('menus').get({ _id: menus.join() })
      if ('data' in menusRes) {
        this.menus = menusRes.data.data ?? []
      }
    },
    logout() {
      auth.logout();
      this.router.push('/login')
      window.localStorage.removeItem('token');
      this.$reset();
    },
  },
});
