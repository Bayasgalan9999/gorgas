import { ref } from 'vue'
import { useRouter } from 'vue-router'

const tabs = ref<{ label: string; id: string }[]>([])
export const useTabs = () => {
  const router = useRouter()
  return {
    openTab({ label, id }: { label: string; id: string }) {
      if (tabs.value.find(v => v.id === id)) return
      tabs.value.push({ label, id })
    },
    closeTab(id: string) {
      tabs.value = tabs.value.filter(v => v.id !== id)
      router.push('/devices')
    },
    tabs,
  }
}
