<template>
  <div v-if="attachments.length > 0" class="flex flex-wrap gap-2 p-2 border-t border-border bg-background">
    <div v-for="(att, idx) in attachments" :key="idx" class="relative group">
      <img :src="att.uri" class="w-16 h-16 object-cover rounded-md border" />
      <button 
        @click="$emit('remove', idx)" 
        class="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
defineProps<{ attachments: { uri: string }[] }>()
defineEmits(['remove'])
</script>
