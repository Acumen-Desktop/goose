# Svelte Electron UI Migration Plan

## Overview

This plan outlines the strategy for creating a Svelte-based UI for Goose while maintaining the ability to pull updates from upstream. The goal is to create a parallel UI implementation that doesn't interfere with the original React-based implementation.

## Key Principles

1. **Zero Upstream Modifications**: No changes to upstream files to maintain ability to pull updates

#### Phase 1: Setup & Infrastructure ✓

1. Initialize SvelteKit 2 project with Electron, TailwindCSS, TypeScript ✓

Next steps:

- The analysis of the existing react/electron UI is here:
  'acumen/features/svelte-electron-ui/react-ui-logic.md'.

- Both React and Svelte have access to 'shadcn' style components. The react ones are here:
  'ui/desktop/src/components/ui'. And the svelte ones are here:'ui-svelte/src-renderer/lib/components/ui'.

  So, 'ui/desktop/src/components/ui/button.tsx' should be similar to 'ui-svelte/src-renderer/lib/components/ui/button/index.ts'.

  Basic components are in the 'ui' directory. Do not modify the basic components, but instead use them to build compound components.

#### Phase 2: Chat Interface - Core Components

1. Implement Chat Message Component
   - Create a new component at 'ui-svelte/src-renderer/lib/components/chat/ChatMessage.svelte'
   - Use Svelte 5 Runes for state management ($state, $derived as needed)
   - Utilize shadcn basic components (Button, Card) to match React UI styling
   - Include the following features:
     - Display message content (AI or user)
     - Show timestamp
     - Support markdown rendering
     - Basic interaction buttons (copy, etc.)
   - Write tests to ensure component behavior matches React version
   - Document component API and usage

This focused approach lets us:
- Test Svelte 5 Runes in a real component
- Verify shadcn component integration
- Establish patterns for future components
- Compare directly with React implementation
