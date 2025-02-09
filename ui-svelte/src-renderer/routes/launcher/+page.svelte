<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let command = $state("");
  let recentDirs = $state<string[]>([]);

  onMount(async () => {
    // Load recent directories
    const config = window.electron.getConfig();
    recentDirs = config.recentDirs || [];
  });

  async function handleSubmit() {
    if (!command.trim()) return;

    // Check if it's a directory path
    if (command.startsWith("/") || command.startsWith("./")) {
      window.electron.directoryChooser(command);
      return;
    }

    // Create new chat window with command
    window.electron.createChatWindow(command);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    } else if (event.key === "Escape") {
      window.electron.hideWindow();
    }
  }
</script>

<div
  class="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
>
  <div class="p-2">
    <input
      type="text"
      class="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
      placeholder="Type a command or directory path..."
      bind:value={command}
      on:keydown={handleKeyDown}
      autofocus
    />
  </div>

  {#if recentDirs.length > 0 && !command}
    <div class="px-2 pb-2">
      <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
        Recent Directories
      </div>
      {#each recentDirs as dir}
        <button
          class="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          on:click={() => {
            window.electron.createChatWindow(undefined, dir);
          }}
        >
          {dir}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Remove default input styles */
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  /* Custom scrollbar for Webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
  }
</style>
