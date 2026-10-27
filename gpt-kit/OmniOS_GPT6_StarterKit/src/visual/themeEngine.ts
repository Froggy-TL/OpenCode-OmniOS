export interface OmniTheme {
  id: string;
  label: string;
  tokens: Record<`--omni-${string}`, string>;
}

export const builtInThemes: OmniTheme[] = [
  {
    id: 'portal',
    label: 'Portal violeta',
    tokens: {
      '--omni-bg': '#080c22',
      '--omni-surface': 'rgba(18, 24, 57, .72)',
      '--omni-border': 'rgba(172, 153, 255, .38)',
      '--omni-pink': '#ff95e7',
      '--omni-blue': '#1390ff',
      '--omni-cyan': '#69e1ff',
      '--omni-purple': '#a66aff',
      '--omni-text': '#f4f4ff',
      '--omni-muted': '#a9b4df',
    },
  },
  {
    id: 'arctic',
    label: 'Ártico',
    tokens: {
      '--omni-bg': '#071622',
      '--omni-surface': 'rgba(10, 39, 58, .76)',
      '--omni-border': 'rgba(105, 225, 255, .4)',
      '--omni-pink': '#8cecff',
      '--omni-blue': '#438dff',
      '--omni-cyan': '#8cecff',
      '--omni-purple': '#8a9bff',
      '--omni-text': '#f1fbff',
      '--omni-muted': '#a6c6d8',
    },
  },
  {
    id: 'ember',
    label: 'Ember',
    tokens: {
      '--omni-bg': '#1b0c20',
      '--omni-surface': 'rgba(48, 18, 46, .74)',
      '--omni-border': 'rgba(255, 149, 180, .38)',
      '--omni-pink': '#ff95b4',
      '--omni-blue': '#9d8cff',
      '--omni-cyan': '#ffcf9b',
      '--omni-purple': '#d77bff',
      '--omni-text': '#fff4fa',
      '--omni-muted': '#d6afc9',
    },
  },
];

const SAFE_TOKEN = /^--omni-[a-z0-9-]+$/i;
const SAFE_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i;

/** Apply only known token names and simple color values, never arbitrary CSS. */
export function applyTheme(themeId: string, root: HTMLElement = document.documentElement): boolean {
  const theme = builtInThemes.find(item => item.id === themeId);
  if (!theme) return false;

  for (const [token, value] of Object.entries(theme.tokens)) {
    if (SAFE_TOKEN.test(token) && SAFE_VALUE.test(value)) {
      root.style.setProperty(token, value);
    }
  }
  root.dataset.omniTheme = theme.id;
  return true;
}
