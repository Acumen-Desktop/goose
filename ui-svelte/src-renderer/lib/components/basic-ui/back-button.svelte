<script lang="ts">
  import { cn } from "$lib/utils";
  import Icon from "$lib/assets/icons-svg/Icon.svelte";
  import type { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";

  // Icons useage:
  //<Icon name={devToolsState === 'open' ? 'debug' : 'bug'} />

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
  <Icon
    name="back"
    size={12}
    class="group-hover:-translate-x-1 transition-all mr-1"
  />
  <span>Back</span>
</button>
