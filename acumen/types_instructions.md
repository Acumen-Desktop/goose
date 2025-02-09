# Types Organization Guide

## Core Principles

- All type files end in `.d.ts`
- No type duplication between main/renderer processes
- Component-specific types stay with components
- Shared types go in appropriate `.d.ts` files
- Use `import type` for all type imports
- Never use `any` - use `unknown` if type is truly unknown
- Prefer interfaces over type aliases for better extensibility
- Use strict TypeScript configuration

## Critical Type Locations

```
ui-svelte/
├── src-main/types/           # Main Process Types
│   ├── electron.d.ts         # IPC & Window API
│   ├── ipc.d.ts             # IPC Events
│   ├── extensions.d.ts       # Extension System
│   ├── config.d.ts          # App Configuration
│   └── index.d.ts           # Type Exports
│
├── src-renderer/            # Renderer Process Types
    ├── app.d.ts             # Global & Window
    ├── types/               # Shared Types
    │   ├── api.d.ts         # API/Service Types
    │   ├── chat.d.ts        # Chat/Message Types
    │   ├── theme.d.ts       # Theme/Styling Types
    │   └── index.d.ts       # Type Exports
    └── lib/types/           # Component Types
        └── components.d.ts   # Shared Component Types
```

## Type Requirements

1. **IPC Communication**

   - Event names MUST be string literals
   - Event payloads MUST be typed
   - Event handlers MUST use typed event names
   - All IPC methods MUST be in `electron.d.ts`
   - All IPC events MUST be in `ipc.d.ts`
   - Preload script types MUST be in `electron.d.ts`

2. **Component Types**

   - Props MUST use `interface ComponentProps`
   - Events MUST use `svelte/elements` types
   - Custom events MUST use `createEventDispatcher`
   - Component types MUST be in `lib/types/components.d.ts`
   - Use Svelte 5 runes type syntax where applicable
   - Props validation through TypeScript, not runtime

3. **API/Service Types**

   - All API responses MUST be typed
   - Message types MUST be consistent between processes
   - Tool invocations MUST use strict types
   - API types MUST be in `types/api.d.ts`
   - Use zod for runtime validation when needed
   - Include proper error types and handling

4. **Window/Electron Types**
   - Window extensions MUST be in `app.d.ts`
   - Electron IPC methods MUST be in `electron.d.ts`
   - Process-specific types MUST be separated
   - Config types MUST be in `config.d.ts`
   - Environment types MUST be in `config.d.ts`

## Quick Reference

### How to Import Types

```typescript
// From main process
import type { ElectronAPI } from "../src-main/types";

// From renderer
import type { Message } from "../types/api";
import type { ComponentProps } from "$lib/types/components";

// Global types (no import needed)
// Available after declaring in app.d.ts
```

### Type Categories

- **electron.d.ts**: IPC methods, window extensions, preload
- **ipc.d.ts**: Event names, payloads, handlers
- **extensions.d.ts**: Extension configs, runtime, tools
- **config.d.ts**: App settings, environment
- **app.d.ts**: Window interface, global exports
- **api.d.ts**: API interfaces, messages, tools
- **chat.d.ts**: Chat, message, and conversation types
- **theme.d.ts**: Theme configuration and styling types

### Best Practices

1. **Type Exports**

   - Use barrel exports in index.d.ts files
   - Export only what's needed
   - Keep internal types internal

2. **Type Safety**

   - Enable strict TypeScript checks
   - Use satisfies operator for type checking
   - Avoid type assertions unless necessary

3. **Documentation**

   - Document complex types with JSDoc
   - Include examples for non-obvious usage
   - Reference related types and files

4. **Versioning**
   - Keep types in sync with implementations
   - Document breaking type changes
   - Use semantic versioning for type changes
