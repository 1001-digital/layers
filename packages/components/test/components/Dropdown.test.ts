import userEvent from '@testing-library/user-event'
import { createEvent, fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import Dropdown from '../../src/base/components/Dropdown.vue'
import DropdownItem from '../../src/base/components/DropdownItem.vue'

describe('Dropdown', () => {
  it('opens and selects an item with the keyboard', async () => {
    const view = render(
      defineComponent({
        components: { Dropdown, DropdownItem },
        setup() {
          return { open: ref(false), selected: ref(false) }
        },
        template: `
          <Dropdown v-model:open="open">
            <template #trigger><button>Actions</button></template>
            <DropdownItem @select="selected = true">Archive</DropdownItem>
          </Dropdown>
          <output>{{ selected }}</output>
        `,
      }),
    )
    const user = userEvent.setup()
    const trigger = view.getByRole('button', { name: 'Actions' })

    trigger.focus()
    await user.keyboard('{ArrowDown}')

    const item = await view.findByRole('menuitem', { name: 'Archive' })
    await waitFor(() => expect(document.activeElement).toBe(item))
    await user.keyboard('{Enter}')

    expect(view.getByRole('status').textContent).toBe('true')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('allows focus to leave a non-modal menu with Tab', async () => {
    const view = render(
      defineComponent({
        components: { Dropdown, DropdownItem },
        setup() {
          return { open: ref(false) }
        },
        template: `
          <Dropdown v-model:open="open" :modal="false">
            <template #trigger><button>Actions</button></template>
            <DropdownItem>Archive</DropdownItem>
          </Dropdown>
          <button>Continue</button>
        `,
      }),
    )
    const user = userEvent.setup()
    const trigger = view.getByRole('button', { name: 'Actions' })
    const continueButton = view.getByRole('button', { name: 'Continue' })

    trigger.focus()
    await user.keyboard('{ArrowDown}')
    const item = await view.findByRole('menuitem', { name: 'Archive' })

    // jsdom does not perform the browser's native focus move after the focused
    // portal item unmounts, so model that step only when Reka allows Tab.
    const tabEvent = createEvent.keyDown(item, { key: 'Tab' })
    await fireEvent(item, tabEvent)
    const tabWasNotCancelled = !tabEvent.defaultPrevented
    if (tabWasNotCancelled) continueButton.focus()

    await waitFor(() => {
      expect(tabWasNotCancelled).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(continueButton)
    })
  })
})
