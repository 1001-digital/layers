# @1001-digital/layers

A monorepo containing composable Nuxt layers, a shared component library, and a CSS design token system for building modern web applications.

## Packages

| Package | Description |
| --- | --- |
| [@1001-digital/layers.base](./packages/layers.base) | Foundation layer with accessible UI components and design tokens |
| [@1001-digital/layers.evm](./packages/layers.evm) | Ethereum/Web3 integration for building decentralized applications |
| [@1001-digital/components](./packages/components) | Shared Vue component library (Reka UI) |
| [@1001-digital/styles](./packages/styles) | Shared CSS framework and design tokens |

### Layer Inheritance

```
evm ──extends──> base
```

Both layers consume shared packages:

```
layers.base ─> @1001-digital/components + @1001-digital/styles
layers.evm ──> @1001-digital/components
```

## Installation

```bash
pnpm add @1001-digital/layers.base
# or
pnpm add @1001-digital/layers.evm
```

## Usage

Extend a layer in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ['@1001-digital/layers.base'],
})
```

## Development

```bash
# Install dependencies
pnpm install

# Format code
pnpm format
```

Each layer has its own playground. Run commands from within the package directory:

```bash
cd packages/layers.base
pnpm dev:prepare  # Prepare Nuxt types
pnpm dev          # Start playground dev server
pnpm build        # Build playground
```

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing to npm.

### Creating a changeset

When you make a change that should result in a new package version, run:

```bash
pnpm changeset
```

This prompts you to select the affected packages, choose the semver bump type (patch/minor/major), and write a short summary. It creates a changeset file in `.changeset/` that you commit alongside your code.

### Publishing

When you push to `master`, a GitHub Action checks for pending changesets. If any exist, it opens (or updates) a **"Version Packages"** pull request that:

- Bumps versions in `package.json`
- Updates `CHANGELOG.md` for each package
- Removes the consumed changeset files

Merging that PR triggers the action again, which publishes the updated packages to npm.

## Code Style

- TypeScript
- Single quotes, no semicolons
- Component files match their full generated name (e.g., `BaseFooButton.vue`)

## License

MIT
