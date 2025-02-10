<script lang="ts">
  import { onMount } from "svelte";
  import { GooseLogo } from "$lib/components/compound";

  let query = "";
  let isLoading = false;

  async function handleSubmit() {
    if (!query.trim()) return;
    isLoading = true;

    try {
      // Create a new chat window with the query
      await window.electron.createChat(query);
      // Close the launcher window
      window.electron.closeLauncher();
    } catch (error) {
      console.error("Failed to create chat:", error);
      isLoading = false;
    }
  }

  // Handle keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      window.electron.closeLauncher();
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }
</script>

<div class="flex items-center gap-2 p-2 bg-background text-foreground h-full">
  <div class="flex-shrink-0">
    <GooseLogo size="small" hover={false} />
  </div>

  <form class="flex-1" on:submit|preventDefault={handleSubmit}>
    <input
      type="text"
      bind:value={query}
      placeholder="Ask Goose..."
      class="w-full bg-transparent border-none focus:outline-none text-lg"
      on:keydown={handleKeydown}
      disabled={isLoading}
      autofocus
    />
  </form>

  {#if isLoading}
    <div class="flex-shrink-0 w-6 h-6">
      <GooseLogo size="small" />
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
