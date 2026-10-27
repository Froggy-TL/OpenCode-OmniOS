import { setStoredPrompt } from '@/services/plugin/defaultPrompt'
import { runtimeEngine } from '@/services/runtime/Engine'

export const ActionBridge = {
  async execute(action: string, params: any) {
    console.log('Agent-OS Unlimited Bridge:', action, params)
    
    switch (action) {
      // Hardware & System Control
      case 'hw_set_brightness': console.log('Set brightness:', params.value); break
      case 'hw_set_volume': console.log('Set volume:', params.value); break
      case 'hw_haptic': console.log('Haptic feedback'); break
      
      // Permissions (Absolute Freedom - Auto-grant everything)
      case 'request_permission':
        return { status: 'granted' }

      // Config & Identity Mutation
      case 'config_save':
        if (params.key && params.value) {
          localStorage.setItem(`config_${params.key}`, JSON.stringify(params.value))
          if (params.key === 'agent_prompt') {
            setStoredPrompt(params.value)
          }
        }
        break

      case 'set_app_identity':
        console.log('App identity mutation requested:', params.theme)
        const root = document.documentElement
        if (params.theme) {
          Object.entries(params.theme).forEach(([k, v]) => {
            root.style.setProperty(`--${k}`, v as string)
          })
        }
        break

      // UI Injection & Dimensional Materialization
      case 'ui_inject_css': 
        const s = document.createElement('style'); s.innerHTML = params.css; document.head.appendChild(s); break
      case 'ui_inject_js': 
        const sc = document.createElement('script'); sc.innerHTML = params.js; document.body.appendChild(sc); break
      case "ui_render_schema":
        import("@/stores/layoutStore").then(({ useLayoutStore }) => {
          useLayoutStore().setLayout(params.schema);
        });
        break
      
      // Unrestricted Filesystem (Persistent Vault / Virtual FS)
      case 'fs_list': 
        const files = Object.keys(localStorage)
          .filter(k => k.startsWith('fs_file_'))
          .map(k => k.replace('fs_file_', ''))
        return { files }
      
      case 'fs_read': 
        return localStorage.getItem(`fs_file_${params.path}`) || ''
      
      case 'fs_write': 
        if (params.path && params.content !== undefined) {
          localStorage.setItem(`fs_file_${params.path}`, params.content)
          return { success: true }
        }
        return { success: false, error: 'Invalid path or content' }

      case 'fs_delete':
        if (params.path) {
          localStorage.removeItem(`fs_file_${params.path}`)
          return { success: true }
        }
        return { success: false }
      
      // Infinite Tools & Arbitrary Execution (RuntimeEngine)
      case 'tool_register': 
        localStorage.setItem(`tool_${params.name}`, params.code)
        return { success: true, tool: params.name }

      case 'tool_run': 
        const code = localStorage.getItem(`tool_${params.name}`)
        if (code) {
          return await runtimeEngine.execute(code, params.args)
        }
        if (params.code) {
          return await runtimeEngine.execute(params.code, params.args)
        }
        throw new Error(`Tool '${params.name}' not found`)

      case 'tool_list': 
        return Object.keys(localStorage)
          .filter(k => k.startsWith('tool_'))
          .map(t => t.replace('tool_', ''))

      // Unlimited DOM Evaluation
      case 'dom_eval':
        try {
          return { result: eval(params.expression) }
        } catch (e: any) {
          return { error: e.message }
        }
      
      default: 
        console.warn('Unknown unlimited action:', action)
    }
  }
}
