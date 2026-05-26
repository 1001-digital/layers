import {
  Actions,
  Alert,
  AppShell,
  Autocomplete,
  Avatar,
  BottomNav,
  Button,
  Calendar,
  Card,
  CardLink,
  ColorPicker,
  Combobox,
  ConfirmDialog,
  CopyText,
  Dialog,
  Dropdown,
  DropdownCheckboxItem,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownSub,
  Embed,
  Form,
  FormCheckbox,
  FormDateField,
  FormDatePicker,
  FormGroup,
  FormInputGroup,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormTextarea,
  Icon,
  Loading,
  NuxtLink,
  Opepicon,
  PinInput,
  Popover,
  Progress,
  Prose,
  Sidebar,
  Tag,
  Tags,
  TagsInput,
  Toasts,
  Tooltip,
} from '#components'
import {
  IconAliasesKey,
  defaultIconAliases,
} from '@1001-digital/components/base/icons'
import { LinkComponentKey } from '@1001-digital/components/base/link'

// Components that the `app/shims/components.ts` facade proxies. Each proxy
// calls `resolveComponent(name)` at render time — for that to find the
// right component (consumer override or layer fallback), the name must be
// in the app's global component registry. Nuxt only auto-imports these as
// named imports, so we register them globally here. Whichever component
// Nuxt picked at scan time wins (consumer's `app/components/<Name>.vue`
// beats the layer's package-level file).
const shadowed = {
  Actions,
  Alert,
  AppShell,
  Autocomplete,
  Avatar,
  BottomNav,
  Button,
  Calendar,
  Card,
  CardLink,
  ColorPicker,
  Combobox,
  ConfirmDialog,
  CopyText,
  Dialog,
  Dropdown,
  DropdownCheckboxItem,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownSub,
  Embed,
  Form,
  FormCheckbox,
  FormDateField,
  FormDatePicker,
  FormGroup,
  FormInputGroup,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormTextarea,
  Icon,
  Loading,
  Opepicon,
  PinInput,
  Popover,
  Progress,
  Prose,
  Sidebar,
  Tag,
  Tags,
  TagsInput,
  Toasts,
  Tooltip,
}

export default defineNuxtPlugin((nuxtApp) => {
  // Import the key from the same source tree that auto-registered components use.
  // Importing from the package entry can create a separate module instance in Nuxt/Vite.
  nuxtApp.vueApp.provide(LinkComponentKey, NuxtLink)

  // Provide icon aliases (matching @nuxt/icon config)
  nuxtApp.vueApp.provide(IconAliasesKey, defaultIconAliases)

  for (const [name, component] of Object.entries(shadowed)) {
    if (component) {
      nuxtApp.vueApp.component(name, component as never)
    }
  }
})
