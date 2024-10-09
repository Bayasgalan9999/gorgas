import { createRouter, createWebHistory } from 'vue-router';

import AuthView from './views/AuthView.vue';
import MainView from './views/MainView.vue';

import DevicesTable from './components/devices/DevicesTable.vue';
import GatewaysTable from './components/gateways/GatewaysTable.vue'
import PurchasesTable from './components/purchases/PurchasesTable.vue'
import ParkingsTable from './components/parkings/ParkingsTable.vue';
import UsersTable from './components/users/UsersTable.vue';
import SettingsTab from './components/SettingsTab.vue';

import TestCard from './components/TestCard.vue';

import { useAuthStore } from '@/stores/auth.store';
import Table from './components/table/TestTable.vue';
import { useTabs } from './stores/tabs';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/',
      name: 'dashboard',
      component: MainView,
      children: [
        {
          path: 'devices',
          component: DevicesTable,
        },
        {
          path: 'devices/:id',
          component: TestCard,
        },
        {
          path: 'gateways',
          component: GatewaysTable,
        },
        {
          path: 'parkings',
          component: ParkingsTable,
        },
        {
          path: 'users',
          component: UsersTable,
        },
        {
          path: 'roles',
          component: Table,
        },
        {
          path: 'settings',
          component: SettingsTab,
        },
        {
          path: 'purchases',
          component: PurchasesTable
        }
      ],
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = useAuthStore();

  const toLogin = !isAuthenticated && to.name !== 'login';
  const toMain = isAuthenticated && to.name === 'login';

  if (toLogin && authStore.redirect === '') authStore.redirect = to.fullPath;

  if (toLogin) return '/auth/login';
  if (toMain) return '/';

  if (to.params.id) {
    const { openTab } = useTabs()
    openTab({ label: String(to.params.id).slice(0, 6), id: String(to.params.id) })
  }
});

export default router;
