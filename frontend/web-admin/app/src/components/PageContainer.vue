<script setup lang="ts">
import { useTabs } from '@/stores/tabs'

const { tabs, closeTab } = useTabs()
</script>

<template lang="pug">
q-page-container
  q-page
    .row
      q-tabs(dense)
        q-route-tab(:to="'/devices'") Table
        q-route-tab.q-pr-sm(v-for="tab in tabs" :key="tab.id" :to="'/devices/' + tab.id")
          .row.items-center
            | {{ tab.label }}
            q-icon.q-ml-xs(name="close" @click.prevent="() => closeTab(tab.id)" size="16px")
    router-view

</template>
