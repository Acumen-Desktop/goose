<script lang="ts">
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import ChatMessage from "$lib/components/chat/ChatMessage.svelte";

  //   export let data: PageData;

  // Example messages for testing
  let messages = [
    {
      type: "user" as const,
      content: "Hello Goose!",
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
    },
    {
      type: "ai" as const,
      content: "Hi there! How can I help you today?",
      timestamp: new Date(),
    },
  ];
</script>

<div class="flex flex-col gap-4 p-4">
  <h1 class="text-2xl font-bold">Chat Interface</h1>

  <div class="flex flex-col gap-4">
    {#each messages as message (message.timestamp)}
      <ChatMessage
        type={message.type}
        content={message.content}
        timestamp={message.timestamp}
      />
    {/each}
  </div>

  <div class="mt-4">
    <Button>Send Message</Button>
  </div>
</div>
