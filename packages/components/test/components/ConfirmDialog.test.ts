import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import BaseDialog from '../../src/base/components/Dialog.vue'
import ConfirmDialog from '../../src/base/components/ConfirmDialog.vue'
import { useConfirm } from '../../src/base/composables/confirm'

describe('ConfirmDialog', () => {
  it('focuses safe cancellation, ignores outside interaction, and never submits', async () => {
    const view = render(
      defineComponent({
        components: { ConfirmDialog },
        setup() {
          const result = ref('idle')
          const submissions = ref(0)
          const { confirm } = useConfirm()
          const ask = async () => {
            result.value = 'pending'
            result.value = String(
              await confirm({
                title: 'Delete artwork?',
                description: 'This cannot be undone.',
                okText: 'Delete',
              }),
            )
          }
          return { ask, result, submissions }
        },
        template: `
          <form @submit.prevent="submissions++">
            <button type="button" @click="ask">Ask to delete</button>
            <ConfirmDialog />
          </form>
          <output data-testid="result">{{ result }}</output>
          <output data-testid="submissions">{{ submissions }}</output>
        `,
      }),
    )
    const user = userEvent.setup()
    const opener = view.getByRole('button', { name: 'Ask to delete' })

    await user.click(opener)
    const dialog = await view.findByRole('alertdialog', {
      name: 'Delete artwork?',
    })
    const cancel = view.getByRole('button', { name: 'Cancel' })
    const action = view.getByRole('button', { name: 'Delete' })

    await waitFor(() => expect(document.activeElement).toBe(cancel))
    expect(cancel.getAttribute('type')).toBe('button')
    expect(action.getAttribute('type')).toBe('button')

    await fireEvent.pointerDown(document.body)
    expect(view.getByRole('alertdialog')).toBe(dialog)

    expect(
      (
        await axe(document.body, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([])

    await user.click(action)
    await waitFor(() =>
      expect(view.getByTestId('result').textContent).toBe('true'),
    )
    expect(view.getByTestId('submissions').textContent).toBe('0')

    await user.click(opener)
    await view.findByRole('alertdialog', { name: 'Delete artwork?' })
    await user.click(view.getByRole('button', { name: 'Cancel' }))

    await waitFor(() =>
      expect(view.getByTestId('result').textContent).toBe('false'),
    )
    expect(view.getByTestId('submissions').textContent).toBe('0')

    await user.click(opener)
    await view.findByRole('alertdialog', { name: 'Delete artwork?' })
    await user.keyboard('{Escape}')

    await waitFor(() =>
      expect(view.getByTestId('result').textContent).toBe('false'),
    )
    expect(view.getByTestId('submissions').textContent).toBe('0')
  })

  it('stacks a confirmation above an already-open dialog', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog, ConfirmDialog },
        setup() {
          const { confirm } = useConfirm()
          const ask = () => {
            void confirm({ title: 'Confirm nested action?' })
          }

          return { ask, open: ref(true) }
        },
        template: `
          <BaseDialog v-model:open="open" title="Outer dialog">
            <button @click="ask">Ask for confirmation</button>
          </BaseDialog>
          <ConfirmDialog />
        `,
      }),
    )
    const user = userEvent.setup()
    const outer = await view.findByRole('dialog', { name: 'Outer dialog' })
    const outerLayer = Number(
      outer.closest<HTMLElement>('.dialog-layer')?.dataset.layerOrder,
    )

    await user.click(view.getByRole('button', { name: 'Ask for confirmation' }))
    const confirmation = await view.findByRole('alertdialog', {
      name: 'Confirm nested action?',
    })
    const confirmationLayer = Number(
      confirmation.closest<HTMLElement>('.dialog-layer')?.dataset.layerOrder,
    )

    expect(confirmationLayer).toBeGreaterThan(outerLayer)
    await user.click(view.getByRole('button', { name: 'Cancel' }))
  })
})
