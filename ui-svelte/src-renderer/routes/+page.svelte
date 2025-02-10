<script lang="ts">
  import { goto } from "$app/navigation";
  import GooseLogo from "$lib/components/compound/GooseLogo.svelte";
  import { Button } from "$lib/components/shadcn-ui/button/index.js";
  import { Progress } from "$lib/components/shadcn-ui/progress/index.js";

  let isLoading = $state(true);
  let progress = $state(0);
  let serverStarted = $state(false);
  let error = $state<string | null>(null);

  async function checkServerStatus() {
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
        serverStarted = true;
        return true;
      }
      console.log("Server response not OK:", response.status);
    } catch (e) {
      console.error("Server check failed:", e);
      return false;
    }
    return false;
  }

  async function waitForServer() {
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds total (20 * 500ms)

    while (attempts < maxAttempts) {
      progress = (attempts / maxAttempts) * 100;

      if (await checkServerStatus()) {
        progress = 100;
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    error = "Server failed to start";
    return false;
  }

  $effect(() => {
    waitForServer().finally(() => {
      isLoading = false;
    });
  });
</script>

<div class="flex flex-col h-screen bg-background text-foreground">
  <!-- Titlebar -->
  <div
    id="titlebar"
    class="h-8 bg-muted flex items-center justify-between px-4"
    style="-webkit-app-region: drag"
  >
    <div class="flex items-center gap-2">
      <GooseLogo size="small" hover={false} />
      <span class="text-sm font-medium">Goose</span>
    </div>
  </div>

  <!-- Main Content -->
  <main class="flex-1 overflow-hidden">
    <div class="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div class="relative">
        <GooseLogo size="default" class="w-32 h-32" />
        {#if isLoading}
          <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <Progress value={progress} class="w-48" />
          </div>
        {/if}
      </div>

      <div class="text-center space-y-4">
        {#if error}
          <p class="text-destructive">{error}</p>
        {:else if isLoading}
          <p class="text-muted-foreground">Starting Goose server...</p>
        {:else if serverStarted}
          <div class="space-y-2">
            <p class="text-green-500">Server started successfully!</p>
            <Button onclick={() => goto("/welcome")}>Continue</Button>
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>
