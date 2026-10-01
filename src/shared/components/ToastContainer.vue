<script setup lang="ts">
import { useToast, type ToastVariant } from '@/shared/composables/useToast'

const { toasts, dismiss } = useToast()

const variantStyles: Record<
  ToastVariant,
  { bar: string; icon: string; title: string }
> = {
  success: {
    bar: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-50',
    icon: 'text-emerald-400',
    title: 'text-white',
  },
  error: {
    bar: 'border-red-500/30 bg-slate-900/95 text-red-50',
    icon: 'text-red-400',
    title: 'text-white',
  },
  info: {
    bar: 'border-sky-500/30 bg-slate-900/95 text-sky-50',
    icon: 'text-sky-400',
    title: 'text-white',
  },
  warning: {
    bar: 'border-amber-500/30 bg-slate-900/95 text-amber-50',
    icon: 'text-amber-400',
    title: 'text-white',
  },
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-end gap-3 px-4 sm:px-6"
    aria-live="polite"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-8 opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-8 opacity-0"
      move-class="transition duration-300"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl shadow-black/20 backdrop-blur-md"
        :class="variantStyles[toast.variant].bar"
        role="status"
      >
        <div class="flex gap-3 p-4">
          <div class="mt-0.5 shrink-0" :class="variantStyles[toast.variant].icon">
            <svg
              v-if="toast.variant === 'success'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg
              v-else-if="toast.variant === 'error'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg
              v-else-if="toast.variant === 'warning'"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold" :class="variantStyles[toast.variant].title">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="mt-1 text-sm leading-snug opacity-90">
              {{ toast.message }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
            aria-label="Tutup"
            @click="dismiss(toast.id)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
