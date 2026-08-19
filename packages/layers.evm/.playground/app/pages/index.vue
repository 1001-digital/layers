<template>
  <div class="playground">
    <h1>EVM Layer Playground</h1>

    <Card>
      <h2>Wallet Connection</h2>
      <EvmConnectDialog>
        <template #connected="{ address: connectedAddress }">
          <p>
            Connected:
            <EvmAccount :address="connectedAddress" />
          </p>
        </template>
      </EvmConnectDialog>
    </Card>

    <SignedIn />

    <Card>
      <h2>Address Input</h2>
      <FormLabel label="Recipient">
        <EvmAddressInput v-model="address" />
      </FormLabel>
    </Card>

    <Card>
      <h2>Amount Input</h2>
      <FormLabel label="Amount">
        <EvmAmountInput
          v-model="amount"
          v-model:units="units"
          :decimals="6"
          symbol="USDC"
          :balance="1234560000n"
        />
      </FormLabel>
      <p v-if="units != null">Base units: {{ units }}</p>
      <FormLabel label="ETH">
        <EvmEthInput v-model="eth" />
      </FormLabel>
    </Card>

    <Card>
      <h2>Pages</h2>
      <NuxtLink to="/connect">Inline Connect</NuxtLink>
      <NuxtLink to="/transaction-flow">Transaction Flow States</NuxtLink>
      <NuxtLink to="/siwe">Sign-In with Ethereum (SIWE)</NuxtLink>
      <NuxtLink to="/artifact">Artifact (NFT preview)</NuxtLink>
    </Card>
  </div>
</template>

<script setup lang="ts">
const address = ref('')
const amount = ref('')
const units = ref<bigint | null>(null)
const eth = ref('')
</script>

<style scoped>
.playground {
  max-width: 50rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}
</style>
