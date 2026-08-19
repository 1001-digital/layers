import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import FormCheckbox from '../../src/base/components/FormCheckbox.vue'

describe('FormCheckbox', () => {
  it('participates in native forms and has an accessible name', async () => {
    const view = render(
      defineComponent({
        components: { FormCheckbox },
        setup() {
          return { accepted: ref(false) }
        },
        template: `
          <form>
            <FormCheckbox v-model="accepted" name="terms" value="accepted">
              Accept terms
            </FormCheckbox>
          </form>
        `,
      }),
    )
    const user = userEvent.setup()
    const checkbox = view.getByRole('checkbox', { name: 'Accept terms' })

    expect(checkbox.getAttribute('aria-checked')).toBe('false')
    expect(
      new FormData(view.container.querySelector('form')!).get('terms'),
    ).toBe(null)

    await user.click(checkbox)

    expect(checkbox.getAttribute('aria-checked')).toBe('true')
    expect(
      new FormData(view.container.querySelector('form')!).get('terms'),
    ).toBe('accepted')
    expect(
      (
        await axe(view.container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([])
  })
})
