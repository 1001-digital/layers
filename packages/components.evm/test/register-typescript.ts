import { extname } from 'node:path'
import { registerHooks } from 'node:module'

const componentsShim = new URL('./support/components-shim.ts', import.meta.url)
const wagmiCoreShim = new URL('./support/wagmi-core-shim.ts', import.meta.url)

const isTransactionFlowSource = (parentURL?: string) =>
  parentURL?.endsWith('/composables/transactionFlow.ts') ||
  parentURL?.endsWith('/composables/multiTransactionFlow.ts')

// Published source uses bundler-style extensionless TypeScript imports. Teach
// Node's focused test runner the same resolution rule without adding a second
// test framework or build step.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier === '@1001-digital/components' &&
      isTransactionFlowSource(context.parentURL)
    ) {
      return { shortCircuit: true, url: componentsShim.href }
    }

    if (
      specifier === '@wagmi/core' &&
      isTransactionFlowSource(context.parentURL)
    ) {
      return { shortCircuit: true, url: wagmiCoreShim.href }
    }

    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (specifier.startsWith('.') && !extname(specifier)) {
        return nextResolve(`${specifier}.ts`, context)
      }

      throw error
    }
  },
})
