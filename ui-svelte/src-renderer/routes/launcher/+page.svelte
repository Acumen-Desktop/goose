<script lang="ts">
  import { onMount } from "svelte";
  import GooseLogo from "$lib/components/compound/GooseLogo.svelte";
  import { Input } from "$lib/components/shadcn-ui/input";
  import type { HTMLInputAttributes } from "svelte/elements";

  let query = $state("");
  let isLoading = $state(false);
  let inputRef = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!query.trim() || isLoading) return;

    try {
      isLoading = true;
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
      void handleSubmit(event);
    }
  }
</script>

<div class="flex items-center gap-4 p-4 bg-background">
  <GooseLogo class="w-8 h-8" />
  <form class="flex-1" onsubmit={handleSubmit}>
    <Input
      type="text"
      class="flex-1"
      placeholder="Type a message..."
      bind:value={query}
      bind:ref={inputRef}
      disabled={isLoading}
      onkeydown={handleKeydown}
    />
  </form>
</div>

<style>
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
