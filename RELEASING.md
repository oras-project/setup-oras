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

The action release tags (`vX.Y.Z`) are separate from the ORAS CLI versions in
[`releases.json`](src/lib/data/releases.json). A new CLI version requires an
action release before consumers using `@vX` or `@vX.Y` can install it.

## Automatic patch releases

The [update workflow](.github/workflows/update-releases.yml) opens a PR with
new CLI versions and rebuilt `dist/`. Check its checksums against the upstream
ORAS release and confirm CI passes before merging.

After both `Tests` and `Check dist/` pass on `main`, the
[auto-release workflow](.github/workflows/auto-release.yml) compares
`releases.json` with the latest action release. If new CLI version keys were
added, it creates the next patch release and moves the floating major and
minor tags. Changes to existing version entries create no release. The
workflow can also be run manually on `main` with a commit SHA to backfill an
unreleased merge or retry a failed release or tag update. Older commits
already covered by a newer release are skipped.

ORAS CLI `1.3.4` is already on `main` but not yet released. It will be included
after the next successful `main` checks; if that run does not release it,
dispatch the workflow with the `1.3.4` merge commit SHA.

The `github-actions` bot needs permission to force-push floating tags if a tag
ruleset is added. The workflow moves them itself because releases created with
`GITHUB_TOKEN` do not trigger `release: published` workflows.

## Manual minor and major releases

Use a minor version for a compatible action feature and a major version for
a breaking action change. After CI passes on `main`, create the GitHub release
at the intended commit with the appropriate `vX.Y.0` or `vX.0.0` tag:

```bash
gh release create vX.Y.0 --repo oras-project/setup-oras --target main --generate-notes
```

For a manually published release, the
[update-version workflow](.github/workflows/update-version.yml) moves `vX`
and `vX.Y`. Check that the workflow succeeded and both tags point at the
release commit. If tag protection blocks the move, fix the ruleset and rerun
that workflow.
