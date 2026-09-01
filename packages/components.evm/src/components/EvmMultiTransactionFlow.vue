<template>
  <div class="multi-transaction-flow">
    <slot name="before" />

    <slot
      name="progress"
      :step="flow.step.value"
      :step-index="flow.stepIndex.value"
      :steps="flow.steps.value"
      :step-states="flow.stepStates.value"
      :current-step="flow.currentStep.value"
      :cancel="cancel"
      :execute="() => flow.initializeRequest()"
      :is-busy="flow.isBusy.value"
      :tx-link="flow.txLink.value"
    >
      <ol
        v-if="flow.stepStates.value.length"
        class="multi-transaction-flow__progress"
      >
        <li
          v-for="(state, index) in flow.stepStates.value"
          :key="state.id"
          :class="[
            `is-${state.status}`,
            {
              'is-active':
                index === flow.stepIndex.value &&
                flow.step.value !== 'idle' &&
                flow.step.value !== 'complete',
            },
          ]"
        >
          <span class="multi-transaction-flow__marker">
            {{ index + 1 }}
          </span>
          <span class="multi-transaction-flow__step">
            <span class="multi-transaction-flow__title">
              {{ getStepTitle(index) }}
            </span>
            <span class="multi-transaction-flow__status">
              {{ getStatusLabel(state.status) }}
            </span>
          </span>
        </li>
      </ol>
    </slot>

    <Loading
      v-if="flow.step.value === 'requesting' || flow.step.value === 'waiting'"
      spinner
      stacked
      :txt="
        flow.step.value === 'requesting' && flow.connector.value?.name
          ? `Requesting signature from ${flow.connector.value.name}...`
          : flow.currentLead.value
      "
    />

    <p
      v-if="
        flow.step.value !== 'requesting' &&
        flow.step.value !== 'waiting' &&
        flow.step.value !== 'error' &&
        flow.currentLead.value
      "
    >
      {{ flow.currentLead.value }}
    </p>

    <Alert
      v-if="flow.error.value"
      type="error"
    >
      <p v-if="flow.currentLead.value">
        {{ flow.currentLead.value }}
      </p>
      <p>{{ flow.error.value }}</p>
    </Alert>

    <slot
      name="step"
      :step="flow.step.value"
      :step-index="flow.stepIndex.value"
      :steps="flow.steps.value"
      :step-states="flow.stepStates.value"
      :current-step="flow.currentStep.value"
      :cancel="cancel"
      :execute="() => flow.initializeRequest()"
      :is-busy="flow.isBusy.value"
      :tx-link="flow.txLink.value"
    >
      <slot
        :name="flow.step.value"
        :step-index="flow.stepIndex.value"
        :steps="flow.steps.value"
        :step-states="flow.stepStates.value"
        :current-step="flow.currentStep.value"
        :cancel="cancel"
        :execute="() => flow.initializeRequest()"
        :is-busy="flow.isBusy.value"
        :tx-link="flow.txLink.value"
      />
    </slot>

    <template v-if="!noFooter">
      <slot
        name="footer"
        :step="flow.step.value"
        :step-index="flow.stepIndex.value"
        :steps="flow.steps.value"
        :step-states="flow.stepStates.value"
        :current-step="flow.currentStep.value"
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
                : flow.currentAction.value || 'Execute'
            }}
          </Button>
        </template>
      </slot>

      <slot
        name="actions"
        :step="flow.step.value"
        :step-index="flow.stepIndex.value"
        :steps="flow.steps.value"
        :step-states="flow.stepStates.value"
        :current-step="flow.currentStep.value"
        :cancel="cancel"
        :execute="() => flow.initializeRequest()"
        :is-busy="flow.isBusy.value"
        :tx-link="flow.txLink.value"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue'
import { Loading, Alert, Button } from '@1001-digital/components'
import { useMultiTransactionFlow } from '../composables/multiTransactionFlow'
import type {
  MultiTransactionFlow,
  MultiTransactionFlowPhase,
} from '../composables/multiTransactionFlow'
import type {
  EvmMultiTransactionFlowEmits,
  EvmMultiTransactionFlowProps,
  MultiTransactionFlowStepStatus,
} from '../types'

type EvmMultiTransactionFlowComponentProps = EvmMultiTransactionFlowProps & {
  flow?: MultiTransactionFlow
  noFooter?: boolean
}

