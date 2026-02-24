import { useSeedWallet } from '@1001-digital/components'

export default defineNuxtPlugin({
  name: 'seed-wallet',
  dependsOn: ['wagmi'],
  setup() {
    const appConfig = useAppConfig()

    if (!appConfig.evm?.seedWallet?.enabled) return

    // Initialize singleton — reads from localStorage on first call
    useSeedWallet()
  },
})
