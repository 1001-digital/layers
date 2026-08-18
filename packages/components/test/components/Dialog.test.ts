import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import BaseDialog from '../../src/base/components/Dialog.vue'

describe('Dialog', () => {
  it('is named, described, keyboard-contained, and has a safe close control', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { open: ref(false), surfaceClicks: ref(0) }
        },
        template: `
          <button @click="open = true">Open preferences</button>
          <BaseDialog
            v-model:open="open"
            id="preferences-dialog"
            data-purpose="settings"
            title="Preferences"
            description="Change your display preferences."
            @click="surfaceClicks++"
          >
            <button>First setting</button>
            <button>Last setting</button>
          </BaseDialog>
          <output data-testid="surface-clicks">{{ surfaceClicks }}</output>
        `,
      }),
    )
    const user = userEvent.setup()
    const opener = view.getByRole('button', { name: 'Open preferences' })

    await user.click(opener)
    const dialog = await view.findByRole('dialog', { name: 'Preferences' })
    const close = view.getByRole('button', { name: 'Close Preferences' })

    expect(dialog.id).toBe('preferences-dialog')
    expect(dialog.getAttribute('data-purpose')).toBe('settings')
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
    expect(close.getAttribute('type')).toBe('button')
    await user.click(view.getByRole('button', { name: 'First setting' }))
    expect(view.getByTestId('surface-clicks').textContent).toBe('1')
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    )

    for (let index = 0; index < 5; index++) {
      await user.tab()
      expect(dialog.contains(document.activeElement)).toBe(true)
    }

    expect(
      (
        await axe(document.body, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([])
  })

  it('honors Escape and outside dismissal policies and restores the opener', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { open: ref(false), locked: ref(true) }
        },
        template: `
          <button @click="open = true">Open account</button>
          <BaseDialog
            v-model:open="open"
            title="Account"
            :closable="!locked"
            :click-outside="!locked"
          >
            <button @click="locked = false">Allow closing</button>
          </BaseDialog>
          <output data-testid="open-state">{{ open }}</output>
        `,
      }),
    )
    const user = userEvent.setup()
    const opener = view.getByRole('button', { name: 'Open account' })

    await user.click(opener)
    const dialog = await view.findByRole('dialog', { name: 'Account' })

    await fireEvent.pointerDown(document.body)
    await user.keyboard('{Escape}')
    expect(view.getByTestId('open-state').textContent).toBe('true')

    await user.click(view.getByRole('button', { name: 'Allow closing' }))
    await user.keyboard('{Escape}')
    expect(view.getByTestId('open-state').textContent).toBe('false')

    if (dialog.isConnected) {
      await fireEvent.animationEnd(dialog, {
        animationName: 'dialog-content-exit',
      })
    }
    await waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('dismisses on outside pointer interaction when allowed', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { open: ref(false) }
        },
        template: `
          <button @click="open = true">Open dismissible dialog</button>
          <BaseDialog v-model:open="open" title="Dismissible dialog">
            Content
          </BaseDialog>
          <output data-testid="open-state">{{ open }}</output>
        `,
      }),
    )
    const user = userEvent.setup()

    await user.click(
      view.getByRole('button', { name: 'Open dismissible dialog' }),
    )
    await view.findByRole('dialog', { name: 'Dismissible dialog' })
    await fireEvent.pointerDown(document.body)

    await waitFor(() =>
      expect(view.getByTestId('open-state').textContent).toBe('false'),
    )
  })

  it('updates forwarded attributes and uses aria-label as its fallback name', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          const dialogId = ref('original-dialog')
          const dialogLabel = ref('Original label')
          const descriptionId = ref<string>()
          const purpose = ref('original')
          const width = ref('20rem')
          const update = () => {
            dialogId.value = 'updated-dialog'
            dialogLabel.value = 'Updated label'
            descriptionId.value = 'updated-description'
            purpose.value = 'updated'
            width.value = '36rem'
          }

          return {
            descriptionId,
            dialogId,
            dialogLabel,
            open: ref(true),
            purpose,
            update,
            width,
          }
        },
        template: `
          <p id="updated-description">The updated description.</p>
          <BaseDialog
            v-model:open="open"
            :id="dialogId"
            :aria-label="dialogLabel"
            :aria-describedby="descriptionId"
            :data-purpose="purpose"
            :style="{ '--dialog-width': width }"
          >
            <button @click="update">Update attributes</button>
          </BaseDialog>
        `,
      }),
    )
    const user = userEvent.setup()
    const dialog = await view.findByRole('dialog', { name: 'Original label' })

    expect(dialog.id).toBe('original-dialog')
    expect(dialog.getAttribute('aria-describedby')).toBeNull()
    expect(dialog.getAttribute('data-purpose')).toBe('original')
    expect(dialog.style.getPropertyValue('--dialog-width')).toBe('20rem')

    await user.click(view.getByRole('button', { name: 'Update attributes' }))
    await waitFor(() =>
      expect(view.getByRole('dialog', { name: 'Updated label' })).toBe(dialog),
    )
    expect(dialog.id).toBe('updated-dialog')
    expect(dialog.getAttribute('aria-label')).toBe('Updated label')
    expect(dialog.getAttribute('aria-describedby')).toBe('updated-description')
    expect(dialog.getAttribute('data-purpose')).toBe('updated')
    expect(dialog.style.getPropertyValue('--dialog-width')).toBe('36rem')
  })

  it('stacks dialogs by open order instead of permanent mount order', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { firstOpen: ref(false), secondOpen: ref(false) }
        },
        template: `
          <button @click="secondOpen = true">Open second dialog</button>
          <BaseDialog v-model:open="firstOpen" title="First dialog">
            First
          </BaseDialog>
          <BaseDialog v-model:open="secondOpen" title="Second dialog">
            <button @click="firstOpen = true">Open first dialog</button>
          </BaseDialog>
        `,
      }),
    )
    const user = userEvent.setup()

    await user.click(view.getByRole('button', { name: 'Open second dialog' }))
    const second = await view.findByRole('dialog', { name: 'Second dialog' })
    const secondLayer = Number(
      second.closest<HTMLElement>('.dialog-layer')?.dataset.layerOrder,
    )

    await user.click(view.getByRole('button', { name: 'Open first dialog' }))
    let first = await view.findByRole('dialog', { name: 'First dialog' })
    let firstLayerElement = first.closest<HTMLElement>('.dialog-layer')
    const firstLayer = Number(firstLayerElement?.dataset.layerOrder)

    expect(firstLayer).toBeGreaterThan(secondLayer)
    const layerRoot =
      firstLayerElement?.closest<HTMLElement>('.dialog-layer-root')
    expect(layerRoot).toBeTruthy()
    expect(layerRoot!.style.zIndex).toBe('var(--z-index-dialog)')
    expect(
      firstLayerElement!.style.getPropertyValue('--dialog-layer-order'),
    ).toBe('1')

    for (let cycle = 0; cycle < 2; cycle++) {
      await user.keyboard('{Escape}')
      await fireEvent.animationEnd(first, {
        animationName: 'dialog-content-exit',
      })
      await waitFor(() =>
        expect(
          second.closest<HTMLElement>('.dialog-layer')?.dataset.layerOrder,
        ).toBe('0'),
      )

      await user.click(view.getByRole('button', { name: 'Open first dialog' }))
      first = await view.findByRole('dialog', { name: 'First dialog' })
      firstLayerElement = first.closest<HTMLElement>('.dialog-layer')
      expect(firstLayerElement?.dataset.layerOrder).toBe('1')
    }
  })

  it('preserves the compat article shape with full dialog semantics', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { open: ref(false) }
        },
        template: `
          <button @click="open = true">Open legacy flow</button>
          <BaseDialog
            v-model:open="open"
            label="Legacy transaction flow"
            aria-describedby="legacy-description"
            class="transaction-flow"
            compat
          >
            <p id="legacy-description">Review the legacy transaction.</p>
            <button>Continue</button>
          </BaseDialog>
        `,
      }),
    )
    const user = userEvent.setup()

    await user.click(view.getByRole('button', { name: 'Open legacy flow' }))
    const dialog = await view.findByRole('dialog', {
      name: 'Legacy transaction flow',
    })

    expect(dialog.tagName).toBe('ARTICLE')
    expect(dialog.classList.contains('compat')).toBe(true)
    expect(dialog.classList.contains('open')).toBe(true)
    expect(dialog.classList.contains('transaction-flow')).toBe(true)
    expect(dialog.getAttribute('aria-describedby')).toBe('legacy-description')
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    )
  })

  it('emits closed only after the content leave animation', async () => {
    const view = render(
      defineComponent({
        components: { BaseDialog },
        setup() {
          return { open: ref(true), closed: ref(0) }
        },
        template: `
          <button @click="open = false">Close from owner</button>
          <BaseDialog
            v-model:open="open"
            title="Timed dialog"
            class="timed-dialog"
            @closed="closed++"
          >
            Content
          </BaseDialog>
          <output data-testid="closed-count">{{ closed }}</output>
        `,
      }),
    )
    const dialog = await view.findByRole('dialog', { name: 'Timed dialog' })

    await fireEvent.animationStart(dialog, {
      animationName: 'dialog-content-enter',
    })
    await fireEvent.click(
      view.getByRole('button', { name: 'Close from owner', hidden: true }),
    )

    expect(view.getByTestId('closed-count').textContent).toBe('0')
    expect(dialog.getAttribute('data-state')).toBe('closed')

    await fireEvent.animationEnd(dialog, {
      animationName: 'dialog-content-exit',
    })
    await waitFor(() =>
      expect(view.getByTestId('closed-count').textContent).toBe('1'),
    )
  })
})
