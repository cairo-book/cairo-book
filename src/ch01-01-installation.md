# Installation

Cairo can be installed by simply downloading [Scarb][scarb doc]. Scarb bundles the Cairo compiler and the Cairo language server together in an easy-to-install package so that you can start writing Cairo code right away.

Scarb is also Cairo's package manager and is heavily inspired by [Cargo][cargo doc], Rust’s build system and package manager.

Scarb handles a lot of tasks for you, such as building your code (either pure Cairo or Starknet contracts), downloading the libraries your code depends on, building those libraries, and provides LSP support for the VSCode Cairo 1 extension.

As you write more complex Cairo programs, you might add dependencies, and if you start a project using Scarb, managing external code and dependencies will be a lot easier to do.

Let's start by installing Scarb.

[scarb doc]: https://docs.swmansion.com/scarb/docs
[cargo doc]: https://doc.rust-lang.org/cargo/

## Installing Scarb

### Requirements

Scarb requires a Git executable to be available in the `PATH` environment variable.

### Installation

To install Scarb, please refer to the [installation instructions][scarb download]. We strongly recommend that you install
Scarb [via asdf][scarb asdf], a CLI tool that can manage multiple language runtime versions on a per-project basis.
This will ensure that the version of Scarb you use to work on a project always matches the one defined in the project settings, avoiding problems related to version mismatches.

Please refer to the [asdf documentation][asdf doc] to install all prerequisites.

Once you have asdf installed locally, you can download Scarb plugin with the following command:

```bash
asdf plugin add scarb
```

This will allow you to download specific versions:

```bash
asdf install scarb 2.6.3
```

and set a global version:

```bash
asdf global scarb 2.6.3
```

Otherwise, you can simply run the following command in your terminal, and follow the onscreen instructions. This will install the latest stable release of Scarb.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

<br>
In both cases, you can verify installation by running the following command in a new terminal session, it should print both Scarb and Cairo language versions, e.g:

```bash
$ scarb --version
scarb 2.6.3 (e6f921dfd 2024-03-13)
cairo: 2.6.3 (https://crates.io/crates/cairo-lang-compiler/2.6.3)
sierra: 1.5.0
```

[scarb download]: https://docs.swmansion.com/scarb/download
[scarb asdf]: https://docs.swmansion.com/scarb/download.html#install-via-asdf
[asdf doc]: https://asdf-vm.com/guide/getting-started.html

## Installing the VSCode Extension

Cairo has a VSCode extension that provides syntax highlighting, code completion, and other useful features. You can install it from the [VSCode Marketplace][vsc extension].
Once installed, go into the extension settings, and make sure to tick the `Enable Language Server` and `Enable Scarb` options.

[vsc extension]: https://marketplace.visualstudio.com/items?itemName=starkware.cairo1

{{#quiz ../quizzes/ch01-01-installation.toml}}
