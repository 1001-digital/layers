# @1001-digital/styles

## 2.7.0

### Minor Changes

- [`23d6b76`](https://github.com/1001-digital/layers/commit/23d6b769ded3a82f663b8d94677e6dd9a0c57841) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--shadow-sm`, `--shadow-md`, `--shadow-lg`, and a `--shadow` default. Shadow colors adapt to the active color scheme via `light-dark()`, using heavier alpha in dark mode so elevation reads against dark backgrounds.

  This also lights up drop shadows on `Combobox`, `FormSelect`, and `Autocomplete` popover surfaces, which already referenced `--shadow-lg` before the token existed.

### Patch Changes

- [`3fbc4b8`](https://github.com/1001-digital/layers/commit/3fbc4b830117349e1d632a1b0403762918068c5d) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--multi-transaction-flow-step-gap` so consumers can override the vertical gap between a step's title and status.

## 2.6.2

### Patch Changes

- [`31f94ce`](https://github.com/1001-digital/layers/commit/31f94cee0e466b26baa0744e312fed35220410ea) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add multi-transaction flow components and composable for sequential EVM transaction flows, plus theme variables for multi-transaction progress styling.

## 2.6.1

### Patch Changes

- [`0619a34`](https://github.com/1001-digital/layers/commit/0619a34bb425ffbbbbf2117a7902c94bab36d06c) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Introduce `--scrollbar-thumb-color` and `--scrollbar-track-color` variables so scrollbar colors can be themed without overriding the base selector.

## 2.6.0

### Minor Changes

- [`bcead70`](https://github.com/1001-digital/layers/commit/bcead7053ffec75e44a25d30b321d75c8bdd24c8) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add an `Autocomplete` component wrapping Reka UI's autocomplete primitives. Unlike `Combobox`, the model value is the input text itself, so users can type free-form values with optional suggestions. Supports flat option lists, grouped options, and server-driven results via the `ignore-filter` prop. Reka UI is bumped to `^2.9.6`.

## 2.5.0

### Minor Changes

- [`197f125`](https://github.com/1001-digital/layers/commit/197f125d19e16b87e1e6e027e3b85bcdc3986b0e) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--tag-background` token (defaults to `transparent`) so `Tag` can be themed like other components.

## 2.4.0

### Minor Changes

- [`2aafcb9`](https://github.com/1001-digital/layers/commit/2aafcb97c1daefb1439966cfcb8adc770a31f17a) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--alert-border-radius` token (defaults to `--border-radius`) so `Alert` can be themed like other components. Also reserve inline-end padding on `Alert` when a close button is present so content cannot overlap it.

## 2.3.3

### Patch Changes

- [`6950d1a`](https://github.com/1001-digital/layers/commit/6950d1a8475092b71e6297ae7b7e4b03e1a3b1e8) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix cross-browser issues, harden components, and ensure correct chain during SIWE signature

## 2.3.2

### Patch Changes

- [`53200b8`](https://github.com/1001-digital/layers/commit/53200b80d333c2326ccad67255c8691e4d08b01f) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add `--dialog-close-color` CSS variable for customizing the Dialog close button color

## 2.3.1

### Patch Changes

- [`0a9103e`](https://github.com/1001-digital/layers/commit/0a9103e382e268a44a25851649a7e90b80373d86) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix scroll container on body. Enable ENS resolution

## 2.3.0

### Minor Changes

- [#16](https://github.com/1001-digital/layers/pull/16) [`0a40ad6`](https://github.com/1001-digital/layers/commit/0a40ad6d3b80dee3bd32a9ce24db411bb9eb18dd) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Add small variant to Tag and TagsInput components

## 2.2.0

### Minor Changes

- [#14](https://github.com/1001-digital/layers/pull/14) [`0efc23b`](https://github.com/1001-digital/layers/commit/0efc23bf22cbe7c5cf6bacc7176b5fcb1d6c0d3d) Thanks [@yougogirldoteth](https://github.com/yougogirldoteth)! - Introduced TagsInput component

## 2.1.2

### Patch Changes

- [`2fbe7c2`](https://github.com/1001-digital/layers/commit/2fbe7c2715914bd5351fb4be00407c5917c779fb) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Allow customizing the ui font family

## 2.1.1

### Patch Changes

- [`1f8234d`](https://github.com/1001-digital/layers/commit/1f8234db60279c2dcd173c09441f553bf28ed84b) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Fix border radius for toasts

## 2.1.0

### Minor Changes

- [`5f97a41`](https://github.com/1001-digital/layers/commit/5f97a41d0dfe2e9eab5c03f7d62adb472038b91e) Thanks [@jwahdatehagh](https://github.com/jwahdatehagh)! - Add default input background that is separate from main background
