# setup-oras

![ORAS](https://github.com/oras-project/oras-www/raw/main/docs/assets/images/oras.png)

Setup [ORAS CLI](https://github.com/oras-project/oras) on GitHub Actions runners.

## Usage

Setup the `oras` CLI:

```yaml
steps:
  - uses: oras-project/setup-oras@main
  - run: oras version
```

Install a specific version of the `oras` CLI:

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

