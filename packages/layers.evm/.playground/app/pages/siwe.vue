<template>
  <div class="playground">
    <h1>Sign-In with Ethereum (SIWE)</h1>
    <p><NuxtLink to="/">&larr; Back</NuxtLink></p>

    <EvmConnectionStatus v-slot="{ status, address }">
      <Card v-if="status === 'disconnected' || status === 'connecting'">
        <h2>Connect Wallet</h2>
        <p>You need to connect a wallet before signing in.</p>
        <EvmConnect />
      </Card>

      <template v-else-if="status === 'connected'">
        <Card>
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

        <Card>
          <h2>Inline</h2>
          <p>Embeds the sign-in steps directly in the page (no dialog).</p>

          <EvmSiwe
            :get-nonce="getNonce"
            :verify="verify"
            statement="Sign in to the EVM Layer Playground."
            @authenticated="onAuthenticated"
            @error="onError"
          />
        </Card>

        <Card>
          <h2>Inline &mdash; Verification Failure</h2>
          <p>Simulates a backend rejecting the signature.</p>

          <EvmSiwe
            :get-nonce="getNonce"
            :verify="mockVerifyFail"
            statement="This will fail verification."
            @error="onError"
          />
        </Card>
      </template>

      <p v-else>Loading&hellip;</p>
    </EvmConnectionStatus>
  </div>
</template>

<script setup lang="ts">
import {
  SiweMessage,
  createViemConfig,
  generateNonce,
} from '@signinwithethereum/siwe'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// In production the nonce would be issued and stored server-side;
// here we keep it in module state so verify() can check it.
let issuedNonce: string | null = null

const getNonce = async () => {
  issuedNonce = generateNonce()
  return issuedNonce
}

let verifierConfigPromise: ReturnType<typeof createViemConfig> | null = null
const getVerifierConfig = () => {
  if (!verifierConfigPromise) {
    verifierConfigPromise = createViemConfig({
      publicClient: createPublicClient({
        chain: mainnet,
        transport: http(),
      }),
    })
  }
  return verifierConfigPromise
}

const verify = async (message: string, signature: string) => {
  const config = await getVerifierConfig()
  const siwe = new SiweMessage(message)
  const { success, error } = await siwe.verify(
    {
      signature,
      domain: window.location.host,
      nonce: issuedNonce ?? '',
    },
    { config, suppressExceptions: true },
  )
  if (!success) {
    console.error('SIWE verification failed:', error)
    return false
  }
  return true
}

const mockVerifyFail = async (_message: string, _signature: string) => {
  await new Promise((r) => setTimeout(r, 500))
  return false
}

const shortAddress = (addr?: `0x${string}`) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : ''

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

.authenticated {
  font-family: var(--font-mono);
  font-size: var(--font-sm);
  color: var(--success);
}
</style>
