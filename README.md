# PubKey Program Library (PPL)

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
> corepack prepare pnpm@8 --activate
> ```

### Installation

1. Clone the repository:

```sh
git clone https://github.com/pubkeyapp/pubkey-program-library
cd pubkey-program-library
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

## License

MIT
