# setup-oras

![ORAS](https://github.com/oras-project/oras-www/raw/main/docs/assets/images/oras.png)

Setup [ORAS CLI](https://github.com/oras-project/oras) on GitHub Actions runners.

## Quick Start

Setup the `oras` CLI of the default version:

```yaml
steps:
  - uses: oras-project/setup-oras@main
  - run: oras version
```

## Advanced Usage

Install a specific version of the `oras` CLI by specifying the input `version` without the prefix `v`.
Supported versions can be found at [`oras` releases](https://github.com/oras-project/oras/releases).

For example, install `oras` version `v0.16.0`.

```yaml
steps:
  - uses: oras-project/setup-oras@main
    with:
      version: 0.16.0
  - run: oras version
```

## Docs

Documentation for the ORAS CLI is located on
the project website: [oras.land/cli](https://oras.land/cli/)

## Code of Conduct

This project has adopted the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for further details.
