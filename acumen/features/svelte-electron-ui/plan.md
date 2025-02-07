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

- The shadcn docs are here:
  'acumen/features/shadcn-svelte/shad-docs.md'
