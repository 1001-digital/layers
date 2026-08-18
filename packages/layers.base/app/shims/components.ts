import { defineComponent, h, resolveComponent, type Component } from 'vue'
import * as Originals from '@1001-digital/components-original'

// Pass through composables, utils, types, and injection keys unchanged.
// The component exports below intentionally shadow the originals so that
// `import { Button } from '@1001-digital/components'` resolves through
// Nuxt's component registry — letting consumer apps or layers override
// any base component via their own `app/components/Button.vue`.
export * from '@1001-digital/components-original'

// No `name:` on the proxy — Vue's `resolveAsset` does a self-name check
// before consulting the global registry, so a same-named proxy would
// resolve back to itself and recurse infinitely. With no name, the lookup
// falls through to the Nuxt-registered original (or a consumer override).
// The companion plugin `app/plugins/register-shadowed.ts` globally
// registers each shadowed name so this resolveComponent call succeeds.
const proxy = <T extends Component>(name: string, fallback: T): T =>
  defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        const resolved = resolveComponent(name, false)
        const target = typeof resolved === 'string' ? fallback : resolved
        return h(target as Component, attrs, slots)
      }
    },
  }) as unknown as T

export const Actions = proxy('Actions', Originals.Actions)
export const Alert = proxy('Alert', Originals.Alert)
export const AppShell = proxy('AppShell', Originals.AppShell)
export const Autocomplete = proxy('Autocomplete', Originals.Autocomplete)
export const Avatar = proxy('Avatar', Originals.Avatar)
export const BottomNav = proxy('BottomNav', Originals.BottomNav)
export const Button = proxy('Button', Originals.Button)
export const Calendar = proxy('Calendar', Originals.Calendar)
export const Card = proxy('Card', Originals.Card)
export const CardLink = proxy('CardLink', Originals.CardLink)
export const ColorPicker = proxy('ColorPicker', Originals.ColorPicker)
export const Combobox = proxy('Combobox', Originals.Combobox)
export const ConfirmDialog = proxy('ConfirmDialog', Originals.ConfirmDialog)
export const CopyText = proxy('CopyText', Originals.CopyText)
export const Dialog = proxy('Dialog', Originals.Dialog)
export const Dropdown = proxy('Dropdown', Originals.Dropdown)
export const DropdownCheckboxItem = proxy(
  'DropdownCheckboxItem',
  Originals.DropdownCheckboxItem,
)
export const DropdownGroup = proxy('DropdownGroup', Originals.DropdownGroup)
export const DropdownItem = proxy('DropdownItem', Originals.DropdownItem)
export const DropdownLabel = proxy('DropdownLabel', Originals.DropdownLabel)
export const DropdownRadioGroup = proxy(
  'DropdownRadioGroup',
  Originals.DropdownRadioGroup,
)
export const DropdownRadioItem = proxy(
  'DropdownRadioItem',
  Originals.DropdownRadioItem,
)
export const DropdownSeparator = proxy(
  'DropdownSeparator',
  Originals.DropdownSeparator,
)
export const DropdownSub = proxy('DropdownSub', Originals.DropdownSub)
export const Embed = proxy('Embed', Originals.Embed)
export const Form = proxy('Form', Originals.Form)
export const FormCheckbox = proxy('FormCheckbox', Originals.FormCheckbox)
export const FormDateField = proxy('FormDateField', Originals.FormDateField)
export const FormDatePicker = proxy('FormDatePicker', Originals.FormDatePicker)
export const FormGroup = proxy('FormGroup', Originals.FormGroup)
export const FormInputGroup = proxy('FormInputGroup', Originals.FormInputGroup)
export const FormItem = proxy('FormItem', Originals.FormItem)
export const FormLabel = proxy('FormLabel', Originals.FormLabel)
export const FormRadioGroup = proxy('FormRadioGroup', Originals.FormRadioGroup)
export const FormSelect = proxy('FormSelect', Originals.FormSelect)
export const FormSlider = proxy('FormSlider', Originals.FormSlider)
export const FormSwitch = proxy('FormSwitch', Originals.FormSwitch)
export const FormTextarea = proxy('FormTextarea', Originals.FormTextarea)
export const Icon = proxy('Icon', Originals.Icon)
export const Loading = proxy('Loading', Originals.Loading)
export const Opepicon = proxy('Opepicon', Originals.Opepicon)
export const PinInput = proxy('PinInput', Originals.PinInput)
export const Popover = proxy('Popover', Originals.Popover)
export const Progress = proxy('Progress', Originals.Progress)
export const Prose = proxy('Prose', Originals.Prose)
export const Sidebar = proxy('Sidebar', Originals.Sidebar)
export const Tag = proxy('Tag', Originals.Tag)
export const Tags = proxy('Tags', Originals.Tags)
export const TagsInput = proxy('TagsInput', Originals.TagsInput)
export const Toasts = proxy('Toasts', Originals.Toasts)
export const Tooltip = proxy('Tooltip', Originals.Tooltip)
