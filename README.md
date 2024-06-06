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
Stable versions (not `beta` or `rc` versions) that can be found at [`oras` releases](https://github.com/oras-project/oras/releases) are supported.

For example, install `oras` version `v1.0.0`.

```yaml
steps:
  - uses: oras-project/setup-oras@v1
    with:
      version: 1.0.0
  - run: oras version
```

You can also download `oras` CLI from a customized link, by specifying the inputs `url`
and `checksum`. This can be used to download a `beta` or `rc` version, or download 
from a proxy. Both inputs must be provided. 

When both `url` and `checksum` are provided, the `version` value is ignored and the 
download will be from `url` and checked against `checksum`.

For example, install `oras` version `v1.2.0-beta.1`.

```yaml
steps:
  - uses: oras-project/setup-oras@v1
    with:
      url: https://github.com/oras-project/oras/releases/download/v1.2.0-beta.1/oras_1.2.0-beta.1_linux_amd64.tar.gz
      checksum: 37d86f848f7c7c471035cf8218f06372fd72a9fbdca1e10f509738e222b3b2be
  - run: oras version
```

## Docs

Documentation for the ORAS CLI is located on
the [project website](https://oras.land/docs/category/cli).

## Code of Conduct

This project has adopted the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for further details.
