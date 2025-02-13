# Svelte-Electron Architecture Overview

## Core Components

### 1. Backend (Rust)
- `goose-server`: HTTP server with AppState management
- `goose-cli`: Command-line interface
- `goose`: Core AI agent library

### 2. Frontend (Svelte + Electron)
- Based on React implementation in `ui/desktop`
- Uses shadcn-svelte for UI components
- Communicates with backend via HTTP/SSE

## Key Architectural Points

### State Management
- Backend: Thread-safe AppState using Arc<Mutex>
- Frontend: Svelte stores (replacing React contexts)
- API authentication via secret key

### Communication Flow
1. Electron main process starts goose-server
2. Svelte UI makes authenticated API calls
3. Server-sent events for streaming responses

### File Organization
- `/src/lib` - Svelte components
- `/src/routes` - Page components
- `/src/stores` - State management
- `/src/api` - Backend communication

## Migration Strategy
1. Port core functionality first
2. Match React behavior exactly
3. Add Svelte-specific improvements
4. Maintain feature parity
