<script lang="ts">
  import { cn } from "$lib/utils";
  import Card from "$lib/components/shadcn-ui/card/card.svelte";

  let {
    isOpen = $bindable(false),
    title = "",
    class: className = "",
    children = () => null,
    actions = () => null,
    ...restProps
  } = $props();

  let dialog: HTMLDialogElement | null = $state(null);

  $effect(() => {
    if (isOpen && dialog) dialog.showModal();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (isOpen = false)}
  onclick={(e) => {
    if (e.target === dialog && dialog) dialog.close();
  }}
  class={cn("max-w-[440px] p-0 border-none rounded-xl", className)}
  {...restProps}
>
  <Card class="overflow-hidden">
    <div class="px-8 pb-0 space-y-8">
      <!-- Header -->
      <div class="flex pt-6">
        <h2 class="text-2xl font-regular dark:text-white text-gray-900">
          {title}
        </h2>
      </div>

      <!-- Content -->
      <div class="px-8">
        {@render children?.()}
      </div>

      <!-- Actions -->
      <div class="mt-[8px] ml-[-24px] mr-[-24px] pt-[16px]">
        {@render actions?.()}
      </div>
    </div>
  </Card>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
