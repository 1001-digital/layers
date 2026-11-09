import type { Chain } from 'viem'

// Wallet SDKs and network switching read chain metadata rather than transports.
// Clone the chain so each app's runtime settings stay local to its config.
export function withConfiguredRpcUrls(chain: Chain, rpcs: string[]): Chain {
  const http = rpcs.filter((url) => /^https?:\/\//.test(url))
  const webSocket = rpcs.filter((url) => /^wss?:\/\//.test(url))
  if (!http.length && !webSocket.length) return chain

  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        // A WebSocket-only config still needs an HTTP endpoint for wallet SDKs.
        http: http.length ? http : chain.rpcUrls.default.http,
        ...(webSocket.length ? { webSocket } : {}),
      },
    },
  }
}
