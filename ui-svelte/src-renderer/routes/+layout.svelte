<script lang="ts">
  import "$lib/styles/app.css";
  import { ModeWatcher } from "mode-watcher";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<ModeWatcher />
<Button
  onclick={toggleMode}
  variant="outline"
  size="icon"
  class="absolute top-4 right-4 z-10"
>
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
{@render children()}
