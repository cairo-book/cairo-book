# Installation

The first step is to install Cairo. We'll download Cairo through [starkup][starkup], a command line tool for managing Cairo versions and associated tools. You'll need an internet connection for the download.

The following steps install the latest stable version of the Cairo compiler through a binary called [Scarb][scarb doc]. Scarb bundles the Cairo compiler and the Cairo language server together in an easy-to-install package so that you can start writing Cairo code right away.

Scarb is also Cairo's package manager and is heavily inspired by [Cargo][cargo doc], Rust's build system and package manager.

Scarb handles a lot of tasks for you, such as building your code (either pure Cairo or Starknet contracts), downloading the libraries your code depends on, building those libraries, and provides LSP support for the VSCode Cairo 1 extension.

As you write more complex Cairo programs, you might add dependencies, and if you start a project using Scarb, managing external code and dependencies will be a lot easier to do.

[Starknet Foundry][sn foundry] is a toolchain for Cairo programs and Starknet smart contract development. It supports many features, including writing and running tests with advanced features, deploying contracts, interacting with the Starknet network, and more.

Let's start by installing starkup, which will help us manage Cairo, Scarb, and Starknet Foundry.

[starkup]: https://github.com/software-mansion/starkup
[scarb doc]: https://docs.swmansion.com/scarb/docs
[cargo doc]: https://doc.rust-lang.org/cargo/
[sn foundry]: https://foundry-rs.github.io/starknet-foundry/index.html

## Installing `starkup` on Linux or MacOs

If you're using Linux or macOS, open a terminal and enter the following command:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.dev | sh
```

The command downloads a script and starts the installation of the starkup tool, which installs the latest stable version of Cairo and related toolings. You might be prompted for your password. If the install is successful, the following line will appear:

```bash
starkup: Installation complete.
```

After installation, starkup will automatically install the latest stable versions of Cairo, Scarb, and Starknet Foundry. You can verify the installations by running the following commands in a new terminal session:

```bash
$ scarb --version
scarb 2.10.1 (f190630a5 2025-02-17)
cairo: 2.10.1 (https://crates.io/crates/cairo-lang-compiler/2.10.1)
sierra: 1.7.0

$ snforge --version
snforge 0.38.0
```

We'll describe Starknet Foundry in more detail in [Chapter {{#chap testing-cairo-programs}}][writing tests] for Cairo programs testing and in [Chapter {{#chap starknet-smart-contracts-security}}][testing with snfoundry] when discussing Starknet smart contract testing and security in the second part of the book.

[writing tests]: ./ch10-01-how-to-write-tests.md
[testing with snfoundry]: ./ch104-02-testing-smart-contracts.md#testing-smart-contracts-with-starknet-foundry

## Installing the VSCode Extension

Cairo has a VSCode extension that provides syntax highlighting, code completion, and other useful features. You can install it from the [VSCode Marketplace][vsc extension].
Once installed, go into the extension settings, and make sure to tick the `Enable Language Server` and `Enable Scarb` options.

[vsc extension]: https://marketplace.visualstudio.com/items?itemName=starkware.cairo1

{{#quiz ../quizzes/ch01-01-installation.toml}}
