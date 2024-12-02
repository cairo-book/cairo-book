# Procedural Macros

Cairo procedural macros are Rust functions that takes Cairo code as input and returns a modified Cairo code as output, enabling developers to extend Cairo's syntax and create reusable code patterns. In the previous chapter, we discussed some Cairo built-in macros like `println!`, `format!`, etc. In this chapter, we will explore how to create and use custom procedural macros in Cairo.

## Types of Procedural Macros

There are three types of procedural macros in Cairo:

- **Expression Macros** (`macro!()`):
  These macros are used like function calls and can generate code based on their arguments.

- **Attribute Macros** (`#[macro]`):
  These macros can be attached to items like functions or structs to modify their behavior or implementation.

- **Derive Macros** (`#[derive(Macro)]`):
  These macros automatically implement traits for structs or enums.

## Creating a Procedural Macro

Before creating or using procedural macros, we need to ensure that the necessary tools are installed:

- **Rust Toolchain**: Cairo procedural macros are implemented in Rust, so we will need the Rust toolchain setup on our machine.
- To set up Rust, visit [rustup](https://rustup.rs) and follow the installation instructions for your operating system.

Since procedural macros are in fact Rust functions, we will need to add a `Cargo.toml` file to the root directory ( same level as the `Scarb.toml` file ). In the `Cargo.toml` file, we need to add a `crate-type = ["cdylib"]` on the `[lib]` target, and also add the `cairo-lang-macro` crate as a dependency.

> It is essential that both the `Scarb.toml` and `Cargo.toml` have the same package name, or there will be an error when trying to use the macro.

Below is an example of the `Scarb.toml` and `Cargo.toml` files:

```toml
# Scarb.toml
[package]
name = "no_listing_15_pow_macro"
version = "0.1.0"
edition = "2024_07"

# See more keys and their definitions at https://docs.swmansion.com/scarb/docs/reference/manifest.html
[cairo-plugin]

[dependencies]

[dev-dependencies]
cairo_test = "2.9.1"
```

{{#label procedural-macros-scarb-file}}
<span class="caption">Listing {{#ref procedural-macros-scarb-file}}: Example `Scarb.toml` file needed for building a procedural macro.</span>

```toml
# Cargo.toml
[package]
name = "no_listing_15_pow_macro"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
bigdecimal = "0.4.5"
cairo-lang-macro = "0.1"
cairo-lang-parser = "2.9.1"
cairo-lang-syntax = "2.9.1"

[workspace]
```

{{#label some-macro}}
<span class="caption">Listing {{#ref some-macro}}: Example `Cargo.toml` file needed for building a procedural macro.</span>

Also notice that you can also add other rust dependencies in your `Cargo.toml` file. In the example above, we added the `bigdecimal`, `cairo-lang-parser` and `cairo-lang-syntax` crates as a dependencies.

Listing {{#ref pow_macro}} shows the rust code for creating an inline macro in Rust:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_15_macro/src/pow.rs:main}}
```

{{#label pow_macro}}
<span class="caption">Listing {{#ref pow_macro}}: Code for creating inline pow procedural macro</span>

The essential dependency for building a cairo macro `cairo_lang_macro` is imported here with `inline_macro, Diagnostic, ProcMacroResult, TokenStream`. The `inline_macro` is used for implementing an expression macro, `ProcMacroResult` is used for the function return, `TokenStream` as the input, and the `Diagnostic` is used for error handling. We also use the `cairo-lang-parser` crate to parse the input code. Then the `pow` function is defined utilizing the imports to create a macro that calculate the pow based on the `TokenStream` input.

## How to Use Existing Procedural Macros

> **Note**: While you need Rust installed to use procedural macros, you don't need to know Rust programming to use existing macros in your Cairo project.

### Incorporating an Existing Procedural Macro Into Your Project

Similar to how you add a library dependency in your Cairo project, you can also add a procedural macro as a dependency in your `Scarb.toml` file.

```rust, noplayground
{{#include ../listings/ch11-advanced-features/no_listing_16_procedural_macro/src/lib.cairo:pow_macro}}
```

{{#label using_pow_macro}}
<span class="caption">Listing {{#ref using_pow_macro}}: Using pow procedural macro</span>

You'd notice a `pow!` macro, which is not a built-in Cairo macro being used in this example above. It is a custom procedural macro that calculates the power of a number as defined in the example above on creating a procedural macro.

```rust, noplayground
{{#include ../listings/ch11-advanced-features/no_listing_16_procedural_macro/src/lib.cairo:derive_macro}}
```

{{#label using_derive_macro}}
<span class="caption">Listing {{#ref using_derive_macro}}: Using derive procedural macro</span>

The example above shows using a derive macro on a `struct` B, which grants the custom struct the ability to perform addition, subtraction, multiplication, and division operations on the struct.

```rust, noplayground
{{#include ../listings/ch11-advanced-features/no_listing_16_procedural_macro/src/lib.cairo:b_struct}}
```

## Summary

Procedural macros offer a powerful way to extend Cairo's capabilities by leveraging Rust functions to generate new Cairo code. They allow for code generation, custom syntax, and automated implementations, making them a valuable tool for Cairo developers. While they require some setup and careful consideration of performance impacts, the flexibility they provide can significantly enhance your Cairo development experience.
