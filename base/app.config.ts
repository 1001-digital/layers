export default defineAppConfig({
  myLayer: {
    name: 'Hello from Nuxt layer'
  },
  icons: {
    map: {}
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
    icons?: {
      map?: Record<string, string>
    }
  }
}
