<template>
  <slot
    :start="flow.start"
    :step="flow.step.value"
    :open="open"
    :is-busy="flow.isBusy.value"
    name="start"
  ></slot>

  <Dialog
    v-model:open="open"
    :closable="flow.canDismiss.value"
    :click-outside="flow.canDismiss.value"
    :title="flow.text.value.title[flow.step.value] || ''"
    class="transaction-flow"
    compat
    @closed="onClosed"
  >
    <EvmTransactionFlow
      :flow="flow"
      no-footer
      @cancel="onCancel"
    >
      <template #before>
        <slot name="before" />
      </template>

      <template
        v-for="name in TRANSACTION_FLOW_STEPS"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
    </EvmTransactionFlow>

    <template #footer>
      <template v-if="flow.step.value === 'chain'">
        <Button
          @click="cancel"
          class="secondary"
          >Cancel</Button
        >
        <Button
          class="primary"
          :disabled="flow.isBusy.value"
          @click="() => flow.initializeRequest()"
        >
          {{ flow.isBusy.value ? 'Switching Network...' : 'Switch Network' }}
        </Button>
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
          :disabled="flow.isBusy.value"
          @click="() => flow.initializeRequest()"
        >
          {{
            flow.isBusy.value
              ? 'Preparing...'
              : flow.text.value.action[flow.step.value] || 'Execute'
          }}
        </Button>
      </template>

      <slot
        name="actions"
        :step="flow.step.value"
        :cancel="cancel"
        :execute="() => flow.initializeRequest()"
        :is-busy="flow.isBusy.value"
        :tx-link="flow.txLink.value"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import { Dialog, Button } from '@1001-digital/components'
import EvmTransactionFlow from './EvmTransactionFlow.vue'
import {
  useTransactionFlow,
  TRANSACTION_FLOW_STEPS,
} from '../composables/transactionFlow'
import type {
  EvmTransactionFlowDialogProps,
  EvmTransactionFlowDialogEmits,
} from '../types'

const props = withDefaults(defineProps<EvmTransactionFlowDialogProps>(), {
  delayAfter: 2000,
  delayAutoclose: 2000,
  skipConfirmation: false,
  autoCloseSuccess: true,
  dismissable: true,
  keepOpen: false,
})

const emit = defineEmits<EvmTransactionFlowDialogEmits>()

const flow = useTransactionFlow(toRefs(props))

const open = computed({
  get: () => flow.step.value !== 'idle',
  set: (v) => {
    if (!v) cancel()
  },
})

watch(flow.receipt, (v) => {
  if (v) emit('complete', v)
})

const onCancel = () => {
  emit('cancel')
}

const cancel = () => {
  flow.cancel()
  emit('cancel')
}

const onClosed = () => {
  if (!flow.isBusy.value) flow.reset()
}

defineExpose({
  initializeRequest: flow.initializeRequest,
  isBusy: flow.isBusy,
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
