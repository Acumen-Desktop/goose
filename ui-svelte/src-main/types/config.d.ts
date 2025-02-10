export interface EnvToggles {
  VITE_DEV_SERVER_URL?: string;
  VITE_DEV?: boolean;
}

export interface Settings {
  recentDirectories: string[];
  activeExtensionId?: string;
  extensions: Record<string, boolean>;
}

export interface AppConfigAPI {
  getAll: () => any;
  get: (key: string) => string | undefined;
  getConfig: () => Promise<Settings>;
  setConfig: (settings: Settings) => Promise<void>;
  getEnv: () => Promise<EnvToggles>;
}

// Provider types
export type Provider = "openai" | "anthropic" | "azure" | "google" | "mistral";

export interface ProviderConfig {
  provider: Provider;
  apiKey: string;
  model?: string;
  options?: Record<string, unknown>;
}
