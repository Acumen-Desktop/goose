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
  let config: any = null;

  // Automatically check server status when component mounts
  onMount(async () => {
    config = window.electron.getConfig();
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
    <div class="stats-container">
      <h3>Server Configuration</h3>
      {#if config}
        <div class="stat-grid">
          <div class="stat-item">
            <span class="label">API Host:</span>
            <span class="value">{config.GOOSE_API_HOST}</span>
          </div>
          <div class="stat-item">
            <span class="label">Port:</span>
            <span class="value">{config.GOOSE_PORT}</span>
          </div>
          <div class="stat-item">
            <span class="label">Working Directory:</span>
            <span class="value">{config.GOOSE_WORKING_DIR}</span>
          </div>
          <div class="stat-item">
            <span class="label">Type:</span>
            <span class="value">{config.type}</span>
          </div>
        </div>
      {/if}
      <p class="success">Server started successfully!</p>
    </div>
  {/if}
</div>

<style>
  .server-stats-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background, #fff);
    padding: 1.5rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 300px;
  }
  .error {
    color: var(--destructive, red);
  }
  .success {
    color: var(--success, green);
    margin-top: 1rem;
  }
  .stats-container h3 {
    margin: 0 0 1rem 0;
    color: var(--foreground);
  }
  .stat-grid {
    display: grid;
    gap: 0.5rem;
  }
  .stat-item {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: center;
  }
  .label {
    color: var(--muted-foreground);
    font-size: 0.9rem;
  }
  .value {
    color: var(--foreground);
    font-family: monospace;
    word-break: break-all;
  }
</style>