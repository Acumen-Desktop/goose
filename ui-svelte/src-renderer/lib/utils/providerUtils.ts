import { getApiUrl, getSecretKey } from "$lib/config";

export async function initializeSystem(
  provider: string,
  model: string
): Promise<void> {
  try {
    const response = await fetch(getApiUrl("/system/initialize"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Key": getSecretKey(),
      },
      body: JSON.stringify({
        provider,
        model,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to initialize system: ${errorText}`);
    }
  } catch (error) {
    console.error("Error initializing system:", error);
    throw error;
  }
}
