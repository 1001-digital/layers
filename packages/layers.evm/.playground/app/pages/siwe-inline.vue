<template>
  <div class="playground">
    <h1>SIWE &mdash; Inline</h1>
    <p><NuxtLink to="/siwe">&larr; Back to SIWE</NuxtLink></p>

    <EvmConnectionStatus v-slot="{ status, address }">
      <Card v-if="status === 'disconnected' || status === 'connecting'">
        <h2>Connect Wallet</h2>
        <p>You need to connect a wallet before signing in.</p>
        <EvmConnect />
      </Card>

      <Card v-else-if="status === 'connected'">
        <h2>Inline</h2>
        <p>Embeds the sign-in steps directly in the page (no dialog).</p>
        <p class="connected">Connected: <EvmAccount :address="address" /></p>

        <EvmSiwe
          :get-nonce="getNonce"
          :verify="verify"
          statement="Sign in to the EVM Layer Playground."
          @authenticated="onAuthenticated"
          @error="onError"
        />
      </Card>

      <p v-else>Loading&hellip;</p>
    </EvmConnectionStatus>
  </div>
</template>

<script setup lang="ts">
const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  console.log('SIWE authenticated:', data)
}

const onError = (error: string) => {
  console.error('SIWE error:', error)
}
</script>

<style scoped>
.playground {
  max-width: 50rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}

.connected {
  font-family: var(--font-mono);
  font-size: var(--font-sm);
}
</style>
