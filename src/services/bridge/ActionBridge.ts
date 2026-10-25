import { Filesystem, Directory } from '@capacitor/filesystem'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Brightness } from '@capacitor-community/brightness'
import { VolumeControl } from 'capacitor-volume-control'
import { Camera } from '@capacitor/camera'
import { setStoredPrompt } from '@/services/plugin/defaultPrompt'

export const ActionBridge = {
  async execute(action: string, params: any) {
    console.log('Agent-OS Bridge:', action, params)
    
    switch (action) {
      // Hardware
      case 'hw_set_brightness': await Brightness.setBrightness({ brightness: params.value }); break
      case 'hw_set_volume': await VolumeControl.setVolume({ volume: params.value }); break
      case 'hw_haptic': await Haptics.impact({ style: ImpactStyle.Light }); break
      
      // Permissions
      case 'request_permission':
        if (params.type === 'camera') return await Camera.requestPermissions()
        if (params.type === 'filesystem') return await Filesystem.requestPermissions()
        return { error: 'Unknown permission type' }

      // Config creation by AI
      case 'config_save':
        if (params.key && params.value) {
          localStorage.setItem(`config_${params.key}`, JSON.stringify(params.value))
          if (params.key === 'agent_prompt') {
            setStoredPrompt(params.value)
          }
        }
        break

      // Dynamic Icon Alias simulation / trigger
      case 'set_app_identity':
        console.log('App identity change requested (Activity Alias):', params.theme)
        // El agente puede cambiar estilos visuales internos o disparar alertas de cambio de identidad
        break

      // UI
      case 'ui_inject_css': 
        const s = document.createElement('style'); s.innerHTML = params.css; document.head.appendChild(s); break
      case 'ui_inject_js': 
        const sc = document.createElement('script'); sc.innerHTML = params.js; document.body.appendChild(sc); break
      
      // Filesystem
      case 'fs_list': return await Filesystem.readdir({ path: params.path, directory: Directory.External })
      case 'fs_read': return await Filesystem.readFile({ path: params.path, directory: Directory.External })
      case 'fs_write': await Filesystem.writeFile({ path: params.path, data: params.data, directory: Directory.External }); break
      
      // Tools
      case 'tool_register': localStorage.setItem(`tool_${params.name}`, params.code); break
      case 'tool_run': 
        const code = localStorage.getItem(`tool_${params.name}`)
        if (code) return new Function(code)(params.args)
        break
      case 'tool_list': return Object.keys(localStorage).filter(k => k.startsWith('tool_')).map(t => t.replace('tool_', ''))
      
      default: console.warn('Unknown action:', action)
    }
  }
}

