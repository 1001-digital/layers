import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  compile,
  createSSRApp,
  defineComponent,
  h,
  type RenderFunction,
} from 'vue'
import { renderToString } from 'vue/server-renderer'

function compileArtifactTemplate() {
  const source = readFileSync(
    new URL('../src/components/EvmArtifact.vue', import.meta.url),
    'utf8',
  )
  const templateStart = source.indexOf('<template>') + '<template>'.length
  const templateBlock = source.slice(
    templateStart,
    source.indexOf('<script setup'),
  )
  const template = templateBlock.slice(
    0,
    templateBlock.lastIndexOf('</template>'),
  )
  return compile(template) as RenderFunction
}

describe('EvmArtifact', () => {
  it('passes an artifact named _ to the static slot', async () => {
    const renderArtifact = compileArtifactTemplate()
    const context = {
      $slots: {
        _: 1,
        static: ({ artifactName }: { artifactName: string }) => [
          h('span', { 'data-artifact-name': artifactName }, artifactName),
        ],
      },
      rootStyle: {},
      isAnimationRenderer: false,
      renderer: 'static',
      resolvedImage: 'https://example.com/cover.jpg',
      resolvedName: '_',
      onImageError() {},
      showAnimation: false,
      hasAnimation: false,
      lastError: null,
    }
    const stub = defineComponent({ render: () => null })
    const app = createSSRApp(
      defineComponent({ render: () => renderArtifact(context, []) }),
    )
    app.component('Embed', stub)
    app.component('EvmArtifactModel', stub)

    const html = await renderToString(app)

    assert.match(html, /<span data-artifact-name="_">_<\/span>/)
  })
})
