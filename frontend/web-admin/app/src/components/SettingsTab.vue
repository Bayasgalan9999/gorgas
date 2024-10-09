<script setup lang="ts">
import { ref } from 'vue';
import { useAppI18n, SUPPORTED_LOCALES, setI18nLanguage, loadLocaleMessages } from '@/i18n';
import type { Locale } from '@/i18n';

const { t, locale } = useAppI18n();

const langModel = ref({
  value: locale,
  label: t(`settings.locales.${locale.value}`),
});
const langOptions = SUPPORTED_LOCALES.map((val) => ({
  value: val,
  label: t(`settings.locales.${val}`),
}));

const loading = ref(false);

const langUpdateHandler = async (e: { value: Locale; label: string }) => {
  loading.value = true;
  await loadLocaleMessages(e.value);
  loading.value = false;
  setI18nLanguage(e.value);
};
</script>

<template lang="pug">
q-card
  q-card-section
    q-select(
      v-model="langModel"
      @update:model-value="langUpdateHandler"
      :options="langOptions"
      :loading="loading"
      :label="t('settings.language.picker')"
    )
</template>
