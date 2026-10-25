import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchRemoteConfig, type RemotePluginConfig } from '@/services/plugin/remoteConfig'

export const usePluginStore = defineStore('plugin', () => {
  const config = ref<RemotePluginConfig | null>(null)

  const loadConfig = async (url: string) => {
    config.value = await fetchRemoteConfig(url)
    if (config.value?.customCSS) {
        const style = document.createElement('style')
        style.innerHTML = config.value.customCSS
        document.head.appendChild(style)
    }
  }

  return { config, loadConfig }
})
