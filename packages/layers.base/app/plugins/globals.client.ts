import { createVNode, render } from 'vue'
import { Globals } from '@1001-digital/components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = createVNode(Globals)
    vnode.appContext = nuxtApp.vueApp._context
    render(vnode, container)
  })
})
