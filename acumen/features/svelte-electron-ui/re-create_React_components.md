# Converting React UI to SvelteKit

## Current Approach

### Page-First Component Migration

We're taking a page-first approach to converting the React UI to SvelteKit. This means:

1. First, identify the main pages/routes in the React app
2. Create corresponding SvelteKit routes
3. Convert components as needed while building each route
4. Test the functionality as we go

### Current Focus

- Converting the main chat interface from React to SvelteKit
- Ensuring Electron integration works correctly
- Maintaining feature parity while improving the architecture

### Directory Structure

```
ui-svelte/
├── src-main/              # Electron main process
├── src-renderer/          # SvelteKit app
│   ├── routes/           # SvelteKit routes (pages)
│   │   ├── chat/        # Chat interface
│   │   ├── settings/    # Settings pages
│   │   └── +layout.svelte
│   └── lib/
│       ├── components/
│       │   ├── basic-ui/     # Atomic components
│       │   ├── compound/     # Reusable compound components
│       │   ├── features/     # Complex feature components
│       │   └── shadcn-ui/    # Shadcn components
│       ├── stores/          # Svelte stores
│       └── utils/           # Utility functions
```

### Component Categories

1. **Route Components** (`routes/`): Full pages/features
2. **Feature Components** (`lib/components/features/`): Complex, business-logic heavy components
3. **Compound Components** (`lib/components/compound/`): Reusable combinations of basic components
4. **Basic UI Components** (`lib/components/basic-ui/`): Atomic UI components

### Migration Status

- [✅] Project structure setup
- [✅] Basic UI components converted
- [⏳] Main chat interface
- [❌] Settings pages
- [❌] Extension system
- [❌] Keyboard shortcuts

## Source Structure

- React basic components: `ui/desktop/src/components/ui`
- React compound components: `ui/desktop/src/components`
- React Icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg` and converted to svg files.
- Svelte 5 components: `ui-svelte/src-renderer/lib/components/shadcn-ui`
- Raw SVG icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg`

## SVG Conversion Process

When converting React SVG components to Svelte:

1. Create raw SVG files in `ui-svelte/src-renderer/lib/assets/icons-svg/`
2. Import SVGs directly in Svelte components:

   ```svelte
   <script lang="ts">
     import icon from "$lib/assets/icons-svg/icon.svg";
   </script>

   <img src={icon} alt="Icon description" />
   ```

3. For dynamic styling, use CSS classes or style props on the `<img>` tag
4. For hover effects, use Svelte's class directives:
   ```svelte
   <img
     src={icon}
     class="{hover ? 'opacity-0 group-hover:opacity-100' : ''}"
   />
   ```

### Benefits of This Approach

- Better type safety with direct imports
- Vite handles asset optimization
- Simpler than using inline SVGs
- Works well with Svelte 5's new props syntax
- Easier to maintain and update SVG assets

## React Components List

Here is a list of all potential "shadcn-react" components:
accordion, alert, alert dialog, aspect ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context menu, data table, date picker, dialog, drawer, dropdown menu, form, hover card, input, input otp, label, menubar, navigation menu, pagination, popover, progress, radio group, resizable, scroll area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, toggle group, tooltip.

## Svelte 5 Components List

Here is a list of "shadcn-svelte" components:
accordion, alert, alert dialog, aspect ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, combobox, command, context menu, data table, date picker, dialog, drawer, dropdown menu, form, hover card, input, input otp, label, menubar, pagination, popover, progress, radio group, range calendar, resizable, scroll area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle group, tooltip

Shadcn-svelte includes "Range Calendar", but not "Navigation Menu".

### Custom Components to Convert

Status:
✅ = Converted
⏳ = In Progress
❌ = Not Started
🚫 = Skipped (using shadcn or not needed)
📝 = Converted to SVG

#### Basic UI Components

- [✅] BackButton.tsx

  - Lessons:
    - Use `Icon` component for SVGs
    - Use `onclick` instead of `on:click`
    - Use `$bindable` for props that need two-way binding

- [✅] BaseModal.tsx

  - Lessons:
    - Use native `<dialog>` element instead of custom modal
    - Use CSS animations instead of Svelte transitions for better performance
    - Use `{@render}` instead of `<slot>`
    - Props should be render functions: `children = () => null`

- [📝] Box.tsx

  - Status: Done
  - Lessons:
    - React component was just an SVG wrapper
    - Should be converted to a raw SVG file with CSS variables
    - Use `Icon` component for rendering

- [🚫] card.tsx

  - Lessons:
    - Using shadcn-svelte's Card component instead
    - No need to recreate as it's part of shadcn-ui

- [❌] select-styles.ts
  - Status: Not a component, just styles
  - Used by shadcn-svelte Select component

#### SVG Icons to Convert

All of these should be converted to .svg files:

- [📝] Plus.tsx

  - Lessons:
    - Use `currentColor` instead of hardcoded colors for theme support
    - Make opacity configurable with CSS variables
    - Default size should be a common icon size (18px)
    - Fix attribute names to kebab-case
    - Remove unnecessary style attributes

- [✅] Send.tsx
- [✅] Stop.tsx
- [✅] VertDots.tsx
- [✅] X.tsx
- [✅] icons.tsx (contains multiple icons to extract)

#### shadcn Components (Skip)

These are already available in shadcn-svelte:

- [🚫] avatar.tsx
- [🚫] button.tsx
- [🚫] input.tsx
- [🚫] label.tsx
- [🚫] popover.tsx
- [🚫] scroll-area.tsx
- [🚫] switch.tsx

#### Custom Components to Create

These need custom Svelte implementations:

- [ ] ConfirmationModal.tsx (extends BaseModal)
- [ ] modal.tsx (different from BaseModal, check if needed)
- [ ] Tooltip.tsx (check if different from shadcn)

#### Remaining Components to Process

- [ ] BaseButton.tsx
- [ ] BaseCheckbox.tsx
- [ ] BaseInput.tsx
- [ ] BaseRadio.tsx
- [ ] BaseSelect.tsx
- [ ] BaseTextArea.tsx
- [ ] Button.tsx
- [ ] Checkbox.tsx
- [ ] ContextMenu.tsx
- [ ] Dialog.tsx
- [ ] DropdownMenu.tsx
- [ ] Form.tsx
- [ ] Input.tsx
- [ ] Label.tsx
- [ ] Popover.tsx
- [ ] Radio.tsx
- [ ] RadioGroup.tsx
- [ ] ScrollArea.tsx
- [ ] Select.tsx
- [ ] Separator.tsx
- [ ] Sheet.tsx
- [ ] Switch.tsx
- [ ] Table.tsx
- [ ] Tabs.tsx
- [ ] TextArea.tsx
- [ ] Toast.tsx
- [ ] Tooltip.tsx

## STEPS

Go through the files one by one in: 'ui/desktop/src/components/ui'.

If the react component is in the React Components List, check if it is also in the Svelte 5 Components List, and if so, skip.

If the react component is NOT in the Svelte 5 Components List, analyze the component and create a Svelte 5 equivalent component in: 'ui-svelte/src-renderer/lib/components/basic-ui'. Keep the same file naming convention. Use raw SVG icons from: 'ui-svelte/src-renderer/lib/assets/icons-svg', if they exist, else create new ones. Check if they exist first.

Use the latest Svelte 5! Not older Svelte. You made Svelte 5 notes here:
'acumen/\_goose/feature_docs/svelte5_svelteKit2/migration_notes.md', update it as needed.

Stop after each component is converted for review.
