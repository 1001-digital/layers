<template>
  <p>
    <slot name="instruction">Scan the code in your wallet application</slot>
  </p>
  <div class="qr-frame">
    <canvas ref="qrCanvas"></canvas>
  </div>
  <Button
    @click="copyUri"
    class="copy-uri tertiary small"
  >
    <Icon :type="isCopied ? 'check' : 'copy'" />
    <span>
      {{ isCopied ? 'Copied' : 'Copy Link' }}
    </span>
  </Button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'
import { useClipboard } from '@vueuse/core'
import { Button, Icon } from '@1001-digital/components'
import type { EvmConnectorQRProps } from '../types'

const props = defineProps<EvmConnectorQRProps>()

const qrCanvas = ref<HTMLCanvasElement | null>(null)
const { copy, copied: isCopied } = useClipboard()

const generateQR = async () => {
  if (!qrCanvas.value || !props.uri) return

  try {
    await QRCode.toCanvas(qrCanvas.value, props.uri, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

const copyUri = () => copy(props.uri)

watch(() => props.uri, generateQR, { immediate: true })

onMounted(() => {
  generateQR()
})
</script>

<style scoped>
p {
  text-align: center;
  @mixin ui-font;
  color: var(--muted);
  font-size: var(--font-sm);
}

.qr-frame {
  background: white;
  padding: var(--spacer-sm);
  max-width: 15rem;
  max-height: 15rem;
  border: var(--border);
  border-radius: var(--border-radius);
  margin: 0 auto;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}

.copy-uri {
  width: fit-content;
  margin: 0 auto;
}
</style>
