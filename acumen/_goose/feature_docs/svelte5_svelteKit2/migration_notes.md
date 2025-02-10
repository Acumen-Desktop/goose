# Svelte 5 + SvelteKit 2 Migration Notes

## ⚠️ CRITICAL CHANGES - READ FIRST

### Event Handling

```svelte
// ❌ Svelte 4 (Wrong)
<button on:click={handler}>
<div on:mouseenter={handler}>

// ✅ Svelte 5 (Correct)
<button onclick={handler}>
<div onmouseenter={handler}>
```

### Content Injection

```svelte
// ❌ Svelte 4 (Wrong)
<slot>Default content</slot>
<slot name="named">Default</slot>

// ✅ Svelte 5 (Correct)
{@render children?.()}
{@render actions?.()}

// Props definition
let {
  children = () => null,
  actions = () => null
} = $props();
```

### State and Props

```svelte
// ❌ Svelte 4 (Wrong)
export let count = 0;
$: doubled = count * 2;

// ✅ Svelte 5 (Correct)
let { prop = defaultValue } = $props();
let count = $state(0);
let doubled = $derived(count * 2);
let bindable = $bindable(initialValue);
```

### Effects

```svelte
// ❌ Svelte 4 (Wrong)
$: if (count > 0) console.log(count);

// ✅ Svelte 5 (Correct)
$effect(() => {
  if (count > 0) console.log(count);
});
```

## Component Props Pattern

```svelte
let {
  // Two-way binding
  isOpen = $bindable(false),

  // Regular props with defaults
  title = "",
  class: className = "",

  // Render function props
  children = () => null,
  actions = () => null,

  // Rest props
  ...restProps
} = $props();
```

## shadcn-svelte Integration

- Update to latest version: `npx shadcn-svelte@next update`
- Update bits-ui: `npm i bits-ui@next`
- Remove cmdk-sv (merged into bits-ui)
- Update components.json with new registry

## Project Structure

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

### State Management

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log(`Count changed to ${count}`);
  });
</script>
```

### Event Dispatching

```svelte
<script lang="ts">
  const dispatch = createEventDispatcher<{
    customEvent: { data: string }
  }>();
</script>
```

### shadcn-svelte Components

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui-shadcn/button";
  import { Card } from "$lib/components/ui-shadcn/card";

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

4. Update components:
   - Convert state to `$state()`
   - Update props to use `$props()`
   - Replace `$:` with `$derived()`
   - Use `$effect()` for side effects
   - Replace `on:event` with `onevent`
   - Replace `<slot>` with `{@render}`

## Common Issues

1. Props Type Errors

   - Ensure proper type imports
   - Use `$props()` with type definitions
   - Check for required vs optional props

2. Event Handling

   - Use `onclick`, `onmouseenter`, etc.
   - Use proper event types
   - Handle keyboard events appropriately

3. State Management

   - Convert all reactive variables to `$state()`
   - Update computed values to `$derived()`
   - Check for proper cleanup in effects

4. Content Injection
   - Replace all slots with render functions
   - Provide default values `() => null`
   - Use optional chaining with `{@render prop?.()}`

## Resources

- [Svelte 5 Documentation](https://svelte.dev/docs/svelte5)
- [SvelteKit 2 Migration Guide](https://kit.svelte.dev/docs/migrating-to-sveltekit-2)
- [shadcn-svelte Documentation](https://next.shadcn-svelte.com/)
