# Packages and Crates

## What is a crate?
Cairo packages can be organized into crates to modularize and group related code together. A crate is a compilation unit that contains Cairo code, functions, and data structures. This allows you to split your code into smaller, reusable parts, and to manage dependencies in a more structured way.

## Creating a Package with Scarb
You can create a new Cairo package using the scarb command-line tool. To create a new package, run the following command:
```bash
scarb new my_crate
```

This command will generate a new package directory named my_crate with the following structure:
```
my_crate/
├── Scarb.toml
└── src
    └── lib.cairo
```

- `src/` is the main directory where all the Cairo source files for the package will be stored.
- `lib.cairo` is the default root module of the crate, which is also the main entry point of the package. By default, it is empty.
- `Scarb.toml` is the package manifest file, which contains metadata and configuration options for the package, such as dependencies, package name, version, and authors. You can find documentation about it on the [scarb reference](https://docs.swmansion.com/scarb/docs/reference/manifest).

```toml
[package]
name = "my_crate"
version = "0.1.0"

[dependencies]
# foo = { path = "vendor/foo" }
```