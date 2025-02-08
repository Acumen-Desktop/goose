<script lang="ts">
  import type { Message, ToolInvocation, ToolResult } from "../../types/api";
  import { chatStore } from "$lib/stores/chat";

  let message = "";

  async function handleSend() {
    if (message.trim()) {
      await chatStore.sendMessage(message);
      message = "";
    }
  }

  function isToolResult(tool: ToolInvocation): tool is ToolResult {
    return tool.state === "result";
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex-1 overflow-y-auto p-4">
    {#each $chatStore.messages as message}
      <div class="mb-4">
        <div class="font-bold">{message.type}</div>
        <div>{message.content}</div>
        {#if message.toolInvocations}
          <div class="text-sm text-gray-500">
            {#each message.toolInvocations as tool}
              <div>Tool: {tool.toolName}</div>
              <div>State: {tool.state}</div>
              {#if isToolResult(tool)}
                <div>Result: {tool.result.text}</div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="border-t p-4">
    <div class="flex gap-2">
      <input
        type="text"
        class="flex-1 rounded border p-2"
        bind:value={message}
        on:keydown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        placeholder="Type a message..."
      />
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded"
        on:click={handleSend}
        disabled={!message.trim()}
      >
        Send
      </button>
    </div>
  </div>
</div>
