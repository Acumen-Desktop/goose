export function getApiUrl(path: string): string {
  const config = window.electron.getConfig();
  const baseUrl = `${config.GOOSE_API_HOST}:${config.GOOSE_PORT}`;
  return `${baseUrl}${path}`;
}

export function getSecretKey(): string {
  const config = window.electron.getConfig();
  return config.secretKey;
}
