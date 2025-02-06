# Svelte Electron UI Migration Plan

## Overview

This plan outlines the strategy for creating a Svelte-based UI for Goose while maintaining the ability to pull updates from upstream. The goal is to create a parallel UI implementation that doesn't interfere with the original React-based implementation.

## Key Principles

1. **Zero Upstream Modifications**: No changes to upstream files to maintain ability to pull updates
2. **Code Reuse**: Maximize reuse of existing business logic and Electron integration
3. **Parallel Implementation**: Build alongside existing React UI without interference
4. **Future-Proof Architecture**: Design for easy upstream updates while maintaining independence

## Implementation Strategy

### 1. Project Structure

- Created new `ui-svelte` directory parallel to existing `ui` directory
- Cloned 'https://github.com/codec-xyz/vtest' to the new directory, as it is similar to the structure of the existing UI
- Use 'Shadcn-svelte' for the UI components. Setup via 'npx shadcn-svelte@next init', add via 'npx shadcn-svelte@next add [component]', docs here: 'https://next.shadcn-svelte.com/docs/cli'

### 2. Code Reuse Strategy
- **Types & Interfaces**: Copy and maintain parallel versions of shared types
- **Electron IPC**: Reuse existing IPC patterns and message formats
- **State Management**: Implement Svelte stores that mirror React Redux patterns
- **Business Logic**: Extract and reuse core business logic where possible

### 3. State Management Architecture

#### Store Structure
```typescript
// stores/core.ts
import { writable, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'

export interface CoreState {
  // Mirror existing Redux state structure
}

function createCoreStore() {
  const { subscribe, set, update } = writable<CoreState>(initialState)
  
  return {
    subscribe,
    // Mirror Redux actions as methods
    someAction: (payload) => update(state => ({
      ...state,
      // Update logic
    })),
    // Additional action creators as methods
  }
}

export const coreStore = createCoreStore()
```

#### IPC Integration
```typescript
// stores/ipc-bridge.ts
import { get } from 'svelte/store'
import { coreStore } from './core'

// Mirror existing IPC patterns
window.electron.on('some-event', (event, data) => {
  coreStore.someAction(data)
})

export function sendToMain(channel: string, data: any) {
  window.electron.send(channel, data)
}
```

#### Store Organization
- **Core Store**: Application state and main functionality
- **UI Store**: UI-specific state (themes, layouts, preferences)
- **Feature Stores**: Modular stores for specific features
- **Shared Types**: Common interfaces between React and Svelte implementations

### 4. Development Phases

#### Phase 1: Setup & Infrastructure ✓
1. Initialize SvelteKit 2 project with TypeScript ✓
2. Setup Electron integration for SvelteKit ✓
3. Establish build and development workflow ✓
4. Create basic IPC bridge

#### Phase 2: State Management & Core Architecture
1. Implement core store structure
2. Setup IPC bridge integration
3. Create shared types package
4. Test state management with simple feature

#### Phase 3: Core UI Components
1. Create Svelte versions of core UI components using shadcn-svelte
2. Implement base layouts and navigation
3. Port essential UI patterns

#### Phase 4: Feature Implementation
1. Systematically implement each major feature
2. Port UI interactions and workflows
3. Ensure cross-platform compatibility

#### Phase 5: Testing & Refinement
1. Implement test suite
2. Performance optimization
3. UX refinement

### 5. Build & Distribution
- Maintain separate build pipelines for React and Svelte versions
- Share electron-builder configuration where possible
- Create distinct distribution packages

## Challenges & Considerations

1. **State Management**:
   - Mapping Redux patterns to Svelte stores while maintaining idioms
   - Managing shared state between features
   - Handling upstream Redux store changes
   - Type safety across store boundaries

2. **TypeScript Integration**:
   - Ensure type definitions work across both implementations
   - Maintain type safety in IPC communication
   - Share types between React and Svelte codebases

3. **Development Workflow**:
   - Setup efficient development process that doesn't interfere with React version
   - Maintain ability to test both UIs independently
   - Handle upstream changes smoothly

4. **Build Process**:
   - Handle electron-builder configuration for both versions
   - Manage dependencies efficiently
   - Optimize build performance

## Next Steps
1. Complete IPC bridge implementation
2. Create core store structure
3. Implement shared types package
4. Build proof-of-concept feature using new architecture

## Success Metrics
1. Zero modifications to upstream code
2. Feature parity with React implementation
3. Maintainable codebase with clear separation of concerns
4. Efficient development workflow
5. Type-safe state management across boundaries
6. Smooth handling of upstream changes