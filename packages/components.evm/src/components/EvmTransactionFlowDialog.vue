<template>
  <slot
    :start="start"
    :step="currentStep"
    :open="open"
    name="start"
  ></slot>

  <Dialog
    v-model:open="open"
    :closable="canDismiss"
    :click-outside="canDismiss"
    :title="title[currentStep] || ''"
    class="transaction-flow"
    compat
    @closed="onClosed"
  >
    <EvmTransactionFlow
      ref="txRef"
      :chain="chain"
      :text="text"
      :request="request"
      :delay-after="delayAfter"
      :delay-autoclose="delayAutoclose"
      :skip-confirmation="skipConfirmation"
      :auto-close-success="autoCloseSuccess"
      :dismissable="dismissable"
      @complete="onComplete"
      @cancel="onCancel"
      @update:step="onStepChange"
    >
      <template #before>
        <slot name="before" />
      </template>

      <template
        v-for="name in stepSlots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>

      <template #footer>
        <!-- Suppress inner footer; handled in Dialog #footer below -->
      </template>

      <template #actions>
        <!-- Suppress inner actions; handled in Dialog #footer below -->
      </template>
    </EvmTransactionFlow>

    <template #footer>
      <template v-if="currentStep === 'chain'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
      </template>

      <template v-if="currentStep === 'confirm' || currentStep === 'error'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
        <Button @click="() => txRef?.initializeRequest()">
          {{ action[currentStep] || 'Execute' }}
        </Button>
      </template>

      <slot
        name="actions"
        :step="currentStep"
        :cancel="cancel"
        :execute="() => txRef?.initializeRequest()"
        :tx-link="txRef?.txLink?.value"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Dialog, Button } from '@1001-digital/components'
import EvmTransactionFlow from './EvmTransactionFlow.vue'
import type {
  TransactionFlowText,
  EvmTransactionFlowDialogProps,
  EvmTransactionFlowDialogEmits,
} from '../types'
import type { TransactionReceipt } from 'viem'

const defaultTitles: Record<string, string> = {
  confirm: 'Confirm Transaction',
  chain: 'Switch Network',
  requesting: 'Requesting',
  waiting: 'Processing',
  complete: 'Complete',
  error: 'Error',
}

const defaultActions: Record<string, string> = {
  confirm: 'Execute',
  error: 'Try Again',
}

const stepSlots = [
  'confirm',
  'chain',
  'requesting',
  'waiting',
  'complete',
  'error',
] as const

const props = withDefaults(defineProps<EvmTransactionFlowDialogProps>(), {
  delayAfter: 2000,
  delayAutoclose: 2000,
  skipConfirmation: false,
  autoCloseSuccess: true,
  dismissable: true,
})

const emit = defineEmits<EvmTransactionFlowDialogEmits>()

const txRef = ref<InstanceType<typeof EvmTransactionFlow> | null>(null)
const currentStep = ref<string>('idle')
const pendingStart = ref(false)

const title = computed(() => ({
  ...defaultTitles,
  ...props.text?.title,
}))

const action = computed(() => ({
  ...defaultActions,
  ...props.text?.action,
}))

const open = computed({
  get: () => currentStep.value !== 'idle',
  set: (v) => {
    if (!v) {
      cancel()
    }
  },
})

const canDismiss = computed(
  () => props.dismissable && currentStep.value !== 'requesting',
)

// When the dialog opens and EvmTransactionFlow mounts, trigger start
watch(txRef, (ref) => {
  if (ref && pendingStart.value) {
    pendingStart.value = false
    nextTick(() => ref.start())
  }
})

const onStepChange = (step: string) => {
  currentStep.value = step
}

const onComplete = (receipt: TransactionReceipt) => {
  emit('complete', receipt)
}

const onCancel = () => {
  emit('cancel')
}

const start = () => {
  if (txRef.value) {
    txRef.value.start()
  } else {
    // Open dialog first, then start once EvmTransactionFlow mounts
    currentStep.value = 'confirm'
    pendingStart.value = true
  }
}

const cancel = () => {
  if (txRef.value) {
    txRef.value.cancel()
  } else {
    currentStep.value = 'idle'
  }
  pendingStart.value = false
}

const onClosed = () => {
  txRef.value?.reset()
  currentStep.value = 'idle'
  pendingStart.value = false
}

defineExpose({
  initializeRequest: (
    ...args: Parameters<
      NonNullable<InstanceType<typeof EvmTransactionFlow>['initializeRequest']>
    >
  ) => txRef.value?.initializeRequest(...args),
})
</script>

<style scoped>
.transaction-flow {
  &:deep(> section) {
    display: grid;
    gap: var(--spacer);

    .text {
      width: 100%;
      height: min-content;
    }

    p {
      white-space: pre-wrap;
      width: 100%;

      a {
        text-decoration: underline;
      }
    }
  }
}
</style>
