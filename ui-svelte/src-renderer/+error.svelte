<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui-shadcn/button";
  import { goto } from "$app/navigation";
</script>

<h1>{page.status}: {page.error?.message}</h1>

<Button onclick={() => goto("/")}>Home</Button>
