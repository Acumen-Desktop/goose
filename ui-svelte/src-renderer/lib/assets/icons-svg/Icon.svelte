<script lang="ts">
  let { name, size = 22, class: className = "" } = $props();

  let svg = $state("");

  async function loadIcon(iconName: string) {
    try {
      const response = await fetch(`$lib/assets/icons-svg/${iconName}.svg`);
      svg = await response.text();
    } catch (error) {
      console.error(`Failed to load icon: ${iconName}`, error);
    }
  }

  $effect(() => {
    loadIcon(name);
  });
</script>

<div
  class="inline-block {className}"
  style="width: {size}px; height: {size}px;"
>
  {@html svg}
</div>

<style>
  div :global(svg) {
    width: 100%;
    height: 100%;
  }
</style>
