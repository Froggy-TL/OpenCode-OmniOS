import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppConfig {
  theme: {
    primaryGradient: string;
    secondaryGradient: string;
    borderRadius: string;
    fontFamily: string;
  };
  customAssets: Record<string, string>;
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<AppConfig>({
    theme: {
      primaryGradient: 'linear-gradient(135deg, #FF95E7, #1390FF)',
      secondaryGradient: 'linear-gradient(to bottom, rgba(19, 144, 255, 0.2), transparent)',
      borderRadius: '24px',
      fontFamily: 'Geist, sans-serif'
    },
    customAssets: {}
  })

  function exportConfig() {
    return JSON.stringify(config.value, null, 2)
  }

  function importConfig(jsonString: string) {
    config.value = JSON.parse(jsonString)
  }

  return { config, exportConfig, importConfig }
})
