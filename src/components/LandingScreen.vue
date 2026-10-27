<template>
  <div
    ref="pullContainerRef"
    class="min-h-dvh flex flex-col px-6 overflow-y-auto relative bg-[#070514] text-slate-100 select-none"
    @touchstart="pull.onTouchStart"
    @touchmove="pull.onTouchMove"
    @touchend="pull.onTouchEnd"
  >
    <!-- FONDO ESPACIAL EXACTO AL ARTE DE GPT -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#b833a0]/35 via-[#632080]/15 to-transparent blur-[80px] rounded-full"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-t from-[#0ea5e9]/25 via-[#0369a1]/10 to-transparent blur-[90px] rounded-full"></div>
      <div class="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center relative z-10" :style="pullContentStyle">
      <svg
        ref="svgRef"
        viewBox="0 0 48 48"
        class="absolute left-1/2 -translate-x-1/2 pointer-events-none text-muted-foreground top-[17px]"
        style="width:0;height:0;opacity:0"
        :class="{ 'animate-spin': pull.isSpinning }"
        alt=""
      >
        <path fill="currentColor" d="m36.565 14.114-3.145 2.471a12.02 12.02 0 0 1 2.058 10.912c-.934 3.066-3.005 5.586-5.833 7.095s-6.076 1.824-9.141.893c-6.33-1.927-9.913-8.644-7.987-14.974a11.924 11.924 0 0 1 5.832-7.095 11.914 11.914 0 0 1 6.767-1.361l-3.531 3.531 2.828 2.828L32.828 10l-8.414-8.414-2.828 2.828 3.645 3.645a15.876 15.876 0 0 0-8.764 1.828 15.89 15.89 0 0 0-7.775 9.46C6.123 27.786 10.9 36.742 19.341 39.31a16.03 16.03 0 0 0 4.678.701c2.591 0 5.159-.637 7.51-1.891a15.895 15.895 0 0 0 7.776-9.46 16.015 16.015 0 0 0-2.74-14.546z"/>
      </svg>
      <div class="w-full max-w-sm flex flex-col items-center gap-6">
        <div class="text-center mb-12 mt-12">
          <div class="flex flex-col items-center gap-3 mb-6">
            <!-- Icono con degradado translúcido por encima mediante overlay -->
            <div class="relative w-16 h-16 flex items-center justify-center">
              <img src="/icon-mask.png" alt="OmniOS Icon" class="h-16 w-16 object-contain filter drop-shadow-[0_0_15px_rgba(255,149,231,0.5)]" />
              <div class="absolute inset-0 bg-gradient-to-tr from-[#FF95E7]/50 via-[#1390FF]/30 to-transparent mix-blend-color-dodge pointer-events-none rounded-xl"></div>
            </div>
            
            <div class="flex flex-col items-center gap-1.5 mt-2">
              <!-- OpenCode con degradado sutil por encima -->
              <div class="relative inline-block">
                <img src="/opencode-mask.png" alt="OpenCode" class="h-5 object-contain filter brightness-125" />
                <div class="absolute inset-0 bg-gradient-to-r from-[#1390FF] to-[#FF95E7] mix-blend-color-dodge opacity-80 pointer-events-none"></div>
              </div>
              <!-- OmniOS con degradado sutil por encima -->
              <div class="relative inline-block">
                <img src="/omnios-mask.png" alt="OmniOS" class="h-6 object-contain filter brightness-125" />
                <div class="absolute inset-0 bg-gradient-to-r from-[#FF95E7] via-[#1390FF] to-[#9333ea] mix-blend-color-dodge opacity-80 pointer-events-none"></div>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400 tracking-wide font-sans mt-1">{{ t('landing.tagline') }}</p>
        </div>

        <Card v-if="defaultProfile" class="cursor-pointer" @click="connectDefault" tabindex="0" @keydown.enter="connectDefault">
          <CardContent class="flex items-center gap-2.5">
            <StatusDot :status="statusForDot" />
            <div class="flex-1 min-w-0">
              <CardTitle class="text-sm">{{ defaultProfile.name }}</CardTitle>
              <CardDescription class="text-xs break-all">{{ sanitizeUrl(defaultProfile.baseUrl) }}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" @click.stop="connectDefault" :title="t('landing.connect')"><Play class="fill-current size-3" /></Button>
          </CardContent>
          <CardFooter class="text-xs text-muted-foreground pt-[4.7px] pb-3">
            {{ stateLabel }}
          </CardFooter>
        </Card>

        <Card
          v-else
          class="w-full cursor-pointer"
          @click="addServer"
          tabindex="0"
          @keydown.enter="addServer"
        >
          <CardContent class=" text-center">
            <p class="text-sm text-muted-foreground">{{ t('landing.noServer') }}</p>
          </CardContent>
        </Card>

        <div class="w-full flex flex-col gap-0">
          <Button
            v-if="defaultProfile && canConnect"
            size="lg"
            class="w-full"
            @click="connectDefault"
          >
            {{ defaultProfile.authEnabled ? t('landing.connectSignIn') : t('landing.connect') }}
          </Button>
          <Button variant="outline" @click="addServer" class="mb-8">
            {{ defaultProfile ? t('landing.addAnother') : t('landing.addServer') }}
          </Button>
          <Button variant="ghost" @click="manageServers">
            {{ t('landing.manageServers') }}
          </Button>
          <Button variant="ghost" @click="openSettings">
            {{ t('common.settings') }}
          </Button>
        </div>
      </div>
    </div>

    <div class="flex justify-center pb-6">
      <Button variant="ghost" class="text-muted-foreground" @click="openHelp">
        {{ t('common.help') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Play } from '@lucide/vue'
import { useServerStore } from '@/stores/serverStore'
import { useConnectionStore } from '@/stores/connectionStore'
import { sanitizeUrlForDisplay } from '@/services/opencode/url'
import { configureSystemBars } from '@/services/platform/systemBars'
import { useServerHealthPoll } from '@/composables/useServerHealthPoll'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import StatusDot from './StatusDot.vue'
import { useI18n } from '@/i18n'

const router = useRouter()
const serverStore = useServerStore()
const connectionStore = useConnectionStore()
const { t } = useI18n()

const poll = useServerHealthPoll()

const pullContainerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)

