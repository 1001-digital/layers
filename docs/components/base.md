# Base Components

Base components come from `@1001-digital/components`. Nuxt apps usually receive them through `@1001-digital/layers.base`; non-Nuxt Vue apps can import them directly from the package.

## Layout and Structure

| Component   | Purpose                                                         |
| ----------- | --------------------------------------------------------------- |
| `AppShell`  | Application shell layout with sidebar and main content regions. |
| `Sidebar`   | Sidebar container for navigation-heavy layouts.                 |
| `BottomNav` | Mobile-oriented bottom navigation.                              |
| `Card`      | Bordered content container.                                     |
| `CardLink`  | Link-style card wrapper using the provided link component.      |
| `Prose`     | Content wrapper for long-form text.                             |
| `Actions`   | Button/action layout container.                                 |

```vue
<template>
  <AppShell>
    <template #sidebar>
      <Sidebar>
        <NuxtLink to="/">Dashboard</NuxtLink>
      </Sidebar>
    </template>

    <Card>
      <h1>Dashboard</h1>
      <p class="muted">Overview and recent activity.</p>
    </Card>
  </AppShell>
</template>
```

## Buttons and Feedback

| Component  | Purpose                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `Button`   | Base button with class-driven variants such as `primary`, `tertiary`, `small`, `link`, `inline`, and `danger`. |
| `Alert`    | Inline alert with `info` and `error` variants.                                                                 |
| `Toasts`   | Toast viewport rendered by the layer globals plugin.                                                           |
| `Loading`  | Loading indicator.                                                                                             |
| `Progress` | Progress bar.                                                                                                  |
| `Tag`      | Single tag chip.                                                                                               |
| `Tags`     | Tag list wrapper.                                                                                              |
| `CopyText` | Copy-to-clipboard text control.                                                                                |

```vue
<template>
  <Actions>
    <Button class="primary">
      <Icon name="check" />
      <span>Confirm</span>
    </Button>
    <Button class="danger">Delete</Button>
  </Actions>
</template>
```

`Button` renders a native `button` by default. When passed a `to` prop it renders through the provided link component, which is `NuxtLink` when used through the base layer.

## Overlays

| Component       | Purpose                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| `Dialog`        | Accessible dialog wrapper around native dialog behavior.                               |
| `ConfirmDialog` | Global confirm dialog controlled by `useConfirm()`.                                    |
| `Popover`       | Floating panel for contextual content.                                                 |
| `Tooltip`       | Accessible tooltip.                                                                    |
| `Dropdown`      | Menu root with item, group, label, separator, checkbox, radio, and submenu components. |

```vue
<template>
  <Dialog
    v-model:open="open"
    title="Edit profile"
  >
    <Form>
      <FormLabel label="Name">
        <input v-model="name" />
      </FormLabel>
    </Form>
  </Dialog>
</template>
```

Dropdown-related components:

`Dropdown`, `DropdownItem`, `DropdownGroup`, `DropdownLabel`, `DropdownSeparator`, `DropdownCheckboxItem`, `DropdownRadioGroup`, `DropdownRadioItem`, `DropdownSub`.

## Forms and Data Entry

| Component        | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `Form`           | Grid-based form wrapper.                        |
| `FormItem`       | Individual form field container.                |
| `FormGroup`      | Grouped fields.                                 |
| `FormLabel`      | Label wrapper for form controls.                |
| `FormInputGroup` | Input wrapper with positioned icons/content.    |
| `FormTextarea`   | Styled textarea with configurable rows.         |
| `FormCheckbox`   | Checkbox with indeterminate support.            |
| `FormRadioGroup` | Radio group with horizontal or vertical layout. |
| `FormSwitch`     | Toggle switch.                                  |
| `FormSlider`     | Numeric range slider.                           |
| `FormSelect`     | Reka UI select, including multi-select support. |
| `FormDateField`  | Date field.                                     |
| `FormDatePicker` | Date picker popover.                            |
| `PinInput`       | PIN/OTP input.                                  |
| `TagsInput`      | Multi-value tag input.                          |
| `Combobox`       | Searchable autocomplete.                        |
| `ColorPicker`    | Color picker control.                           |

```vue
<template>
  <Form>
    <FormLabel label="Email">
      <FormInputGroup>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
        />
      </FormInputGroup>
    </FormLabel>

    <FormSwitch v-model="enabled">Enable alerts</FormSwitch>
  </Form>
</template>
```

Most form components use Vue `v-model` conventions. When a component wraps Reka UI primitives, pass through the same high-level concepts: model value, disabled state, item values, and orientation.

## Media and Utility Components

| Component  | Purpose                                                         |
| ---------- | --------------------------------------------------------------- |
| `Avatar`   | Avatar image/fallback display.                                  |
| `Icon`     | Semantic icon wrapper over Nuxt Icon in layer usage.            |
| `Opepicon` | Generative icon component.                                      |
| `Embed`    | Embedded media/content wrapper.                                 |
| `Calendar` | Calendar widget based on internationalized date primitives.     |
| `Globals`  | Internal global component mount for toasts and confirm dialogs. |

`Globals` is mounted by the base layer plugin. Consumers generally do not render it manually.

## Client-only Components

The base layer marks these components client-only:

`Combobox`, `ConfirmDialog`, `Dialog`, `Toasts`, `Popover`, `Dropdown`, `FormDatePicker`, `ColorPicker`, `Embed`.

If you import `@1001-digital/components` outside Nuxt, you must handle any browser-only rendering requirements in your own application.

## Direct Imports

```ts
import {
  Button,
  Card,
  Dialog,
  Form,
  FormLabel,
  useToast,
} from '@1001-digital/components'
```

Direct imports are useful in non-Nuxt Vue apps or internal component libraries. Nuxt app code should usually rely on layer auto-imports.
