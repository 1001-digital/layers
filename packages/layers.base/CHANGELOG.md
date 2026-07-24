# @1001-digital/layers.base

## 2.1.1

### Patch Changes

- Updated dependencies [[`1ee65c7`](https://github.com/1001-digital/layers/commit/1ee65c7678a151cc3e3c30868db7ca714f78e063)]:
  - @1001-digital/components@2.9.1

## 2.1.0

### Minor Changes

- [`ce2b4c3`](https://github.com/1001-digital/layers/commit/ce2b4c3225650c87127c2a454fa0ee29c4820a64) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add shared media detection to `@1001-digital/components`: `detectMediaInfoFromUrl`,
  `detectMediaInfoFromMime`, `inspectMediaUrl`, and a cached `fetchMediaInfo` resolve
  a media URL's kind, MIME type, and extension. `Embed` now reuses the shared
  (cached) probe instead of its own HEAD request, and `createCache` moved to the
  base library (still re-exported from `@1001-digital/components.evm`).

  `@1001-digital/components.evm` gains a `useMediaInfo` composable that resolves
  `ipfs://`/`ipns://`/Arweave URLs and exposes the detected media info reactively.
  `EvmArtifact` uses the same inspection result, so artifact rendering and `Embed`
  no longer issue duplicate HEAD probes.

### Patch Changes

- Updated dependencies [[`ce2b4c3`](https://github.com/1001-digital/layers/commit/ce2b4c3225650c87127c2a454fa0ee29c4820a64)]:
  - @1001-digital/components@2.9.0

## 2.0.38

### Patch Changes

- Updated dependencies [[`14da803`](https://github.com/1001-digital/layers/commit/14da8037e46fb0504cd3cd86f4ff801321b04fff)]:
  - @1001-digital/components@2.8.10

## 2.0.37

### Patch Changes

- [`83024fb`](https://github.com/1001-digital/layers/commit/83024fba31206a7a57c54a7ea274e255ed7988d5) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Upgrade `nuxt` to 4.4.8 and align the toolchain around it:
  - `vue` ^3.5.40 (matches nuxt's `^3.5.35` requirement — previously the exact pin at 3.5.30 produced a second Vue copy in the tree)
  - `eslint` 10.7.0 and `@nuxt/eslint` 1.16.0
  - `@nuxt/icon` 2.3.1
  - `vue-tsc` added as a dev dependency since `nuxi typecheck` no longer installs a type checker on demand
  - `compatibilityDate` set to 2026-07-18 in layers.base; layers.evm (previously stuck on 2024-11-01) now inherits it through `extends` instead of duplicating the date

## 2.0.36

### Patch Changes

- Updated dependencies [[`13e3143`](https://github.com/1001-digital/layers/commit/13e3143ca04196eb675fdf63a9af708debe03560)]:
  - @1001-digital/components@2.8.9

## 2.0.35

### Patch Changes

- Updated dependencies [[`a4cb297`](https://github.com/1001-digital/layers/commit/a4cb297cdb607a8e34bf41dca7b7fc884a2c0ad9)]:
  - @1001-digital/components@2.8.8

## 2.0.34

### Patch Changes

- Updated dependencies [[`722a1bc`](https://github.com/1001-digital/layers/commit/722a1bc841e1010ff35dbafbcad0f958e9fced13)]:
  - @1001-digital/components@2.8.7

## 2.0.33

### Patch Changes

- Updated dependencies [[`ca4e516`](https://github.com/1001-digital/layers/commit/ca4e516a132c39b1bea14a4738e2e4c8ecafb134)]:
  - @1001-digital/components@2.8.6

## 2.0.32

### Patch Changes

- Updated dependencies [[`b3e8c9a`](https://github.com/1001-digital/layers/commit/b3e8c9a972ab8f3a992a6d25c92728943992df4a)]:
  - @1001-digital/components@2.8.5

## 2.0.31

### Patch Changes

- [`ad3c686`](https://github.com/1001-digital/layers/commit/ad3c686650468f71d8c6242dbc75512882e59ec2) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Force Vite to dedupe `@1001-digital/components` and `@1001-digital/components.evm` so injection keys (`EvmConfigKey`, `LinkComponentKey`, `IconAliasesKey`, …) resolve to a single `Symbol(...)` everywhere. Without this, Vite's dep optimizer pre-bundles the bare-specifier import as a separate chunk from the package's own relative-path imports — two module instances, two symbols, and `inject` silently falls back to defaults (in `EvmConfigKey`'s case: a mainnet-only config, which is why every write transaction prompted the wallet to switch to chain 1).

  `exclude` must list both the bare name and its `-original` companion. The new facade re-exports through `@1001-digital/components.evm-original` (and `@1001-digital/components-original` in the base layer); Vite's optimizer scans those as bare specifiers too, and pre-bundling either name creates the same parallel module instance the bare name causes. The combined `resolve.dedupe` + `optimizeDeps.exclude` for both spellings picks the same physical file and keeps everything as source.

## 2.0.30

### Patch Changes

- [`11bccd5`](https://github.com/1001-digital/layers/commit/11bccd5fed9cd83d24fdabdd00320fd72da54e0a) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix the component override facade so consumer overrides actually apply.

  Two bugs in 2.7.19 / 2.0.28:
  1. **Infinite render recursion.** The proxy was given the same `name` as the original. Vue's `resolveAsset` checks self-name before the global registry, so `resolveComponent(name)` returned the proxy itself, looping until hydration crashed with `Cannot destructure property 'type' of 'vnode' as it is null`. Dropping `name:` from the proxy fixes the recursion.
  2. **Overrides ignored.** After the recursion fix, `resolveComponent(name)` only finds _globally_ registered components. Nuxt auto-imports `app/components/<Name>.vue` as a named import, not as a global, so the proxy fell through to the package default — the consumer's `app/components/Loading.vue` was never picked up. A new plugin (`app/plugins/components.ts` in each layer) registers each shadowed name on `nuxtApp.vueApp.component()` from `#components`, where the consumer's override has already taken precedence over the layer's package-level file. The proxy's `resolveComponent` now resolves through that global registration.

## 2.0.29

### Patch Changes

- [`615c8e4`](https://github.com/1001-digital/layers/commit/615c8e4592dcc8a31e42ccab807ddf41543e67dc) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix infinite render recursion in the component facade. The proxy was given the same `name` as the original component, but Vue's `resolveAsset` checks self-name before the global registry — so `resolveComponent(name)` returned the proxy itself, looping until hydration crashed with `Cannot destructure property 'type' of 'vnode' as it is null`. Dropping `name:` from the proxy lets the lookup fall through to the Nuxt-registered original (or a consumer override).

## 2.0.28

### Patch Changes

- [`227d6a6`](https://github.com/1001-digital/layers/commit/227d6a6944a87b21193ff19a6a921e6994c62eee) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Route `@1001-digital/components` and `@1001-digital/components.evm` package imports through a Nuxt-layer facade so consumer/layer component overrides apply to package-level imports (e.g. `<Button>` inside `EvmConnectDialog` will pick up an app's override of `Button`).

## 2.0.27

### Patch Changes

- Updated dependencies [[`3fbc4b8`](https://github.com/1001-digital/layers/commit/3fbc4b830117349e1d632a1b0403762918068c5d), [`23d6b76`](https://github.com/1001-digital/layers/commit/23d6b769ded3a82f663b8d94677e6dd9a0c57841)]:
  - @1001-digital/styles@2.7.0
  - @1001-digital/components@2.8.4

## 2.0.26

### Patch Changes

- Updated dependencies [[`31f94ce`](https://github.com/1001-digital/layers/commit/31f94cee0e466b26baa0744e312fed35220410ea)]:
  - @1001-digital/styles@2.6.2
  - @1001-digital/components@2.8.3

## 2.0.25

### Patch Changes

- Updated dependencies [[`0619a34`](https://github.com/1001-digital/layers/commit/0619a34bb425ffbbbbf2117a7902c94bab36d06c)]:
  - @1001-digital/styles@2.6.1
  - @1001-digital/components@2.8.2

## 2.0.24

### Patch Changes

- Updated dependencies [[`7d3da95`](https://github.com/1001-digital/layers/commit/7d3da950e1e8f3aaa53eaef5cc4b48b649c119e3)]:
  - @1001-digital/components@2.8.1

## 2.0.23

### Patch Changes

- Updated dependencies [[`bcead70`](https://github.com/1001-digital/layers/commit/bcead7053ffec75e44a25d30b321d75c8bdd24c8)]:
  - @1001-digital/components@2.8.0
  - @1001-digital/styles@2.6.0

## 2.0.22

### Patch Changes

- Updated dependencies [[`197f125`](https://github.com/1001-digital/layers/commit/197f125d19e16b87e1e6e027e3b85bcdc3986b0e)]:
  - @1001-digital/styles@2.5.0
  - @1001-digital/components@2.7.2

## 2.0.21

### Patch Changes

- Updated dependencies [[`2aafcb9`](https://github.com/1001-digital/layers/commit/2aafcb97c1daefb1439966cfcb8adc770a31f17a)]:
  - @1001-digital/styles@2.4.0
  - @1001-digital/components@2.7.1

## 2.0.20

### Patch Changes

- Updated dependencies [[`856096e`](https://github.com/1001-digital/layers/commit/856096edf9f529e0a2519e8c17739dc43324b810)]:
  - @1001-digital/components@2.7.0

## 2.0.19

### Patch Changes

- Updated dependencies [[`3e1e0eb`](https://github.com/1001-digital/layers/commit/3e1e0ebd4189c34c516cc77421f8e487d4672cfa)]:
  - @1001-digital/components@2.6.0

## 2.0.18

### Patch Changes

- Updated dependencies [[`ded0887`](https://github.com/1001-digital/layers/commit/ded08872a40886e9e428be746384ade45594fb00)]:
  - @1001-digital/components@2.5.0

## 2.0.17

### Patch Changes

- [`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix cross-browser issues, harden components, and ensure correct chain during SIWE signature

- Updated dependencies [[`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8)]:
  - @1001-digital/components@2.4.5
  - @1001-digital/styles@2.3.3

## 2.0.16

### Patch Changes

- Updated dependencies [[`f2fae71`](https://github.com/1001-digital/layers/commit/f2fae717e64cfe460c5a6b79376b31047a25258c)]:
  - @1001-digital/components@2.4.4

## 2.0.15

### Patch Changes

- Updated dependencies [[`aac9359`](https://github.com/1001-digital/layers/commit/aac93597b81a992f5ff03c99d1ac23c295636cd7)]:
  - @1001-digital/components@2.4.3

## 2.0.14

### Patch Changes

- [`ed9d490`](https://github.com/1001-digital/layers/commit/ed9d49087739e188aee4d1bc719ffaf698ff98f3) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Enforce correct loading of css layers.

## 2.0.13

### Patch Changes

- Updated dependencies [[`d69112e`](https://github.com/1001-digital/layers/commit/d69112e461addd13a8a7bebcec7c62fbf42770dc)]:
  - @1001-digital/components@2.4.2

## 2.0.12

### Patch Changes

- [`e7e9466`](https://github.com/1001-digital/layers/commit/e7e94667cb9b7318a77fc849ecb83e6dd5d227d9) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix provide/inject module identity by importing LinkComponentKey and IconAliasesKey from deep subpaths, and add explicit package exports for `./base/icons` and `./base/link` so TypeScript resolves them correctly

- Updated dependencies [[`e7e9466`](https://github.com/1001-digital/layers/commit/e7e94667cb9b7318a77fc849ecb83e6dd5d227d9)]:
  - @1001-digital/components@2.4.1

## 2.0.11

### Patch Changes

- Updated dependencies [[`23fb107`](https://github.com/1001-digital/layers/commit/23fb107ae9647332ac5ebf85ad4053051c878b86)]:
  - @1001-digital/components@2.4.0

## 2.0.10

### Patch Changes

- Updated dependencies [[`b985ba1`](https://github.com/1001-digital/layers/commit/b985ba17f1bcddef6431606c3a2cfd74969f35fc), [`53200b8`](https://github.com/1001-digital/layers/commit/53200b80d333c2326ccad67255c8691e4d08b01f)]:
  - @1001-digital/components@2.3.0
  - @1001-digital/styles@2.3.2

## 2.0.9

### Patch Changes

- Updated dependencies [[`0a9103e`](https://github.com/1001-digital/layers/commit/0a9103e382e268a44a25851649a7e90b80373d86)]:
  - @1001-digital/styles@2.3.1
  - @1001-digital/components@2.2.1

## 2.0.8

### Patch Changes

- Updated dependencies [[`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6d3b80dee3bd32a9ce24db411bb9eb18dd)]:
  - @1001-digital/components@2.2.0
  - @1001-digital/styles@2.3.0

## 2.0.7

### Patch Changes

- Updated dependencies [[`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23bf22cbe7c5cf6bacc7176b5fcb1d6c0d3d)]:
  - @1001-digital/components@2.1.0
  - @1001-digital/styles@2.2.0

## 2.0.6

### Patch Changes

- Updated dependencies [[`e72c6e5`](https://github.com/1001-digital/layers/commit/e72c6e576eb4a973c0cb6c7c7c52c3e8e84e7ee2), [`3b2a682`](https://github.com/1001-digital/layers/commit/3b2a682afb88f99c28d00c7a1a1d42b7a0be4d72)]:
  - @1001-digital/components@2.0.8

## 2.0.5

### Patch Changes

- Updated dependencies [[`6983bca`](https://github.com/1001-digital/layers/commit/6983bca6ed2dc03edb805f6fb291f628cfdd15f2)]:
  - @1001-digital/components@2.0.7

## 2.0.4

### Patch Changes

- Updated dependencies [[`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2715914bd5351fb4be00407c5917c779fb)]:
  - @1001-digital/components@2.0.6
  - @1001-digital/styles@2.1.2

## 2.0.3

### Patch Changes

- Updated dependencies [[`3486179`](https://github.com/1001-digital/layers/commit/3486179ac40bc45e0888932ff937132e92aa895f), [`a5d3ae9`](https://github.com/1001-digital/layers/commit/a5d3ae99089d7bdb101bdb7f8cb71b24609c99d0)]:
  - @1001-digital/components@2.0.5

## 2.0.2

### Patch Changes

- Updated dependencies [[`1f8234d`](https://github.com/1001-digital/layers/commit/1f8234db60279c2dcd173c09441f553bf28ed84b)]:
  - @1001-digital/styles@2.1.1
  - @1001-digital/components@2.0.4

## 2.0.1

### Patch Changes

- Updated dependencies [[`5f97a41`](https://github.com/1001-digital/layers/commit/5f97a41d0dfe2e9eab5c03f7d62adb472038b91e)]:
  - @1001-digital/styles@2.1.0
  - @1001-digital/components@2.0.3
