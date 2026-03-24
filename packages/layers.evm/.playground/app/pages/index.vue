<template>
  <div class="playground">
    <h1>EVM Layer Playground</h1>

    <Card>
      <h2>Wallet Connection</h2>
      <EvmConnectDialog>
        <template #connected="{ address }">
          <p>
            Connected:
            <EvmAccount :address="address" />
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
      <h2>Pages</h2>
      <NuxtLink to="/connect">Inline Connect</NuxtLink>
      <NuxtLink to="/transaction-flow">Transaction Flow States</NuxtLink>
      <NuxtLink to="/siwe">Sign-In with Ethereum (SIWE)</NuxtLink>
    </Card>
  </div>
</template>

<script setup lang="ts">
const address = ref('')
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
