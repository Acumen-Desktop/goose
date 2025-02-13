# State Management in Svelte UI

## Core State Stores

### 1. Provider Store
```typescript
// stores/provider.ts
import { writable } from 'svelte/store';

interface ProviderState {
  current: string | null;
  available: string[];
  configs: Record<string, boolean>;
}

export const providerStore = writable<ProviderState>({
  current: null,
  available: [],
  configs: {}
});
```

### 2. Model Store
```typescript
// stores/model.ts
import { writable } from 'svelte/store';

interface ModelState {
  current: string | null;
  recent: string[];
  byProvider: Record<string, string[]>;
}

export const modelStore = writable<ModelState>({
  current: null,
  recent: [],
  byProvider: {}
});
```

### 3. Config Store
```typescript
// stores/config.ts
import { writable } from 'svelte/store';

interface ConfigState {
  secretKey: string;
  apiUrl: string;
  theme: 'light' | 'dark';
}

export const configStore = writable<ConfigState>({
  secretKey: '',
  apiUrl: '',
  theme: 'dark'
});
```

## React Context Equivalents

| React Context | Svelte Store |
|---------------|--------------|
| ActiveKeysContext | configStore |
| ModelContext | modelStore |
| ThemeContext | configStore (theme) |

## Usage Pattern
```typescript
// In Svelte components
import { providerStore, modelStore } from '../stores';

// Subscribe to changes
$: provider = $providerStore.current;
$: model = $modelStore.current;

// Update state
providerStore.update(state => ({
  ...state,
  current: newProvider
}));
```

## Key Differences from React
1. Reactive by default with $ syntax
2. No need for useContext
3. Simpler subscription management
4. Automatic cleanup on component destroy
