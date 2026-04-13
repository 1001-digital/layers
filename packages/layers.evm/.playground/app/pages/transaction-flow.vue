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
import { EvmTransactionFlow } from '#components'

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

const inlineRef = ref<InstanceType<typeof EvmTransactionFlow> | null>(null)
const inlineErrorRef = ref<InstanceType<typeof EvmTransactionFlow> | null>(null)
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
</style>
