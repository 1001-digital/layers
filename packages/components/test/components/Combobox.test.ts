import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import Combobox from '../../src/base/components/Combobox.vue'

describe('Combobox', () => {
  it('exposes an accessible name and selects an option with the keyboard', async () => {
    const view = render(
      defineComponent({
        components: { Combobox },
        setup() {
          return {
            currency: ref<string>(),
            options: [
              { value: 'eth', label: 'Ether' },
              { value: 'eur', label: 'Euro' },
            ],
          }
        },
        template: `
          <Combobox
            v-model="currency"
            :options="options"
            aria-label="Currency"
          />
          <output>{{ currency }}</output>
        `,
      }),
    )
    const user = userEvent.setup()
    const input = view.getByRole('combobox', { name: 'Currency' })

    expect(
      (
        await axe(view.container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([])

    await user.click(input)
    await user.type(input, 'eur')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(view.getByRole('status').textContent).toBe('eur')
    expect(input.getAttribute('aria-expanded')).toBe('false')
  })

  it('does not select an option while text composition is active', async () => {
    const view = render(Combobox, {
      props: {
        ariaLabel: 'Language',
        options: [{ value: 'ja', label: '日本語' }],
      },
    })
    const user = userEvent.setup()
    const input = view.getByRole('combobox', { name: 'Language' })

    await user.click(input)
    const option = await view.findByRole('option', { name: '日本語' })
    await user.keyboard('{ArrowDown}')
    expect(option.hasAttribute('data-highlighted')).toBe(true)

    await fireEvent.compositionStart(input)
    await fireEvent.keyDown(input, { key: 'Enter', isComposing: true })

    expect(view.emitted('update:modelValue')).toBeUndefined()

    await fireEvent.compositionEnd(input)
    await user.keyboard('{Enter}')

    expect(view.emitted('update:modelValue')).toEqual([['ja']])
  })
})
