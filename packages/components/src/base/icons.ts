import type { InjectionKey } from 'vue'

export type IconAliases = Record<string, string>

export const IconAliasesKey: InjectionKey<IconAliases> = Symbol('IconAliases')

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
  help: 'lucide:circle-question-mark',
  home: 'lucide:house',
  link: 'lucide:link',
  loader: 'lucide:loader-2',
  wallet: 'lucide:wallet',
}
