import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref,
} from 'vue'

interface DialogLayer {
  id: symbol
  order: Ref<number>
}

interface DialogLayerRegistry {
  host: HTMLElement
  layers: DialogLayer[]
  users: number
}

const registries = new WeakMap<HTMLElement, DialogLayerRegistry>()

const createRegistry = (target: HTMLElement): DialogLayerRegistry => {
  const host = document.createElement('div')
  host.className = 'dialog-layer-root'
  host.style.zIndex = 'var(--z-index-dialog)'
  target.append(host)

  return { host, layers: [], users: 0 }
}

const rankLayers = (layers: DialogLayer[]) => {
  layers.forEach((layer, order) => {
    layer.order.value = order
  })
}

/**
 * Orders active dialogs inside one shared stacking context. The host stays at
 * the public dialog z-index, so nested dialogs never overtake global toasts.
 * Host creation is deferred until mount to keep server output deterministic.
 */
export const useDialogLayer = (
  open: Readonly<Ref<boolean>>,
  teleportTarget: HTMLElement | null,
) => {
  const id = Symbol('dialog-layer')
  const layerOrder = ref(0)
  const layerTarget = shallowRef<HTMLElement | string>(teleportTarget || 'body')
  let registry: DialogLayerRegistry | undefined
  let active = false

  const activateLayer = () => {
    if (!registry) return

    if (active) {
      const index = registry.layers.findIndex((layer) => layer.id === id)
      if (index !== -1 && index !== registry.layers.length - 1) {
        const layer = registry.layers[index]
        if (!layer) return

        registry.layers.splice(index, 1)
        registry.layers.push(layer)
        rankLayers(registry.layers)
      }
      return
    }

    registry.layers.push({ id, order: layerOrder })
    active = true
    rankLayers(registry.layers)
  }

  const releaseLayer = () => {
    if (!registry || !active) return

    const index = registry.layers.findIndex((layer) => layer.id === id)
    if (index !== -1) registry.layers.splice(index, 1)
    active = false
    layerOrder.value = 0
    rankLayers(registry.layers)
  }

  watch(open, (value) => {
    if (value) activateLayer()
  })

  onMounted(() => {
    const target = teleportTarget || document.body
    registry = registries.get(target) || createRegistry(target)
    registries.set(target, registry)
    registry.users += 1
    layerTarget.value = registry.host

    if (open.value) activateLayer()
  })

  onBeforeUnmount(() => {
    if (!registry) return

    releaseLayer()
    registry.users -= 1
    if (registry.users === 0) {
      registry.host.remove()
      registries.delete(teleportTarget || document.body)
    }
  })

  return { layerOrder, layerTarget, releaseLayer }
}
