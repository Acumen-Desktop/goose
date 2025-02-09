# Re-creating React UI Components in Svelte 5

## Source Structure

- React basic components: `ui/desktop/src/components/ui`
- React compound components: `ui/desktop/src/components`
- React Icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg` and converted to svg files.
- Svelte 5 components: `ui-svelte/src-renderer/lib/components/shadcn-ui`
- Raw SVG icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg`

## SVG Conversion Process

When encountering React components that are just SVG wrappers:

1. Create a new .svg file in `ui-svelte/src-renderer/lib/assets/icons-svg`
2. Extract the SVG content from the React component
3. For dynamic props (like size), use CSS variables in the SVG:
   ```svg
   <svg width="var(--size, 24)" height="var(--size, 24)" ...>
   ```
4. Use the `Icon` component to render with props:
   ```svelte
   <Icon name="icon-name" style="--size: {size}px" />
   ```

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
