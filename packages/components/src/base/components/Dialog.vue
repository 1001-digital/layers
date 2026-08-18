<template>
  <DialogRoot v-model:open="open">
    <DialogPortal :to="layerTarget">
      <div
        v-if="layerPresent"
        class="dialog-layer"
        :data-layer-order="layerOrder"
        :style="{ '--dialog-layer-order': layerOrder }"
      >
        <DialogOverlay
          class="dialog-overlay"
          :class="{ overlay: compat }"
        />
        <DialogContent
          as-child
          v-bind="
            description || $attrs['aria-describedby'] !== undefined
              ? $attrs
              : { ...$attrs, 'aria-describedby': undefined }
          "
          @escape-key-down="onEscapeKeyDown"
          @pointer-down-outside="onPointerDownOutside"
          @after-leave="onAfterLeave"
        >
          <DialogSurface
            :as="compat ? 'article' : 'div'"
            :class="classes"
          >
            <DialogTitle
              v-if="title"
              as="h1"
            >
              {{ title }}
            </DialogTitle>
            <DialogTitle
              v-else
              as="h1"
              class="dialog-visually-hidden"
            >
              {{ label || $attrs['aria-label'] || 'Dialog' }}
            </DialogTitle>

            <DialogClose
              v-if="closable"
              as-child
            >
              <button
                type="button"
                class="close"
                :aria-label="resolvedCloseLabel"
                :title="resolvedCloseLabel"
              >
                <Icon
                  name="close"
                  aria-hidden="true"
                />
              </button>
            </DialogClose>

            <section>
              <DialogDescription
                v-if="description"
                as="p"
                class="dialog-description"
              >
                {{ description }}
              </DialogDescription>
              <slot />
            </section>

            <footer v-if="$slots.footer">
              <slot name="footer" />
            </footer>
          </DialogSurface>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import DialogSurface from '../internal/DialogSurface.vue'
import { useDialogLayer } from '../internal/useDialogLayer'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const teleportTarget = inject<HTMLElement | null>('teleport-target', null)

const props = withDefaults(
  defineProps<{
    title?: string
    /** Accessible name used when there is no visible title. */
    label?: string
    /** Optional visible description associated with the dialog. */
    description?: string
    /** Accessible label for the close control. */
    closeLabel?: string
    class?: string | string[] | Record<string, boolean>
    clickOutside?: boolean
    closable?: boolean
    compat?: boolean
    large?: boolean
  }>(),
  {
    clickOutside: true,
    closable: true,
  },
)

const emit = defineEmits<{
  closed: []
}>()

const open = defineModel<boolean>('open', { required: true })
const layerPresent = ref(open.value)
const { layerOrder, layerTarget, releaseLayer } = useDialogLayer(
  open,
  teleportTarget,
)
const resolvedCloseLabel = computed(
  () => props.closeLabel || `Close ${props.title || props.label || 'dialog'}`,
)
const classes = computed(() => [
  props.class,
  {
    compat: !!props.compat,
    large: !!props.large,
    open: !!props.compat && open.value,
  },
])
const onEscapeKeyDown = (event: KeyboardEvent) => {
  if (!props.closable) event.preventDefault()
}

const onPointerDownOutside = (event: Event) => {
  if (!props.clickOutside) event.preventDefault()
}

const onAfterLeave = () => {
  if (open.value) return

  releaseLayer()
  layerPresent.value = false
  emit('closed')
}

watch(open, (value) => {
  if (value) layerPresent.value = true
})
</script>
