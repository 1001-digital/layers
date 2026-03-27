import { NuxtLink } from '#components'
import {
  IconAliasesKey,
  defaultIconAliases,
} from '@1001-digital/components/base/icons'
import { LinkComponentKey } from '@1001-digital/components/base/link'

export default defineNuxtPlugin((nuxtApp) => {
  // Import the key from the same source tree that auto-registered components use.
  // Importing from the package entry can create a separate module instance in Nuxt/Vite.
  nuxtApp.vueApp.provide(LinkComponentKey, NuxtLink)

  // Provide icon aliases (matching @nuxt/icon config)
  nuxtApp.vueApp.provide(IconAliasesKey, defaultIconAliases)
})
