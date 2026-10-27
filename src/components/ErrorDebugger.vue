<template>
  <div v-if="hasError" class="fixed inset-0 z-[99999] bg-slate-950/95 text-red-400 p-6 flex flex-col items-center justify-center font-mono select-none">
    <div class="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center gap-3 border-b border-red-500/20 pb-3">
        <span class="text-2xl">🚨</span>
        <div>
          <h2 class="text-sm font-bold text-red-300 tracking-wide uppercase">OmniOS Crash Diagnostic</h2>
          <p class="text-[10px] text-slate-500">Uncaught Runtime Exception Captured</p>
        </div>
      </div>
      <div class="bg-slate-950 p-4 rounded-xl text-xs text-red-200 overflow-x-auto max-h-48 border border-red-500/10">
        {{ errorMessage }}
      </div>
      <div class="flex gap-2 pt-2">
        <button @click="reloadApp" class="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow transition-colors">
          Reiniciar Sistema
        </button>
        <button @click="hasError = false" class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors">
          Ocultar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

function handleError(event: ErrorEvent) {
  hasError.value = true
  errorMessage.value = event.message || String(event)
}

function handleUnhandledRejection(event: PromiseRejectionEvent) {
  hasError.value = true
  errorMessage.value = event.reason?.message || String(event.reason)
}

onMounted(() => {
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

onUnmounted(() => {
  window.removeEventListener('error', handleError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
})

function reloadApp() {
  window.location.reload()
}
</script>
