---
'@1001-digital/components': patch
---

Keep component prop types usable from consuming apps. `Record<string, unknown>`
rejects interface-typed values, so `options` arrays and vue-router locations
failed to typecheck downstream; they now accept any object shape. Drop the `.ts`
import extension from `utils/media`, which raised TS5097 in every consumer that
typechecks the published source, and run the util tests through Vitest so the
extensionless import still resolves.
