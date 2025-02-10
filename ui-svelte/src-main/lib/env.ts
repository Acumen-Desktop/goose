// Environment variable constants
export const GOOSE_PROVIDER = "GOOSE_PROVIDER";
export const GOOSE_MODEL = "GOOSE_MODEL";

// Provider API Keys
export const OPENAI_API_KEY = "OPENAI_API_KEY";
export const ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY";
export const AZURE_API_KEY = "AZURE_API_KEY";
export const GOOGLE_API_KEY = "GOOGLE_API_KEY";
export const MISTRAL_API_KEY = "MISTRAL_API_KEY";

// Load environment variables from shell if in production
export async function loadShellEnv(
  isProduction: boolean = false
): Promise<void> {
  // Only proceed if running on macOS and in production mode
  if (process.platform !== "darwin" || !isProduction) {
    console.info(
      `Skipping shell environment loading: ${
        process.platform !== "darwin"
          ? "Not running on macOS"
          : "Not in production mode"
      }`
    );
    return;
  }

  try {
    console.info("Loading environment variables from shell");
    const { execSync } = await import("child_process");

    const shell = process.env.SHELL || "/bin/bash";
    const envStr = execSync(`${shell} -l -i -c 'env'`, {
      encoding: "utf-8",
    });

    // Parse and set environment variables
    envStr.split("\n").forEach((line) => {
      const matches = line.match(/^([^=]+)=(.*)$/);
      if (matches) {
        const [, key, value] = matches;
        console.info(`Setting ${key}`);
        process.env[key] = value;
      }
    });

    console.info("Successfully loaded shell environment variables");
  } catch (error) {
    console.error("Failed to load shell environment variables:", error);
  }
}

// Get all provider API keys
export function getProviderKeys(): Record<string, string | undefined> {
  return {
    [OPENAI_API_KEY]: process.env[OPENAI_API_KEY],
    [ANTHROPIC_API_KEY]: process.env[ANTHROPIC_API_KEY],
    [AZURE_API_KEY]: process.env[AZURE_API_KEY],
    [GOOGLE_API_KEY]: process.env[GOOGLE_API_KEY],
    [MISTRAL_API_KEY]: process.env[MISTRAL_API_KEY],
  };
}

// Update environment variables
export function updateEnvironmentVariables(
  envToggles: Record<string, boolean>
): void {
  Object.entries(envToggles).forEach(([key, enabled]) => {
    if (!enabled && process.env[key]) {
      delete process.env[key];
    }
  });
}