const props = withDefaults(
  defineProps<EvmMultiTransactionFlowComponentProps>(),
  {
    delayAfter: 2000,
    delayAutoclose: 2000,
    skipConfirmation: false,
    autoCloseSuccess: true,
    dismissable: true,
  },
)

const emit = defineEmits<EvmMultiTransactionFlowEmits>()

// When used standalone, create own composable.
// When used inside EvmMultiTransactionFlowDialog, receive shared instance.
const ownFlow = props.flow ? null : useMultiTransactionFlow(toRefs(props))
const flow = props.flow ?? ownFlow!

const statusLabels: Record<MultiTransactionFlowStepStatus, string> = {
  idle: 'Pending',
  confirm: 'Ready',
  chain: 'Switch network',
  requesting: 'Requesting',
  waiting: 'Waiting',
  complete: 'Complete',
  skipped: 'Skipped',
  error: 'Error',
}

const getStepTitle = (index: number) =>
  flow.steps.value[index]?.title || `Step ${index + 1}`

const getStatusLabel = (status: MultiTransactionFlowStepStatus) =>
  statusLabels[status]

watch(flow.step, (v: MultiTransactionFlowPhase) => {
  emit('update:step', v)

  if (v === 'complete') {
    emit('complete', flow.receipts.value)
  }
})

watch(flow.stepIndex, (v) => {
  emit('update:stepIndex', v)
})

watch(flow.error, (v) => {
  if (v && flow.currentStep.value) {
    emit('error', v, flow.currentStep.value, flow.stepIndex.value)
  }
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
  stepIndex: flow.stepIndex,
  steps: flow.steps,
  stepStates: flow.stepStates,
  currentStep: flow.currentStep,
  currentTitle: flow.currentTitle,
  currentLead: flow.currentLead,
  currentAction: flow.currentAction,
  text: flow.text,
  canDismiss: flow.canDismiss,
  txLink: flow.txLink,
  receipts: flow.receipts,
  hashes: flow.hashes,
  results: flow.results,
})
</script>

<style scoped>
.multi-transaction-flow {
  display: grid;
  gap: var(--multi-transaction-flow-gap, var(--spacer));
}

.multi-transaction-flow__progress {
  list-style: none;
  display: grid;
  gap: var(--multi-transaction-flow-progress-gap, var(--spacer-sm));
  padding: 0;
  margin: 0;

  li {
    display: grid;
    grid-template-columns:
      var(--multi-transaction-flow-marker-size, calc(var(--spacer) * 2))
      minmax(0, 1fr);
    gap: var(--spacer-sm);
    align-items: center;
    color: var(--multi-transaction-flow-muted-color, var(--muted));
  }

  li.is-active {
    color: var(--multi-transaction-flow-color, var(--color));
  }

  li.is-complete,
  li.is-skipped {
    color: var(--multi-transaction-flow-color, var(--color));
  }

  li.is-error {
    color: var(--multi-transaction-flow-error-color, var(--error));
  }
}

.multi-transaction-flow__marker {
  display: inline-grid;
  place-items: center;
  inline-size: var(
    --multi-transaction-flow-marker-size,
    calc(var(--spacer) * 2)
  );
  block-size: var(
    --multi-transaction-flow-marker-size,
    calc(var(--spacer) * 2)
  );
  border-radius: var(--multi-transaction-flow-marker-border-radius, 50%);
  box-shadow: var(--multi-transaction-flow-marker-shadow, var(--border-shadow));
  font-size: var(--ui-font-size);
  font-weight: var(--ui-font-weight);
}

.is-active .multi-transaction-flow__marker,
.is-complete .multi-transaction-flow__marker {
  box-shadow: var(
    --multi-transaction-flow-marker-active-shadow,
    0 0 0 var(--border-width) var(--color)
  );
}

.is-error .multi-transaction-flow__marker {
  box-shadow: var(
    --multi-transaction-flow-marker-error-shadow,
    0 0 0 var(--border-width) var(--error)
  );
}

.multi-transaction-flow__step {
  display: grid;
  gap: var(--multi-transaction-flow-step-gap, calc(var(--spacer-sm) / 2));
  min-inline-size: 0;
}

.multi-transaction-flow__title,
.multi-transaction-flow__status {
  overflow-wrap: anywhere;
}

.multi-transaction-flow__title {
  color: inherit;
}

.multi-transaction-flow__status {
  color: var(--multi-transaction-flow-muted-color, var(--muted));
  font-size: var(
    --multi-transaction-flow-status-font-size,
    var(--ui-font-size)
  );
}
</style>
