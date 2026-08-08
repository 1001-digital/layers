<template>
  <div class="playground">
    <h1>SIWE &mdash; Inline Verification Failure</h1>
    <p><NuxtLink to="/siwe">&larr; Back to SIWE</NuxtLink></p>

    <EvmConnectionStatus v-slot="{ status, address }">
      <Card v-if="status === 'disconnected' || status === 'connecting'">
        <h2>Connect Wallet</h2>
        <p>You need to connect a wallet before signing in.</p>
        <EvmConnect />
      </Card>

      <Card v-else-if="status === 'connected'">
        <h2>Inline &mdash; Verification Failure</h2>
        <p>Simulates a backend rejecting the signature.</p>
        <p class="connected">Connected: <EvmAccount :address="address" /></p>

        <EvmSiwe
          :get-nonce="getNonce"
          :verify="mockVerifyFail"
          statement="This will fail verification."
          @error="onError"
        />
      </Card>

      <p v-else>Loading&hellip;</p>
    </EvmConnectionStatus>
  </div>
</template>

<script setup lang="ts">
const onError = (error: SiweError) => {
  console.error(
    'SIWE error:',
    error.code,
    error.rpcCode,
    error.message,
    error.cause,
  )
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
