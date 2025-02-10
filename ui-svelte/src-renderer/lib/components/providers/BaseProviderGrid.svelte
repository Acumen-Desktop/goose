<script lang="ts">
  import { Button } from "$lib/components/shadcn-ui/button";
  import { Card } from "$lib/components/shadcn-ui/card";

  interface Provider {
    id: string;
    name: string;
    isConfigured: boolean;
    description: string;
  }

  let {
    providers,
    isSelectable = false,
    selectedId = null,
    onSelect = (id: string) => {},
    onAddKeys = (provider: Provider) => {},
    onTakeoff = (provider: Provider) => {},
  } = $props<{
    providers: Provider[];
    isSelectable?: boolean;
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    onAddKeys?: (provider: Provider) => void;
    onTakeoff?: (provider: Provider) => void;
  }>();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each providers as provider}
    <Card
      class="relative overflow-hidden transition-all duration-200 hover:shadow-lg"
      data-selected={selectedId === provider.id}
      onclick={() => isSelectable && onSelect(provider.id)}
    >
      <div class="p-6">
        <h3 class="text-lg font-semibold">{provider.name}</h3>
        <p class="text-sm text-muted-foreground mt-2">{provider.description}</p>

        <div class="mt-4 flex justify-end gap-2">
          {#if provider.isConfigured}
            <Button
              variant="default"
              onclick={(e) => {
                e.stopPropagation();
                onTakeoff(provider);
              }}
            >
              Take Off
            </Button>
          {:else}
            <Button
              variant="outline"
              onclick={(e) => {
                e.stopPropagation();
                onAddKeys(provider);
              }}
            >
              Add Keys
            </Button>
          {/if}
        </div>
      </div>
    </Card>
  {/each}
</div>

<style>
  [data-selected="true"] {
    @apply ring-2 ring-primary;
  }
</style>
