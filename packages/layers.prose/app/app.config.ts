export default defineAppConfig({
  prose: {
    name: 'Hello from Nuxt layer'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    prose?: {
      /** Project name */
      name?: string
    }
  }
}
