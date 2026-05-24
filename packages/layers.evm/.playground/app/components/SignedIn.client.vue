<template>
  <Card v-if="isConnected">
    <h2>Profile</h2>
    <p>
      Opens a profile dialog with ENS data, network switcher, and disconnect.
    </p>
    <Actions>
      <EvmProfile @disconnected="onDisconnected">
        <template #default="{ display, address }">
          <EvmAvatar :address="address" />
          <span>{{ display }}</span>
        </template>
      </EvmProfile>
    </Actions>
  </Card>

  <Card v-if="isConnected">
    <h2>Switch Network</h2>
    <p>Standalone network switcher dialog.</p>
    <Actions>
      <EvmSwitchNetwork
        @switched="onNetworkSwitched"
        @error="onNetworkError"
      >
        <template #default="{ currentChain }">
          <span> Switch Network ({{ currentChain?.name || 'Unknown' }}) </span>
        </template>
      </EvmSwitchNetwork>
    </Actions>
  </Card>

  <Card v-if="isConnected">
    <h2>Account Info</h2>
    <p>Address: {{ address }}</p>
    <p>Chain ID: {{ chainId }}</p>
  </Card>

  <Card v-if="isConnected">
    <h2>Transaction Flow Example</h2>
    <p>Send 0 ETH to your own address</p>

    <EvmTransactionFlowDialog
      :request="sendTransaction"
      chain="sepolia"
      :text="{
        title: { confirm: 'Send Transaction' },
        lead: {
          confirm:
            'This will send 0 ETH to your address as a test transaction.',
        },
        action: { confirm: 'Send Transaction' },
      }"
      @complete="onTransactionComplete"
      @cancel="onTransactionCancel"
    >
      <template #start="{ start }">
        <Actions>
          <Button @click="start">Start Transaction</Button>
        </Actions>
      </template>

      <template #confirm>
        <div class="tx-details">
          <p><strong>To:</strong> {{ address }}</p>
          <p><strong>Amount:</strong> 0 ETH</p>
          <p><strong>Chain:</strong> Sepolia</p>
        </div>
      </template>
    </EvmTransactionFlowDialog>
  </Card>

  <Card v-if="isConnected">
    <h2>Cross-Chain Transaction</h2>
    <p>Send 0 ETH on Optimism (different from default chain Sepolia).</p>

    <EvmTransactionFlowDialog
      :request="sendOptimismTransaction"
      chain="optimism"
      :text="{
        title: {
          confirm: 'Send on Optimism',
          chain: 'Switch to Optimism',
        },
        lead: {
          confirm: 'This will send 0 ETH to your address on Optimism.',
          chain: 'This transaction requires the Optimism network.',
        },
        action: { confirm: 'Send Transaction' },
      }"
      @complete="onTransactionComplete"
      @cancel="onTransactionCancel"
    >
      <template #start="{ start }">
        <Actions>
          <Button @click="start">Start Optimism Transaction</Button>
        </Actions>
      </template>

      <template #confirm>
        <div class="tx-details">
          <p><strong>To:</strong> {{ address }}</p>
          <p><strong>Amount:</strong> 0 ETH</p>
          <p><strong>Chain:</strong> Optimism</p>
        </div>
      </template>
    </EvmTransactionFlowDialog>
    <EvmTransactionFlowDialog
      :chain="10"
      :request="sendOptimismTransaction"
      :text="{
        title: { confirm: 'Confirm on Optimism' },
        lead: {
          confirm: 'This transaction targets Optimism (chain ID 10).',
        },
        action: { confirm: 'Send' },
      }"
    >
      <template #start="{ start }">
        <Actions>
          <Button @click="start">Open Numeric Chain</Button>
        </Actions>
      </template>
    </EvmTransactionFlowDialog>
  </Card>

  <Card v-if="isConnected">
    <h2>Multi-Transaction Flow Example</h2>
    <p>Send two 0 ETH transactions to your own address in sequence.</p>

    <EvmMultiTransactionFlowDialog
      :steps="multiTransactionSteps"
      chain="sepolia"
      :delay-after="0"
      :text="{
        title: {
          complete: 'Transactions Complete',
        },
        lead: {
          complete: 'Both test transactions have confirmed.',
        },
      }"
      @complete="onMultiTransactionComplete"
      @cancel="onTransactionCancel"
    >
      <template #start="{ start }">
        <Actions>
          <Button @click="start">Start Multi-Transaction Flow</Button>
        </Actions>
      </template>

      <template #confirm="{ currentStep, stepIndex, steps }">
        <div class="tx-details">
          <p><strong>Step:</strong> {{ stepIndex + 1 }} / {{ steps.length }}</p>
          <p><strong>Action:</strong> {{ currentStep?.title }}</p>
          <p><strong>To:</strong> {{ address }}</p>
          <p><strong>Amount:</strong> 0 ETH</p>
          <p><strong>Chain:</strong> Sepolia</p>
        </div>
      </template>
    </EvmMultiTransactionFlowDialog>
  </Card>
</template>

<script setup lang="ts">
import { useConnection } from '@wagmi/vue'
import { sendTransaction as sendTx } from '@wagmi/core'
import { parseEther } from 'viem'
import type { Config } from '@wagmi/vue'
import type { TransactionReceipt } from 'viem'
import type {
  MultiTransactionFlowStep,
  MultiTransactionFlowStepContext,
} from '@1001-digital/components.evm'

const { $wagmi } = useNuxtApp()
const { address, isConnected, chainId } = useConnection()

const onDisconnected = () => {
  console.log('Wallet disconnected')
}

const onNetworkSwitched = ({
  chainId,
  name,
}: {
  chainId: number
  name: string
}) => {
  console.log(`Switched to ${name} (${chainId})`)
}

const onNetworkError = ({ message }: { message: string }) => {
  console.log('Network switch error:', message)
}

const sendTransaction = async () => {
  const hash = await sendTx($wagmi as Config, {
    to: address.value!,
    value: parseEther('0'),
  })
  return hash
}

const sendOptimismTransaction = async () => {
  const hash = await sendTx($wagmi as Config, {
    to: address.value!,
    value: parseEther('0'),
    chainId: 10,
  })
  return hash
}

const sendFollowUpTransaction = async ({
  receipts,
}: MultiTransactionFlowStepContext) => {
  console.log('First transaction receipt:', receipts[0])

  const hash = await sendTx($wagmi as Config, {
    to: address.value!,
    value: parseEther('0'),
  })
  return hash
}

const multiTransactionSteps: MultiTransactionFlowStep[] = [
  {
    id: 'first',
    title: 'Send First Transaction',
    lead: 'Send the first 0 ETH transaction to your address.',
    action: 'Send First',
    request: sendTransaction,
  },
  {
    id: 'second',
    title: 'Send Follow-Up Transaction',
    lead: 'Send the second transaction after the first one confirms.',
    action: 'Send Second',
    request: sendFollowUpTransaction,
  },
]

const onTransactionComplete = (receipt: TransactionReceipt) => {
  console.log('Transaction complete:', receipt)
}

const onMultiTransactionComplete = (receipts: TransactionReceipt[]) => {
  console.log('Multi-transaction flow complete:', receipts)
}

const onTransactionCancel = () => {
  console.log('Transaction cancelled')
}
</script>

<style scoped>
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

.success {
  color: var(--success);
  font-weight: 600;
  text-align: center;
}
</style>
