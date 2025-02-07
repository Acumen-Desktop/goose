# React UI Logic Analysis

## Main Application Structure

The React UI is organized into several key components and utilities:

### Core Windows
1. `App.tsx` - Main application component
2. `ChatWindow.tsx` - Main chat interface
3. `LauncherWindow.tsx` - Initial launcher/setup window

### Key Components

#### Chat Interface
- `components/chat_window/ChatLayout.tsx` - Main chat UI layout
- `components/GooseMessage.tsx` - AI response rendering
- `components/UserMessage.tsx` - User message rendering
- `components/GooseResponseForm.tsx` - Input form for user messages
- `components/ToolInvocations.tsx` - Handles tool call displays
- `components/MarkdownContent.tsx` - Markdown rendering for messages

#### Settings & Configuration
- `components/settings/Settings.tsx` - Main settings panel
- `components/settings/models/` - Model selection and configuration
- `components/settings/providers/` - AI provider configuration
- `components/settings/extensions/` - Extension management
- `components/settings/api_keys/` - API key management

#### UI Components
Located in `components/ui/`, these are reusable UI components that could be ported to Svelte:
- Button
- Modal
- Input
- Card
- Tooltip
- ScrollArea
- Switch
- Icons

### Utilities

#### AI Integration (`ai-sdk-fork/`)
Reusable logic for AI interaction:
- `useChat.ts` - Chat state management hook
- `call-custom-chat-api.ts` - API interaction
- `process-custom-chat-response.ts` - Response processing

#### General Utilities (`utils/`)
- `askAI.ts` - AI interaction utilities
- `settings.ts` - Settings management
- `providerUtils.ts` - AI provider helpers
- `urlUtils.ts` - URL handling
- `logger.ts` - Logging functionality

### Electron Integration
- `main.ts` - Electron main process
- `preload.ts` - Preload script for Electron
- `renderer.tsx` - Renderer process setup

## Key Reusable Logic

Several parts of the codebase could be reused in the Svelte implementation:

1. **AI Communication Layer**
   - The entire `ai-sdk-fork` directory contains provider-agnostic chat functionality
   - Response processing logic
   - API call handling

2. **Settings Management**
   - Configuration schema and validation
   - Provider and model management
   - API key storage and retrieval

3. **Tool Integration**
   - Tool call parsing and execution
   - Tool response formatting
   - Tool UI rendering logic

4. **Electron Integration**
   - IPC communication setup
   - Window management
   - System integration (file system, clipboard, etc.)

## Migration Strategy

For the Svelte implementation, we should:

1. **Keep Shared Logic**
   - Reuse the AI SDK fork as-is
   - Port utility functions that aren't React-specific
   - Maintain the same Electron integration patterns

2. **Rebuild UI Components**
   - Recreate UI components using Svelte
   - Use SvelteKit stores instead of React state management
   - Implement Svelte equivalents of React hooks where needed

3. **Enhanced Areas**
   - Consider using Svelte's reactive statements for simpler state management
   - Take advantage of Svelte's built-in transitions
   - Use Svelte stores for global state instead of React contexts

## Next Steps

1. Set up the basic Svelte component structure mirroring the React layout
2. Port the AI SDK integration first
3. Implement the chat interface
4. Add settings and configuration components
5. Integrate tool handling
6. Polish the UI and transitions