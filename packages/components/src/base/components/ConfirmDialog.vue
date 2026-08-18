<template>
  <AlertDialogRoot
    :open="open"
    @update:open="onOpenChange"
  >
    <AlertDialogPortal :to="layerTarget">
      <div
        v-if="displayedState"
        class="dialog-layer"
        :data-layer-order="layerOrder"
        :style="{ '--dialog-layer-order': layerOrder }"
      >
        <AlertDialogOverlay class="dialog-overlay" />
        <AlertDialogContent
          as-child
          @after-leave="onAfterLeave"
        >
          <DialogSurface class="confirm-dialog">
            <AlertDialogTitle as="h1">
              {{ displayedState?.title }}
            </AlertDialogTitle>

            <section>
              <AlertDialogDescription
                as="p"
                :class="{
                  'dialog-visually-hidden': !displayedState?.description,
                }"
              >
                {{
                  displayedState?.description ||
                  'Confirm or cancel this action.'
                }}
              </AlertDialogDescription>
            </section>

            <footer>
              <AlertDialogCancel as-child>
                <Button
                  type="button"
                  class="tertiary"
                  @click.capture="pendingResult = false"
                >
                  {{ displayedState?.cancelText || 'Cancel' }}
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction as-child>
                <Button
                  type="button"
                  @click.capture="pendingResult = true"
                >
                  {{ displayedState?.okText || 'OK' }}
                </Button>
              </AlertDialogAction>
            </footer>
          </DialogSurface>
        </AlertDialogContent>
      </div>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import { computed, inject, shallowRef, watch } from 'vue'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'reka-ui'
import DialogSurface from '../internal/DialogSurface.vue'
import { useDialogLayer } from '../internal/useDialogLayer'
import Button from './Button.vue'
import { useConfirm, type ConfirmState } from '../composables/confirm'

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)
const { state, resolve } = useConfirm()
const displayedState = shallowRef<ConfirmState | null>(null)
const open = computed(() => !!state.value)
const { layerOrder, layerTarget, releaseLayer } = useDialogLayer(
  open,
  teleportTarget,
)
let pendingResult: boolean | undefined

watch(
  state,
  (value) => {
    if (value) {
      displayedState.value = value
      pendingResult = undefined
    }
  },
  { immediate: true },
)

const onOpenChange = (value: boolean) => {
  if (value || !state.value) return

  const result = pendingResult ?? false
  pendingResult = undefined
  resolve(result)
}

const onAfterLeave = () => {
  if (open.value) return

  releaseLayer()
  displayedState.value = null
}
</script>
