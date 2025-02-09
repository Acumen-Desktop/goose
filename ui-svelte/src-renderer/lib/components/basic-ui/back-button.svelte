<script lang="ts">
  import { cn } from "$lib/utils";
  import type { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import BackIcon from "$lib/assets/icons-svg/back.svg?raw";

  let {
    ref = $bindable(null),
    class: className = "",
    onClick,
    ...restProps
  }: WithElementRef<HTMLButtonAttributes> & {
    onClick?: () => void;
  } = $props();

  function handleExit() {
    if (onClick) {
      onClick();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      console.warn("No history to go back to");
    }
  }
</script>

<button
  bind:this={ref}
  onclick={handleExit}
  class={cn(
    "flex items-center text-sm text-muted-foreground group hover:text-foreground",
    className
  )}
  {...restProps}
>
  <div class="w-3 h-3 group-hover:-translate-x-1 transition-all mr-1">
    {@html BackIcon}
  </div>
  <span>Back</span>
</button>
