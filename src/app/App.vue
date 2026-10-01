<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSplashLoader from '@/shared/components/AppSplashLoader.vue'
import ToastContainer from '@/shared/components/ToastContainer.vue'
import { apiClient } from '@/shared/api/client'

const appReady = ref(false)

onMounted(async () => {
  const minimumMs = 1200
  await Promise.all([
    apiClient.get('/api/health').catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, minimumMs)),
  ])
  appReady.value = true
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-500 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <AppSplashLoader v-if="!appReady" />
  </Transition>

  <div
    class="page-mesh min-h-screen transition-opacity duration-500"
    :class="appReady ? 'opacity-100' : 'opacity-0'"
  >
    <RouterView v-if="appReady" />
    <ToastContainer v-if="appReady" />
  </div>
</template>
