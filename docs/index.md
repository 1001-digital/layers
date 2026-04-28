---
layout: home

hero:
  name: '@1001-digital/layers'
  text: Build better dApps
  tagline: Install a layer, inherit the shared design system, and compose accessible UI without copying setup across apps.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View Packages
      link: /reference/packages

features:
  - title: Nuxt Layers
    details: Use `@1001-digital/layers.base` for shared UI foundations or `@1001-digital/layers.evm` for wallet-enabled dapps.
  - title: Vue Components
    details: Consume framework-agnostic Vue components directly or through the Nuxt layer auto-imports.
  - title: CSS Tokens
    details: Build on a shared CSS framework with cascade layers, OKLCH colors, spacing, typography, and layout variables.
---

## Package Overview

| Package                        | Use it when                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `@1001-digital/layers.base`    | You are building a Nuxt app that needs the base components, Nuxt Icon aliases, and global styles.       |
| `@1001-digital/layers.evm`     | You are building a Nuxt EVM app with wallet connection, SIWE, ENS, chain config, and transaction flows. |
| `@1001-digital/components`     | You want the shared Vue component library outside of a Nuxt layer.                                      |
| `@1001-digital/components.evm` | You want EVM Vue components, composables, and utilities outside of the Nuxt EVM layer.                  |
| `@1001-digital/styles`         | You want the CSS framework and design tokens directly.                                                  |

The recommended Nuxt entrypoint is a layer. Use the component and styles packages directly only when you are not extending a layer or when you need explicit imports in library code.

## Common Paths

- Start with [Getting Started](/getting-started) if you are installing a layer in a Nuxt app.
- Read [Architecture](/architecture) to understand how packages depend on each other.
- Use [Base Components](/components/base) and [EVM Components](/components/evm) as practical component references.
- Use [Configuration](/reference/configuration) and [Environment Variables](/reference/environment) when wiring an EVM app.
