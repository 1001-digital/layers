export default defineNuxtPlugin({
  name: 'price-feed',
  dependsOn: ['wagmi'],
  setup(nuxtApp) {
    const priceFeed = usePriceFeed()

    priceFeed.fetchPrice()

    const interval = setInterval(() => priceFeed.fetchPrice(), 60 * 60 * 1000)

    nuxtApp.hook('app:unmounted', () => clearInterval(interval))
  },
})
