import type { Component, InjectionKey } from 'vue'

export const LinkComponentKey: InjectionKey<Component | string> =
  Symbol('LinkComponent')
