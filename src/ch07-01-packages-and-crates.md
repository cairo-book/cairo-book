# Packages and Crates

## What is a crate?

A crate is the smallest amount of code that the Cairo compiler considers at a time. Even if you run `cairo-compile` (a compiler binary that can be used to compile Cairo files, that Scarb extends with additional functionalities) rather than `scarb build` and pass a single source code file, the compiler considers that file to be a crate. Crates can contain modules, and the modules may be defined in other files that get compiled with the crate, as will be discussed in the subsequent sections.

## What is the crate root?

The crate root is the _lib.cairo_ source file that the Cairo compiler starts from and makes up the root module of your crate. We’ll explain modules in depth in the [“Defining Modules to Control Scope”](./ch07-02-defining-modules-to-control-scope.md) section.

## What is a package?

A cairo package is a bundle of one or more crates, each crate containing a _Scarb.toml_ file that describes how to build it. If the package includes more than one crate, it will contain its own _Scarb.toml_, organizing all included crates as dependencies. This enables the splitting of code into smaller, reusable parts and facilitates more structured dependency management.

## Creating a Package with Scarb

You can create a new Cairo package using the Scarb command-line tool. To create a new package, run the following command:

```bash
scarb new my_package
```

This command will generate a new package directory named _my_package_ with the following structure:

```
my_package/
├── Scarb.toml
└── src
    └── lib.cairo
```

- _src/_ is the main directory where all the Cairo source files for the package will be stored.
- _lib.cairo_ is the default root module of the crate, which is also the main entry point of the package.
- _Scarb.toml_ is the package manifest file, which contains metadata and configuration options for the package, such as dependencies, package name, version, and authors. You can find documentation about it on the [scarb reference](https://docs.swmansion.com/scarb/docs/reference/manifest.html).

```toml
[package]
name = "my_package"
version = "0.1.0"
edition = "2023_11"

[dependencies]
# foo = { path = "vendor/foo" }
```

As you develop your package, you may want to organize your code into multiple Cairo source files. You can do this by creating additional `.cairo` files within the `src` directory or its subdirectories.
