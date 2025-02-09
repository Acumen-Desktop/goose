<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";

  let { data }: { data: PageData } = $props();
  let serverStatus = $state("Checking...");
  let debugInfo = $state({
    config: null as null | Record<string, any>,
    startTime: new Date().toISOString(),
    connectionAttempts: 0,
    lastError: null as null | string,
    lastResponse: null as null | unknown,
    electronAvailable: false,
    appConfigAvailable: false,
  });

  async function checkServer() {
    try {
      // First check if window.electron is available
      debugInfo.electronAvailable =
        typeof window.electron?.getConfig === "function";
      debugInfo.appConfigAvailable =
        typeof window.appConfig?.getAll === "function";

      if (!debugInfo.electronAvailable && !debugInfo.appConfigAvailable) {
        throw new Error(
          "Neither Electron nor AppConfig APIs are available - waiting for initialization"
        );
      }

      // Try both APIs for redundancy
      const config = debugInfo.electronAvailable
        ? window.electron.getConfig()
        : window.appConfig.getAll();

      debugInfo.config = config;
      debugInfo.connectionAttempts++;

      console.log("Checking server with config:", config);

      if (!config.GOOSE_PORT) {
        throw new Error("No port configured");
      }

      const response = await fetch(
        `http://127.0.0.1:${config.GOOSE_PORT}/status`
      );

      const responseData = await response.json();
      debugInfo.lastResponse = responseData;

      if (response.ok) {
        serverStatus = "Connected to Goose server!";
        console.log("Server connected successfully:", responseData);
      } else {
        serverStatus = "Server responded but status not OK";
        console.warn("Server response not OK:", response.status, responseData);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Server connection error:", error);
      serverStatus = `Failed to connect to server: ${error.message}`;
      debugInfo.lastError = error.message;
    }
  }

  onMount(() => {
    console.log("Component mounted, checking server...");
    void checkServer();

    // Retry every 5 seconds if not connected
    const interval = setInterval(() => {
      if (!serverStatus.includes("Connected")) {
        window.logInfo(
          `[Server] Attempting to reconnect... (Attempt ${debugInfo.connectionAttempts + 1})`
        );
        void checkServer();
      }
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<div
  class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8"
>
  <h1 class="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
    Goose AI
  </h1>
  <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
    Welcome to the Svelte UI
  </p>

  <!-- Server Status -->
  <div
    class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mb-8"
  >
    <p class="text-gray-700 dark:text-gray-200 text-xl font-semibold mb-2">
      Server Status: <span
        class={serverStatus.includes("Connected")
          ? "text-green-500"
          : "text-red-500"}>{serverStatus}</span
      >
    </p>
  </div>

  <!-- Debug Information -->
  <div
    class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl"
  >
    <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      Debug Information
    </h2>

    <div class="space-y-4 font-mono text-sm">
      <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 class="text-gray-600 dark:text-gray-400">APIs Available</h3>
        <p class="text-gray-800 dark:text-gray-200">
          Electron API: {debugInfo.electronAvailable ? "Yes" : "No"}<br />
          AppConfig API: {debugInfo.appConfigAvailable ? "Yes" : "No"}
        </p>
      </div>

      <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 class="text-gray-600 dark:text-gray-400">Start Time</h3>
        <p class="text-gray-800 dark:text-gray-200">{debugInfo.startTime}</p>
      </div>

      <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
        <h3 class="text-gray-600 dark:text-gray-400">Connection Attempts</h3>
        <p class="text-gray-800 dark:text-gray-200">
          {debugInfo.connectionAttempts}
        </p>
      </div>

      {#if debugInfo.config}
        <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 class="text-gray-600 dark:text-gray-400">Configuration</h3>
          <pre
            class="text-gray-800 dark:text-gray-200 overflow-x-auto">{JSON.stringify(
              debugInfo.config,
              null,
              2
            )}</pre>
        </div>
      {/if}

      {#if debugInfo.lastResponse}
        <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 class="text-gray-600 dark:text-gray-400">Last Server Response</h3>
          <pre
            class="text-gray-800 dark:text-gray-200 overflow-x-auto">{JSON.stringify(
              debugInfo.lastResponse,
              null,
              2
            )}</pre>
        </div>
      {/if}

      {#if debugInfo.lastError}
        <div class="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 class="text-gray-600 dark:text-gray-400">Last Error</h3>
          <p class="text-red-500">{debugInfo.lastError}</p>
        </div>
      {/if}
    </div>
  </div>
</div>
