<template>
  <div class="playground">
    <h1>EVM Layer Playground</h1>

    <Card>
      <h2>Wallet Connection</h2>
      <EvmConnect>
        <template #connected="{ address }">
          <p>
            Connected:
            <EvmAccount :address="address" />
          </p>
        </template>
      </EvmConnect>
    </Card>

    <SignedIn />

    <Card>
      <h2>Pages</h2>
      <NuxtLink to="/transaction-flow">Transaction Flow States</NuxtLink>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.playground {
  max-width: 50rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}
</style>
