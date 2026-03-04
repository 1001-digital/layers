# AGENTS.md

Shared Vue component library (`@1001-digital/components`) used by the Nuxt layers.

## Code style

- TypeScript
- Single quotes, no semicolons

## Structure

- `src/base/` — Base UI components, composables, and utilities
- `src/index.ts` — Main entry point (re-exports everything)

## Components (base)

Accessible components built on [Reka UI](https://reka-ui.com/llms.txt):

- Layout: Card, CardLink, Actions
- Feedback: Alert, Dialog, ConfirmDialog, Toasts, Loading, Progress
- Forms: Form, FormGroup, FormItem, FormLabel, FormInputGroup, FormCheckbox, FormRadioGroup, FormSelect, FormSlider, FormSwitch, FormTextarea, FormDateField, FormDatePicker
- Overlays: Popover, Dropdown (with Group, Item, Label, Sub, Separator, CheckboxItem, RadioGroup, RadioItem), Tooltip, Combobox
- Misc: Button, Icon, Tag, Tags, Opepicon, PinInput, Calendar, Globals

## Composables

- `useConfirm()` — Programmatic confirmation dialogs
- `useToast()` — Toast notifications
- `useSeconds()`, `useCountDown()`, `useTimeAgo()`, `useSecondsAgo()` — Time utilities

## Utilities

- `formatNumber()`, `roundAndFormatNumber()`, `asPercentageOf()`, `formatUSD()` — Number formatting
- `delay()`, `daysInSeconds()`, `nowInSeconds()`, `asUTCDate()` — Time utilities
