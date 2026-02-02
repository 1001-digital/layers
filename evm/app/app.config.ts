export default defineAppConfig({
  evm: {
    name: 'Hello from Nuxt layer'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    evm?: {
      /** Project name */
      name?: string
    }
  }
}
