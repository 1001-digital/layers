export default defineNuxtPlugin(() => {
  const priceFeed = usePriceFeed()

  priceFeed.fetchPrice()

  setInterval(() => priceFeed.fetchPrice(), 60 * 60 * 1000)
})
