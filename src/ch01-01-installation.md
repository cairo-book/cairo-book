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

To install Scarb, please refer to the [installation instructions](https://docs.swmansion.com/scarb/download). We strongly recommend that you install
Scarb [via asdf](https://docs.swmansion.com/scarb/download.html#install-via-asdf), a CLI tool that can manage multiple language runtime versions on a per-project basis.
This will ensure that the version of Scarb you use to work on a project always matches the one defined in the project settings, avoiding problems related to version mismatches.

Please refer to the [asdf documentation](https://asdf-vm.com/guide/getting-started.html) to install all prerequisites.

Once you have asdf installed locally, you can download Scarb plugin with the following command:

```bash
asdf plugin add scarb
```

This will allow you to download specific versions:

```bash
asdf install scarb 2.5.3
```

and set a global version:

```bash
asdf global scarb 2.5.3
```

Otherwise, you can simply run the following command in your terminal, and follow the onscreen instructions. This will install the latest stable release of Scarb.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

- In both cases, you can verify installation by running the following command in a new terminal session, it should print Scarb, Cairo and Sierra language versions, e.g:

```bash
$ scarb --version
scarb 2.5.3 (46d5d5cea 2024-02-01)
cairo: 2.5.3 (https://crates.io/crates/cairo-lang-compiler/2.5.3)
sierra: 1.4.0
```

## Installing the VSCode extension

Cairo has a VSCode extension that provides syntax highlighting, code completion, and other useful features. You can install it from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=starkware.cairo1).
Once installed, go into the extension settings, and make sure to tick the `Enable Language Server` and `Enable Scarb` options.
