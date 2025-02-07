<script lang="ts">
  import type { PageData } from './$types';
  import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
  import ChatInput from '$lib/components/chat/ChatInput.svelte';

  export let data: PageData;

  // Example messages with tool invocations
  let messages = [
    {
      type: 'user' as const,
      content: 'Hello Goose!',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      type: 'ai' as const,
      content: 'Let me check something for you.',
      timestamp: new Date(),
      toolInvocations: [
        {
          toolCallId: '1',
          toolName: 'example__check_something',
          args: { query: 'test' },
          state: 'call'
        }
      ]
    },
    {
      type: 'ai' as const,
      content: 'Here is what I found.',
      timestamp: new Date(),
      toolInvocations: [
        {
          toolCallId: '2',
          toolName: 'example__search_result',
          args: { query: 'test' },
          state: 'result',
          result: {
            text: 'This is an example search result.\nIt has multiple lines.\nAnd shows how tool results work.'
          }
        }
      ]
    }
  ];

  function handleSendMessage(message: string) {
    messages = [...messages, {
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }];

    // Simulate a tool call
    setTimeout(() => {
      messages = [...messages, {
        type: 'ai' as const,
        content: 'Processing your request...',
        timestamp: new Date(),
        toolInvocations: [{
          toolCallId: Date.now().toString(),
          toolName: 'example__process',
          args: { input: message },
          state: 'call'
        }]
      }];

      // Simulate the result after 2 seconds
      setTimeout(() => {
        messages = [...messages, {
          type: 'ai' as const,
          content: 'Here is the result.',
          timestamp: new Date(),
          toolInvocations: [{
            toolCallId: Date.now().toString(),
            toolName: 'example__process',
            args: { input: message },
            state: 'result',
            result: {
              text: `Processed: ${message}`
            }
          }]
        }];
      }, 2000);
    }, 1000);
  }
</script>

<div class="flex flex-col h-screen">
  <div class="flex-1 overflow-y-auto p-4">
    <div class="flex flex-col gap-4">
      {#each messages as message (message.timestamp)}
        <ChatMessage 
          type={message.type}
          content={message.content}
          timestamp={message.timestamp}
          toolInvocations={message.toolInvocations}
        />
      {/each}
    </div>
  </div>

  <div class="p-4 border-t">
    <ChatInput onSend={handleSendMessage} />
  </div>
</div>