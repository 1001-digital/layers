# Changelog

All notable changes across all packages in this monorepo.
Generated from individual package changelogs — do not edit manually.

## 2026-05-27

- Make the `EvmEthInput` suffix customizable: new optional `suffix` prop (defaults to `'ETH'`); pass a different string to relabel it or `:suffix="false"` to hide it entirely. The existing `#suffix` slot still overrides both. [`700aef7`](https://github.com/1001-digital/layers/commit/700aef7)
  _`components.evm`_

- Route `@1001-digital/components` and `@1001-digital/components.evm` package imports through a Nuxt-layer facade so consumer/layer component overrides apply to package-level imports (e.g. `<Button>` inside `EvmConnectDialog` will pick up an app's override of `Button`). [`227d6a6`](https://github.com/1001-digital/layers/commit/227d6a6)
  _`layers.base`, `layers.evm`_

## 2026-05-26

- Allow passing a global `title` prop to `EvmMultiTransactionFlowDialog`. When set, it overrides the per-step title from the flow; otherwise the current step's title is used as before. [`1952d69`](https://github.com/1001-digital/layers/commit/1952d69)
  _`components.evm`, `layers.evm`_

- Add an `EvmEthInput` component for ETH amount text input with parsed wei output. [`b98b8ce`](https://github.com/1001-digital/layers/commit/b98b8ce)
  _`components.evm`, `layers.evm`_

- Add reusable ETH amount input helpers for parsing user-entered ETH values to wei. [`623d075`](https://github.com/1001-digital/layers/commit/623d075)
  _`components.evm`, `layers.evm`_

- Prevent stale ENS lookup responses from overwriting newer address input state and show standard Error messages in transaction flow failures. [`8dfd67c`](https://github.com/1001-digital/layers/commit/8dfd67c)
  _`components.evm`_

- Add `--multi-transaction-flow-step-gap` so consumers can override the vertical gap between a step's title and status. [`3fbc4b8`](https://github.com/1001-digital/layers/commit/3fbc4b8)
  _`components.evm`, `styles`_

- **Minor** Add `--shadow-sm`, `--shadow-md`, `--shadow-lg`, and a `--shadow` default. Shadow colors adapt to the active color scheme via `light-dark()`, using heavier alpha in dark mode so elevation reads against dark backgrounds. [`23d6b76`](https://github.com/1001-digital/layers/commit/23d6b76)
  This also lights up drop shadows on `Combobox`, `FormSelect`, and `Autocomplete` popover surfaces, which already referenced `--shadow-lg` before the token existed.
  _`styles`_

## 2026-05-24

- **Minor** Add multi-transaction flow components and composable for sequential EVM transaction flows, plus theme variables for multi-transaction progress styling. [`31f94ce`](https://github.com/1001-digital/layers/commit/31f94ce)
  _`components.evm`, `styles`_

- Render EvmTransactionFlow confirm and retry actions as primary buttons by default. [`ea90683`](https://github.com/1001-digital/layers/commit/ea90683)
  _`components.evm`_

- Introduce `--scrollbar-thumb-color` and `--scrollbar-track-color` variables so scrollbar colors can be themed without overriding the base selector. [`0619a34`](https://github.com/1001-digital/layers/commit/0619a34)
  _`styles`_

## 2026-05-17

- Remove the default border from EVM artifact media. [`ac8983d`](https://github.com/1001-digital/layers/commit/ac8983d)
  _`components.evm`_

- Fix Nuxt SSR crash from the `baseAccount` wagmi connector. [`fe1eca0`](https://github.com/1001-digital/layers/commit/fe1eca0)
  `@base-org/account`'s telemetry init runs eagerly inside `createBaseAccountSDK`, called by the connector's `getProvider()` during wagmi's SSR `reconnect()` step. On the server it has no `window`/`document` and throws `Telemetry is not supported in non-browser environments`, surfacing as an `unhandledRejection` in dev logs.
  Pass `preference: { telemetry: false }` to `baseAccount(...)` so the SDK skips telemetry init entirely. The connector itself stays available; only the analytics call is suppressed.
  _`layers.evm`_

## 2026-05-04

- Fix type-check failures for external consumers: [`7d3da95`](https://github.com/1001-digital/layers/commit/7d3da95)
  - `Autocomplete`: simplify `NormalizedGroup.options` type — the previous conditional resolved to `never[]`, so iterating grouped options in the template surfaced `'label' does not exist on type 'never'` errors.
  - `EvmArtifact`: inline a local `TokenMetadata` type instead of importing from `@1001-digital/resolve-metadata` so consumers without that optional peer dep can still type-check.
  - `EvmArtifactModel`: silence the dynamic `import('@google/model-viewer')` for consumers without that optional peer dep.
  _`components`, `components.evm`_

## 2026-05-01

- **Minor** Add an `Autocomplete` component wrapping Reka UI's autocomplete primitives. Unlike `Combobox`, the model value is the input text itself, so users can type free-form values with optional suggestions. Supports flat option lists, grouped options, and server-driven results via the `ignore-filter` prop. Reka UI is bumped to `^2.9.6`. [`bcead70`](https://github.com/1001-digital/layers/commit/bcead70)
  _`components`, `styles`_

- `EvmArtifact` now uses the static `image` as a poster for `<video>` and `<model-viewer>` while the heavy asset loads, so users see the artwork immediately instead of a blank container. The `#animation` slot also receives a `poster` prop for custom renderers. [`96171df`](https://github.com/1001-digital/layers/commit/96171df)
  _`components.evm`_

## 2026-04-28

- **Minor** Make `EvmArtifact` SSR-friendly. Plain `<img>`, `<video>`, and `<audio>` renderers now render server-side (good for LCP and SEO). The pieces that still need a browser — the `@google/model-viewer` dynamic import, `<Embed>`, and the HEAD-request MIME probe — are deferred until after hydration so the initial server and client render match. [`a3b31eb`](https://github.com/1001-digital/layers/commit/a3b31eb)
  3D rendering is split into a new `EvmArtifactModel` component (client-only) that owns the `@google/model-viewer` dynamic import. It emits `error` for runtime `<model-viewer>` errors and `import-error` if the dynamic import fails; `EvmArtifact` translates these into the existing `error` payload (`kind: 'animation' | 'model'`).
  `useResolvedUrl` now resolves `http(s):`, `data:`, and `blob:` URIs synchronously (and reads cached `ipfs://` / `ar://` resolutions synchronously too), so SSR can emit a real `src` attribute on first paint instead of an empty string.
  `EvmArtifact` is removed from the client-only component list; `EvmArtifactModel` takes its place.
  _`components.evm`_

- **Minor** Add `EvmArtifact` — a generic NFT artifact renderer that accepts a normalized `TokenMetadata` shape (e.g. from `@1001-digital/resolve-metadata`) or individual `image` / `animationUrl` / `name` / `backgroundColor` props. Auto-detects media type by file extension first, then by HEAD-request `Content-Type` (with `AbortController` so rapid URL changes can't let stale responses overwrite fresh detection), and renders the appropriate element: `<img>` for images, `<video autoplay muted loop>` for video, `<audio controls>` (over the static image as poster) for audio, `<Embed>` for HTML/iframe and unknown types, and a lazy-loaded `<model-viewer>` for `.glb` / `.gltf` 3D assets. URLs from `resolve-metadata` come back as protocol URIs (`ipfs://`, `ar://`) and are resolved through the existing `useResolvedUrl` composable against the configured gateways. [`92d026c`](https://github.com/1001-digital/layers/commit/92d026c)
  Provides `v-model:show-animation` for parent-controlled play/pause and four scoped slots: `#animation`, `#static`, `#overlay` (receives `showAnimation` and `hasAnimation`), and `#fallback` (receives `name` and the last `error`). Emits `error` with `{ kind: 'image' | 'animation' | 'model'; url }`. Optionally applies `background_color` from metadata as the container background (validated as 6-char hex). Aspect ratio defaults to `1` and is overridable via the `aspectRatio` prop or a `--evm-artifact-aspect-ratio` CSS custom property.
  `@1001-digital/resolve-metadata` and `@google/model-viewer` are added as **optional** peer dependencies — the type import for `TokenMetadata` is type-only, and `model-viewer` is only fetched on demand when a 3D asset is detected, so neither is required for the common image/video case.
  _`components.evm`_

## 2026-04-13

- Fix type issue ([#40](https://github.com/1001-digital/layers/pull/40)) [`ead860d`](https://github.com/1001-digital/layers/commit/ead860d)
  _`components.evm`_

- This fixes a type error for the toast explorer label ([#40](https://github.com/1001-digital/layers/pull/40)) [`c703979`](https://github.com/1001-digital/layers/commit/c703979)
  _`components.evm`_

## 2026-04-10

- Expose ens and address in profile actions [`3a532d8`](https://github.com/1001-digital/layers/commit/3a532d8)
  _`components.evm`_

## 2026-04-07

- Fix client only component list [`5e71dfa`](https://github.com/1001-digital/layers/commit/5e71dfa)
  _`components.evm`_

- Fix default block explorer links [`e4c7708`](https://github.com/1001-digital/layers/commit/e4c7708)
  _`components.evm`, `layers.evm`_

## 2026-04-06

- **Minor** Extract generic Avatar component from EvmAvatar ([#35](https://github.com/1001-digital/layers/pull/35)) [`3e1e0eb`](https://github.com/1001-digital/layers/commit/3e1e0eb)
  Add a reusable `Avatar` component to `@1001-digital/components` that renders an image or an Opepicon fallback. `EvmAvatar` now delegates to this component instead of inlining the logic.
  - Remove `avatarUrl` prop from `EvmAvatarProps` (avatar URL is now resolved internally)
  - Cache resolved dweb URLs to avoid duplicate resolution
  _`components`, `components.evm`_

- **Minor** Switch default block explorer to evm.now (mainnet) [`8536c21`](https://github.com/1001-digital/layers/commit/8536c21)
  _`components.evm`_

- Make block explorer link text customizable [`b6947f1`](https://github.com/1001-digital/layers/commit/b6947f1)
  _`components.evm`_

## 2026-04-03

- Upgrade dweb-fetch to 0.2.1 [`997b51e`](https://github.com/1001-digital/layers/commit/997b51e)
  _`components.evm`_

- Pass RPC URLs from wagmi config to dweb-fetch client for EIP-155 resolution [`42c75d9`](https://github.com/1001-digital/layers/commit/42c75d9)
  _`components.evm`, `layers.evm`_

## 2026-04-02

- **Minor** Fix long tags overflowing TagsInput, default addOnBlur and duplicate to true ([#31](https://github.com/1001-digital/layers/pull/31)) [`ded0887`](https://github.com/1001-digital/layers/commit/ded0887)
  _`components`_

## 2026-03-31

- Fix cross-browser issues, harden components, and ensure correct chain during SIWE signature [`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a)
  _`components`, `components.evm`, `layers.base`, `styles`_

- **Breaking** Add EvmTransactionFlowDialog and keepOpen prop for persistent transaction dialogs ([#29](https://github.com/1001-digital/layers/pull/29)) [`f680a0f`](https://github.com/1001-digital/layers/commit/f680a0f)
  Note: Deprecation of old EvmTransactionFlow (clients have to rename their implementation to EvmTransactionFlowDialog)
  _`components.evm`_

- Fix dapp url [`282c26c`](https://github.com/1001-digital/layers/commit/282c26c)
  _`layers.evm`_

- **Minor** Implement new metamask/connect-evm library [`7229122`](https://github.com/1001-digital/layers/commit/7229122)
  _`layers.evm`_

- Implement automatic manifest.json generation for safe app browser integration [`db17ba9`](https://github.com/1001-digital/layers/commit/db17ba9)
  Configure safe to allow safe.global to connect via an iframe
  _`layers.evm`_

- Upgrade @base-org/account and @walletconnnect/ethereum-provider packages [`e40fe80`](https://github.com/1001-digital/layers/commit/e40fe80)
  _`layers.evm`_

## 2026-03-30

- **Minor** Update viem and wagmi to their latest versions. [`3e4d23e`](https://github.com/1001-digital/layers/commit/3e4d23e)
  _`components.evm`, `layers.evm`_

- **Minor** Extract WAGMI plugin registration vs config into separate concerns [`007a1b2`](https://github.com/1001-digital/layers/commit/007a1b2)
  _`layers.evm`_

## 2026-03-29

- Add Embed component [`f2fae71`](https://github.com/1001-digital/layers/commit/f2fae71)
  _`components`_

- Fix combobox height [`aac9359`](https://github.com/1001-digital/layers/commit/aac9359)
  _`components`_

- **Minor** Fix chain config [`23d5c51`](https://github.com/1001-digital/layers/commit/23d5c51)
  _`components.evm`_

## 2026-03-27

- Open combobox by default on focus [`d69112e`](https://github.com/1001-digital/layers/commit/d69112e)
  _`components`_

- Fix provide/inject module identity by importing LinkComponentKey and IconAliasesKey from deep subpaths, and add explicit package exports for `./base/icons` and `./base/link` so TypeScript resolves them correctly [`e7e9466`](https://github.com/1001-digital/layers/commit/e7e9466)
  _`components`, `layers.base`_

- Fix uncaught error when ENS avatar uses an unsupported URI scheme (e.g. eip155://) by catching the resolution failure and falling back to the identicon [`5081b62`](https://github.com/1001-digital/layers/commit/5081b62)
  _`components.evm`_

- Enforce correct loading of css layers. [`ed9d490`](https://github.com/1001-digital/layers/commit/ed9d490)
  _`layers.base`_

## 2026-03-26

- **Minor** Update opepicons to v1 (SVG-based rendering) [`23fb107`](https://github.com/1001-digital/layers/commit/23fb107)
  _`components`_

## 2026-03-24

- **Minor** Add `CopyText` component for click-to-copy with "Copied..." feedback and `EvmAddressInput` form input with ENS resolution [`b985ba1`](https://github.com/1001-digital/layers/commit/b985ba1)
  _`components`, `components.evm`_

- Add `--dialog-close-color` CSS variable for customizing the Dialog close button color [`53200b8`](https://github.com/1001-digital/layers/commit/53200b8)
  _`components`, `styles`_

- Fix scroll container on body. Enable ENS resolution [`0a9103e`](https://github.com/1001-digital/layers/commit/0a9103e)
  _`components.evm`, `styles`_

## 2026-03-23

- **Minor** Add small variant to Tag and TagsInput components ([#16](https://github.com/1001-digital/layers/pull/16)) [`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6)
  _`components`, `styles`_

## 2026-03-20

- **Minor** Introduced TagsInput component ([#14](https://github.com/1001-digital/layers/pull/14)) [`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23b)
  _`components`, `styles`_

## 2026-03-19

- Fix default max dialog height [`e72c6e5`](https://github.com/1001-digital/layers/commit/e72c6e5)
  _`components`_

- Fix escape keydown catch on some browsers [`3b2a682`](https://github.com/1001-digital/layers/commit/3b2a682)
  _`components`_

- **Minor** Add auto-imports for evm utils / composables [`be17369`](https://github.com/1001-digital/layers/commit/be17369)
  _`components.evm`, `layers.evm`_

- **Minor** Refactor SIWE composable [`3c9e791`](https://github.com/1001-digital/layers/commit/3c9e791)
  _`components.evm`_

- **Minor** Explicit import resolving for evm components [`e940bde`](https://github.com/1001-digital/layers/commit/e940bde)
  _`components.evm`, `layers.evm`_

- **Minor** Fix resolving relative modules [`b53939d`](https://github.com/1001-digital/layers/commit/b53939d)
  _`layers.evm`_

- Fix import map [`45724a3`](https://github.com/1001-digital/layers/commit/45724a3)
  _`layers.evm`_

- **Minor** Remove priceFeed as a default plugin [`9138b9c`](https://github.com/1001-digital/layers/commit/9138b9c)
  _`layers.evm`_

## 2026-03-18

- Cast date as valid datetime [`6983bca`](https://github.com/1001-digital/layers/commit/6983bca)
  _`components`_

- Allow customizing the ui font family [`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2)
  _`components`, `styles`_

- Fixed Toast, Dropdown, and Combobox style scopes. Comboboxes now show clean empty value [`3486179`](https://github.com/1001-digital/layers/commit/3486179)
  _`components`_

- Add custom header bg vars for Dialogs, Popovers, and Toasts [`a5d3ae9`](https://github.com/1001-digital/layers/commit/a5d3ae9)
  _`components`_

- **Minor** Refactor faulty string matching [`4c6225e`](https://github.com/1001-digital/layers/commit/4c6225e)
  _`components.evm`_

- **Minor** Handle wallets that are already connected [`4086f5a`](https://github.com/1001-digital/layers/commit/4086f5a)
  _`components.evm`_

- **Minor** Refactor how indexers and rpcs are configured [`485b644`](https://github.com/1001-digital/layers/commit/485b644)
  _`components.evm`, `layers.evm`_

- **Minor** Rework configuration of indexer and rpc URLs [`15a0d15`](https://github.com/1001-digital/layers/commit/15a0d15)
  _`components.evm`, `layers.evm`_

- Fix border radius for toasts [`1f8234d`](https://github.com/1001-digital/layers/commit/1f8234d)
  _`styles`_

- **Minor** Add default input background that is separate from main background [`5f97a41`](https://github.com/1001-digital/layers/commit/5f97a41)
  _`styles`_

## Unknown

- **Minor** Add `--tag-background` token (defaults to `transparent`) so `Tag` can be themed like other components. [`197f125`](https://github.com/1001-digital/layers/commit/197f125)
  _`components`, `styles`_

- **Minor** Add `--alert-border-radius` token (defaults to `--border-radius`) so `Alert` can be themed like other components. Also reserve inline-end padding on `Alert` when a close button is present so content cannot overlap it. [`2aafcb9`](https://github.com/1001-digital/layers/commit/2aafcb9)
  _`components`, `styles`_

- **Minor** Support non-persistent dismissal on `Alert`. Adds a `dismissable` boolean prop for in-memory dismissal and renames the persistence prop from `dismiss` to `dismiss-key` for clarity. Providing `dismiss-key` still implies `dismissable`. [`856096e`](https://github.com/1001-digital/layers/commit/856096e)
  _`components`_

- **Minor** `EvmConnectAuthDialog` can now be driven externally. Adds `v-model:open` for controlled open state and a `noTrigger` prop that suppresses the built-in trigger button and authenticated slot, so the component renders the dialog only. Useful for flows that already have their own trigger (e.g. linking an additional wallet from a settings page) and need to programmatically open the connect + SIWE flow even while the user is already signed in. [`bdd255a`](https://github.com/1001-digital/layers/commit/bdd255a)
  Also drops the internal watcher that auto-closed the dialog when `isAuthenticated` flipped to `false`, which interfered with controlled flows that clear the SIWE session before prompting a new signature.
  _`components.evm`_

- Upgrade `viem` to 2.48.4, `@wagmi/core` to 3.4.6, and `@wagmi/vue` to 0.5.6. [`ebca2e9`](https://github.com/1001-digital/layers/commit/ebca2e9)
  _`components.evm`, `layers.evm`_

- **Minor** Add `EvmConnectAuth` and `EvmConnectAuthDialog` for a combined connect + SIWE flow that auto-prompts the signature once the wallet connects, plus an `autoSignIn` prop on `EvmSiwe` that triggers sign-in on mount. [`76b8b30`](https://github.com/1001-digital/layers/commit/76b8b30)
  _`components.evm`, `layers.evm`_

