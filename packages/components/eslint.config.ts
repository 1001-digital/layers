import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      // Public primitives intentionally use concise names such as Button and Dialog.
      'vue/multi-word-component-names': 'off',
      // Prettier's Vue formatter always self-closes HTML void elements.
      'vue/html-self-closing': ['error', { html: { void: 'always' } }],
    },
  },
)
