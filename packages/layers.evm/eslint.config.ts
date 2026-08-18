import withNuxt from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Prettier's Vue formatter always self-closes HTML void elements.
    'vue/html-self-closing': ['error', { html: { void: 'always' } }],
  },
})
