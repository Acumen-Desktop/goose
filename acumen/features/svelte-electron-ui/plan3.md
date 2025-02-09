# Svelte Electron UI Migration Plan

## Overview

This plan outlines the strategy for creating a Svelte-based UI for 'Goose AI', while maintaining the ability to pull updates from upstream. The goal is to create a parallel UI implementation that doesn't interfere with the original React-based implementation.

## Key Principles

1. **Zero Upstream Modifications**: No changes to upstream files to maintain ability to pull updates
2. **Clean Architecture**: Keep frontend (Svelte) and backend (Goose) separate, unlike the React implementation
3. **API-First**: Focus on proper API communication between UI and Goose instances

## Progress & Learnings

#### Phase 1: Setup & Infrastructure ✓

1. Initialize SvelteKit 2 project with Electron, TailwindCSS, TypeScript ✓
2. Setup 'types' organization. Documented in 'acumen/types_instructions.md'. ✓
3. Basic Electron integration with preload scripts ✓
4. Goosed binary integration and startup ✓

#### Phase 2: Core Architecture (In Progress)

1. Asset handling and build configuration

   - Vite + SvelteKit static adapter setup ✓
   - Asset path resolution in Electron main process ✓
   - Proper build output directory structure ✓

2. IPC Communication
   - Preload script configuration ✓
   - Window API exposure ✓
   - Config passing between processes ✓

#### Next Steps

1. **Asset Loading**

   - [ ] Fix asset loading in development mode
   - [ ] Ensure proper asset paths in production build
   - [ ] Test static file serving through Electron protocol

2. **UI Implementation**

   - [ ] Port core UI components from React
   - [ ] Implement chat interface
   - [ ] Add theme support
   - [ ] Implement window controls

3. **State Management**

   - [ ] Define state management strategy
   - [ ] Implement chat history
   - [ ] Handle configuration persistence

4. **Testing & Packaging**
   - [ ] Add unit tests for core functionality
   - [ ] Set up E2E testing
   - [ ] Configure electron-forge for production builds

## Technical Decisions

1. **Build System**

   - Using Vite for both main and renderer processes
   - SvelteKit with static adapter for SPA mode
   - Electron-forge for application packaging

2. **Development Mode**

   - Vite dev server for renderer
   - Watch mode for main/preload scripts
   - Hot module replacement enabled

3. **Production Build**

   - Static HTML/JS/CSS output
   - CommonJS for main/preload
   - ESM for renderer
   - Assets served through custom Electron protocol

4. **Type System**
   - Strict TypeScript configuration
   - Shared types between processes
   - No type duplication
   - Component-specific types with components
