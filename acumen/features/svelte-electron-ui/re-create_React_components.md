# Re-creating React UI Components in Svelte 5

## Source Structure

- React basic components: `ui/desktop/src/components/ui`
- React compound components: `ui/desktop/src/components`
- React Icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg` and converted to svg files.
- Svelte 5 components: `ui-svelte/src-renderer/lib/components/shadcn-ui`
- Raw SVG icons moved to: `ui-svelte/src-renderer/lib/assets/icons-svg`

Here is a list of all potential "shadcn-react" components:
Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, Form, Hover Card, Input, Input OTP, Label, Menubar, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip.

Here is a list of "shadcn-svelte" components:
Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, Form, Hover Card, Input, Input OTP, Label, Menubar, Pagination, Popover, Progress, Radio Group, Range Calendar, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toggle, Toggle Group, Tooltip

Shadcn-svelte includes "Range Calendar", but not "Navigation Menu".

Go one by one through: 'ui/desktop/src/components/ui'. If it is a 'shadcn-react' component, create a 'shadcn-svelte' component in: 'ui-svelte/src-renderer/lib/components/shadcn-ui'. Else, create a compound svelte component in: 'ui-svelte/src-renderer/lib/components/basic-ui'. Keep the same file naming convention. It may be that shadcn components start with a lowercase letter, and basic components start with an uppercase letter.

There is also on 'ts' file, 'ui/desktop/src/components/ui/select-styles.ts', I am not sure what this is for. Review it and suggest a sub-folder for 'dependencies' etc.?

Use Svelte 5!

Do the first 4 components, and then review.

If the 'component' is actually a 'route', check and update the sveltekit 2 routes here: 'ui-svelte/src-renderer/routes'.
