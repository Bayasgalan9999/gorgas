<script setup lang="ts">
import { useAppI18n } from '@/i18n';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores';

const authStore = useAuthStore();
const { t } = useAppI18n();

const data = reactive({
  email: '',
  password: '',
});
const showPassword = ref(false);

const submit = () => {
  authStore.login(data.email, data.password);  
};
</script>

<template lang="pug">
q-layout
  q-page-container
    q-page
      div(style="height: 100vh")
        .column.full-height.justify-center.items-center
          q-spinner(v-if="authStore.token" color="primary" size="20%")
          q-card.q-pa-sm.no-shadow.text-center(v-else style="min-width: 380px")
            q-card-section.text-h4
              q-form(@submit="submit")
                q-input.q-my-sm.text-h6(autofocus outlined no-error-icon hide-bottom-space hide-hint :label="t('auth.email')" stack-label :rules="[(val) => (val && val.length) || '']" v-model="data.email" type="email")
                q-input.q-my-sm.text-h6(outlined :rules="[(val) => (val && val.length) || '']" no-error-icon hide-hint hide-bottom-space :label="t('auth.password')" stack-label v-model="data.password" :type="showPassword ? 'text' : 'password'")
                  template(#append)
                    q-icon.cursor-pointer(:name="showPassword ? 'visibility_off' : 'visibility'" @click="showPassword = !showPassword")
                .text-caption.text-red.q-my-sm.text-bold(v-if="authStore.error")
                  | {{ t('errors.' + authStore.error) }}
                q-btn.full-width.text-bold(type="submit" size="lg" unelevated color="primary" :label="t('auth.login')")
                .text-caption.q-mt-lg
                  | {{ t('auth.copyright', { currentYear: new Date().getFullYear(), }) }}
            q-inner-loading(:showing="authStore.loading" color="secondary")
</template>

