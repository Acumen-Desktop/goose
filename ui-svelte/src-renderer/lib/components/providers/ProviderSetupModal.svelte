<script lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "$lib/components/ui-shadcn/dialog";
  import { Button } from "$lib/components/ui-shadcn/button";
  import { Input } from "$lib/components/ui-shadcn/input";
  import { Label } from "$lib/components/ui-shadcn/label";
  import { required_keys, type Provider } from "$lib/config/providers";

  let {
    provider = undefined,
    model = "",
    endpoint = "",
    onSubmit = (values: Record<string, string>) => {},
    onCancel = () => {},
  } = $props<{
    provider?: Provider;
    model?: string;
    endpoint?: string;
    onSubmit?: (values: Record<string, string>) => void;
    onCancel?: () => void;
  }>();

  let configValues = $state<Record<string, string>>({});

  $effect(() => {
    if (provider) {
      const providerKeys = required_keys[provider as Provider] as string[];
      configValues = providerKeys.reduce<Record<string, string>>(
        (acc: Record<string, string>, key: string) => ({ ...acc, [key]: "" }),
        {}
      );
    }
  });

  function handleSubmit() {
    onSubmit(configValues);
  }
</script>

<Dialog open={true}>
  <DialogContent class="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Configure {provider}</DialogTitle>
      <DialogDescription>
        Enter your API keys to start using {provider}.
      </DialogDescription>
    </DialogHeader>

    <div class="grid gap-4 py-4">
      {#if provider && (required_keys[provider as Provider] as string[])}
        {#each required_keys[provider as Provider] as key}
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for={key} class="text-right">{key}</Label>
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

    <DialogFooter>
      <Button variant="outline" onclick={onCancel}>Cancel</Button>
      <Button onclick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
