export default defineAppConfig({
  base: {
    name: 'Hello from Nuxt layer'
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    base?: {
      /** Project name */
      name?: string
    }
  }
}
