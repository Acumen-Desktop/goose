# TypeScript Organization Guide

## Core Rules
- Use `.d.ts` for type files
- No type duplication across processes
- Component types stay with components
- Use `import type` statements
- Use `unknown` instead of `any`
- Prefer interfaces over type aliases
- Use strict TypeScript config

## File Structure
```
ui-svelte/
├── src-main/types/          
│   ├── electron.d.ts       # IPC & Window API
│   ├── ipc.d.ts           # IPC Events & Payloads
│   ├── extensions.d.ts    # Extension System
│   ├── config.d.ts        # App & Env Config
│   └── index.d.ts         # Type Exports
│
├── src-renderer/          
    ├── app.d.ts           # Global & Window
    ├── types/             # Shared Types
    │   ├── api.d.ts       # API/Service Types
    │   ├── chat.d.ts      # Chat/Message Types
    │   ├── theme.d.ts     # Theme/Styling Types
    │   └── index.d.ts     # Type Exports
    └── lib/types/         # Component Types
        └── components.d.ts # Shared Components
```

## Type Requirements

### IPC & Electron
- Event names: string literals
- Event payloads & handlers: typed
- IPC methods: `electron.d.ts`
- IPC events: `ipc.d.ts`
- Window extensions: `app.d.ts`
- Preload types: `electron.d.ts`
- Config & env: `config.d.ts`

### Components
- Props: `interface ComponentProps`
- Events: `svelte/elements` types
- Custom events: `createEventDispatcher`
- Location: `lib/types/components.d.ts`
- Validation: TypeScript, not runtime
- Use Svelte 5 rune types when applicable

### API/Services
- API responses: fully typed
- Message types: consistent across processes
- Tool invocations: strict types
- Location: `types/api.d.ts`
- Runtime validation: zod when needed
- Include error types & handling

## Imports
```typescript
// Main process
import type { ElectronAPI } from "../src-main/types";

// Renderer
import type { Message } from "../types/api";
import type { ComponentProps } from "$lib/types/components";

// Global (from app.d.ts)
declare global { interface Window { ... } }
```

## Best Practices
1. **Exports**
   - Use barrel exports in index.d.ts
   - Export only what's needed
   - Keep internal types internal

2. **Safety**
   - Enable strict mode
   - Use satisfies operator
   - Minimize type assertions

3. **Documentation**
   - JSDoc for complex types
   - Examples for non-obvious usage
   - Cross-reference related types

4. **Versioning**
   - Sync types with implementations
   - Document breaking changes
   - Use semantic versioning
