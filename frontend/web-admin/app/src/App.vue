<script setup lang="ts">
import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores';
import router from './router';
import { onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAppI18n } from './i18n';

const authStore = useAuthStore();

if (authStore.token)
  authStore.refreshToken().then(() => {
    const redirect = authStore.redirect;
    if (redirect) router.push(redirect);
    else router.push('/');
  });
</script>

<template lang="pug">
RouterView
</template>
