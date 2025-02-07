<script lang="ts">
    import { Card } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { cn } from "$lib/utils";

    type MessageType = 'ai' | 'user';

    interface ChatMessageProps {
        type: MessageType;
        content: string;
        timestamp: Date;
    }

    export let type: MessageType;
    export let content: string;
    export let timestamp: Date;
    
    let formattedTime = timestamp.toLocaleTimeString();
    let isAI = type === 'ai';
</script>

<Card class={cn(
    "p-4 max-w-[80%]",
    isAI ? "ml-4" : "mr-4 ml-auto"
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
        <p class="text-sm">
            {content}
        </p>
        <div class="flex justify-end gap-2">
            <Button variant="ghost" size="sm">
                Copy
            </Button>
        </div>
    </div>
</Card>