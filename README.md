# PubKey Protocol (PPL)

This is a work in progress.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or higher)
- [PNPM](https://pnpm.io/) (v8 or higher)
- [Rust](https://www.rust-lang.org/)
- [Anchor](https://www.anchor-lang.com/)
- [Git](https://git-scm.com/)

> [!TIP]
> If you don't have PNPM installed, you can install it using `corepack`:
>
> ```sh
> corepack enable
> corepack prepare pnpm@latest --activate
> ```

### Installation

1. Clone the repository:

```sh
git clone https://github.com/pubkeyapp/pubkey-protocol
cd pubkey-protocol
pnpm install
```

### Development

Start web app

```sh
pnpm dev:web
```

### Build

Build web app

```sh
pnpm build:web
```

Build the Anchor program

```sh
pnpm build:anchor
```

### Lint

Lint all projects

```sh

pnpm lint
```

### Test

Test all projects

```sh
pnpm test
```

To iterate on the `anchor` program using a local validator, this is the recommended workflow:

Open this in one terminal:

```shell
pnpm anchor localnet
```

And this in another:

```shell
pnpm anchor test --skip-deploy --skip-local-validator
```

## License

MIT