const pull = usePullToRefresh(pullContainerRef, svgRef, () => {
  poll.pollNow()
})

const pullContentStyle = computed(() => {
  if (pull.offsetPx.value <= 0) return {}
  return { transform: `translate3d(0, ${pull.offsetPx.value}px, 0)` }
})

const defaultProfile = computed(() => serverStore.defaultProfile)

const statusForDot = computed(() => {
  if (!defaultProfile.value) return 'unknown'
  const ls = defaultProfile.value.lastStatus
  if (ls === 'auth_required' || ls === 'wrong_credentials') return ls
  const r = serverStore.reachable[defaultProfile.value.id]
  return r === true ? 'online' : r === false ? 'offline' : 'checking'
})

const canConnect = computed(() => !!defaultProfile.value)

const stateLabel = computed(() => {
  if (!defaultProfile.value) return ''
  const ls = defaultProfile.value.lastStatus
  if (ls === 'auth_required') return t('status.authRequired')
  if (ls === 'wrong_credentials') return t('status.wrongCredentials')
  const r = serverStore.reachable[defaultProfile.value.id]
  if (r === true) {
    if (defaultProfile.value.id === connectionStore.lastWebviewServerId) return t('status.connected')
    return t('status.ready')
  }
  return r === false ? t('status.offline') : t('status.checking')
})

function sanitizeUrl(url: string): string { return sanitizeUrlForDisplay(url) }

onMounted(async () => {
  await serverStore.load()
  poll.pollNow()
  configureSystemBars()
  
})

onUnmounted(() => {
  pull.cleanup()
})

async function connectDefault(): Promise<void> { if (defaultProfile.value) router.push(`/connect/${defaultProfile.value.id}`) }
function addServer(): void { router.push('/servers/new') }
function manageServers(): void { router.push('/servers') }
function openSettings(): void { router.push('/settings') }
function openHelp(): void { router.push('/help') }
</script>
