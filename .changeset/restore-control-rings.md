---
'@1001-digital/styles': patch
'@1001-digital/components': patch
'@1001-digital/components.evm': patch
---

Restore layout-neutral box-shadow rings for interactive controls.

Buttons, form controls, input-like component triggers, tags, sliders, switches,
pin inputs, and transaction-flow markers retain their complete outline as a
shadow ring. This lets controls in `FormInputGroup` show their full hover or
focus edge above adjacent controls without changing layout.

Structural containers and dividers continue to use physical borders.
