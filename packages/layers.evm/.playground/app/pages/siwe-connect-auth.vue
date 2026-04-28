<template>
  <div class="playground">
    <h1>SIWE &mdash; Inline Connect &amp; Sign In</h1>
    <p><NuxtLink to="/siwe">&larr; Back to SIWE</NuxtLink></p>

    <Card>
      <h2>Combined Inline: Connect &amp; Sign In</h2>
      <p>Same flow as the dialog, embedded directly in the page.</p>
      <EvmConnectAuth
        :get-nonce="getNonce"
        :verify="verify"
        statement="Sign in to the EVM Layer Playground."
        @authenticated="onAuthenticated"
        @signed-out="onSignedOut"
        @error="onError"
      >
        <template #authenticated="{ address: authAddr, signOut }">
          <p class="connected">
            Authenticated: <EvmAccount :address="authAddr" />
          </p>
          <Actions>
            <Button
              class="secondary"
              @click="signOut"
              >Sign Out</Button
            >
          </Actions>
        </template>
      </EvmConnectAuth>
    </Card>
  </div>
</template>

<script setup lang="ts">
const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  console.log('SIWE authenticated:', data)
}

const onSignedOut = () => {
  console.log('SIWE signed out')
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
