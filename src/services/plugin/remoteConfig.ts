export interface RemotePluginConfig {
  customCSS?: string;
  extraFeatures?: {
    [key: string]: boolean;
  };
}

export const fetchRemoteConfig = async (url: string): Promise<RemotePluginConfig | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch remote config", error);
    return null;
  }
};
