<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import type { Message, ChatState } from "../../types/api";
  import { Button } from "$lib/components/shadcn-ui/button";
  import { Input } from "$lib/components/shadcn-ui/input";
  import { ScrollArea } from "$lib/components/shadcn-ui/scroll-area";
  import { Separator } from "$lib/components/shadcn-ui/separator";
  import { ChatMessage } from "$lib/components/chat/ChatMessage.svelte";
  import { WelcomeScreen } from "$lib/components/welcome/WelcomeScreen.svelte";

  // State
  let messages = $state<Message[]>([]);
  let inputMessage = $state("");
  let isWorking = $state(false);
  let progressMessage = $state("");
  let showWelcomeScreen = $state(true);

  // Load initial state
  onMount(async () => {
    try {
      const config = window.electron.getConfig();
      const searchParams = new URLSearchParams(window.location.search);
      const initialQuery = searchParams.get("initialQuery");

      if (initialQuery) {
        inputMessage = decodeURIComponent(initialQuery);
        showWelcomeScreen = false;
        await handleSend();
      } else {
        // Check if we should show welcome screen
        showWelcomeScreen = !config.hasCompletedWelcome;
      }
    } catch (error) {
      console.error("Failed to load initial state:", error);
      toast.error("Failed to load initial state");
    }
  });

  // Handle sending a message
  async function handleSend() {
    if (!inputMessage.trim() || isWorking) return;

    try {
      isWorking = true;
      const newMessage: Message = {
        role: "user",
        content: inputMessage,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      messages = [...messages, newMessage];
      const currentMessage = inputMessage;
      inputMessage = "";

      // TODO: Implement chat API call
      progressMessage = "Processing your message...";

      // Placeholder response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response: Message = {
        role: "assistant",
        content:
          "This is a placeholder response. Chat API not implemented yet.",
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      messages = [...messages, response];
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      isWorking = false;
      progressMessage = "";
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }
</script>

{#if showWelcomeScreen}
  <WelcomeScreen
    on:submit={() => {
      showWelcomeScreen = false;
    }}
  />
{:else}
  <div class="flex flex-col h-full">
    <!-- Chat Messages -->
    <ScrollArea class="flex-1 p-4">
      <div class="space-y-4">
        {#each messages as message (message.id)}
          <ChatMessage {message} />
        {/each}
      </div>

      {#if progressMessage}
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {progressMessage}
        </div>
      {/if}
    </ScrollArea>

    <!-- Input Area -->
    <div class="border-t p-4 dark:border-gray-700">
      <div class="flex gap-2">
        <Input
          type="text"
          class="flex-1"
          placeholder="Type a message..."
          bind:value={inputMessage}
          on:keydown={handleKeyDown}
          disabled={isWorking}
        />
        <Button
          on:click={handleSend}
          disabled={!inputMessage.trim() || isWorking}
        >
          Send
        </Button>
      </div>
    </div>
  </div>
{/if}

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
