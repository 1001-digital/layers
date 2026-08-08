<template>
  <div class="playground">
    <h1>Sign-In with Ethereum (SIWE)</h1>
    <p><NuxtLink to="/">&larr; Back</NuxtLink></p>

    <Card>
      <h2>Combined Dialog: Connect &amp; Sign In</h2>
      <p>One dialog, two wallet popups back-to-back &mdash; no extra clicks.</p>
      <Actions>
        <EvmConnectAuthDialog
          :get-nonce="getNonce"
          :verify="verify"
          statement="Sign in to the EVM Layer Playground."
          @authenticated="onAuthenticated"
          @signed-out="onSignedOut"
          @error="onError"
        >
          Connect &amp; Sign In
          <template #authenticated="{ address: authAddr, signOut }">
            <span class="authenticated">
              Authenticated: {{ shortAddress(authAddr) }}
            </span>
            <Button
              class="secondary"
              @click="signOut"
              >Sign Out</Button
            >
          </template>
        </EvmConnectAuthDialog>
      </Actions>
    </Card>

    <EvmConnectionStatus v-slot="{ status, address }">
      <Card v-if="status === 'disconnected' || status === 'connecting'">
        <h2>Connect Wallet</h2>
        <p>You need to connect a wallet before signing in.</p>
        <EvmConnect />
      </Card>

      <Card v-else-if="status === 'connected'">
        <h2>Dialog</h2>
        <p>
          Opens a dialog with the full SIWE sign-in flow. Verifies with
          <code>@signinwithethereum/siwe</code>.
        </p>
        <p class="connected">Connected: <EvmAccount :address="address" /></p>

        <Actions>
          <EvmSiweDialog
            :get-nonce="getNonce"
            :verify="verify"
            statement="Sign in to the EVM Layer Playground."
            @authenticated="onAuthenticated"
            @signed-out="onSignedOut"
            @error="onError"
          >
            Sign In
            <template #authenticated="{ address: authAddr, signOut }">
              <span class="authenticated">
                Authenticated: {{ shortAddress(authAddr) }}
              </span>
              <Button
                class="secondary"
                @click="signOut"
                >Sign Out</Button
              >
            </template>
          </EvmSiweDialog>
        </Actions>
      </Card>

      <p v-else>Loading&hellip;</p>
    </EvmConnectionStatus>

    <Card>
      <h2>Inline Flows</h2>
      <p>
        Each inline flow auto-triggers on mount, so they live on separate pages
        to avoid fighting over the wallet popup.
      </p>
      <NuxtLink to="/siwe-connect-auth">Inline Connect &amp; Sign In</NuxtLink>
      <NuxtLink to="/siwe-inline">Inline Sign In</NuxtLink>
      <NuxtLink to="/siwe-inline-failure"
        >Inline Sign In &mdash; Verification Failure</NuxtLink
      >
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { SiweError } from '@1001-digital/components.evm'
const shortAddress = (addr?: `0x${string}`) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''

const onAuthenticated = (data: { address: `0x${string}`; chainId: number }) => {
  console.log('SIWE authenticated:', data)
}

const onSignedOut = () => {
  console.log('SIWE signed out')
}

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

.authenticated {
  font-family: var(--font-mono);
  font-size: var(--font-sm);
  color: var(--success);
}
</style>
