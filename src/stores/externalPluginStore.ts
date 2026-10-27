import { defineStore } from 'pinia'
import { ref } from 'vue'
import { runtimeEngine } from '@/services/runtime/Engine'

export interface ExternalPlugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  enabled: boolean
  code: string // Código JS/TS que se ejecuta en el RuntimeEngine
  permissions: string[] // ['net', 'fs', 'ui', 'hw']
}

export const useExternalPluginStore = defineStore('externalPlugins', () => {
  const plugins = ref<ExternalPlugin[]>([])

  // Cargar plugins guardados al iniciar
  function loadPlugins() {
    try {
      const saved = localStorage.getItem('omni_external_plugins')
      if (saved) {
        plugins.value = JSON.parse(saved)
        // Registrar y activar los plugins habilitados
        plugins.value.forEach(plugin => {
          if (plugin.enabled) {
            activatePlugin(plugin)
          }
        })
      }
    } catch (e) {
      console.error('Failed to load external plugins:', e)
    }
  }

  // Guardar plugins
  function savePlugins() {
    localStorage.setItem('omni_external_plugins', JSON.stringify(plugins.value))
  }

  // Instalar un plugin externo nuevo
  function installPlugin(plugin: Omit<ExternalPlugin, 'enabled'>) {
    const existingIndex = plugins.value.findIndex(p => p.id === plugin.id)
    const newPlugin: ExternalPlugin = { ...plugin, enabled: true }
    
    if (existingIndex >= 0) {
      plugins.value[existingIndex] = newPlugin
    } else {
      plugins.value.push(newPlugin)
    }
    savePlugins()
    activatePlugin(newPlugin)
  }

  // Activar / Registrar el plugin en el ActionBridge y RuntimeEngine
  async function activatePlugin(plugin: ExternalPlugin) {
    try {
      // Registrar herramienta ejecutable en el runtime
      localStorage.setItem(`tool_plugin_${plugin.id}`, plugin.code)
      console.log(`[Omni-Plugin] External plugin activated: ${plugin.name} (${plugin.id})`)
    } catch (e) {
      console.error(`Failed to activate plugin ${plugin.id}:`, e)
    }
  }

  // Desactivar plugin
  function togglePlugin(id: string, enabled: boolean) {
    const p = plugins.value.find(plugin => plugin.id === id)
    if (p) {
      p.enabled = enabled
      savePlugins()
      if (!enabled) {
        localStorage.removeItem(`tool_plugin_${id}`)
      } else {
        activatePlugin(p)
      }
    }
  }

  // Eliminar plugin
  function uninstallPlugin(id: string) {
    plugins.value = plugins.value.filter(p => p.id !== id)
    localStorage.removeItem(`tool_plugin_${id}`)
    savePlugins()
  }

  // Ejecutar una función del plugin externo
  async function runPluginAction(id: string, args: any) {
    const code = localStorage.getItem(`tool_plugin_${id}`)
    if (code) {
      return await runtimeEngine.execute(code, args)
    }
    throw new Error(`External plugin '${id}' not found or disabled`)
  }

  return {
    plugins,
    loadPlugins,
    installPlugin,
    togglePlugin,
    uninstallPlugin,
    runPluginAction
  }
})
