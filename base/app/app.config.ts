export default defineAppConfig({
  base: {
    name: 'Hello from Nuxt layer',
    icons: {
      map: {}
    }
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    base?: {
      /** Project name */
      name?: string,
      icons?: {
        map?: Record<string, string>
      }
    }
  }
}
