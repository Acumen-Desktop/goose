<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Textarea } from "$lib/components/ui/textarea";

    export let onSend: (message: string) => void;
    
    let messageText = '';
    
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (messageText.trim()) {
                onSend(messageText);
                messageText = '';
            }
        }
    }

    function handleSend() {
        if (messageText.trim()) {
            onSend(messageText);
            messageText = '';
        }
    }
</script>

<div class="flex gap-2 items-end">
    <div class="flex-1">
        <Textarea
            bind:value={messageText}
            on:keydown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            class="resize-none"
        />
    </div>
    <Button 
        on:click={handleSend}
        disabled={!messageText.trim()}
    >
        Send
    </Button>
</div>