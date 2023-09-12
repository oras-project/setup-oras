# setup-oras

<p align="left">
<a href="https://oras.land/"><img src="https://oras.land/img/oras.svg" alt="banner" width="100px"></a>
</p>

Setup [ORAS CLI](https://github.com/oras-project/oras) on GitHub Actions runners.

## Quick Start

Setup the `oras` CLI of the default version:

```yaml
steps:
  - uses: oras-project/setup-oras@v1
  - run: oras version
```

## Advanced Usage

Install a specific version of the `oras` CLI by specifying the input `version` without the prefix `v`.
Supported versions can be found at [`oras` releases](https://github.com/oras-project/oras/releases).

For example, install `oras` version `v1.1.0`.

```yaml
steps:
  - uses: oras-project/setup-oras@v1
    with:
      version: 1.1.0
  - run: oras version
```

## Docs

Documentation for the ORAS CLI is located on
the [project website](https://oras.land/docs/category/cli).

## Code of Conduct

This project has adopted the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for further details.
