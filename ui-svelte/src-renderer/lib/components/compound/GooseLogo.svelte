<script lang="ts">
  import rain from "$lib/assets/icons-svg/rain.svg";
  import goose from "$lib/assets/icons-svg/goose.svg";
  type Size = "default" | "small";
  type SizeConfig = {
    frame: string;
    rain: string;
    goose: string;
  };
  type Sizes = Record<Size, SizeConfig>;
  //ui-svelte/src-renderer/lib/assets/icons-svg/rain.svg
  let {
    class: className = "",
    size = "default" as Size,
    hover = true,
  } = $props();

  const sizes: Sizes = {
    default: {
      frame: "w-16 h-16",
      rain: "w-[275px] h-[275px]",
      goose: "w-16 h-16",
    },
    small: {
      frame: "w-8 h-8",
      rain: "w-[150px] h-[150px]",
      goose: "w-8 h-8",
    },
  };
</script>

<div
  class="{className} {sizes[size].frame} {hover
    ? 'group/with-hover'
    : ''} relative overflow-hidden"
>
  <img
    src={rain}
    alt="Rain effect"
    class="{sizes[size].rain} absolute left-0 bottom-0 {hover
      ? 'opacity-0 group-hover/with-hover:opacity-100'
      : ''} transition-all duration-300 z-1"
  />
  <img
    src={goose}
    alt="Goose"
    class="{sizes[size].goose} absolute left-0 bottom-0 z-2"
  />
</div>

<style>
  img {
    color: currentColor;
  }
</style>
