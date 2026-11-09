import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mainnet, sepolia } from 'viem/chains'
import { withConfiguredRpcUrls } from '../app/rpc-chain.ts'

test('wallet SDK metadata uses configured HTTP endpoints in order', () => {
  const urls = ['https://app.example/api/rpc', 'https://backup.example/rpc']
  const chain = withConfiguredRpcUrls(mainnet, urls)
  assert.deepEqual(chain.rpcUrls.default.http, urls)
  assert.equal(chain.rpcUrls.default.http[0], urls[0])
  assert.equal(chain.id, mainnet.id)
  assert.equal(chain.contracts, mainnet.contracts)
})

test('HTTP and WebSocket metadata use their matching configured protocols', () => {
  const chain = withConfiguredRpcUrls(mainnet, [
    'wss://app.example/ws',
    'https://app.example/api/rpc',
  ])
  assert.deepEqual(chain.rpcUrls.default, {
    http: ['https://app.example/api/rpc'],
    webSocket: ['wss://app.example/ws'],
  })
})

test('WebSocket-only config retains an HTTP endpoint for wallet SDKs', () => {
  const chain = withConfiguredRpcUrls(mainnet, ['wss://app.example/ws'])
  assert.deepEqual(chain.rpcUrls.default.http, mainnet.rpcUrls.default.http)
  assert.deepEqual(chain.rpcUrls.default.webSocket, ['wss://app.example/ws'])
})

test('unconfigured chains retain their built-in defaults', () => {
  assert.equal(withConfiguredRpcUrls(mainnet, []), mainnet)
})

test('app and chain configurations do not mutate shared chain defaults', () => {
  const original = structuredClone(mainnet.rpcUrls)
  const first = withConfiguredRpcUrls(mainnet, ['https://first.example/rpc'])
  const second = withConfiguredRpcUrls(mainnet, ['https://second.example/rpc'])
  const other = withConfiguredRpcUrls(sepolia, ['https://test.example/rpc'])
  assert.equal(first.rpcUrls.default.http[0], 'https://first.example/rpc')
  assert.equal(second.rpcUrls.default.http[0], 'https://second.example/rpc')
  assert.equal(other.id, sepolia.id)
  assert.equal(other.rpcUrls.default.http[0], 'https://test.example/rpc')
  assert.deepEqual(mainnet.rpcUrls, original)
})
