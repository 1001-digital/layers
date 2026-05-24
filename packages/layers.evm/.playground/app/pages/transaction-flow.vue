<template>
  <div class="playground">
    <h1>EvmTransactionFlowDialog</h1>
    <p><NuxtLink to="/">&larr; Back</NuxtLink></p>

    <Card>
      <h2>Confirm</h2>
      <p>Opens the dialog at the confirmation step.</p>

      <EvmTransactionFlowDialog
        :request="hangingRequest"
        :text="{
          title: { confirm: 'Confirm Transfer' },
          lead: {
            confirm: 'You are about to send 1 ETH to vitalik.eth.',
          },
          action: { confirm: 'Send' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Confirm</Button>
          </Actions>
        </template>

        <template #confirm>
          <div class="tx-details">
            <p><strong>To:</strong> vitalik.eth</p>
            <p><strong>Amount:</strong> 1 ETH</p>
            <p><strong>Network:</strong> Sepolia</p>
          </div>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Requesting</h2>
      <p>
        Skips confirmation, shows the loading spinner while awaiting wallet
        signature.
      </p>

      <EvmTransactionFlowDialog
        skip-confirmation
        :dismissable="false"
        :request="hangingRequest"
        :text="{
          title: { requesting: 'Awaiting Signature' },
          lead: { requesting: 'Please confirm in your wallet...' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Requesting</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Error: User Rejected</h2>
      <p>Simulates a user rejecting the transaction in their wallet.</p>

      <EvmTransactionFlowDialog
        skip-confirmation
        :request="rejectedRequest"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Rejected</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Error: Transaction Failed</h2>
      <p>Simulates a generic transaction error.</p>

      <EvmTransactionFlowDialog
        skip-confirmation
        :request="failedRequest"
        :text="{
          title: { error: 'Transfer Failed' },
          action: { error: 'Retry' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Failed</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Waiting &amp; Complete (Toast)</h2>
      <p>
        After signing, the dialog closes and a toast tracks the receipt. This
        mock resolves instantly and shows the success toast.
      </p>

      <EvmTransactionFlowDialog
        skip-confirmation
        :request="successRequest"
        :delay-after="0"
        :delay-autoclose="5000"
        :text="{
          title: {
            waiting: 'Transfer Pending',
            complete: 'Transfer Complete',
          },
          lead: {
            waiting: 'Waiting for on-chain confirmation...',
            complete: 'Your transfer has been confirmed.',
          },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Waiting/Complete</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Waiting &amp; Complete (Dialog)</h2>
      <p>
        Dialog stays open through waiting and complete steps instead of
        switching to a toast.
      </p>

      <EvmTransactionFlowDialog
        skip-confirmation
        keep-open
        :request="successRequest"
        :delay-after="0"
        :delay-autoclose="3000"
        :text="{
          title: {
            waiting: 'Transfer Pending',
            complete: 'Transfer Complete',
          },
          lead: {
            waiting: 'Waiting for on-chain confirmation...',
            complete: 'Your transfer has been confirmed.',
          },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Waiting/Complete (Dialog)</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Chain Switch</h2>
      <p>
        Shown when the connected wallet is on a different chain. Connect to a
        non-Sepolia network to see this state.
      </p>

      <EvmTransactionFlowDialog
        :request="hangingRequest"
        :text="{
          title: { chain: 'Wrong Network' },
          lead: { chain: 'Please switch to Sepolia to continue.' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Chain Switch</Button>
          </Actions>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Custom Actions Slot</h2>
      <p>Uses the <code>actions</code> slot to add custom footer buttons.</p>

      <EvmTransactionFlowDialog
        :request="hangingRequest"
        :text="{
          title: { confirm: 'Custom Actions' },
          lead: { confirm: 'This dialog has custom footer actions.' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Custom Actions</Button>
          </Actions>
        </template>

        <template #actions="{ cancel, step }">
          <template v-if="step === 'confirm'">
            <Button
              class="secondary"
              @click="cancel"
              >Nevermind</Button
            >
            <Button class="secondary">Save Draft</Button>
            <Button>Approve &amp; Send</Button>
          </template>
        </template>
      </EvmTransactionFlowDialog>
    </Card>

    <h1>EvmMultiTransactionFlowDialog</h1>

    <Card>
      <h2>ENS-Style Registration</h2>
      <p>
        Three sequential transactions with later requests receiving prior hashes
        and receipts through the step context.
      </p>

      <EvmMultiTransactionFlowDialog
        :steps="ensRegistrationSteps"
        :delay-after="0"
        :text="{
          title: { complete: 'Registration Complete' },
          lead: {
            complete: 'All registration transactions have completed.',
          },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open ENS Registration Flow</Button>
          </Actions>
        </template>

        <template #confirm="{ currentStep, stepIndex, steps }">
          <div class="tx-details">
            <p>
              <strong>Step:</strong> {{ stepIndex + 1 }} / {{ steps.length }}
            </p>
            <p><strong>Action:</strong> {{ currentStep?.title }}</p>
            <p><strong>Name:</strong> example.eth</p>
          </div>
        </template>
      </EvmMultiTransactionFlowDialog>
    </Card>

    <Card>
      <h2>Dynamic Skip</h2>
      <p>
        Simulates a wrapping flow where an approval transaction is skipped when
        the app already knows approval exists.
      </p>

      <label class="option">
        <input
          v-model="hasPunkApproval"
          type="checkbox"
        />
        Existing CryptoPunks approval found
      </label>

      <EvmMultiTransactionFlowDialog
        :steps="punkWrappingSteps"
        :delay-after="0"
        :text="{
          title: { complete: 'Punk Wrapped' },
          lead: { complete: 'The wrapping flow has completed.' },
        }"
      >
        <template #start="{ start }">
          <Actions>
            <Button @click="start">Open Wrapping Flow</Button>
          </Actions>
        </template>

        <template #confirm="{ currentStep, stepStates }">
          <div class="tx-details">
            <p><strong>Current action:</strong> {{ currentStep?.title }}</p>
            <p>
              <strong>Approval status:</strong>
              {{ stepStates[0]?.status }}
            </p>
            <p><strong>Punk:</strong> #1001</p>
          </div>
        </template>
      </EvmMultiTransactionFlowDialog>
    </Card>

    <h1>EvmMultiTransactionFlow (standalone)</h1>

    <Card>
      <h2>Inline Custom Progress</h2>
      <p>
        Renders a multi-transaction flow inline with a custom progress slot.
      </p>

      <Actions>
        <Button @click="inlineMultiRef?.start()"
          >Start Inline Multi Flow</Button
        >
      </Actions>

      <EvmMultiTransactionFlow
        ref="inlineMultiRef"
        :steps="inlineMultiSteps"
        :delay-after="0"
        :text="{
          title: { complete: 'Flow Complete' },
          lead: { complete: 'All inline transactions have completed.' },
        }"
      >
        <template #progress="{ stepStates, stepIndex }">
          <ol class="custom-progress">
            <li
              v-for="(state, index) in stepStates"
              :key="state.id"
              :class="{ active: index === stepIndex }"
            >
              {{ index + 1 }}. {{ state.id }} -
              {{ state.status }}
            </li>
          </ol>
        </template>

        <template #confirm="{ currentStep, stepIndex }">
          <div class="tx-details">
            <p><strong>Step:</strong> {{ stepIndex + 1 }}</p>
            <p><strong>Action:</strong> {{ currentStep?.title }}</p>
          </div>
        </template>
      </EvmMultiTransactionFlow>
    </Card>

    <h1>EvmTransactionFlow (standalone)</h1>

    <Card>
      <h2>Inline Confirm</h2>
      <p>
        Renders the transaction flow inline without a dialog. Trigger
        <code>start()</code> via the exposed ref.
      </p>

      <Actions>
        <Button @click="inlineRef?.start()">Start Inline Flow</Button>
      </Actions>

      <EvmTransactionFlow
        ref="inlineRef"
        :request="hangingRequest"
        :text="{
          title: { confirm: 'Confirm Transfer' },
          lead: {
            confirm: 'You are about to send 1 ETH to vitalik.eth.',
          },
          action: { confirm: 'Send' },
        }"
      >
        <template #confirm>
          <div class="tx-details">
            <p><strong>To:</strong> vitalik.eth</p>
            <p><strong>Amount:</strong> 1 ETH</p>
            <p><strong>Network:</strong> Sepolia</p>
          </div>
        </template>
      </EvmTransactionFlow>
    </Card>

    <Card>
      <h2>Inline Error</h2>
      <p>Renders an error state inline.</p>

      <Actions>
        <Button @click="inlineErrorRef?.start()">Start Inline Error</Button>
      </Actions>

      <EvmTransactionFlow
        ref="inlineErrorRef"
        skip-confirmation
        :request="failedRequest"
        :text="{
          title: { error: 'Transfer Failed' },
          action: { error: 'Retry' },
        }"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Hash } from 'viem'
import type { MultiTransactionFlowStep } from '@1001-digital/components.evm'
import { EvmMultiTransactionFlow, EvmTransactionFlow } from '#components'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const hangingRequest = () => new Promise<Hash>(() => {})

const rejectedRequest = async (): Promise<Hash> => {
  await delay(500)
  // Mimics Rainbow wallet's actual error shape (InternalRpcError wrapped in TransactionExecutionError)
  const cause = new Error('An internal error was received.')
  ;(cause as any).code = -32603
  ;(cause as any).details = 'User rejected the request.'
  const err = new Error('An internal error was received.')
  ;(err as any).cause = cause
  ;(err as any).shortMessage = 'An internal error was received.'
  throw err
}

const failedRequest = async (): Promise<Hash> => {
  await delay(500)
  const err = new Error('Insufficient funds for gas.')
  ;(err as any).shortMessage = 'Insufficient funds for gas.'
  throw err
}

const successRequest = async (): Promise<Hash> => {
  await delay(500)
  return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as Hash
}

const hasPunkApproval = ref(true)

const ensRegistrationSteps: MultiTransactionFlowStep[] = [
  {
    id: 'commit',
    title: 'Commit Name',
    lead: 'Submit the name commitment transaction.',
    action: 'Commit',
    request: hangingRequest,
  },
  {
    id: 'wait',
    title: 'Settle Commitment',
    lead: 'Submit the settlement transaction after the commitment wait.',
    action: 'Settle',
    request: async ({ receipts }) => {
      console.log('Commit receipt:', receipts[0])
      return hangingRequest()
    },
  },
  {
    id: 'register',
    title: 'Register Name',
    lead: 'Register the ENS name after the commitment is ready.',
    action: 'Register',
    request: async ({ hashes }) => {
      console.log('Previous hashes:', hashes)
      return hangingRequest()
    },
  },
]

const punkWrappingSteps: MultiTransactionFlowStep[] = [
  {
    id: 'approve',
    title: 'Approve Wrapper',
    lead: 'Approve the wrapper contract to transfer this Punk.',
    action: 'Approve',
    skip: () => hasPunkApproval.value,
    request: hangingRequest,
  },
  {
    id: 'wrap',
    title: 'Wrap Punk',
    lead: 'Wrap CryptoPunk #1001.',
    action: 'Wrap',
    request: async ({ receipts }) => {
      console.log('Approval receipt:', receipts[0])
      return hangingRequest()
    },
  },
]

const inlineMultiSteps: MultiTransactionFlowStep[] = [
  {
    id: 'prepare',
    title: 'Prepare Position',
    lead: 'Prepare the position with the first transaction.',
    action: 'Prepare',
    request: hangingRequest,
  },
  {
    id: 'execute',
    title: 'Execute Position',
    lead: 'Execute after preparation is confirmed.',
    action: 'Execute',
    request: hangingRequest,
  },
]

const inlineRef = ref<InstanceType<typeof EvmTransactionFlow> | null>(null)
const inlineErrorRef = ref<InstanceType<typeof EvmTransactionFlow> | null>(null)
const inlineMultiRef = ref<InstanceType<typeof EvmMultiTransactionFlow> | null>(
  null,
)
</script>

<style scoped>
.playground {
  max-width: 50rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}

.tx-details {
  padding: var(--size-4);
  background: var(--gray-z-1);
  border-radius: var(--radius);
  display: grid;
  gap: var(--size-3);
}

.tx-details p {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--font-sm);
}

.option {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
}

.custom-progress {
  list-style: none;
  display: grid;
  gap: var(--spacer-sm);
  padding: 0;
  margin: 0;

  li {
    padding: var(--spacer-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--border-shadow);
    color: var(--muted);
    overflow-wrap: anywhere;
  }

  li.active {
    color: var(--color);
    box-shadow: var(--border-shadow-highlight);
  }
}
</style>
