# @1001-digital/components

## 2.7.0

### Minor Changes

- [`856096e`](https://github.com/1001-digital/layers/commit/856096edf9f529e0a2519e8c17739dc43324b810) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Support non-persistent dismissal on `Alert`. Adds a `dismissable` boolean prop for in-memory dismissal and renames the persistence prop from `dismiss` to `dismiss-key` for clarity. Providing `dismiss-key` still implies `dismissable`.

## 2.6.0

### Minor Changes

- [#35](https://github.com/1001-digital/layers/pull/35) [`3e1e0eb`](https://github.com/1001-digital/layers/commit/3e1e0ebd4189c34c516cc77421f8e487d4672cfa) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Extract generic Avatar component from EvmAvatar

  Add a reusable `Avatar` component to `@1001-digital/components` that renders an image or an Opepicon fallback. `EvmAvatar` now delegates to this component instead of inlining the logic.
  - Remove `avatarUrl` prop from `EvmAvatarProps` (avatar URL is now resolved internally)
  - Cache resolved dweb URLs to avoid duplicate resolution

## 2.5.0

### Minor Changes

- [#31](https://github.com/1001-digital/layers/pull/31) [`ded0887`](https://github.com/1001-digital/layers/commit/ded08872a40886e9e428be746384ade45594fb00) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Fix long tags overflowing TagsInput, default addOnBlur and duplicate to true

## 2.4.5

### Patch Changes

- [`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix cross-browser issues, harden components, and ensure correct chain during SIWE signature

- Updated dependencies [[`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8)]:
  - @1001-digital/styles@2.3.3

## 2.4.4

### Patch Changes

- [`f2fae71`](https://github.com/1001-digital/layers/commit/f2fae717e64cfe460c5a6b79376b31047a25258c) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add Embed component

## 2.4.3

### Patch Changes

- [`aac9359`](https://github.com/1001-digital/layers/commit/aac93597b81a992f5ff03c99d1ac23c295636cd7) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix combobox height

## 2.4.2

### Patch Changes

- [`d69112e`](https://github.com/1001-digital/layers/commit/d69112e461addd13a8a7bebcec7c62fbf42770dc) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Open combobox by default on focus

## 2.4.1

### Patch Changes

- [`e7e9466`](https://github.com/1001-digital/layers/commit/e7e94667cb9b7318a77fc849ecb83e6dd5d227d9) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix provide/inject module identity by importing LinkComponentKey and IconAliasesKey from deep subpaths, and add explicit package exports for `./base/icons` and `./base/link` so TypeScript resolves them correctly

## 2.4.0

### Minor Changes

- [`23fb107`](https://github.com/1001-digital/layers/commit/23fb107ae9647332ac5ebf85ad4053051c878b86) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Update opepicons to v1 (SVG-based rendering)

## 2.3.0

### Minor Changes

- [`b985ba1`](https://github.com/1001-digital/layers/commit/b985ba17f1bcddef6431606c3a2cfd74969f35fc) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `CopyText` component for click-to-copy with "Copied..." feedback and `EvmAddressInput` form input with ENS resolution

### Patch Changes

- [`53200b8`](https://github.com/1001-digital/layers/commit/53200b80d333c2326ccad67255c8691e4d08b01f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--dialog-close-color` CSS variable for customizing the Dialog close button color

- Updated dependencies [[`53200b8`](https://github.com/1001-digital/layers/commit/53200b80d333c2326ccad67255c8691e4d08b01f)]:
  - @1001-digital/styles@2.3.2

## 2.2.1

### Patch Changes

- Updated dependencies [[`0a9103e`](https://github.com/1001-digital/layers/commit/0a9103e382e268a44a25851649a7e90b80373d86)]:
  - @1001-digital/styles@2.3.1

## 2.2.0

### Minor Changes

- [#16](https://github.com/1001-digital/layers/pull/16) [`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6d3b80dee3bd32a9ce24db411bb9eb18dd) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Add small variant to Tag and TagsInput components

### Patch Changes

- Updated dependencies [[`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6d3b80dee3bd32a9ce24db411bb9eb18dd)]:
  - @1001-digital/styles@2.3.0

## 2.1.0

### Minor Changes

- [#14](https://github.com/1001-digital/layers/pull/14) [`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23bf22cbe7c5cf6bacc7176b5fcb1d6c0d3d) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Introduced TagsInput component

### Patch Changes

- Updated dependencies [[`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23bf22cbe7c5cf6bacc7176b5fcb1d6c0d3d)]:
  - @1001-digital/styles@2.2.0

## 2.0.8

### Patch Changes

- [`e72c6e5`](https://github.com/1001-digital/layers/commit/e72c6e576eb4a973c0cb6c7c7c52c3e8e84e7ee2) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix default max dialog height

- [`3b2a682`](https://github.com/1001-digital/layers/commit/3b2a682afb88f99c28d00c7a1a1d42b7a0be4d72) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix escape keydown catch on some browsers

## 2.0.7

### Patch Changes

- [`6983bca`](https://github.com/1001-digital/layers/commit/6983bca6ed2dc03edb805f6fb291f628cfdd15f2) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Cast date as valid datetime

## 2.0.6

### Patch Changes

- [`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2715914bd5351fb4be00407c5917c779fb) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Allow customizing the ui font family

- Updated dependencies [[`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2715914bd5351fb4be00407c5917c779fb)]:
  - @1001-digital/styles@2.1.2

## 2.0.5

### Patch Changes

- [`3486179`](https://github.com/1001-digital/layers/commit/3486179ac40bc45e0888932ff937132e92aa895f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fixed Toast, Dropdown, and Combobox style scopes. Comboboxes now show clean empty value

- [`a5d3ae9`](https://github.com/1001-digital/layers/commit/a5d3ae99089d7bdb101bdb7f8cb71b24609c99d0) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add custom header bg vars for Dialogs, Popovers, and Toasts

## 2.0.4

### Patch Changes

- Updated dependencies [[`1f8234d`](https://github.com/1001-digital/layers/commit/1f8234db60279c2dcd173c09441f553bf28ed84b)]:
  - @1001-digital/styles@2.1.1

## 2.0.3

### Patch Changes

- Updated dependencies [[`5f97a41`](https://github.com/1001-digital/layers/commit/5f97a41d0dfe2e9eab5c03f7d62adb472038b91e)]:
  - @1001-digital/styles@2.1.0
