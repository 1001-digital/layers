import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@1001-digital/layers',
  description: 'Nuxt layers, Vue components, EVM integrations, and CSS tokens.',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Layers', link: '/layers/base' },
      { text: 'Components', link: '/components/base' },
      { text: 'Reference', link: '/reference/packages' },
    ],
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Playgrounds', link: '/playgrounds' },
        ],
      },
      {
        text: 'Layers',
        items: [
          { text: 'Base Layer', link: '/layers/base' },
          { text: 'EVM Layer', link: '/layers/evm' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Base Components', link: '/components/base' },
          { text: 'EVM Components', link: '/components/evm' },
          {
            text: 'Composables and Utilities',
            link: '/components/composables',
          },
        ],
      },
      {
        text: 'Styles',
        items: [{ text: 'Design Tokens', link: '/styles' }],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Packages', link: '/reference/packages' },
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'Environment Variables', link: '/reference/environment' },
          { text: 'Releases', link: '/reference/releases' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/1001-digital/layers' },
    ],
    editLink: {
      pattern: 'https://github.com/1001-digital/layers/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 1001 Digital',
    },
  },
})
