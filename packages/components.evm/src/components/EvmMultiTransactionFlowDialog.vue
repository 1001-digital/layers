<template>
  <slot
    :start="flow.start"
    :step="flow.step.value"
    :step-index="flow.stepIndex.value"
    :open="open"
    name="start"
  />

  <Dialog
    v-model:open="open"
    :closable="flow.canDismiss.value"
    :click-outside="flow.canDismiss.value"
    :title="flow.currentTitle.value || ''"
    class="multi-transaction-flow-dialog"
    compat
    @closed="flow.reset"
  >
    <EvmMultiTransactionFlow
      :flow="flow"
      :steps="props.steps"
      no-footer
      @cancel="onCancel"
    >
      <template #before>
        <slot name="before" />
      </template>

      <template
        v-if="$slots.progress"
        #progress="slotProps"
      >
        <slot
          name="progress"
          v-bind="slotProps"
        />
      </template>

      <template
        v-if="$slots.step"
        #step="slotProps"
      >
        <slot
          name="step"
          v-bind="slotProps"
        />
      </template>

      <template
        v-for="name in MULTI_TRANSACTION_FLOW_STEPS"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </EvmMultiTransactionFlow>

    <template #footer>
      <template v-if="flow.step.value === 'chain'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
      </template>

      <template
        v-if="flow.step.value === 'confirm' || flow.step.value === 'error'"
      >
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
        <Button
          class="primary"
          @click="() => flow.initializeRequest()"
        >
          {{ flow.currentAction.value || 'Execute' }}
        </Button>
      </template>

      <slot
        name="actions"
        :step="flow.step.value"
        :step-index="flow.stepIndex.value"
        :steps="flow.steps.value"
        :step-states="flow.stepStates.value"
        :current-step="flow.currentStep.value"
        :cancel="cancel"
        :execute="() => flow.initializeRequest()"
        :tx-link="flow.txLink.value"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import { Dialog, Button } from '@1001-digital/components'
import EvmMultiTransactionFlow from './EvmMultiTransactionFlow.vue'
import {
  MULTI_TRANSACTION_FLOW_STEPS,
  useMultiTransactionFlow,
} from '../composables/multiTransactionFlow'
import type { MultiTransactionFlowPhase } from '../composables/multiTransactionFlow'
import type {
  EvmMultiTransactionFlowDialogEmits,
  EvmMultiTransactionFlowDialogProps,
} from '../types'

const props = withDefaults(defineProps<EvmMultiTransactionFlowDialogProps>(), {
  delayAfter: 2000,
  delayAutoclose: 2000,
  skipConfirmation: false,
  autoCloseSuccess: true,
  dismissable: true,
})

const emit = defineEmits<EvmMultiTransactionFlowDialogEmits>()

const flow = useMultiTransactionFlow(toRefs(props))

const open = computed({
  get: () => flow.step.value !== 'idle',
  set: (v) => {
    if (!v) cancel()
  },
})

watch(flow.step, (v: MultiTransactionFlowPhase) => {
  if (v === 'complete') {
    emit('complete', flow.receipts.value)
  }
})

watch(flow.error, (v) => {
  if (v && flow.currentStep.value) {
    emit('error', v, flow.currentStep.value, flow.stepIndex.value)
  }
})

const onCancel = () => {
  emit('cancel')
}

const cancel = () => {
  flow.cancel()
  emit('cancel')
}

defineExpose({
  initializeRequest: flow.initializeRequest,
  start: flow.start,
  cancel,
  reset: flow.reset,
  step: flow.step,
  stepIndex: flow.stepIndex,
  steps: flow.steps,
  stepStates: flow.stepStates,
  currentStep: flow.currentStep,
  currentTitle: flow.currentTitle,
  currentLead: flow.currentLead,
  currentAction: flow.currentAction,
  canDismiss: flow.canDismiss,
  txLink: flow.txLink,
  receipts: flow.receipts,
  hashes: flow.hashes,
  results: flow.results,
})
</script>

<style scoped>
.multi-transaction-flow-dialog {
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
