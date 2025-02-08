# Types Organization Guide

## Core Principles

- All type files end in `.d.ts`
- No type duplication between main/renderer processes
- Component-specific types stay with components
- Shared types go in appropriate `.d.ts` files
- Use `import type` for all type imports
- Never use `any` - use `unknown` if type is truly unknown

## Critical Type Locations

```
ui-svelte/
├── src-main/types/           # Main Process Types
│   ├── electron.d.ts         # IPC & Window API
│   ├── ipc.d.ts             # IPC Events
│   ├── extensions.d.ts       # Extension System
│   └── config.d.ts          # App Configuration
│
├── src-renderer/            # Renderer Process Types
    ├── app.d.ts             # Global & Window
    ├── types/api.d.ts       # API/Service Types
    └── lib/types/           # Component Types
```

## Type Requirements

1. **IPC Communication**

   - Event names MUST be string literals
   - Event payloads MUST be typed
   - Event handlers MUST use typed event names
   - All IPC methods MUST be in `electron.d.ts`
   - All IPC events MUST be in `ipc.d.ts`

2. **Component Types**

   - Props MUST use `interface ComponentProps`
   - Events MUST use `svelte/elements` types
   - Custom events MUST use `createEventDispatcher`
   - Component types MUST be in `lib/types/components.d.ts`

3. **API/Service Types**

   - All API responses MUST be typed
   - Message types MUST be consistent between processes
   - Tool invocations MUST use strict types
   - API types MUST be in `types/api.d.ts`

4. **Window/Electron Types**
   - Window extensions MUST be in `app.d.ts`
   - Electron IPC methods MUST be in `electron.d.ts`
   - Process-specific types MUST be separated

## Quick Reference

### How to Import Types

```typescript
// From main process
import type { ElectronAPI } from "../src-main/types";

// From renderer
import type { Message } from "../types/api";

// Global types (no import needed)
// Available after declaring in app.d.ts
```

### Type Categories

- **electron.d.ts**: IPC methods, window extensions
- **ipc.d.ts**: Event names, payloads, handlers
- **extensions.d.ts**: Extension configs, runtime, tools
- **config.d.ts**: App settings, environment
- **app.d.ts**: Window interface, global exports
- **api.d.ts**: API interfaces, messages, tools
