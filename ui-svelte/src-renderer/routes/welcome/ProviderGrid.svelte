<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui-shadcn/button";
  // import { toast } from "$lib/components/ui-shadcn/use-toast";
  import { Toaster, toast } from "svelte-sonner";
  import BaseProviderGrid from "$lib/components/providers/BaseProviderGrid.svelte";
  import ProviderSetupModal from "$lib/components/providers/ProviderSetupModal.svelte";
  import {
    supported_providers,
    required_keys,
    provider_aliases,
    getDefaultModel,
    getProviderDescription,
  } from "$lib/config/providers";
  import { initializeSystem } from "$lib/utils/providerUtils";
  import { getApiUrl, getSecretKey } from "$lib/config";
  import { getActiveProviders, isSecretKey } from "$lib/utils/api-keys";

  let { onSubmit } = $props<{ onSubmit?: () => void }>();

  let providers = $state(
    supported_providers.map((providerName) => {
      const alias =
        provider_aliases.find((p) => p.provider === providerName)?.alias ||
        providerName.toLowerCase();
      const isConfigured = false; // Will be updated in onMount

      return {
        id: alias,
        name: providerName,
        isConfigured,
        description: getProviderDescription(providerName),
      };
    })
  );

  let selectedId = $state<string | null>(null);
  let showSetupModal = $state(false);
  let activeKeys = $state<string[]>([]);

  onMount(async () => {
    const keys = await getActiveProviders();
    activeKeys = keys;
    updateProviderConfiguration();
  });

  function updateProviderConfiguration() {
    providers = providers.map((provider) => ({
      ...provider,
      isConfigured: activeKeys.includes(provider.name),
    }));
  }

  async function handleConfigure(provider: { id: string; name: string }) {
    const providerId = provider.id.toLowerCase();
    const modelName = getDefaultModel(providerId);

    await initializeSystem(providerId, modelName);
    localStorage.setItem("GOOSE_PROVIDER", providerId);

    toast.success("Provider Selected", {
      description: `Selected ${provider.name} provider. Starting Goose with default model: ${modelName}.`,
    });

    onSubmit?.();
  }

  function handleAddKeys(provider: { id: string }) {
    selectedId = provider.id;
    showSetupModal = true;
  }

  async function handleModalSubmit(configValues: { [key: string]: string }) {
    if (!selectedId) return;

    const provider = providers.find((p) => p.id === selectedId)?.name;
    if (!provider) return;

    const requiredKeys = required_keys[provider];
    if (!requiredKeys || requiredKeys.length === 0) {
      console.error(`No keys found for provider ${provider}`);
      return;
    }

    try {
      // Delete existing keys if provider is already configured
      const isUpdate = providers.find((p) => p.id === selectedId)?.isConfigured;
      if (isUpdate) {
        for (const keyName of requiredKeys) {
          const isSecret = isSecretKey(keyName);
          const deleteResponse = await fetch(getApiUrl("/configs/delete"), {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-Secret-Key": getSecretKey(),
            },
            body: JSON.stringify({
              key: keyName,
              isSecret,
            }),
          });

          if (!deleteResponse.ok) {
            const errorText = await deleteResponse.text();
            console.error("Delete response error:", errorText);
            throw new Error(`Failed to delete old key: ${keyName}`);
          }
        }
      }

      // Store new keys
      for (const keyName of requiredKeys) {
        const value = configValues[keyName];
        if (!value) {
          console.error(`Missing value for required key: ${keyName}`);
          continue;
        }

        const isSecret = isSecretKey(keyName);
        const storeResponse = await fetch(getApiUrl("/configs/store"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Secret-Key": getSecretKey(),
          },
          body: JSON.stringify({
            key: keyName,
            value: value,
            isSecret,
          }),
        });

        if (!storeResponse.ok) {
          const errorText = await storeResponse.text();
          console.error("Store response error:", errorText);
          throw new Error(`Failed to store new key: ${keyName}`);
        }
      }

      toast.success("Success", {
        description: isUpdate
          ? `Successfully updated configuration for ${provider}`
          : `Successfully added configuration for ${provider}`,
      });

      const updatedKeys = await getActiveProviders();
      activeKeys = updatedKeys;
      updateProviderConfiguration();

      showSetupModal = false;
      selectedId = null;
    } catch (error) {
      console.error("Error handling modal submit:", error);
      toast.error("Error", {
        description: `Failed to ${providers.find((p) => p.id === selectedId)?.isConfigured ? "update" : "add"} configuration for ${provider}`,
      });
    }
  }

  function handleSelect(providerId: string) {
    selectedId = selectedId === providerId ? null : providerId;
  }

  // Add Esc key handling
  onMount(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectedId = null;
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  });
</script>

<div class="space-y-4 max-w-[1400px] mx-auto">
  <BaseProviderGrid
    {providers}
    isSelectable={true}
    {selectedId}
    onSelect={handleSelect}
    onAddKeys={handleAddKeys}
    onTakeoff={handleConfigure}
  />

  {#if showSetupModal && selectedId}
    <div class="relative z-[9999]">
      <ProviderSetupModal
        provider={providers.find((p) => p.id === selectedId)?.name}
        model="Example Model"
        endpoint="Example Endpoint"
        onSubmit={handleModalSubmit}
        onCancel={() => {
          showSetupModal = false;
          selectedId = null;
        }}
      />
    </div>
  {/if}

  <Toaster />
</div>
