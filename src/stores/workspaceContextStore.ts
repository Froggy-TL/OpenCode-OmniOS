
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface FolderShortcut {
  id: string
  alias: string
  path: string
  description?: string
}

export const useWorkspaceContextStore = defineStore('workspaceContext', () => {
  const shortcuts = ref<FolderShortcut[]>([])

  const addShortcut = (shortcut: FolderShortcut) => {
    shortcuts.value.push(shortcut)
  }

  const removeShortcut = (id: string) => {
    shortcuts.value = shortcuts.value.filter(s => s.id !== id)
  }

  return { shortcuts, addShortcut, removeShortcut }
})
