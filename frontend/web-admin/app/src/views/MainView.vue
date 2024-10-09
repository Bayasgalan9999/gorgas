<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import DrawerMenu from '../components/DrawerMenu.vue';
import PageContainer from '../components/PageContainer.vue';
import { useAppI18n } from '@/i18n';

const authStore = useAuthStore();
const { t } = useAppI18n();

const menus = authStore.menus;

const drawerOpen = ref(true);
</script>

<template lang="pug">
q-layout(view="hHh LpR fFf")
  q-header.bg-primary.text-white(elevated)
    q-toolbar
      q-btn(dense flat round icon="menu" @click="drawerOpen = !drawerOpen")
      q-toolbar-title
        router-link.text-white(to="/") QParking
      q-item.text-bold
        .row.no-wrap.items-center
          q-icon.q-mr-sm(name="account_circle" size="md")
          | {{ authStore.user?.email }}
        .row.no-wrap.q-ml-md
          q-btn.q-px-sm(dark unelevated icon="logout" @click="authStore.logout()" to="/auth/login")
            q-tooltip {{ t('auth.logout') }}
  DrawerMenu(v-model:isOpen="drawerOpen")
  PageContainer
</template>
