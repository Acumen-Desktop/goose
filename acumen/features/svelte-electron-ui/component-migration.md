# Component Migration Guide

## Component Structure

### React to Svelte Mapping
```
React                          Svelte
----------------------------------------
/components                    /src/lib/components
  /ui                           /ui
  /settings                     /settings
  /chat                         /chat
App.tsx                       App.svelte
ChatWindow.tsx                ChatWindow.svelte
```

## Key Differences

### 1. Props and Events
```typescript
// React
interface Props {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

// Svelte
<script lang="ts">
  export let onSubmit: (value: string) => void;
  export let disabled = false;
</script>
```

### 2. State Management
```typescript
// React
const [value, setValue] = useState('');

// Svelte
let value = '';
$: console.log(value); // Reactive
```

### 3. Effects
```typescript
// React
useEffect(() => {
  // Side effect
  return () => cleanup();
}, [deps]);

// Svelte
onMount(() => {
  // Side effect
  return () => cleanup();
});
```

## Migration Steps

1. Core Components First
   - ChatWindow
   - Settings
   - Provider/Model selection

2. UI Components
   - Port shadcn components
   - Maintain styling
   - Keep component small

3. Features
   - One feature at a time
   - Test thoroughly
   - Document differences

4. State Management
   - Convert contexts to stores
   - Use reactive statements
   - Keep state minimal
