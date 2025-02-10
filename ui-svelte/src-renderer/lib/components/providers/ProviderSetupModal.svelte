<script lang="ts">
  import { Dialog } from "$lib/components/shadcn-ui/dialog";
  import { Button } from "$lib/components/shadcn-ui/button";
  import { Input } from "$lib/components/shadcn-ui/input";
  import { Label } from "$lib/components/shadcn-ui/label";
  import { required_keys } from "$lib/config/providers";

  let {
    provider,
    model,
    endpoint,
    onSubmit = (values: { [key: string]: string }) => {},
    onCancel = () => {},
  } = $props<{
    provider?: string;
    model?: string;
    endpoint?: string;
    onSubmit?: (values: { [key: string]: string }) => void;
    onCancel?: () => void;
  }>();

  let configValues = $state<{ [key: string]: string }>({});

  $effect(() => {
    if (provider) {
      const keys = required_keys[provider] || [];
      configValues = keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {});
    }
  });

  function handleSubmit() {
    onSubmit(configValues);
  }
</script>

<Dialog.Root open={true}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Configure {provider}</Dialog.Title>
      <Dialog.Description>
        Enter your API keys to start using {provider}.
      </Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-4 py-4">
      {#if provider && required_keys[provider]}
        {#each required_keys[provider] as key}
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right" for={key}>{key}</Label>
            <Input
              id={key}
              type="password"
              class="col-span-3"
              bind:value={configValues[key]}
            />
          </div>
        {/each}
      {/if}
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={onCancel}>Cancel</Button>
      <Button onclick={handleSubmit}>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
