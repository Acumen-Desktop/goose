<script lang="ts">
  import { Card } from "$lib/components/ui-shadcn/card";

  interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: Record<string, any>;
    state: "call" | "result";
    result?: any;
  }

  export let toolInvocations: ToolInvocation[];
</script>

<div class="flex flex-col gap-2">
  {#each toolInvocations as invocation (invocation.toolCallId)}
    <Card class="p-4">
      <div class="font-medium">
        {invocation.toolName.substring(
          invocation.toolName.lastIndexOf("__") + 2
        )}
      </div>
      {#if invocation.state === "result" && invocation.result}
        <div class="mt-2 whitespace-pre-wrap">
          {invocation.result.text || JSON.stringify(invocation.result, null, 2)}
        </div>
      {:else}
        <div class="mt-2">Loading...</div>
      {/if}
    </Card>
  {/each}
</div>
