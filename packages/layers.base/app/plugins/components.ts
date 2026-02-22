import { NuxtLink } from '#components'
import {
  LinkComponentKey,
  IconAliasesKey,
  defaultIconAliases,
} from '@1001-digital/components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(LinkComponentKey, NuxtLink)

  // Provide icon aliases (matching @nuxt/icon config)
  nuxtApp.vueApp.provide(IconAliasesKey, defaultIconAliases)
})
