<template>
  <Dialog
    v-model:open="open"
    :title="state?.title"
    :closable="false"
    :click-outside="false"
  >
    <p v-if="state?.description">{{ state.description }}</p>

    <template #footer>
      <Button
        class="tertiary"
        @click="resolve(false)"
      >
        {{ state?.cancelText || 'Cancel' }}
      </Button>
      <Button @click="resolve(true)">
        {{ state?.okText || 'OK' }}
      </Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from './Dialog.vue'
import Button from './Button.vue'
import { useConfirm } from '../composables/confirm'

const { state, resolve } = useConfirm()

const open = computed({
  get: () => !!state.value,
  set: () => resolve(false),
})
</script>
