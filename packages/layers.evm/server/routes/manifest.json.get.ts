export default defineEventHandler((event) => {
  const { evm } = useAppConfig() as { evm: Record<string, any> }

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  })

  return {
    name: evm?.title || 'Ethereum App',
    description: evm?.safe?.description || evm?.title || 'Ethereum App',
    iconPath: evm?.safe?.iconPath || evm?.appLogoUrl || '/icon.png',
    iconUrl: evm?.appLogoUrl || '/icon.png',
  }
})
