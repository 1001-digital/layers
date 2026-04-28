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

export const getNonce = async () => {
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

export const verify = async (message: string, signature: string) => {
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

export const mockVerifyFail = async () => {
  await new Promise((r) => setTimeout(r, 500))
  return false
}
