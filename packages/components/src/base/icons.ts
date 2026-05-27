import type { InjectionKey } from 'vue'

export type IconAliases = Record<string, string>

// See `./link.ts` for why this uses `Symbol.for` instead of a fresh symbol.
export const IconAliasesKey: InjectionKey<IconAliases> = Symbol.for(
  '@1001-digital/components/IconAliases',
)

export const defaultIconAliases: IconAliases = {
  add: 'lucide:plus',
  calendar: 'lucide:calendar',
  check: 'lucide:check',
  'chevron-left': 'lucide:chevron-left',
  'chevron-down': 'lucide:chevron-down',
  'chevron-right': 'lucide:chevron-right',
  close: 'lucide:x',
  copy: 'lucide:copy',
  edit: 'lucide:pencil',
  help: 'lucide:circle-help',
  home: 'lucide:house',
  link: 'lucide:link',
  loader: 'lucide:loader-2',
  menu: 'lucide:menu',
  wallet: 'lucide:wallet',
}
