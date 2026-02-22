import {
  LinkComponentKey,
  IconAliasesKey,
  defaultIconAliases,
} from '@1001-digital/components'

export default defineNuxtPlugin((nuxtApp) => {
  // Provide NuxtLink as the link component for Button/CardLink
  nuxtApp.vueApp.provide(LinkComponentKey, resolveComponent('NuxtLink'))

  // Provide icon aliases (matching @nuxt/icon config)
  nuxtApp.vueApp.provide(IconAliasesKey, defaultIconAliases)
})
