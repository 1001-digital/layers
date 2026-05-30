import { defineChain, type Chain } from 'viem'
import {
  mainnet,
  sepolia,
  holesky,
  optimism,
  optimismSepolia,
  arbitrum,
  base,
  baseSepolia,
  polygon,
  shape,
  shapeSepolia,
  zora,
  zoraSepolia,
  localhost,
  hardhat,
} from 'viem/chains'

const KNOWN: Chain[] = [
  mainnet,
  sepolia,
  holesky,
  optimism,
  optimismSepolia,
  arbitrum,
  base,
  baseSepolia,
  polygon,
  shape,
  shapeSepolia,
  zora,
  zoraSepolia,
  localhost,
  hardhat,
]
const byId = new Map<number, Chain>(KNOWN.map((c) => [c.id, c]))

export const resolveChain = (id: number): Chain =>
  byId.get(id) ??
  defineChain({
    id,
    name: `Chain ${id}`,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [] } },
  })
