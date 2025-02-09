# Svelte 5 + SvelteKit 2 Migration Notes

## Key Changes

### 1. Svelte 5 Runes

- Use `$state()` instead of `let` for reactive variables
- Use `$derived()` instead of `$:` for computed values
- Use `$effect()` for side effects
- Use `$props()` for component props

### 2. Component Props Pattern

```svelte
// Old (Svelte 4)
export let prop;

// New (Svelte 5)
let { prop } = $props();
```

### 3. Event Handling

```svelte
// Old (Svelte 4)
<button on:click={handler}>

// New (Svelte 5)
<button onclick={handler}>
```

### 4. shadcn-svelte Integration

- Update to latest version: `npx shadcn-svelte@next update`
- Update bits-ui: `npm i bits-ui@next`
- Remove cmdk-sv (merged into bits-ui)
- Update components.json with new registry

### 5. Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── ui/          # shadcn components
│   ├── hooks/           # Custom hooks
│   └── utils.ts         # Utility functions
└── routes/
    └── +layout.svelte   # Root layout
```

## Required Dependencies

```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^5.0.0",
    "bits-ui": "next",
    "tailwindcss-animate": "latest"
  }
}
```

## Common Patterns

### 1. State Management

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log(`Count changed to ${count}`);
  });
</script>
```

### 2. Event Dispatching

```svelte
<script lang="ts">
  const dispatch = createEventDispatcher<{
    customEvent: { data: string }
  }>();
</script>
```

### 3. shadcn-svelte Components

```svelte
<script lang="ts">
  import { Button } from "$lib/components/shadcn-ui/button";
  import { Card } from "$lib/components/shadcn-ui/card";

  let { variant = "default" } = $props();
</script>
```

## Migration Steps

1. Update dependencies

   ```bash
   npm i svelte@next @sveltejs/kit@latest
   ```

2. Update shadcn-svelte

   ```bash
   npx shadcn-svelte@next init
   npx shadcn-svelte@next update
   ```

3. Update TypeScript config

   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "verbatimModuleSyntax": true
     }
   }
   ```

4. Update components to use runes

   - Convert state to `$state()`
   - Update props to use `$props()`
   - Replace `$:` with `$derived()`
   - Use `$effect()` for side effects

5. Update event handling
   - Review all event handlers
   - Update to new syntax where needed
   - Ensure proper event forwarding

## Common Issues

1. Props Type Errors

   - Ensure proper type imports
   - Use `$props()` with type definitions
   - Check for required vs optional props

2. Event Handling

   - Check event forwarding in custom components
   - Use proper event types from 'svelte/elements'
   - Handle keyboard events appropriately

3. State Management

   - Convert all reactive variables to `$state()`
   - Update computed values to `$derived()`
   - Check for proper cleanup in effects

4. shadcn Integration
   - Verify component imports
   - Check for proper event forwarding
   - Update to latest component versions

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte5)
- [SvelteKit 2 Migration Guide](https://kit.svelte.dev/docs/migrating-to-sveltekit-2)
- [shadcn-svelte Documentation](https://next.shadcn-svelte.com/)
