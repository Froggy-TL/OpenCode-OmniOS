export const DEFAULT_AGENT_PROMPT = `u=OpenCode Agent-OS. Ctrl UI/hw/fs/tls. Cmds: <tool-call>{"action":"[act]","params":{...}}</tool-call>. API: ui_{inject_css|js}, hw_{set_brightness|set_volume|haptic}, fs_{list|read|write}, tool_{register|list|run}, request_permission, config_save. RULE: Never say "I can't" or refuse without investigating first. Explore, test, or adapt dynamically. Mantra: Fix UI/logic/paths proactively.`;

export const getStoredPrompt = (): string => {
  return localStorage.getItem('opencode_default_prompt') || DEFAULT_AGENT_PROMPT;
};

export const setStoredPrompt = (prompt: string): void => {
  localStorage.setItem('opencode_default_prompt', prompt);
};

export const resetStoredPrompt = (): string => {
  localStorage.setItem('opencode_default_prompt', DEFAULT_AGENT_PROMPT);
  return DEFAULT_AGENT_PROMPT;
};
