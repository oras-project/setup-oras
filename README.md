# setup-oras

<p align="left">
<a href="https://oras.land/"><img src="https://oras.land/img/oras.svg" alt="banner" width="100px"></a>
</p>

Setup [ORAS CLI](https://github.com/oras-project/oras) on GitHub Actions runners.

## Quick Start

Setup the `oras` CLI of the default version:

```yaml
steps:
  - uses: oras-project/setup-oras@v2
  - run: oras version
```

## Advanced Usage

Install a specific version of the `oras` CLI by specifying the input `version` without the prefix `v`. Stable versions (not pre-release versions) are supported and can be found at [`oras` releases](https://github.com/oras-project/oras/releases).

For example, install `oras` version `v1.0.0`.

```yaml
steps:
  - uses: oras-project/setup-oras@v2
    with:
      version: 1.0.0
  - run: oras version
```

You can also download `oras` CLI from any preferred trusted source, by specifying link of the source via `url` and the SHA256 checksum via `checksum`. This can be used to download a pre-release version or download from a proxy other than `github.com`. 

For example, install `oras` version `v1.2.0-beta.1`.

```yaml
steps:
  - uses: oras-project/setup-oras@v2
    with:
      url: https://github.com/oras-project/oras/releases/download/v1.2.0-beta.1/oras_1.2.0-beta.1_linux_amd64.tar.gz
      checksum: 37d86f848f7c7c471035cf8218f06372fd72a9fbdca1e10f509738e222b3b2be
  - run: oras version
```

## Pinning

Choose how to reference the action based on your update and reproducibility needs:

| Reference | Behavior |
| --- | --- |
| `@v2` | A mutable, floating tag that moves automatically to each new v2 release, making new ORAS CLI versions available without workflow changes. |
| `@vX.Y.Z` (for example, `@v2.0.3`) | A full patch tag for an immutable release cannot be moved or deleted. This guarantee only applies to releases published after release immutability was enabled on 2026-10-17; v2.0.2 and earlier are not immutable. |
| `@<full-commit-sha>` | A content-addressed reference to an exact commit, providing the strongest pin of these options. Full-length commit SHA pinning is recommended in the [GitHub Actions security hardening guide](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions). |

To pin to a commit, replace `<full-commit-sha>` with the full commit SHA from the desired release in this repository and keep its version in a comment:

```yaml
steps:
  - uses: oras-project/setup-oras@<full-commit-sha> # v2.0.3
```

Dependabot's `github-actions` ecosystem can update both SHA pins and their trailing version comments, so pinning to a SHA still allows automated update PRs. See [Keeping your actions up to date with Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot).

## Docs

Documentation for the ORAS CLI is located on the [project website][docs-cli].

[docs-cli]: https://oras.land/docs/commands/use_oras_cli

## Code of Conduct

This project has adopted the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for further details.
