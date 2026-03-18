export default defineNuxtPlugin({
  name: 'price-feed',
  dependsOn: ['wagmi'],
  setup(nuxtApp) {
    const priceFeed = usePriceFeed()

    priceFeed.fetchPrice()

    setInterval(() => priceFeed.fetchPrice(), 60 * 60 * 1000)
  },
})
