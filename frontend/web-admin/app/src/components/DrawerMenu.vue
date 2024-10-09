<script setup lang="ts">
import { useAppI18n } from '@/i18n'
import { useAuthStore } from '@/stores'
import { computed } from 'vue';

defineProps<{
  isOpen: boolean
}>()
defineEmits<{
  (e: 'update:isOpen', isOpen: boolean): void
}>()

const { t } = useAppI18n()

const auth = useAuthStore()

const menuMap = {
  DEVICES: {
    icon: 'folder_open',
    path: 'devices',
    name: t('menu.devices')
  },
  GATEWAYS: {
    icon: 'place',
    path: 'gateways',
    name: t('menu.gateways')
  },
  PARKINGS: {
    icon: 'local_parking',
    path: 'parkings',
    name: t('menu.parkings')
  },
  USERS: {
    icon: 'people_alt',
    path: 'users',
    name: t('menu.users')
  },
  ROLES: {
    icon: 'admin_panel_settings',
    path: 'roles',
    name: t('menu.roles')
  },
  MAP: {
    icon: 'map',
    path: 'map',
    name: t('menu.map')
  },
  PURCHASES: {
    icon: 'shopping_basket',
    path: 'purchases',
    name: t('menu.purchases')
  }
} as const

const menus = computed(() =>
  auth.menus.map(menu => menuMap[menu.name as keyof typeof menuMap])
)
</script>

<template lang="pug">
q-drawer(show-if-above :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" side="left" bordered)
  q-list.fit.column
      q-item(name="main" to="/" exact)
        q-item-section(avatar)
          q-icon(name="dashboard" size="sm")
        q-item-section.text-weight-regular(style="text-transform: uppercase")
          | {{ t('menu.main') }}
      q-item(
        v-if="menus.length"
        v-for="menu in menus"
        :name="menu?.path" :to="'/' + menu?.path"
      )
        q-item-section(avatar)
          q-icon(:name="menu?.icon" size="sm")
        q-item-section.text-weight-regular(style="text-transform: uppercase")
          | {{ menu?.name ?? 'unknown' }}

      q-item(
        v-else
        v-for="width in [80, 55, 65, 40]"
      )
        q-item-section(avatar)
          q-skeleton(type="circle" size="24px")
        q-item-section
          q-skeleton(height="15px" :width="width + '%'")

      q-separator
      q-item.col-grow
      q-separator

      q-item(name="settings" to="/settings")
        q-item-section(avatar)
          q-icon(name="settings" size="sm")
        q-item-section.text-weight-regular(style="text-transform: uppercase")
          | {{ t('menu.settings') }}
</template>
