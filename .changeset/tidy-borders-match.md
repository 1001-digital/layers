---
'@1001-digital/styles': minor
'@1001-digital/components': minor
'@1001-digital/components.evm': minor
---

Draw every hairline with `border` instead of a box-shadow ring

Inputs, buttons, comboboxes, tags, switches, sliders, pin inputs and panel
headers outlined themselves with `box-shadow: 0 0 0 1px`, while cards, popovers
and dialogs used a real `border`. Browsers snap border widths down to whole
device pixels but leave box-shadow spread unsnapped, so on fractional-DPR
screens the shadow rings painted about twice as heavy as the borders next to
them. Everything now uses `border` / `border-color`, so all outlines share one
weight.

Shadow rings overlapped each other where two outlined boxes met; borders do not,
so the places that relied on that now leave exactly one border per shared edge:
the tag dismiss button keeps only its divider, `FormItem` prefix/suffix and the
leading controls of a `FormInputGroup` drop the border their neighbour draws,
and dialog, popover and toast headers draw only the separator below them.
Hovering a tag's dismiss button now highlights the tag's border, which is the
line that button no longer draws.

The `--border-shadow` / `--border-shadow-highlight` tokens remain for
layout-neutral rings. The multi transaction flow marker tokens change from
shadows to colors: `--multi-transaction-flow-marker-shadow`,
`--multi-transaction-flow-marker-active-shadow` and
`--multi-transaction-flow-marker-error-shadow` are replaced by
`--multi-transaction-flow-marker-border-color`,
`--multi-transaction-flow-marker-active-border-color` and
`--multi-transaction-flow-marker-error-border-color`.
