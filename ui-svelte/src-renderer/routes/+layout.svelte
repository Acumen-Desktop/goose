<!-- Main App Layout -->
<script lang="ts">
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";
  import "$lib/styles/app.css";
  import { ModeWatcher } from "mode-watcher";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/shadcn-ui/button/index.js";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  let fatalError = $state<string | null>(null);

  // Handle fatal errors from main process
  onMount(() => {
    const handleFatalError = (_: any, errorMessage: string) => {
      fatalError = errorMessage;
    };

    window.electron.on("fatal-error", handleFatalError);

    return () => {
      window.electron.off("fatal-error", handleFatalError);
    };
  });
</script>

{#if fatalError}
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8"
  >
    <h1 class="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
      Fatal Error
    </h1>
    <p class="text-lg text-gray-800 dark:text-gray-200 mb-8">{fatalError}</p>
    <button
      class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      onclick={() => window.electron.reloadApp()}
    >
      Reload Application
    </button>
  </div>
{:else}
  <div
    class="overflow-hidden size-full text-slate-950 dark:from-zinc-800 dark:to-zinc-900 dark:text-slate-50"
  >
    <ModeWatcher />
    <Button
      onclick={toggleMode}
      variant="outline"
      size="icon"
      class="absolute top-4 right-4 z-10"
    >
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
    {@render children()}
  </div>

  <!-- Toast Container -->
  <Toaster position="bottom-right" />
{/if}

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }

  :global(body) {
    color: var(--colors-slate-950);
    background-color: var(--colors-white);
  }

  :global(.dark body) {
    color: var(--colors-slate-50);
    background-color: var(--colors-zinc-900);
  }
</style>
