import type { useResourceStore } from '@/stores/store'
import type { BaseResourse } from '@/types'
import type { QSelectProps, QSelectSlots } from 'quasar'
import ResourceSelectVue from './ResourceSelect.vue'

export default ResourceSelectVue as any as new <T extends BaseResourse>(
  props: SelectProps<T>
) => {
  $props: SelectProps<T>
  $slots: QSelectSlots
}

type SelectProps<T extends BaseResourse> = QSelectProps & {
  store: ReturnType<typeof useResourceStore<T>>
}
