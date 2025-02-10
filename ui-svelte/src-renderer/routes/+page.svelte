<script lang="ts">
  import { goto } from "$app/navigation";
  import GooseLogo from "$lib/components/ui-compound/GooseLogo.svelte";
  import { Button } from "$lib/components/ui-shadcn/button/index.js";
  import ServerStats from "$lib/components/ui-compound/ServerStats.svelte";
</script>

<main
  class="h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8 p-8"
>
  <div class="relative">
    <GooseLogo size="default" class="w-32 h-32" />
    <ServerStats />
  </div>

  <div class="text-center space-y-4">
    <Button onclick={() => goto("/welcome")}>Continue</Button>
  </div>
</main>
