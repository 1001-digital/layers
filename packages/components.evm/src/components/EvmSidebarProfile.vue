<template>
  <div class="evm-sidebar-profile">
    <EvmConnectDialog
      v-if="!isConnected"
      className="block"
    />
    <EvmProfile
      v-else
      class-name="sidebar-profile-trigger"
      @disconnected="$emit('disconnected')"
    >
      <template #default="{ address, display, ensName }">
        <slot
          :address="address"
          :display="display"
          :ens-name="ensName"
        >
          <EvmAvatar :address="address" />
          <span class="sidebar-profile-name">{{ display }}</span>
        </slot>
      </template>
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
    </EvmProfile>
  </div>
</template>

<script setup lang="ts">
import { useConnection } from '@wagmi/vue'
import EvmAvatar from './EvmAvatar.vue'
import EvmProfile from './EvmProfile.vue'
import type { EvmSidebarProfileEmits } from '../types'

defineEmits<EvmSidebarProfileEmits>()

const { isConnected } = useConnection()
</script>

<style scoped>
.evm-sidebar-profile {
  margin-block-start: auto;
  border-block-start: var(--border);
  padding: var(--spacer-sm);
}

:deep(.sidebar-profile-trigger) {
  display: flex;
  align-items: center;
  gap: var(--spacer-sm);
  inline-size: 100%;
  padding: var(--spacer-sm);
  border-radius: var(--radius);
}

.sidebar-profile-name {
  font-size: var(--font-sm);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
