# Svelte Electron UI Migration Plan

## Overview

This plan outlines the strategy for creating a Svelte-based UI (dir: 'ui-svelte') for 'Goose AI', while maintaining the ability to pull updates from upstream. The goal is to create a parallel UI implementation that doesn't interfere with the original React-based (dir: 'ui/desktop') implementation.

If you run into issues/errors developing the Svelte UI logic, refer to the 'ui/desktop' implementation for guidance.

## Key Principles

1. **Zero Upstream Modifications**: No changes to upstream files to maintain ability to pull updates
2. **Clean Architecture**: Keep frontend (Svelte) and backend (Goose) separate, unlike the React implementation
3. **API-First**: Focus on proper API communication between UI and Goose instances
4. **Mirror React Structure**: Follow React component and routing structure closely for easier updates

## React App Analysis

### 1. Main Process (main.ts)

- Window Types:
  1. Launcher Window (Quick Command)
     - Small, frameless window
     - Triggered by global shortcut (Ctrl+Alt+Cmd+G)
     - Shows recent directories
  2. Chat Window (Main App)
     - Normal window with custom titlebar
     - Can have multiple instances
     - Handles directory/workspace context
  3. Welcome Flow
     - Shows on first launch
     - Provider selection
     - Directory setup

### 2. Window Creation Flow

1. **App Start**

   ```typescript
   app.whenReady().then(async () => {
     createTray();
     const recentDirs = loadRecentDirs();
     let openDir = dirPath || (recentDirs.length > 0 ? recentDirs[0] : null);
     createChat(app, undefined, openDir);
   });
   ```

2. **Chat Window Creation**

   ```typescript
   const createChat = async (
     app,
     query?: string,
     dir?: string,
     version?: string
   ) => {
     // 1. Start Goosed process
     const [port, working_dir, goosedProcess] = await startGoosed(app, dir);

     // 2. Create window with specific config
     const mainWindow = new BrowserWindow({
       titleBarStyle: "hidden",
       // ... window config
     });

     // 3. Load content with query params
     const queryParam = query
       ? `?initialQuery=${encodeURIComponent(query)}`
       : "";
     mainWindow.loadURL(`${url}${queryParam}`);
   };
   ```

### 3. React App Structure

1. **Entry Point** (`App.tsx`)

   - Handles deep links
   - Error boundaries
   - Provider contexts
   - Window type routing

2. **Welcome Flow** (`WelcomeScreen.tsx`)

   - Provider selection grid
   - Directory setup
   - First-time setup flow

3. **Chat Interface** (`ChatWindow.tsx`)
   - Message history
   - Input handling
   - Tool invocations
   - Extension management

## Implementation Progress

### Phase 1: Core Structure ✓

1. Initialize SvelteKit 2 project with Electron ✓
2. Setup types organization ✓
3. Basic Electron integration ✓
4. Goosed binary integration ✓
5. Moved all the React image files from 'ui/desktop/src' to 'ui-svelte/src-renderer'

### Phase 2: Window Management (Current)

1. **Main Process Setup**

   - [x] Implement window creation logic
   - [x] Handle window positioning
   - [x] Setup IPC communication
   - [x] Implement tray icon

2. **Welcome Flow**

   - [ ] Create WelcomeScreen component
   - [ ] Implement provider selection
   - [ ] Add directory setup
   - [ ] Test first-time flow

3. **Chat Window**
   - [ ] Basic window structure
   - [ ] Custom titlebar
   - [ ] Multiple window support
   - [ ] Directory context

### Next Steps

1. Test Current Implementation

   - [ ] Start app and verify main window
   - [ ] Test launcher window (Ctrl+Alt+Cmd+G)
   - [ ] Test directory handling
   - [ ] Verify window positioning
   - [ ] Check tray icon functionality

2. Create Welcome Flow

   - [ ] Design provider selection UI
   - [ ] Implement provider state management
   - [ ] Add directory selection
   - [ ] Test configuration persistence

3. Finally Chat Interface
   - [ ] Basic message display
   - [ ] Input handling
   - [ ] Tool integration
   - [ ] Extension support

## Testing Strategy

1. Test each component in isolation
2. Verify against React behavior
3. Check all window interactions
4. Validate IPC communication
5. Ensure theme consistency

## Current Tasks

1. Run the app and test window management:

Make sure you are in the 'ui-svelte' directory

```bash
yarn start
```

2. Verify:

   - Main window opens with correct size/position
   - Launcher window appears with Ctrl+Alt+Cmd+G
   - Recent directories are loaded/saved
   - Multiple windows position correctly
   - Tray icon works as expected

3. Fix any issues before moving to Welcome Flow
