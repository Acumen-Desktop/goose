import { getApiUrl, getSecretKey } from "$lib/config";
import { supported_providers, required_keys } from "$lib/config/providers";

export async function getActiveProviders(): Promise<string[]> {
  const activeProviders: string[] = [];

  for (const provider of supported_providers) {
    const keys = required_keys[provider];
    if (keys.length === 0) {
      // Provider doesn't require keys (e.g., Ollama)
      activeProviders.push(provider);
      continue;
    }

    let isConfigured = true;
    for (const key of keys) {
      try {
        const response = await fetch(getApiUrl(`/configs/get?key=${key}`), {
          headers: {
            "X-Secret-Key": getSecretKey(),
          },
        });

        if (!response.ok) {
          isConfigured = false;
          break;
        }

        const data = await response.json();
        if (!data.value) {
          isConfigured = false;
          break;
        }
      } catch (error) {
        console.error(
          `Error checking key ${key} for provider ${provider}:`,
          error
        );
        isConfigured = false;
        break;
      }
    }

    if (isConfigured) {
      activeProviders.push(provider);
    }
  }

  return activeProviders;
}

export function isSecretKey(key: string): boolean {
  const secretKeyPatterns = [
    /api[-_]?key/i,
    /secret[-_]?key/i,
    /token/i,
    /password/i,
    /credential/i,
  ];
  return secretKeyPatterns.some((pattern) => pattern.test(key));
}
