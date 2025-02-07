<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { cn } from "$lib/utils";
    import ToolInvocations from "./ToolInvocations.svelte";

    type MessageType = 'ai' | 'user';

    export let type: MessageType;
    export let content: string;
    export let timestamp: Date;
    export let toolInvocations: any[] | undefined = undefined;
    
    let formattedTime = timestamp.toLocaleTimeString();
    let isAI = type === 'ai';
</script>

<div class="flex w-[90%] justify-start">
    <div class="flex flex-col w-full">
        <Card class={cn(
            "p-4",
            isAI ? "bg-secondary" : "",
            toolInvocations ? "rounded-b-none" : ""
        )}>
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold">
                        {isAI ? 'Goose' : 'You'}
                    </span>
                    <span class="text-xs text-gray-500">
                        {formattedTime}
                    </span>
                </div>
                <p class="text-sm whitespace-pre-wrap">
                    {content}
                </p>
            </div>
        </Card>

        {#if toolInvocations}
            <div class="mt-1">
                <ToolInvocations {toolInvocations} />
            </div>
        {/if}
    </div>
</div>