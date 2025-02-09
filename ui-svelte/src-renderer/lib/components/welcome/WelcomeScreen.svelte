<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/shadcn-ui/button";
  import { Card, CardContent } from "$lib/components/shadcn-ui/card";
  import { ScrollArea } from "$lib/components/shadcn-ui/scroll-area";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Provider = {
    id: string;
    name: string;
    description: string;
    icon: string;
  };

  const dispatch = createEventDispatcher<{
    submit: void;
  }>();

  let selectedProvider = $state<string | null>(null);
  let providers = $state<Provider[]>([
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude 3 models from Anthropic",
      icon: "🤖",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4 and GPT-3.5 models from OpenAI",
      icon: "🧠",
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "Local models via Ollama",
      icon: "🦙",
    },
  ]);

  let selectedProviderName = $derived(
    selectedProvider
      ? providers.find((p) => p.id === selectedProvider)?.name
      : ""
  );

  function handleProviderSelect(providerId: string) {
    selectedProvider = providerId;
  }

  function handleSubmit(e: MouseEvent) {
    if (!selectedProvider) return;
    dispatch("submit");
  }

  function handleKeydown(e: KeyboardEvent, providerId: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleProviderSelect(providerId);
    }
  }
</script>

<div
  class="flex flex-col items-center justify-center min-h-screen bg-background p-8"
>
  <div class="max-w-4xl w-full">
    <h1 class="text-4xl font-bold mb-4 text-center">Welcome to Goose AI</h1>
    <p class="text-lg text-center text-muted-foreground mb-8">
      Choose your preferred AI provider to get started
    </p>

    <ScrollArea class="h-[400px]">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {#each providers as provider (provider.id)}
          <Card
            class="transition-all cursor-pointer {selectedProvider ===
            provider.id
              ? 'ring-2 ring-primary'
              : 'hover:shadow-lg'}"
            onclick={() => handleProviderSelect(provider.id)}
            onkeydown={(e) => handleKeydown(e, provider.id)}
            role="button"
            tabindex={0}
          >
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <div class="text-4xl">{provider.icon}</div>
                <div>
                  <h3 class="text-xl font-semibold mb-2">{provider.name}</h3>
                  <p class="text-muted-foreground">
                    {provider.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    </ScrollArea>

    <div class="mt-8 flex justify-center">
      <Button
        size="lg"
        variant={selectedProvider ? "default" : "secondary"}
        disabled={!selectedProvider}
        onclick={handleSubmit}
      >
        Continue with {selectedProviderName}
      </Button>
    </div>
  </div>
</div>
