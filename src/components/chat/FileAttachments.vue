<template>
  <div v-if="attachments.length > 0" class="flex flex-col gap-1 p-2 border-t border-border bg-background">
    <div v-for="(att, idx) in attachments" :key="idx" class="flex items-center justify-between p-2 rounded-md bg-muted text-xs">
      <div class="flex items-center gap-2 truncate">
        <FileIcon class="h-4 w-4" />
        <span class="truncate">{{ att.name }}</span>
      </div>
      <button 
        @click="$emit('remove', idx)" 
        class="text-muted-foreground hover:text-destructive"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, File as FileIcon } from 'lucide-vue-next'
defineProps<{ attachments: { name: string }[] }>()
defineEmits(['remove'])
</script>
