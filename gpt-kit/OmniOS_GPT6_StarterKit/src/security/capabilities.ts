import { computed, ref } from 'vue';
import type { CapabilityDescriptor } from '../types/omnios';

const initialCapabilities: CapabilityDescriptor[] = [
  {
    id: 'ui.read',
    label: 'Leer estado de la interfaz',
    description: 'Consultar rutas y componentes registrados.',
    risk: 'read', requiresConfirmation: false, available: true,
  },
  {
    id: 'ui.modify',
    label: 'Modificar la interfaz',
    description: 'Cambiar temas y crear componentes dentro de zonas permitidas.',
    risk: 'write', requiresConfirmation: true, available: true,
  },
  {
    id: 'files.read',
    label: 'Leer archivos del proyecto',
    description: 'Requiere un adaptador con alcance limitado a carpetas autorizadas.',
    risk: 'read', requiresConfirmation: false, available: false,
    unavailableReason: 'Conecta el adaptador de archivos y define sus carpetas permitidas.',
  },
  {
    id: 'code.execute',
    label: 'Ejecutar código',
    description: 'Solo en un entorno aislado y con límites definidos.',
    risk: 'sensitive', requiresConfirmation: true, available: false,
    unavailableReason: 'No hay un ejecutor aislado conectado.',
  },
];

const capabilities = ref<CapabilityDescriptor[]>(initialCapabilities.map(item => ({ ...item })));
const granted = ref(new Set<string>());

export function useCapabilities() {
  const available = computed(() => capabilities.value.filter(item => item.available));

  function updateAvailability(id: string, isAvailable: boolean, reason?: string) {
    capabilities.value = capabilities.value.map(item =>
      item.id === id
        ? { ...item, available: isAvailable, unavailableReason: isAvailable ? undefined : reason }
        : item,
    );
    if (!isAvailable) granted.value.delete(id);
  }

  function grant(id: string, userConfirmed: boolean) {
    const capability = capabilities.value.find(item => item.id === id);
    if (!capability?.available) return false;
    if (capability.requiresConfirmation && !userConfirmed) return false;
    granted.value.add(id);
    return true;
  }

  function revoke(id: string) {
    granted.value.delete(id);
  }

  function canUse(id: string) {
    return capabilities.value.some(item => item.id === id && item.available) && granted.value.has(id);
  }

  return { capabilities, available, updateAvailability, grant, revoke, canUse };
}
