<script lang="ts">
  import { onMount } from 'svelte';

  // Moved from +page.svelte: checkServerStatus function
  export async function checkServerStatus(): Promise<boolean> {
    try {
      const config = window.electron.getConfig();
      console.log("Server config:", config);
      const port = config.GOOSE_PORT;
      if (!port) {
        console.error("No port found in config");
        throw new Error("Server port not found in config");
      }
      console.log(`Checking server status at port ${port}`);
      const response = await fetch(`http://127.0.0.1:${port}/status`);
      if (response.ok) {
        console.log("Server responded successfully");
        return true;
      }
      console.log("Server response not OK:", response.status);
    } catch (e) {
      console.error("Server check failed:", e);
      return false;
    }
    return false;
  }

  let serverStarted = false;
  let isLoading = true;
  let progress = 0;
  let error: string | null = null;

  // Automatically check server status when component mounts
  onMount(async () => {
    const maxAttempts = 20;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      progress = Math.floor((attempts / maxAttempts) * 100);
      if (await checkServerStatus()) {
        serverStarted = true;
        progress = 100;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    if (!serverStarted) {
      error = "Server failed to start";
    }
    isLoading = false;
  });
</script>

<div class="server-stats-modal">
  {#if isLoading}
    <p>Loading server stats... {progress}%</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if serverStarted}
    <p class="success">Server started successfully!</p>
  {/if}
</div>

<style>
  .server-stats-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background, #fff);
    padding: 1rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .error {
    color: var(--destructive, red);
  }
  .success {
    color: var(--success, green);
  }
</style>