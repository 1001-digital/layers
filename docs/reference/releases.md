# Releases

The repository uses Changesets for versioning and npm publishing.

## Create a Changeset

Run this when a code change should publish a new package version:

```bash
pnpm changeset
```

Choose the affected package or packages, select the semver bump, and write a concise release summary.

Docs-only changes normally do not need a changeset because `/docs` is private and not published.

## Version Packages

When changesets are merged to `master`, the release workflow opens or updates a version PR. That PR:

- bumps package versions
- updates package changelogs
- removes consumed changeset files

## Publish

Merging the version PR triggers npm publishing for changed packages.

## Local Release Maintenance

The root package includes helper scripts:

```bash
pnpm changeset
pnpm version-packages
pnpm changelog
```

Use `pnpm version-packages` only when intentionally preparing package version changes.
