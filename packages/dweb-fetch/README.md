# @1001-digital/dweb-fetch

Fetch library for decentralized web protocols (IPFS, IPNS, Arweave) with native protocol clients and verified content retrieval.

## Usage

```ts
import { createDwebFetch } from '@1001-digital/dweb-fetch'

const dwebFetch = createDwebFetch()

// IPFS
const ipfsResponse = await dwebFetch('ipfs://bafyABC...')

// IPNS
const ipnsResponse = await dwebFetch('ipns://example.eth')

// Arweave
const arResponse = await dwebFetch('ar://txId123')

// HTTPS passthrough
const httpsResponse = await dwebFetch('https://example.com/data.json')
```

## Configuration

```ts
const dwebFetch = createDwebFetch({
  ipfs: {
    gateways: ['https://my-gateway.io'],
    routers: ['https://my-router.io'],
  },
  arweave: {
    // Use static gateways instead of network discovery
    gateways: ['https://arweave.net', 'https://ar-io.dev'],
    // Or disable network discovery to use default static gateways
    useNetworkDiscovery: false,
  },
})
```

## Protocol Backends

- **IPFS/IPNS** — `@helia/verified-fetch` for content-verified retrieval
- **Arweave** — `@ar.io/wayfinder-core` with network gateway discovery, falls back to static gateway list
- **HTTP/HTTPS** — Native `fetch` passthrough

All backends are lazily initialized on first use.

## API

### `createDwebFetch(config?): DwebFetch`

Creates a fetch function that routes URLs to the appropriate protocol handler. Synchronous — backends initialize lazily on first fetch.

### `extractScheme(url): string | undefined`

Extracts the URL scheme (e.g., `'ipfs'`, `'ar'`, `'https'`).

### `parseDwebUrl(url): ParsedDwebUrl | undefined`

Parses a URL into scheme, raw URL, and path components.

### Error Classes

- `DwebFetchError` — Base error for all fetch failures
- `DwebUnsupportedProtocolError` — Thrown for unknown URL schemes
