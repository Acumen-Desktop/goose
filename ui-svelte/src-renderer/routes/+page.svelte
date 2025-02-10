<script lang="ts">
  import { goto } from "$app/navigation";
  import GooseLogo from "$lib/components/ui-compound/GooseLogo.svelte";
  import { Button } from "$lib/components/ui-shadcn/button/index.js";
  import ServerStats from "$lib/components/ui-compound/ServerStats.svelte";
</script>

<main
  class="size-full bg-background text-foreground flex flex-col items-center pt-32 gap-8 justify-around"
>
  <GooseLogo size="default" class="w-32 h-32" />
  <div class="mb-8">
    <ServerStats />
  </div>
  <Button onclick={() => goto("/welcome")}>Continue</Button>
</main>
