<script setup lang="ts">
import { ref } from 'vue'
import { QMenu, QTooltip } from 'quasar'
import { useAppI18n } from '@/i18n'
import type { BaseResourse } from '@/types'

const { t } = useAppI18n()

defineProps<{
  row: object
  readOnly?: boolean
}>()
defineEmits<{
  <T extends BaseResourse>(e: 'update:model-value', item: T): void
  (e: 'click:delete'): void
}>()

const editTooltip = ref<QTooltip>()
const editPopup = ref<QMenu>()
const moreActionsTooltip = ref<QTooltip>()
</script>

<template lang="pug">
.actions.q-ml-md
  q-btn(
    v-if="!readOnly"
    icon="edit"
    @click="editTooltip?.hide()"
    size="md" flat
  )
    q-tooltip(ref="editTooltip") {{ t('table.actions.edit') }}
    q-popup-edit(
      ref="editPopup"
      :model-value="row"
      @save="(newValue) => $emit('submit', newValue)"
      :cover="false"
      anchor="bottom left"
      self="top left"
    )
      template(#="scope")
        slot(:="scope") EDIT
  q-btn(
    v-if="'_id' in row"
    :to="$route.path + '/' + row._id"
    icon="bar_chart "
    size="md" flat
  )
    q-tooltip(:delay="300") {{ t('table.actions.details') }}
  q-btn(
    v-if="!readOnly"
    icon="more_vert"
    @click="moreActionsTooltip?.hide()"
    size="md" flat
  )
    q-tooltip(ref="moreActionsTooltip") {{ t('table.actions.more_actions') }}
    q-menu
      q-list
        q-item.danger(clickable dense @click="() => $emit('click:delete')")
          q-item-section
            q-icon(name="delete" size="sm")
</template>

<style scoped lang="scss">
.danger:hover,
.danger:focus {
  background-color: $negative;
  i {
    color: white;
  }
}
</style>
