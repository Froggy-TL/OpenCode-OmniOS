export type HealthState = 'unknown' | 'checking' | 'online' | 'offline' | 'error';

export interface ServerTarget {
  id: string;
  name: string;
  baseUrl: string;
}

export interface ServerHealth {
  state: HealthState;
  checkedAt: number | null;
  latencyMs: number | null;
  message?: string;
}

export type MotionPreset =
  | 'portal'
  | 'fade-up'
  | 'glass-sweep'
  | 'soft-pulse'
  | 'none';

export interface MaterializationRequest {
  id: string;
  label: string;
  preset: MotionPreset;
  /** Optional CSS selector of a known, app-owned anchor. */
  anchor?: string;
  durationMs?: number;
}

export type CapabilityRisk = 'read' | 'write' | 'sensitive';

export interface CapabilityDescriptor {
  id: string;
  label: string;
  description: string;
  risk: CapabilityRisk;
  requiresConfirmation: boolean;
  available: boolean;
  unavailableReason?: string;
}

export type DeclarativeAction =
  | { type: 'navigate'; route: string }
  | { type: 'notify'; message: string }
  | { type: 'set-theme'; themeId: string };

export interface ActionResult {
  ok: boolean;
  message: string;
}
