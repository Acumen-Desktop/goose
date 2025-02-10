export const supported_providers = [
  "OpenAI",
  "Anthropic",
  "Ollama",
  "Azure OpenAI",
  "Google AI",
  "Mistral AI",
] as const;

export type Provider = (typeof supported_providers)[number];

export const provider_aliases = [
  { provider: "OpenAI", alias: "openai" },
  { provider: "Anthropic", alias: "anthropic" },
  { provider: "Ollama", alias: "ollama" },
  { provider: "Azure OpenAI", alias: "azure" },
  { provider: "Google AI", alias: "google" },
  { provider: "Mistral AI", alias: "mistral" },
] as const;

export const required_keys: Record<Provider, string[]> = {
  OpenAI: ["OPENAI_API_KEY"],
  Anthropic: ["ANTHROPIC_API_KEY"],
  Ollama: [],
  "Azure OpenAI": ["AZURE_API_KEY", "AZURE_ENDPOINT"],
  "Google AI": ["GOOGLE_API_KEY"],
  "Mistral AI": ["MISTRAL_API_KEY"],
};

export const default_models: Record<string, string> = {
  openai: "gpt-4",
  anthropic: "claude-3-opus-20240229",
  ollama: "llama2",
  azure: "gpt-4",
  google: "gemini-pro",
  mistral: "mistral-large-latest",
};

export function getDefaultModel(providerId: string): string {
  return default_models[providerId.toLowerCase()] || "unknown";
}

export function getProviderDescription(provider: Provider): string {
  const descriptions: Record<Provider, string> = {
    OpenAI: "Access GPT-4 and other powerful language models from OpenAI.",
    Anthropic: "Use Claude and other advanced AI models from Anthropic.",
    Ollama: "Run open-source models locally with Ollama.",
    "Azure OpenAI": "Enterprise-grade AI with Azure's OpenAI service.",
    "Google AI": "Access Gemini and other Google AI models.",
    "Mistral AI": "Use Mistral's powerful and efficient language models.",
  };
  return descriptions[provider];
}
