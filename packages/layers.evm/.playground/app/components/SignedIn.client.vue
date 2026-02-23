<template>
  <Card v-if="isConnected">
    <h2>Disconnect?</h2>
    <Button @click="disconnect">Disconnect</Button>
  </Card>

  <Card v-if="isConnected">
    <h2>Account Info</h2>
    <p>Address: {{ address }}</p>
    <p>Chain ID: {{ chainId }}</p>
  </Card>

  <Card v-if="isConnected">
    <h2>Transaction Flow Example</h2>
    <p>Send 0 ETH to your own address</p>

    <EvmTransactionFlow
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
    </EvmTransactionFlow>
  </Card>
</template>

<script setup lang="ts">
import { useConnection, useDisconnect } from '@wagmi/vue'
import { sendTransaction as sendTx } from '@wagmi/core'
import { parseEther } from 'viem'
import type { Config } from '@wagmi/vue'
import type { TransactionReceipt } from 'viem'

const { $wagmi } = useNuxtApp()
const { address, isConnected, chainId } = useConnection()
const { mutate: disconnect } = useDisconnect()

const sendTransaction = async () => {
  const hash = await sendTx($wagmi as Config, {
    to: address.value!,
    value: parseEther('0'),
  })
  return hash
}

const onTransactionComplete = (receipt: TransactionReceipt) => {
  console.log('Transaction complete:', receipt)
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
