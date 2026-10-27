<template>
  <div class="fixed inset-0 pointer-events-none z-[100] overflow-hidden" @mousemove="handleMouseMove">
    <!-- Fase de Preparación / Pulso de cálculo previo (Línea de energía adaptativa) -->
    <div 
      v-if="preparing" 
      class="absolute border rounded-2xl animate-pulse shadow-lg transition-all duration-300 backdrop-blur-md"
      :style="[portalStyle, { borderColor: currentPalette.primary, boxShadow: `0 0 25px ${currentPalette.primary}66` }]"
    >
      <div class="absolute inset-0 bg-gradient-to-r rounded-2xl flex items-center justify-center" :style="{ background: `linear-gradient(to right, ${currentPalette.primary}1A, ${currentPalette.accent}1A)` }">
        <span class="text-[10px] font-mono animate-ping tracking-widest uppercase" :style="{ color: currentPalette.primary }">
          {{ status === 'thinking' ? 'AI Processing...' : status === 'error' ? 'Anomaly Detected!' : 'Materializing Space...' }}
        </span>
      </div>
    </div>

    <!-- Brecha Dimensional Activa con Degradados en Vivo -->
    <transition
      enter-active-class="transition-all duration-900 cubic-bezier(0.16, 1, 0.3, 1)"
      enter-from-class="opacity-0 scale-40 blur-3xl rotate-6"
      enter-to-class="opacity-100 scale-100 blur-0 rotate-0"
      leave-active-class="transition-all duration-500 cubic-bezier(0.4, 0, 1, 1)"
      leave-from-class="opacity-100 scale-100 blur-0"
      leave-to-class="opacity-0 scale-125 blur-3xl rotate-[-6deg]"
      @after-leave="$emit('closed')"
    >
      <div
        v-if="active && !preparing"
        class="absolute dimensional-portal rounded-2xl transition-all duration-700"
        :style="[portalStyle, portalGlowStyle]"
      >
        <!-- EFECTO RAYOS DE SOL (GOD SHAFTS) DINÁMICOS -->
        <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
          <div class="absolute -inset-32 flex items-center justify-center animate-sunburst opacity-70">
            <div 
              class="w-[700px] h-[700px] bg-gradient-conic from-transparent via-current to-transparent opacity-40 blur-3xl transition-colors duration-700"
              :style="{ color: currentPalette.primary }"
            ></div>
          </div>
          <!-- Rayos de luz volumétrica adaptativos -->
          <div 
            class="absolute inset-0 bg-gradient-to-tr opacity-25 animate-pulse mix-blend-screen transition-all duration-700"
            :style="{ backgroundImage: `linear-gradient(to top right, ${currentPalette.primary}33, transparent, ${currentPalette.accent}4D)` }"
          ></div>
        </div>

        <!-- PARTÍCULAS FLOTANTES DINÁMICAS -->
        <div class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-1">
          <div class="absolute w-1.5 h-1.5 rounded-full animate-particle-1 left-1/4 bottom-0 opacity-80" :style="{ backgroundColor: currentPalette.primary, boxShadow: `0 0 8px ${currentPalette.primary}` }"></div>
          <div class="absolute w-2 h-2 rounded-full animate-particle-2 left-2/3 bottom-0 opacity-70" :style="{ backgroundColor: currentPalette.accent, boxShadow: `0 0 10px ${currentPalette.accent}` }"></div>
          <div class="absolute w-1 h-1 rounded-full animate-particle-3 left-1/2 bottom-0 opacity-90" :style="{ backgroundColor: currentPalette.glow, boxShadow: `0 0 6px ${currentPalette.glow}` }"></div>
        </div>

        <!-- FONDO DE OLAS DEFORMADAS Y PLASMA EN VIVO -->
        <div class="absolute inset-0 overflow-hidden rounded-2xl opacity-90 pointer-events-none z-2">
          <svg class="absolute w-[250%] h-[250%] -left-3/4 -top-3/4 animate-plasma-wave opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
            <defs>
              <linearGradient id="live-plasma-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :stop-color="currentPalette.primary" />
                <stop offset="50%" :stop-color="currentPalette.accent" />
                <stop offset="100%" :stop-color="currentPalette.secondary" />
              </linearGradient>
            </defs>
            <path fill="url(#live-plasma-grad)" d="M417.5,310Q420,320,432.5,335Q445,350,430,364.5Q415,379,397.5,389.5Q380,400,365,391.5Q350,383,337.5,379.5Q325,376,315,363Q305,350,311,333.5Q317,317,331,304.5Q345,292,362.5,293.5Q380,295,400,297.5Q420,300,417.5,310Z"></path>
          </svg>
          <div class="absolute inset-0 bg-[#0c0a1d]/75 backdrop-blur-2xl"></div>
        </div>

        <!-- CONTENIDO MULTICAPA CON PARALAJE -->
        <div class="relative z-10 p-6 flex flex-col gap-3 pointer-events-auto">
          <!-- Capa Fondo -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-30" :style="getLayerStyle(0.2)">
            <div class="absolute -top-10 -left-10 w-44 h-44 rounded-full blur-2xl animate-pulse transition-colors duration-700" :style="{ backgroundColor: `${currentPalette.primary}66` }"></div>
          </div>

          <!-- Capa Media (Contenido Principal) -->
          <div class="relative z-25 transition-transform duration-100 ease-out" :style="getLayerStyle(0.5)">
            <slot />
          </div>

          <!-- Capa Primer Plano -->
          <div class="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 transition-colors duration-700" :style="[getLayerStyle(0.8), { color: `${currentPalette.primary}AA` }]">
            <span class="w-1.5 h-1.5 rounded-full animate-ping" :style="{ backgroundColor: currentPalette.primary }"></span>
            [{{ status?.toUpperCase() || 'NORMAL' }} // Space: {{ spaceId ?? 'global' }}]
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  active: boolean
  status?: 'normal' | 'thinking' | 'success' | 'error'
  spaceId?: string | number
  x?: number
  y?: number
  width?: number
  height?: number
}>()

