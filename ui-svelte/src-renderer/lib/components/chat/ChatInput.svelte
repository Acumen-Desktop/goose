<script lang="ts">
  import { Button } from "$lib/components/ui-shadcn/button";
  import { createEventDispatcher } from "svelte";
  import type { ChatInputProps } from "$lib/types/components";

  export let messageText: string = "";
  export let onSend: ChatInputProps["onSend"];

  const dispatch = createEventDispatcher<{
    keydown: KeyboardEvent;
    send: { message: string };
  }>();

  function handleKeyDown(event: KeyboardEvent) {
    dispatch("keydown", event);
    if (event.key === "Enter" && !event.shiftKey && messageText.trim()) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (messageText.trim()) {
      dispatch("send", { message: messageText.trim() });
      onSend(messageText.trim());
      messageText = "";
    }
  }
</script>

<div class="flex gap-2 p-4">
  <input
    type="text"
    class="flex-1 rounded border p-2"
    bind:value={messageText}
    on:keydown={handleKeyDown}
    placeholder="Type a message..."
  />
  <button class="btn" on:click={handleSend} disabled={!messageText.trim()}>
    Send
  </button>
</div>
