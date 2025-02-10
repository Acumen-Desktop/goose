<script lang="ts">
  import { ScrollArea } from "$lib/components/shadcn-ui/scroll-area";
  import { Button } from "$lib/components/shadcn-ui/button";
  import GooseLogo from "$lib/components/compound/GooseLogo.svelte";
  import ProviderGrid from "./ProviderGrid.svelte";

  let onSubmit = () => {
    // Will be implemented when we add the provider grid
  };
</script>

<div class="size-full select-none bg-background flex flex-col">
  <!-- Fixed Header -->
  <header class="flex-none px-8 py-6 md:px-16 border-b">
    <div class="flex items-center gap-4 max-w-4xl mx-auto">
      <div class="group/logo">
        <GooseLogo class="h-16 w-16 md:h-20 md:w-20" />
      </div>
      <div>
        <h1
          class="text-4xl font-medium text-foreground tracking-tight md:text-5xl"
        >
          Welcome to goose
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Your intelligent AI assistant for seamless productivity and
          creativity.
        </p>
      </div>
    </div>
  </header>

  <!-- Scrollable Main Content -->
  <main class="flex-1 overflow-hidden">
    <ScrollArea class="h-full w-full">
      <div class="px-8 py-8 md:px-16 max-w-4xl mx-auto">
        <!-- Provider Section -->
        <div class="w-full">
          <h2 class="text-3xl font-medium text-foreground tracking-tight mb-2">
            Choose a Provider
          </h2>
          <p class="text-xl text-foreground mb-4">
            Select an AI model provider to get started with goose.
          </p>
          <p class="text-sm text-muted-foreground mb-8">
            Click on a provider to configure its API keys and start using goose.
            Your keys are stored securely and encrypted locally. You can change
            your provider and select specific models in the settings.
          </p>
          <ProviderGrid {onSubmit} />
        </div>
      </div>
    </ScrollArea>
  </main>

  <!-- Fixed Footer -->
  <footer class="flex-none px-8 py-4 md:px-16 border-t">
    <div class="max-w-4xl mx-auto">
      <p class="text-sm text-muted-foreground">
        Not sure where to start?{" "}
        <Button
          variant="link"
          class="text-primary hover:text-primary/90 p-0 h-auto"
          onclick={() =>
            window.electron.openInChrome(
              "https://block.github.io/goose/docs/quickstart"
            )}
        >
          Quick Start Guide
        </Button>
      </p>
    </div>
  </footer>
</div>