const preparing = ref(false)

const palettes = {
  normal: {
    primary: 'var(--omni-primary, #FF95E7)',
    accent: 'var(--omni-accent, #1390FF)',
    secondary: 'var(--omni-secondary, #9333ea)',
    glow: 'var(--omni-glow, #f472b6)'
  },
  thinking: {
    primary: 'var(--omni-thinking-1, #a855f7)',
    accent: 'var(--omni-thinking-2, #3b82f6)',
    secondary: 'var(--omni-thinking-3, #ec4899)',
    glow: '#c084fc'
  },
  success: {
    primary: 'var(--omni-success-1, #10b981)',
    accent: 'var(--omni-success-2, #06b6d4)',
    secondary: '#3b82f6',
    glow: '#34d399'
  },
  error: {
    primary: 'var(--omni-error-1, #ef4444)',
    accent: 'var(--omni-error-2, #f97316)',
    secondary: '#dc2626',
    glow: '#f87171'
  }
}

const currentPalette = computed(() => {
  return palettes[props.status || 'normal']
})

watch(() => props.active, (newVal) => {
  if (newVal) {
    preparing.value = true
    setTimeout(() => {
      preparing.value = false
    }, 350)
  } else {
    preparing.value = false
  }
})

const mouseX = ref(0)
const mouseY = ref(0)

function handleMouseMove(e: MouseEvent) {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  mouseX.value = (e.clientX - centerX) / centerX
  mouseY.value = (e.clientY - centerY) / centerY
}

const portalStyle = computed(() => {
  if (props.x !== undefined && props.y !== undefined) {
    return {
      left: `${props.x}px`,
      top: `${props.y}px`,
      width: props.width ? `${props.width}px` : 'auto',
      height: props.height ? `${props.height}px` : 'auto',
    }
  }
  return {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '280px'
  }
})

const portalGlowStyle = computed(() => {
  const p = currentPalette.value
  return {
    background: '#121024',
    border: `1.5px solid ${p.primary}66`,
    boxShadow: `0 0 40px ${p.primary}55, 0 0 80px ${p.accent}40, inset 0 0 30px ${p.primary}33`
  }
})

function getLayerStyle(depth: number) {
  return {
    transform: `translate(${mouseX.value * depth * 25}px, ${mouseY.value * depth * 25}px)`
  }
}
</script>

<style scoped>
@keyframes plasmaWave {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); }
  33% { transform: translate(-40px, 25px) rotate(120deg) scale(1.15); }
  66% { transform: translate(25px, -40px) rotate(240deg) scale(0.9); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
}

@keyframes sunburstSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes floatParticle1 {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-180px) translateX(25px); opacity: 0; }
}

@keyframes floatParticle2 {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  50% { opacity: 0.7; }
  100% { transform: translateY(-200px) translateX(-30px); opacity: 0; }
}

@keyframes floatParticle3 {
  0% { transform: translateY(0px) translateX(0px); opacity: 0; }
  50% { opacity: 0.9; }
  100% { transform: translateY(-160px) translateX(15px); opacity: 0; }
}

.animate-plasma-wave {
  animation: plasmaWave 10s infinite linear;
}

.animate-sunburst {
  animation: sunburstSpin 20s infinite linear;
}

.animate-particle-1 { animation: floatParticle1 4s infinite ease-in-out; }
.animate-particle-2 { animation: floatParticle2 5s infinite ease-in-out 1s; }
.animate-particle-3 { animation: floatParticle3 3.5s infinite ease-in-out 0.5s; }
</style>
