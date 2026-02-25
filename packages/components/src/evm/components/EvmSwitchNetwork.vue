<template>
  <template v-if="chains.length > 1">
    <Button
      @click="dialogOpen = true"
      :class="className"
    >
      <slot :current-chain="currentChain">
        {{ currentChain?.name || 'Unknown Network' }}
      </slot>
    </Button>

    <Dialog
      title="Switch Network"
      v-model:open="dialogOpen"
      @closed="onClosed"
      compat
    >
      <Alert
        v-if="errorMessage"
        type="error"
      >
        {{ errorMessage }}
      </Alert>

      <Loading
        v-if="switching"
        spinner
        stacked
        :txt="`Switching to ${switchingTo}...`"
      />

      <div
        v-if="!switching"
        class="chain-list"
      >
        <Button
          v-for="chain in chains"
          :key="chain.id"
          :disabled="chain.id === currentChainId || undefined"
          :class="['block', 'chain-item', { active: chain.id === currentChainId }]"
          @click="() => switchTo(chain)"
        >
          <span>{{ chain.name }}</span>
          <Icon
            v-if="chain.id === currentChainId"
            type="check"
          />
        </Button>
      </div>
    </Dialog>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Chain } from 'viem'
import { useConfig, useConnection, useSwitchChain } from '@wagmi/vue'
import Button from '../../base/components/Button.vue'
import Dialog from '../../base/components/Dialog.vue'
import Icon from '../../base/components/Icon.vue'
import Alert from '../../base/components/Alert.vue'
import Loading from '../../base/components/Loading.vue'

defineProps<{
  className?: string
}>()

const emit = defineEmits<{
  switched: [{ chainId: number; name: string }]
  error: [{ message: string }]
}>()

const config = useConfig()
const { chainId: currentChainId } = useConnection()
const { mutateAsync: switchChainAsync } = useSwitchChain()

const chains = computed<readonly Chain[]>(() => config.chains)
const currentChain = computed(() =>
  chains.value.find((c) => c.id === currentChainId.value),
)

const dialogOpen = ref(false)
const switching = ref(false)
const switchingTo = ref('')
const errorMessage = ref('')

const switchTo = async (chain: Chain) => {
  if (chain.id === currentChainId.value) return

  switching.value = true
  switchingTo.value = chain.name
  errorMessage.value = ''

  try {
    await switchChainAsync({ chainId: chain.id })
    emit('switched', { chainId: chain.id, name: chain.name })
    dialogOpen.value = false
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to switch network.'
    errorMessage.value =
      message.includes('rejected') || message.includes('denied')
        ? 'Network switch cancelled.'
        : 'Failed to switch network. Please try again.'
    emit('error', { message: errorMessage.value })
  } finally {
    switching.value = false
    switchingTo.value = ''
  }
}

const onClosed = () => {
  switching.value = false
  switchingTo.value = ''
  errorMessage.value = ''
}
</script>

<style scoped>
.chain-list {
  display: grid;
  gap: var(--spacer-sm);
}

.chain-item {
  justify-content: space-between;

  &.active {
    pointer-events: none;
    opacity: 1;
  }
}
</style>
