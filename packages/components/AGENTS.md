# AGENTS.md

Shared Vue 3 component library (`@1001-digital/components`). Not a Nuxt layer — used by `layers.base` which auto-imports everything.

## Peer dependencies

- `vue` (^3.5.0)
- `@1001-digital/styles` (workspace)

## Key dependencies

- `reka-ui` (^2.9.0) — accessible UI primitives ([reka-ui.com/llms.txt](https://reka-ui.com/llms.txt))
- `@vueuse/core` (^14.2.1) — Vue composition utilities
- `@internationalized/date` (^3.12.0) — date types for calendar/date components
- `luxon` (^3.7.0) — time formatting
- `@visualizevalue/opepicons` (^1.0.0) — generative avatars

## Exports

Entry point: `src/index.ts` (barrel export). Also exports:

- `./client-only` — array of components requiring browser APIs
- `./*` — direct access to any source file

## Client-only components

These need browser APIs and must be rendered client-side: `Combobox`, `ConfirmDialog`, `Dialog`, `Toasts`, `Popover`, `Dropdown`, `FormDatePicker`, `ColorPicker`.

## Components (50+)

### Layout

- `AppShell` — app layout scaffold
- `Sidebar` — collapsible sidebar navigation
- `BottomNav` — mobile bottom navigation
- `Card`, `CardLink` — card containers (CardLink is clickable)
- `Actions` — action button group

### Forms

- `Form` — form wrapper
- `FormGroup` — groups form items with shared label
- `FormItem` — individual form field with label/error support
- `FormLabel` — standalone label
- `FormInputGroup` — input with prefix/suffix
- `FormCheckbox`, `FormRadioGroup`, `FormSelect`, `FormSlider`, `FormSwitch`, `FormTextarea`
- `FormDateField` — date input field
- `FormDatePicker` — date picker with calendar

### Feedback

- `Alert` — alert banner
- `Dialog` — modal dialog (Reka UI)
- `ConfirmDialog` — confirmation modal (used by `useConfirm()`)
- `Toasts` — toast container (used by `useToast()`)
- `Loading` — loading spinner
- `Progress` — progress bar

### Overlays

- `Popover` — positioned popover
- `Dropdown` — dropdown menu with subcomponents: `DropdownGroup`, `DropdownItem`, `DropdownLabel`, `DropdownSub`, `DropdownSeparator`, `DropdownCheckboxItem`, `DropdownRadioGroup`, `DropdownRadioItem`
- `Tooltip` — hover tooltip
- `Combobox` — searchable select

### Content & misc

- `Button` — styled button
- `Icon` — icon renderer (uses `IconAliasesKey` injection)
- `Tag`, `Tags` — tag display
- `TagsInput` — tag input
- `Prose` — typography container
- `CopyText` — click-to-copy text
- `PinInput` — PIN/OTP code input
- `Calendar` — standalone calendar
- `ColorPicker` — color picker
- `Opepicon` — generative avatar from address/seed
- `Globals` — renders toast/confirm system (auto-mounted by layers.base plugin)

## Composables

- `useConfirm()` — programmatic confirmation dialogs
- `useToast()` — toast notifications
- `useSeconds()` — reactive current time in seconds
- `useCountDown(target)` — countdown to target timestamp
- `useTimeAgo(timestamp)` — relative time display
- `useSecondsAgo(timestamp)` — seconds since timestamp

## Utilities

- `formatNumber(n, decimals)` — locale-aware number formatting
- `roundAndFormatNumber(n, decimals)` — round then format
- `asPercentageOf(part, whole)` — percentage calculation
- `formatUSD(n)` — USD currency formatting
- `delay(ms)` — promise-based delay
- `daysInSeconds(days)` — convert days to seconds
- `nowInSeconds()` — current time in seconds
- `asUTCDate(timestamp)` — timestamp to UTC date

## Injection keys

- `LinkComponentKey` — provides the router link component (NuxtLink in Nuxt context)
- `IconAliasesKey` — provides icon name mappings
- `defaultIconAliases` — default alias map (check → lucide:check, etc.)

## Directory structure

```
src/
├── index.ts                  # Barrel export
├── client-only.ts            # Client-only component list
├── base/
│   ├── components/           # 50+ Vue SFC components
│   ├── composables/          # confirm.ts, toast.ts, time.ts
│   ├── utils/                # format-number.ts, time.ts
│   ├── icons.ts              # IconAliasesKey, defaultIconAliases
│   └── link.ts               # LinkComponentKey
```
