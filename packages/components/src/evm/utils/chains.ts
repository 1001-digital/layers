import { defineChain, type Chain } from 'viem'
import { mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost } from 'viem/chains'

const KNOWN: Chain[] = [mainnet, sepolia, holesky, optimism, arbitrum, base, polygon, localhost]
const byId = new Map<number, Chain>(KNOWN.map(c => [c.id, c]))

export const resolveChain = (id: number): Chain =>
  byId.get(id) ?? defineChain({
    id,
    name: `Chain ${id}`,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [] } },
  })
