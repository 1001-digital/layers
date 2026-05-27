# @1001-digital/components.evm

## 3.6.8

### Patch Changes

- Updated dependencies [[`ca4e516`](https://github.com/1001-digital/layers/commit/ca4e516a132c39b1bea14a4738e2e4c8ecafb134)]:
  - @1001-digital/components@2.8.6

## 3.6.7

### Patch Changes

- Updated dependencies [[`b3e8c9a`](https://github.com/1001-digital/layers/commit/b3e8c9a972ab8f3a992a6d25c92728943992df4a)]:
  - @1001-digital/components@2.8.5

## 3.6.6

### Patch Changes

- [`700aef7`](https://github.com/1001-digital/layers/commit/700aef7779ab920f6314cf59e05550e89ab4b6eb) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Make the `EvmEthInput` suffix customizable: new optional `suffix` prop (defaults to `'ETH'`); pass a different string to relabel it or `:suffix="false"` to hide it entirely. The existing `#suffix` slot still overrides both.

## 3.6.5

### Patch Changes

- [`1952d69`](https://github.com/1001-digital/layers/commit/1952d69e4cc3943769a22f3cfcaa9d0116497046) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Allow passing a global `title` prop to `EvmMultiTransactionFlowDialog`. When set, it overrides the per-step title from the flow; otherwise the current step's title is used as before.

## 3.6.4

### Patch Changes

- [`b98b8ce`](https://github.com/1001-digital/layers/commit/b98b8ceaa8b7de4ccac3ed6e0677705a2e57e892) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Add an `EvmEthInput` component for ETH amount text input with parsed wei output.

## 3.6.3

### Patch Changes

- [`623d075`](https://github.com/1001-digital/layers/commit/623d075b5afe60f87cec8480f5931f7f47a5f910) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Add reusable ETH amount input helpers for parsing user-entered ETH values to wei.

## 3.6.2

### Patch Changes

- [`8dfd67c`](https://github.com/1001-digital/layers/commit/8dfd67c0044e8b8830ca489dcabc48cf52e625dd) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Prevent stale ENS lookup responses from overwriting newer address input state and show standard Error messages in transaction flow failures.

## 3.6.1

### Patch Changes

- [`3fbc4b8`](https://github.com/1001-digital/layers/commit/3fbc4b830117349e1d632a1b0403762918068c5d) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--multi-transaction-flow-step-gap` so consumers can override the vertical gap between a step's title and status.

- Updated dependencies []:
  - @1001-digital/components@2.8.4

## 3.6.0

### Minor Changes

- [`31f94ce`](https://github.com/1001-digital/layers/commit/31f94cee0e466b26baa0744e312fed35220410ea) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add multi-transaction flow components and composable for sequential EVM transaction flows, plus theme variables for multi-transaction progress styling.

### Patch Changes

- Updated dependencies []:
  - @1001-digital/components@2.8.3

## 3.5.6

### Patch Changes

- [`ea90683`](https://github.com/1001-digital/layers/commit/ea906838b3d270897c6ffcc7a6f523e0d60c7433) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Render EvmTransactionFlow confirm and retry actions as primary buttons by default.

## 3.5.5

### Patch Changes

- Updated dependencies []:
  - @1001-digital/components@2.8.2

## 3.5.4

### Patch Changes

- [`ac8983d`](https://github.com/1001-digital/layers/commit/ac8983db1bc4203d19e9a128e0c7fa8881e7ae8f) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Remove the default border from EVM artifact media.

## 3.5.3

### Patch Changes

- [`7d3da95`](https://github.com/1001-digital/layers/commit/7d3da950e1e8f3aaa53eaef5cc4b48b649c119e3) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix type-check failures for external consumers:
  - `Autocomplete`: simplify `NormalizedGroup.options` type — the previous conditional resolved to `never[]`, so iterating grouped options in the template surfaced `'label' does not exist on type 'never'` errors.
  - `EvmArtifact`: inline a local `TokenMetadata` type instead of importing from `@1001-digital/resolve-metadata` so consumers without that optional peer dep can still type-check.
  - `EvmArtifactModel`: silence the dynamic `import('@google/model-viewer')` for consumers without that optional peer dep.

- Updated dependencies [[`7d3da95`](https://github.com/1001-digital/layers/commit/7d3da950e1e8f3aaa53eaef5cc4b48b649c119e3)]:
  - @1001-digital/components@2.8.1

## 3.5.2

### Patch Changes

- Updated dependencies [[`bcead70`](https://github.com/1001-digital/layers/commit/bcead7053ffec75e44a25d30b321d75c8bdd24c8)]:
  - @1001-digital/components@2.8.0

## 3.5.1

### Patch Changes

- [`96171df`](https://github.com/1001-digital/layers/commit/96171dfb1dadc5435e102783d543b9d902207e74) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - `EvmArtifact` now uses the static `image` as a poster for `<video>` and `<model-viewer>` while the heavy asset loads, so users see the artwork immediately instead of a blank container. The `#animation` slot also receives a `poster` prop for custom renderers.

## 3.5.0

### Minor Changes

- [`a3b31eb`](https://github.com/1001-digital/layers/commit/a3b31eb093ae78b5aa018695625b04d79167bae1) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Make `EvmArtifact` SSR-friendly. Plain `<img>`, `<video>`, and `<audio>` renderers now render server-side (good for LCP and SEO). The pieces that still need a browser — the `@google/model-viewer` dynamic import, `<Embed>`, and the HEAD-request MIME probe — are deferred until after hydration so the initial server and client render match.

  3D rendering is split into a new `EvmArtifactModel` component (client-only) that owns the `@google/model-viewer` dynamic import. It emits `error` for runtime `<model-viewer>` errors and `import-error` if the dynamic import fails; `EvmArtifact` translates these into the existing `error` payload (`kind: 'animation' | 'model'`).

  `useResolvedUrl` now resolves `http(s):`, `data:`, and `blob:` URIs synchronously (and reads cached `ipfs://` / `ar://` resolutions synchronously too), so SSR can emit a real `src` attribute on first paint instead of an empty string.

  `EvmArtifact` is removed from the client-only component list; `EvmArtifactModel` takes its place.

## 3.4.0

### Minor Changes

- [`92d026c`](https://github.com/1001-digital/layers/commit/92d026cfc531a2d85449d66dfd1bfc1bf9d8663f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `EvmArtifact` — a generic NFT artifact renderer that accepts a normalized `TokenMetadata` shape (e.g. from `@1001-digital/resolve-metadata`) or individual `image` / `animationUrl` / `name` / `backgroundColor` props. Auto-detects media type by file extension first, then by HEAD-request `Content-Type` (with `AbortController` so rapid URL changes can't let stale responses overwrite fresh detection), and renders the appropriate element: `<img>` for images, `<video autoplay muted loop>` for video, `<audio controls>` (over the static image as poster) for audio, `<Embed>` for HTML/iframe and unknown types, and a lazy-loaded `<model-viewer>` for `.glb` / `.gltf` 3D assets. URLs from `resolve-metadata` come back as protocol URIs (`ipfs://`, `ar://`) and are resolved through the existing `useResolvedUrl` composable against the configured gateways.

  Provides `v-model:show-animation` for parent-controlled play/pause and four scoped slots: `#animation`, `#static`, `#overlay` (receives `showAnimation` and `hasAnimation`), and `#fallback` (receives `name` and the last `error`). Emits `error` with `{ kind: 'image' | 'animation' | 'model'; url }`. Optionally applies `background_color` from metadata as the container background (validated as 6-char hex). Aspect ratio defaults to `1` and is overridable via the `aspectRatio` prop or a `--evm-artifact-aspect-ratio` CSS custom property.

  `@1001-digital/resolve-metadata` and `@google/model-viewer` are added as **optional** peer dependencies — the type import for `TokenMetadata` is type-only, and `model-viewer` is only fetched on demand when a 3D asset is detected, so neither is required for the common image/video case.

## 3.3.0

### Minor Changes

- [`bdd255a`](https://github.com/1001-digital/layers/commit/bdd255a1e696e26a4736a14694e3c9b16386359a) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - `EvmConnectAuthDialog` can now be driven externally. Adds `v-model:open` for controlled open state and a `noTrigger` prop that suppresses the built-in trigger button and authenticated slot, so the component renders the dialog only. Useful for flows that already have their own trigger (e.g. linking an additional wallet from a settings page) and need to programmatically open the connect + SIWE flow even while the user is already signed in.

  Also drops the internal watcher that auto-closed the dialog when `isAuthenticated` flipped to `false`, which interfered with controlled flows that clear the SIWE session before prompting a new signature.

## 3.2.1

### Patch Changes

- [`ebca2e9`](https://github.com/1001-digital/layers/commit/ebca2e9ece9a37d79b342f19c252dd2fe84533f2) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Upgrade `viem` to 2.48.4, `@wagmi/core` to 3.4.6, and `@wagmi/vue` to 0.5.6.

## 3.2.0

### Minor Changes

- [`76b8b30`](https://github.com/1001-digital/layers/commit/76b8b309a4fbb2d007ee6526c5eddbf45f86ebe7) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `EvmConnectAuth` and `EvmConnectAuthDialog` for a combined connect + SIWE flow that auto-prompts the signature once the wallet connects, plus an `autoSignIn` prop on `EvmSiwe` that triggers sign-in on mount.

## 3.1.7

### Patch Changes

- Updated dependencies [[`197f125`](https://github.com/1001-digital/layers/commit/197f125d19e16b87e1e6e027e3b85bcdc3986b0e)]:
  - @1001-digital/components@2.7.2

## 3.1.6

### Patch Changes

- Updated dependencies [[`2aafcb9`](https://github.com/1001-digital/layers/commit/2aafcb97c1daefb1439966cfcb8adc770a31f17a)]:
  - @1001-digital/components@2.7.1

## 3.1.5

### Patch Changes

- Updated dependencies [[`856096e`](https://github.com/1001-digital/layers/commit/856096edf9f529e0a2519e8c17739dc43324b810)]:
  - @1001-digital/components@2.7.0

## 3.1.4

### Patch Changes

- [#40](https://github.com/1001-digital/layers/pull/40) [`ead860d`](https://github.com/1001-digital/layers/commit/ead860d398e27d8586da3651dff04b8117cf1b04) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Fix type issue

- [#40](https://github.com/1001-digital/layers/pull/40) [`c703979`](https://github.com/1001-digital/layers/commit/c703979aea9d09d97c3b0528def60b89f6115efc) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - This fixes a type error for the toast explorer label

## 3.1.3

### Patch Changes

- [`3a532d8`](https://github.com/1001-digital/layers/commit/3a532d891118eec022577277f621a2cf31a17f82) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Expose ens and address in profile actions

## 3.1.2

### Patch Changes

- [`5e71dfa`](https://github.com/1001-digital/layers/commit/5e71dfab8f721b3f111e1cfbf81e103c203e5fa6) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix client only component list

## 3.1.1

### Patch Changes

- [`e4c7708`](https://github.com/1001-digital/layers/commit/e4c7708c502599b6e46dc97b782e4be55b248d6e) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix default block explorer links

## 3.1.0

### Minor Changes

- [#35](https://github.com/1001-digital/layers/pull/35) [`3e1e0eb`](https://github.com/1001-digital/layers/commit/3e1e0ebd4189c34c516cc77421f8e487d4672cfa) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Extract generic Avatar component from EvmAvatar

  Add a reusable `Avatar` component to `@1001-digital/components` that renders an image or an Opepicon fallback. `EvmAvatar` now delegates to this component instead of inlining the logic.
  - Remove `avatarUrl` prop from `EvmAvatarProps` (avatar URL is now resolved internally)
  - Cache resolved dweb URLs to avoid duplicate resolution

- [`8536c21`](https://github.com/1001-digital/layers/commit/8536c21c543722a60c90c4f2b2a7781a4b5db48f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Switch default block explorer to evm.now (mainnet)

### Patch Changes

- [`b6947f1`](https://github.com/1001-digital/layers/commit/b6947f146761c9e206deee37c1e89e957547d201) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Make block explorer link text customizable

- Updated dependencies [[`3e1e0eb`](https://github.com/1001-digital/layers/commit/3e1e0ebd4189c34c516cc77421f8e487d4672cfa)]:
  - @1001-digital/components@2.6.0

## 3.0.3

### Patch Changes

- [`997b51e`](https://github.com/1001-digital/layers/commit/997b51ea751a9204240ef9096a585d55182e4a35) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Upgrade dweb-fetch to 0.2.1

## 3.0.2

### Patch Changes

- [`42c75d9`](https://github.com/1001-digital/layers/commit/42c75d937b68bdc13b7b746dbb702c94aca58f45) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Pass RPC URLs from wagmi config to dweb-fetch client for EIP-155 resolution

## 3.0.1

### Patch Changes

- Updated dependencies [[`ded0887`](https://github.com/1001-digital/layers/commit/ded08872a40886e9e428be746384ade45594fb00)]:
  - @1001-digital/components@2.5.0

## 3.0.0

### Major Changes

- [#29](https://github.com/1001-digital/layers/pull/29) [`f680a0f`](https://github.com/1001-digital/layers/commit/f680a0f543a301f012db11bb09bde5f33bfd55a0) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Add EvmTransactionFlowDialog and keepOpen prop for persistent transaction dialogs

  Note: Deprecation of old EvmTransactionFlow (clients have to rename their implementation to EvmTransactionFlowDialog)

## 2.7.0

### Minor Changes

- [`3e4d23e`](https://github.com/1001-digital/layers/commit/3e4d23e59fe8785a31dd820a7b1180df03d20120) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Update viem and wagmi to their latest versions.

### Patch Changes

- [`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix cross-browser issues, harden components, and ensure correct chain during SIWE signature

- Updated dependencies [[`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8)]:
  - @1001-digital/components@2.4.5

## 2.6.1

### Patch Changes

- Updated dependencies [[`f2fae71`](https://github.com/1001-digital/layers/commit/f2fae717e64cfe460c5a6b79376b31047a25258c)]:
  - @1001-digital/components@2.4.4

## 2.6.0

### Minor Changes

- [`23d5c51`](https://github.com/1001-digital/layers/commit/23d5c51dfe74a99d73c39b961833f9794b69ee8b) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix chain config

## 2.5.4

### Patch Changes

- Updated dependencies [[`aac9359`](https://github.com/1001-digital/layers/commit/aac93597b81a992f5ff03c99d1ac23c295636cd7)]:
  - @1001-digital/components@2.4.3

## 2.5.3

### Patch Changes

- Updated dependencies [[`d69112e`](https://github.com/1001-digital/layers/commit/d69112e461addd13a8a7bebcec7c62fbf42770dc)]:
  - @1001-digital/components@2.4.2

## 2.5.2

### Patch Changes

- [`5081b62`](https://github.com/1001-digital/layers/commit/5081b62e54af4f9db24e0a44e0f6b6ba0b427cf4) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix uncaught error when ENS avatar uses an unsupported URI scheme (e.g. eip155://) by catching the resolution failure and falling back to the identicon

- Updated dependencies [[`e7e9466`](https://github.com/1001-digital/layers/commit/e7e94667cb9b7318a77fc849ecb83e6dd5d227d9)]:
  - @1001-digital/components@2.4.1

## 2.5.1

### Patch Changes

- Updated dependencies [[`23fb107`](https://github.com/1001-digital/layers/commit/23fb107ae9647332ac5ebf85ad4053051c878b86)]:
  - @1001-digital/components@2.4.0

## 2.5.0

### Minor Changes

- [`b985ba1`](https://github.com/1001-digital/layers/commit/b985ba17f1bcddef6431606c3a2cfd74969f35fc) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `CopyText` component for click-to-copy with "Copied..." feedback and `EvmAddressInput` form input with ENS resolution

### Patch Changes

- Updated dependencies [[`b985ba1`](https://github.com/1001-digital/layers/commit/b985ba17f1bcddef6431606c3a2cfd74969f35fc), [`53200b8`](https://github.com/1001-digital/layers/commit/53200b80d333c2326ccad67255c8691e4d08b01f)]:
  - @1001-digital/components@2.3.0

## 2.4.3

### Patch Changes

- [`0a9103e`](https://github.com/1001-digital/layers/commit/0a9103e382e268a44a25851649a7e90b80373d86) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix scroll container on body. Enable ENS resolution

- Updated dependencies []:
  - @1001-digital/components@2.2.1

## 2.4.2

### Patch Changes

- Updated dependencies [[`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6d3b80dee3bd32a9ce24db411bb9eb18dd)]:
  - @1001-digital/components@2.2.0

## 2.4.1

### Patch Changes

- Updated dependencies [[`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23bf22cbe7c5cf6bacc7176b5fcb1d6c0d3d)]:
  - @1001-digital/components@2.1.0

## 2.4.0

### Minor Changes

- [`be17369`](https://github.com/1001-digital/layers/commit/be1736985cfa29cc28619923f7ad790fdb934a4b) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add auto-imports for evm utils / composables

- [`3c9e791`](https://github.com/1001-digital/layers/commit/3c9e791bfaedc0ac87dfd8ef419526f591ef0ca9) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Refactor SIWE composable

## 2.3.0

### Minor Changes

- [`4c6225e`](https://github.com/1001-digital/layers/commit/4c6225e3d0a7c9b90c393caacb4c8ba0efb4661f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Refactor faulty string matching

- [`e940bde`](https://github.com/1001-digital/layers/commit/e940bde5a01a0ff58b08f5e6f10b52450c32dd9e) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Explicit import resolving for evm components

- [`4086f5a`](https://github.com/1001-digital/layers/commit/4086f5a394a1eefc8c32fcb9f7643347c4f0f0d2) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Handle wallets that are already connected

### Patch Changes

- Updated dependencies [[`e72c6e5`](https://github.com/1001-digital/layers/commit/e72c6e576eb4a973c0cb6c7c7c52c3e8e84e7ee2), [`3b2a682`](https://github.com/1001-digital/layers/commit/3b2a682afb88f99c28d00c7a1a1d42b7a0be4d72)]:
  - @1001-digital/components@2.0.8

## 2.2.0

### Minor Changes

- [`485b644`](https://github.com/1001-digital/layers/commit/485b644603a8c6d9106a44eeeb3143fbe5e0144c) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Refactor how indexers and rpcs are configured

### Patch Changes

- Updated dependencies [[`6983bca`](https://github.com/1001-digital/layers/commit/6983bca6ed2dc03edb805f6fb291f628cfdd15f2)]:
  - @1001-digital/components@2.0.7

## 2.1.4

### Patch Changes

- Updated dependencies [[`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2715914bd5351fb4be00407c5917c779fb)]:
  - @1001-digital/components@2.0.6

## 2.1.3

### Patch Changes

- Updated dependencies [[`3486179`](https://github.com/1001-digital/layers/commit/3486179ac40bc45e0888932ff937132e92aa895f), [`a5d3ae9`](https://github.com/1001-digital/layers/commit/a5d3ae99089d7bdb101bdb7f8cb71b24609c99d0)]:
  - @1001-digital/components@2.0.5

## 2.1.2

### Patch Changes

- Updated dependencies []:
  - @1001-digital/components@2.0.4

## 2.1.1

### Patch Changes

- Updated dependencies []:
  - @1001-digital/components@2.0.3

## 2.1.0

### Minor Changes

- [`15a0d15`](https://github.com/1001-digital/layers/commit/15a0d15dfa6c3319975acece030798b1701120e3) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Rework configuration of indexer and rpc URLs
