<script lang="ts">
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-4">
  <h1>Svelte UI</h1>
  <Button>Click me</Button>
</div>
