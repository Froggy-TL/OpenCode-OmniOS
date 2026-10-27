<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans">
    <!-- Panel de Control Flotante para Probar los Portales -->
    <div class="absolute top-6 z-50 bg-slate-900/80 border border-slate-700/50 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex flex-wrap gap-3 items-center justify-center max-w-xl">
      <h1 class="text-xs font-mono text-pink-400 tracking-wider uppercase mr-2">[ Testbench de Portales ]</h1>
      <button 
        @click="triggerPortal('center')"
        class="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        Portal Central
      </button>
      <button 
        @click="triggerPortal('custom')"
        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium text-xs rounded-xl transition-all"
      >
        Portal Dinámico (Coordenadas)
      </button>
      <button 
        @click="active = false"
        class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium text-xs rounded-xl transition-all"
      >
        Cerrar Portal
      </button>
    </div>

    <!-- Instrucciones en Pantalla -->
    <div class="text-center space-y-2 opacity-50 mb-12">
      <p class="text-sm">Mueve el cursor por la pantalla para ver el efecto de profundidad (Paralaje Multicapa).</p>
      <p class="text-xs font-mono">Las olas de plasma toman automáticamente los colores del tema.</p>
    </div>

    <!-- El Componente de Materialización Dimensional (Portal) -->
    <DimensionalMaterializer 
      :active="active"
      :x="portalCoords.x"
      :y="portalCoords.y"
      :width="portalCoords.width"
      :height="portalCoords.height"
    >
      <div class="flex flex-col gap-3 min-w-[260px] max-w-sm">
        <div class="flex items-center justify-between border-b border-slate-700/50 pb-2">
          <span class="text-xs font-mono text-pink-400 font-bold">MATERIALIZER v2.0</span>
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <p class="text-sm font-medium leading-relaxed">
          ¡Hola! Este componente ha emergido a través de la brecha dimensional con éxito.
        </p>
        <div class="flex gap-2 mt-2">
          <button @click="alert('¡Acción ejecutada con éxito!')" class="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition-colors">
            Botón Funcional
          </button>
          <button @click="active = false" class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </DimensionalMaterializer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DimensionalMaterializer from '@/components/DimensionalMaterializer.vue'

const active = ref(false)
const portalCoords = ref<{ x?: number; y?: number; width?: number; height?: number }>({})

function triggerPortal(mode: 'center' | 'custom') {
  active.value = false
  setTimeout(() => {
    if (mode === 'center') {
      portalCoords.value = {} // Centrado por defecto
    } else {
      // Coordenadas aleatorias dentro de la pantalla para probar posicionamiento exacto
      portalCoords.value = {
        x: Math.random() * (window.innerWidth - 320),
        y: Math.random() * (window.innerHeight - 250) + 80,
        width: 300
      }
    }
    active.value = true
  }, 100)
}
</script>
