<template>
  <slot name="before" />

  <Loading
    v-if="flow.step.value === 'requesting' || flow.step.value === 'waiting'"
    spinner
    stacked
    :txt="
      flow.step.value === 'requesting' && flow.connector.value?.name
        ? `Requesting signature from ${flow.connector.value.name}...`
        : flow.text.value.lead[flow.step.value] || ''
    "
  />

  <p
    v-if="
      flow.step.value !== 'requesting' &&
      flow.step.value !== 'waiting' &&
      flow.step.value !== 'error' &&
      flow.text.value.lead[flow.step.value]
    "
  >
    {{ flow.text.value.lead[flow.step.value] }}
  </p>

  <Alert
    v-if="flow.error.value"
    type="error"
  >
    <p v-if="flow.text.value.lead[flow.step.value]">
      {{ flow.text.value.lead[flow.step.value] }}
    </p>
    <p>{{ flow.error.value }}</p>
  </Alert>

  <slot
    :name="flow.step.value"
    :cancel="cancel"
    :is-busy="flow.isBusy.value"
  ></slot>

  <template v-if="!noFooter">
    <slot
      name="footer"
      :step="flow.step.value"
      :cancel="cancel"
      :execute="() => flow.initializeRequest()"
      :is-busy="flow.isBusy.value"
      :tx-link="flow.txLink.value"
    >
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
    </slot>

    <slot
      name="actions"
      :step="flow.step.value"
      :cancel="cancel"
      :execute="() => flow.initializeRequest()"
      :is-busy="flow.isBusy.value"
      :tx-link="flow.txLink.value"
    />
  </template>
</template>

<script setup lang="ts">
import { watch, toRefs } from 'vue'
import { Loading, Alert, Button } from '@1001-digital/components'
import { useTransactionFlow } from '../composables/transactionFlow'
import type { TransactionFlow } from '../composables/transactionFlow'
import type { EvmTransactionFlowProps, EvmTransactionFlowEmits } from '../types'

const props = withDefaults(
  defineProps<
    EvmTransactionFlowProps & {
      flow?: TransactionFlow
      noFooter?: boolean
    }
  >(),
  {
    delayAfter: 2000,
    delayAutoclose: 2000,
    skipConfirmation: false,
    autoCloseSuccess: true,
    dismissable: true,
    keepOpen: false,
  },
)

const emit = defineEmits<EvmTransactionFlowEmits>()

// When used standalone, create own composable.
// When used inside EvmTransactionFlowDialog, receive shared instance via prop.
const ownFlow = props.flow ? null : useTransactionFlow(toRefs(props))
const flow = props.flow ?? ownFlow!

watch(flow.step, (v) => {
  emit('update:step', v)
})

watch(flow.receipt, (v) => {
  if (v) emit('complete', v)
})

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
  isBusy: flow.isBusy,
  text: flow.text,
  canDismiss: flow.canDismiss,
  txLink: flow.txLink,
})
</script>
