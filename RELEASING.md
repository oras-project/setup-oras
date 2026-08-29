<!--
Copyright The ORAS Authors.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Releasing setup-oras

This document describes how to cut a release of the `setup-oras` GitHub
Action.

## Two versions, decoupled

There are two independent version streams. Keep them separate in your head:

- **The action's version** — the `vX.Y.Z` git tags and GitHub Releases of
  *this repository* (e.g. `v2.0.1`). This is what consumers pin with
  `uses: oras-project/setup-oras@v2`.
- **The ORAS CLI versions** — the keys in
  [`src/lib/data/releases.json`](src/lib/data/releases.json) (e.g. `1.3.3`).
  These are the CLI versions the action knows how to install. Adding a CLI
  version does **not** change the action's version by itself.

## When to bump which part

Follow [semver](https://semver.org/) for the **action's** version:

| Change to the action | Version bump | Example |
| --- | --- | --- |
| A new ORAS CLI version was added to `releases.json`, or any other backward-compatible fix | **patch** | `v2.0.1` → `v2.0.2` |
| A backward-compatible feature was added to the action | **minor** | `v2.0.x` → `v2.1.0` |
| A breaking change to the action (e.g. Node runtime migration, dropping older runners, changed inputs/outputs) | **major** | `v1.2.4` → `v2.0.0` |

Historically, adding ORAS CLI support ships as a **patch** release on the
current major line. Minor and major bumps are reserved for changes to the
action itself and are always cut by hand — never automate them.

> The `v1` line is frozen (Node 20 runtime). All new CLI support lands on the
> current `v2`+ line.

## How a CLI version gets added

The [`Update releases.json`](.github/workflows/update-releases.yml) workflow
runs daily (and on demand via *workflow_dispatch*). It detects new upstream
ORAS releases and opens an automated PR that adds them to `releases.json` and
rebuilds `dist/`. Review it against the checklist in the PR body (verify
checksums against https://github.com/oras-project/oras/releases; confirm
`check-dist` is green) and merge it.

Merging that PR **does not** release the action. It only lands the new CLI
support on `main`. You still need to cut a release for consumers pinned to a
floating tag (`@v2`, `@v2.0`) to pick it up.

## Cutting a release

### 1. Confirm `main` is green

The tip of `main` you are about to tag must have passing **Check dist/**,
**Tests**, and **License Checker** runs.

```bash
gh run list --repo oras-project/setup-oras --branch main -L 5
```

### 2. Pick the next version

Bump the appropriate part per the table above. For a new-CLI-version release,
patch-bump the latest tag:

```bash
gh release list --repo oras-project/setup-oras -L 1   # find the latest, e.g. v2.0.1
```

### 3. Publish the GitHub Release

Create an annotated tag + release off `main`. Auto-generate notes, then edit
in a short **Highlights** section (the ORAS CLI versions now supported)
matching the style of previous releases.

```bash
gh release create v2.0.2 \
  --repo oras-project/setup-oras \
  --target main \
  --title v2.0.2 \
  --generate-notes
```

### 4. Let the floating tags move

Publishing the release fires the
[`Update major and minor tags`](.github/workflows/update-version.yml)
workflow (`on: release: published`), which force-moves the **`vX`** and
**`vX.Y`** tags to the released commit.

```bash
gh run list --repo oras-project/setup-oras --workflow update-version.yml -L 3
gh api repos/oras-project/setup-oras/git/ref/tags/v2   -q '.object.sha'
gh api repos/oras-project/setup-oras/git/ref/tags/v2.0 -q '.object.sha'
```

Both should now equal the released commit. Consumers on `@v2` / `@v2.0` now
resolve to the new version.

> If a tag protection ruleset blocks the `github-actions` bot from
> force-pushing `vX` / `vX.Y`, the release will publish but the floating tags
> will not move. Check the `update-version.yml` run, resolve the ruleset, and
> re-run the workflow.

## Automating patch releases (optional)

New-CLI-version releases are pure patch bumps and can be fully automated. A
`push`-to-`main` workflow can detect that `src/lib/data/releases.json` gained
a new version key, compute the next patch tag, and cut the release. Two things
to get right:

- **Only new CLI keys trigger it.** Diff `releases.json` against the parent
  commit; skip dependency bumps and formatting changes.
- **Beware `GITHUB_TOKEN` recursion.** A release created with the default
  `GITHUB_TOKEN` does **not** fire the `release: published` event, so
  `update-version.yml` won't run. Either create the release with a PAT / App
  token, or have the auto-release job move the `vX` / `vX.Y` tags itself
  instead of relying on the release event.

Minor and major releases stay manual.
