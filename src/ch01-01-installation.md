# Installation

Cairo can be installed by simply downloading [Scarb](https://docs.swmansion.com/scarb/docs). Scarb bundles the Cairo compiler and the Cairo language server together in an easy-to-install package so that you can start writing Cairo code right away.

Scarb is also Cairo's package manager and is heavily inspired by [Cargo](https://doc.rust-lang.org/cargo/), Rust’s build system and package manager.

Scarb handles a lot of tasks for you, such as building your code (either pure Cairo or Starknet contracts), downloading the libraries your code depends on, building those libraries, and provides LSP support for the VSCode Cairo 1 extension.

As you write more complex Cairo programs, you might add dependencies, and if you start a project using Scarb, managing external code and dependencies will be a lot easier to do.

Let's start by installing Scarb.

## Installing Scarb

### Requirements

Scarb requires a Git executable to be available in the `PATH` environment variable.

### Installation

To install Scarb, please refer to the [installation instructions](https://docs.swmansion.com/scarb/download).
You can simply run the following command in your terminal, then follow the onscreen instructions. This will install the latest stable release.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

- Verify installation by running the following command in new terminal session, it should print both Scarb and Cairo language versions, e.g:

  ```bash
  $ scarb --version
  scarb 2.3.0-rc1 (58cc88efb 2023-08-23)
  cairo: 2.2.0 (https://crates.io/crates/cairo-lang-compiler/2.2.0)
  sierra: 1.3.0
  ```

## Installing the VSCode extension

Cairo has a VSCode extension that provides syntax highlighting, code completion, and other useful features. You can install it from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=starkware.cairo1).
Once installed, go into the extension settings, and make sure to tick the `Enable Language Server` and `Enable Scarb` options.
