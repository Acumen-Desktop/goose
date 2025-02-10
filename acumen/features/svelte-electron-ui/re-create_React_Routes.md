This is a 'React' app located at: 'ui/desktop'. 

Read 'ui/desktop/package.json'.
- Package manager: npm

# Current React Routes
The React routes are defined in `ui/desktop/src/components/chat_window/ChatRoutes.tsx`:
```
Routes
  - /chat/:id
  - /settings
  - /settings/more-models
  - /settings/configure-providers
  - /welcome
  - * (redirects to /chat/1)
```

# SvelteKit Route Structure
These routes will be converted to SvelteKit's folder-based routing system:
```
src/routes/
├── chat/[id]/+page.svelte        # Dynamic route for chat pages
├── settings/
│   ├── +page.svelte             # Main settings page
│   ├── more-models/+page.svelte # More models settings
│   └── configure-providers/+page.svelte # Provider configuration
├── welcome/+page.svelte         # Welcome screen
└── +layout.svelte              # Root layout (handles fallback redirect)
```

# Terminal Commands
Run these commands to create the SvelteKit route structure (you can copy/paste all lines at once):

```bash
mkdir -p ui-svelte/src-renderer/routes/chat/[id]
touch ui-svelte/src-renderer/routes/chat/[id]/+page.svelte
mkdir -p ui-svelte/src-renderer/routes/settings
touch ui-svelte/src-renderer/routes/settings/+page.svelte
mkdir -p ui-svelte/src-renderer/routes/settings/more-models
touch ui-svelte/src-renderer/routes/settings/more-models/+page.svelte
mkdir -p ui-svelte/src-renderer/routes/settings/configure-providers
touch ui-svelte/src-renderer/routes/settings/configure-providers/+page.svelte
mkdir -p ui-svelte/src-renderer/routes/welcome
touch ui-svelte/src-renderer/routes/welcome/+page.svelte
touch ui-svelte/src-renderer/routes/+layout.svelte
```

Note: The root layout file (+layout.svelte) will handle the fallback redirect to '/chat/1' for unmatched routes.
