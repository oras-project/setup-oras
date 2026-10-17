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

## Release immutability and floating tags

Releases with full version tags (`vX.Y.Z`) published after release immutability
was enabled on 2026-10-17 are immutable: their tags and assets cannot change
once published. Fix a bad release by publishing the next patch release rather than
editing its assets or moving its tag. Releases published before immutability
was enabled, including v2.0.2 and earlier, remain mutable.

Floating tags (`vX` and `vX.Y`) must stay plain Git tags. Never create a GitHub
release for a floating tag: publishing it would lock the tag and prevent the
force-pushes in `auto-release.yml` and `update-version.yml` from moving it.

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

The release is created with `GITHUB_TOKEN`, but the floating tags are pushed
over SSH with the `TAG_DEPLOY_KEY` deploy key. The workflow moves them itself
because releases created with `GITHUB_TOKEN` do not trigger
`release: published` workflows. The rulesets:

- `release-tags` matches `refs/tags/v*` and restricts deletion, updates and
  force-pushes. The deploy key is its only bypass actor, so only the release
  workflows can move `vX` and `vX.Y`. GitHub rejects the GitHub Actions app as
  a bypass actor for this ruleset, which is why a deploy key is used.
- `no-version-branches` matches `refs/heads/v*` and restricts creation, so a
  branch cannot shadow a release tag.

## Deploy key

Floating tags can only be moved with the repository deploy key. To create or
rotate it:

```bash
ssh-keygen -t ed25519 -N '' -C setup-oras-tags -f tag_deploy_key
gh repo deploy-key add tag_deploy_key.pub --repo oras-project/setup-oras \
  --allow-write --title 'release tags'
gh secret set TAG_DEPLOY_KEY --repo oras-project/setup-oras < tag_deploy_key
rm tag_deploy_key tag_deploy_key.pub
```

If the key is missing, the release is still published but the tag move fails.
Restore the key, then rerun the auto-release workflow with the release commit.

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
release commit. If a floating-tag move fails in either release workflow,
check the deploy key and that it is still the `release-tags` bypass actor, then
rerun the failed workflow. For an automatic release, use the manual retry
described above with the original release commit SHA.
