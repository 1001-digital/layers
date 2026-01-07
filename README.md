# Nuxt Layers

A monorepo containing composable Nuxt layers for building modern web applications.

## Layers

| Layer | Description |
|-------|-------------|
| **base** | Foundation layer with accessible UI components and a comprehensive design token system |
| **prose** | Typography and content styling for documentation and content-driven sites |
| **evm** | Ethereum/Web3 integration for building decentralized applications |

### Layer Inheritance

```
evm ──extends──► base
prose ─extends─► base
```

## Installation

```bash
pnpm add @1001-digital/layers.base
# or
pnpm add @1001-digital/layers.prose
# or
pnpm add @1001-digital/layers.evm
```

## Usage

Extend a layer in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base']
})
```

## Base Layer

The foundation for building modern web applications with accessible, semantic components.

### Components

- **Button** - Versatile button with variants (`primary`, `danger`, `link`, `inline`) and sizes (`small`, `normal`)
- **Card** - Article container with padding, borders, and hover states
- **Icon** - Semantic icon mapper with 29+ icons (Lucide/Simple Icons)
- **Alert** - Dismissable alerts with `info`/`error` variants
- **Dialog** - Native `<dialog>` wrapper with accessibility features
- **Tag/Tags** - Inline tag components

### Form Components

- **Form** - Grid-based form wrapper
- **FormItem** - Individual form field container
- **FormLabel** - Semantic label wrapper
- **FormInputGroup** - Groups inputs with positioned icons
- **FormSelect** - Dropdown with multi-select support (Reka UI)
- **FormCheckbox** - Checkbox with indeterminate state support
- **FormRadioGroup** - Radio buttons with horizontal/vertical orientation

### Design System

Built on CSS custom properties with a layered architecture (`reset` → `base` → `components` → `utilities`).

**Colors** - OKLCH color palette with automatic light/dark mode support:
```css
--primary, --muted, --error, --success
--gray-50 through --gray-950
--background, --color
```

**Typography** - Fluid font scaling using `clamp()`:
```css
--font-xs through --font-3xl
--font-family
```

**Spacing**:
```css
--size-0 through --size-10
--spacer-xs, --spacer-sm, --spacer, --spacer-md, --spacer-lg, --spacer-xl
```

**Layout**:
```css
--content-width-wide: 90rem
--content-width: 60rem
--content-width-sm: 35rem
```

### Dependencies

- [Reka UI](https://reka-ui.com) - Accessible component primitives
- [Nuxt Icon](https://github.com/nuxt/icon) - Icon component system
- [Lucide](https://lucide.dev) / [Simple Icons](https://simpleicons.org) - Icon sets

## Prose Layer

Extends base with typography and content styling for markdown and prose content.

### Components

- **Prose** - Wrapper component with typography styles
  - `centered` prop for center-aligned text

### Styled Elements

Heading styles (h1-h6), links, tables, lists, blockquotes, code blocks, and horizontal rules.

## EVM Layer

Extends base with Ethereum/Web3 capabilities for building dAPPs.

### Features

- Wallet connection (MetaMask, Coinbase, WalletConnect, Injected)
- Multiple RPC endpoint support with fallback
- Chain switching (mainnet, sepolia, holesky, localhost)
- Batch multicall optimization
- Persistent wallet selection via cookies

### Utilities

```ts
// Abbreviate addresses
shortAddress('0x1234...abcd') // '0x123...bcd'

// Format ETH values
formatETH(1000000000000000000n) // '1'
```

### Composables

```ts
// Get configured chain ID
const chainId = useMainChainId()

// Ensure wallet is on correct chain
await useEnsureChainIdCheck()
```

### Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.evm'],
  runtimeConfig: {
    public: {
      chainId: 1,
      blockExplorer: 'https://etherscan.io',
      rpc1: 'https://...',
      walletConnectProjectId: '...'
    }
  }
})
```

### Dependencies

- [Wagmi](https://wagmi.sh) - Vue hooks for Ethereum
- [Viem](https://viem.sh) - Type-safe Ethereum utilities
- [TanStack Query](https://tanstack.com/query) - Data fetching and caching

## Development

```bash
# Install dependencies
pnpm install

# Prepare Nuxt
pnpm dev:prepare

# Start dev server (uses .playground)
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Lint
pnpm lint
```

## Code Style

- TypeScript
- Single quotes, no semicolons
- Component naming: files match full component name (e.g., `BaseFooButton.vue` not `Button.vue`)

## License

MIT
