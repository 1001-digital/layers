# Composables and Utilities

The layer packages re-export composables and utilities so Nuxt consumers can use them through auto-imports. Direct Vue consumers can import from `@1001-digital/components` and `@1001-digital/components.evm`.

## Base Composables

### `useToast()`

Global toast state and actions:

```ts
const toast = useToast()

const id = toast.add({
  title: 'Uploading',
  description: 'Waiting for confirmation.',
  variant: 'info',
  loading: true,
  duration: Infinity,
})

toast.update(id, {
  variant: 'success',
  loading: false,
  title: 'Uploaded',
  duration: 3000,
})
```

Toast variants are `info`, `success`, and `error`. Toast actions accept a `label`, `onClick`, and optional `persistent` flag.

### `useConfirm()`

Programmatic confirmation:

```ts
const { confirm } = useConfirm()

const confirmed = await confirm({
  title: 'Delete item?',
  description: 'This cannot be undone.',
  okText: 'Delete',
  cancelText: 'Cancel',
})
```

The base layer mounts the global confirm UI through its globals plugin.

### Time Composables

| Composable        | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `useSeconds()`    | Shared ticking seconds ref.                                                  |
| `useCountDown()`  | Breaks a seconds ref into days, hours, minutes, seconds, and formatted text. |
| `useTimeAgo()`    | Reactive relative time string from an ISO date string.                       |
| `useSecondsAgo()` | Deprecated alias for `useTimeAgo()`.                                         |

## Base Utilities

| Utility                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `formatNumber()`         | Format numeric values.                           |
| `roundAndFormatNumber()` | Round and format numeric values.                 |
| `asPercentageOf()`       | Convert a value into a percentage of a total.    |
| `formatUSD()`            | Format USD values.                               |
| `delay()`                | Promise-based timeout.                           |
| `daysInSeconds()`        | Convert days to seconds.                         |
| `nowInSeconds()`         | Current Unix timestamp in seconds.               |
| `asUTCDate()`            | Convert date input to the package UTC date type. |

## EVM Config and Chain Composables

| Composable                | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `useEvmConfig()`          | Read the provided EVM config.                             |
| `useChainConfig(key?)`    | Resolve a named chain from EVM config.                    |
| `useMainChainId()`        | Read the configured default chain ID.                     |
| `useBlockExplorer(key?)`  | Resolve a block explorer URL for a named chain.           |
| `useEnsureChainIdCheck()` | Validate or request a chain switch before wallet actions. |

```ts
const mainChainId = useMainChainId()
const explorer = useBlockExplorer('sepolia')
```

## ENS, URI, and Price Composables

| Composable            | Purpose                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `useEns()`            | Resolve ENS data.                                                                             |
| `useEnsWithAvatar()`  | Resolve ENS name plus avatar data.                                                            |
| `useEnsProfile()`     | Resolve an ENS profile object.                                                                |
| `useDwebClient()`     | Access the decentralized-web fetch client.                                                    |
| `useResolvedUrl()`    | Resolve `ipfs://`, `ipns://`, or Arweave URLs reactively.                                     |
| `useAmountInput()`    | Manage decimals-aware amount text input and parsed base-unit value. Used by `EvmAmountInput`. |
| `useEthAmountInput()` | Manage ETH amount text input and parsed wei value. Used by `EvmEthInput`.                     |
| `useGasPrice()`       | Read current gas price data.                                                                  |
| `usePriceFeed()`      | Read cached ETH price feed data.                                                              |
| `useWalletExplorer()` | Search and rank wallet options.                                                               |

## Transaction Flow

`useTransactionFlow()` exposes the same state machine used by `EvmTransactionFlow`:

```ts
const flow = useTransactionFlow({
  chain: 'sepolia',
  request: mint,
  keepOpen: true,
})

await flow.initializeRequest()
```

Important returned state:

| Field                 | Purpose                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `step`                | Current step: `idle`, `confirm`, `chain`, `requesting`, `waiting`, `complete`, or `error`. |
| `error`               | Current error message.                                                                     |
| `tx`                  | Transaction hash.                                                                          |
| `receipt`             | Transaction receipt after confirmation.                                                    |
| `txLink`              | Block explorer transaction URL.                                                            |
| `start()`             | Open the flow from idle state.                                                             |
| `initializeRequest()` | Start or restart the transaction request.                                                  |
| `cancel()`            | Return to idle.                                                                            |
| `reset()`             | Clear transaction state.                                                                   |

## SIWE

| Export                                                             | Purpose                                  |
| ------------------------------------------------------------------ | ---------------------------------------- |
| `useSiwe()`                                                        | Client-side SIWE flow state and actions. |
| `createSiweMessage()`                                              | Utility for constructing a SIWE message. |
| `SiweSession`, `SiweStep`, `SiweSignInOptions`, `SiweSignInResult` | SIWE TypeScript types.                   |

## EVM Utilities

| Utility                           | Purpose                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `shortAddress()`                  | Display-shortened address string.                                            |
| `resolveChain()`                  | Resolve a viem chain object from a chain ID.                                 |
| `formatETH()`                     | Format wei values as ETH.                                                    |
| `parseAmountInput()`              | Parse user-entered amount text to base units for a given number of decimals. |
| `normalizeAmountInput()`          | Normalize amount text input.                                                 |
| `parseEthAmountInput()`           | Parse user-entered ETH text to wei.                                          |
| `normalizeEthAmountInput()`       | Normalize ETH amount text input.                                             |
| `isUserRejection()`               | Detect common wallet user-rejection errors.                                  |
| `createCache()`                   | Small cache utility used by EVM helpers.                                     |
| `createDwebFetch()`               | Create a dweb fetch client.                                                  |
| `formatPrice()`                   | Format price feed values.                                                    |
| `stringifyJSON()` / `parseJSON()` | JSON helpers for price/feed storage.                                         |

```ts
const label = shortAddress('0x1234567890abcdef1234567890abcdef12345678')
const amount = formatETH(1000000000000000000n)
const wei = parseEthAmountInput('0,5')
```
