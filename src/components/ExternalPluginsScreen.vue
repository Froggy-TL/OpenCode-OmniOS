<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6 text-slate-100 font-sans">
    <!-- Cabecera -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <h1 class="text-xl font-bold tracking-wide bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
          Omni-Plugins & Extensiones Externas
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Instala scripts externos para conectar OmniOS con servicios de terceros y acciones ilimitadas.
        </p>
      </div>
      <button 
        @click="showInstallModal = true"
        class="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-95"
      >
        + Instalar Plugin
      </button>
    </div>

    <!-- Lista de Plugins Instalados -->
    <div class="space-y-3">
      <div v-if="pluginStore.plugins.length === 0" class="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
        No hay plugins externos instalados. Añade uno para dotar a OmniOS de superpoderes externos.
      </div>

      <div 
        v-for="plugin in pluginStore.plugins" 
        :key="plugin.id"
        class="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xl"
      >
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-200 truncate">{{ plugin.name }}</h2>
            <span class="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-pink-400 rounded-full">v{{ plugin.version }}</span>
          </div>
          <p class="text-xs text-slate-400 line-clamp-2">{{ plugin.description }}</p>
          <div class="flex items-center gap-2 pt-1">
            <span class="text-[10px] text-slate-500 font-mono">By: {{ plugin.author }}</span>
            <span v-for="perm in plugin.permissions" :key="perm" class="text-[9px] font-mono px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
              {{ perm }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <!-- Toggle Activar/Desactivar -->
          <button 
            @click="pluginStore.togglePlugin(plugin.id, !plugin.enabled)"
            class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300"
            :class="plugin.enabled ? 'bg-pink-500' : 'bg-slate-800'"
          >
            <div 
              class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300"
              :class="plugin.enabled ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </button>

          <!-- Botón Eliminar -->
          <button 
            @click="pluginStore.uninstallPlugin(plugin.id)"
            class="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-xs"
            title="Desinstalar Plugin"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Instalación Rápida de Plugin de Ejemplo / Personalizado -->
    <div v-if="showInstallModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl space-y-4">
        <h2 class="text-base font-bold text-slate-200">Instalar Nuevo Omni-Plugin</h2>
        
        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">ID Único</label>
            <input v-model="newPlugin.id" placeholder="ej: weather-api" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-pink-500" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Nombre del Plugin</label>
            <input v-model="newPlugin.name" placeholder="ej: OpenWeather Connector" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-pink-500" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Descripción</label>
            <input v-model="newPlugin.description" placeholder="Conecta con servicios meteorológicos externos" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-pink-500" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Código JS/TS (Ejecutado por RuntimeEngine)</label>
            <textarea v-model="newPlugin.code" rows="5" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-slate-200 outline-none focus:border-pink-500" placeholder="return async (args) => { return 'Hola desde plugin externo: ' + args.name; }"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showInstallModal = false" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs">
            Cancelar
          </button>
          <button @click="handleInstall" class="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-xl font-semibold text-xs shadow">
            Instalar y Activar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useExternalPluginStore } from '@/stores/externalPluginStore'

const pluginStore = useExternalPluginStore()
const showInstallModal = ref(false)

const newPlugin = ref({
  id: '',
  name: '',
  description: '',
  version: '1.0.0',
  author: 'Community',
  code: 'return async (args) => {\n  // Escribe tu código aquí\n  return { status: "success", result: "Acción externa ejecutada" };\n}',
  permissions: ['net', 'tool']
})

onMounted(() => {
  pluginStore.loadPlugins()
})

function handleInstall() {
  if (!newPlugin.value.id || !newPlugin.value.name) return
  pluginStore.installPlugin({
    id: newPlugin.value.id,
    name: newPlugin.value.name,
    description: newPlugin.value.description,
    version: newPlugin.value.version,
    author: newPlugin.value.author,
    code: newPlugin.value.code,
    permissions: newPlugin.value.permissions
  })
  showInstallModal.value = false
  // Reset
  newPlugin.value.id = ''
  newPlugin.value.name = ''
  newPlugin.value.description = ''
}
</script>
