import 'vitest-canvas-mock'

import { cleanup } from '@testing-library/vue'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

class ResizeObserverMock implements ResizeObserver {
  disconnect = vi.fn()
  observe = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: ResizeObserverMock,
})

Object.defineProperty(globalThis, 'PointerEvent', {
  configurable: true,
  value: MouseEvent,
})

Object.defineProperties(HTMLElement.prototype, {
  hasPointerCapture: {
    configurable: true,
    value: vi.fn(() => false),
  },
  releasePointerCapture: {
    configurable: true,
    value: vi.fn(),
  },
  scrollIntoView: {
    configurable: true,
    value: vi.fn(),
  },
})
