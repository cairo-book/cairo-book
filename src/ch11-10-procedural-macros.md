# Procedural Macros

Cairo procedural macros are actually Rust functions that takes Cairo code as input and returns a modified Cairo code as output. The main concept behind this is to grant developers the ability to create custom macros that supports Cairo packages.

## Types of Procedural Macros

There are three main types of procedural macros in Cairo:

1. **Expression Macros** (`macro!()`)
   These macros are used like function calls and can generate code based on their arguments.

2. **Attribute Macros** (`#[macro]`)
   These macros can be attached to items like functions or structs to modify their behavior or implementation.

3. **Derive Macros** (`#[derive(Macro)]`)
   These macros automatically implement traits for structs or enums.

## How to Use Existing Procedural Macros

Using existing procedural macros in your Cairo project involves:

1. Setting up your environment
2. Incorporating the macro into your project

### 1. Setting Up Your Environment

Before using procedural macros, ensure you have the necessary tools:

- **Rust Toolchain**: Cairo procedural macros are implemented in Rust, so you need the Rust toolchain on your machine.
- To set up Rust, visit [rustup](https://rustup.rs) and follow the installation instructions for your operating system.

> **Note**: While you need Rust installed to use procedural macros, you don't need to know Rust programming to use existing macros in your Cairo project.

### 2. Incorporating the Macro Into Your Project

To use a procedural macro in your project:

- Add the macro as a dependency in your `Scarb.toml` file.
- Import and use the macro in your Cairo program.

Here's an example of how to add a macro dependency:

```toml
[package]
name = "using-procedural-macros"
version = "0.1.0"

[dependencies]
example_expression_macro = "0.1.0"
example_attribute_macro = "0.1.0"
example_derive_macro = "0.1.0"
...
```
{{#label using-procedural-macros}}
<span class="caption">Listing {{#ref using-procedural-macros}}: Scarb.toml that shows using procedural macros as dependencies</span>

```rust,noplayground
use example_expression_macro::macro_one;
use example_attribute_macro::macro_two;
use example_derive_macro::macro_three;

// This is a derive macro that implements some trait for ExampleStruct
#[derive(macro_three)]
struct ExampleStruct {
    field: u32,
}

// This attribute macro would modify the function in some way
#[macro_two]
fn main() -> u32 {
    let: u32 a = ExampleStruct { field: 1 };
    let: u32 b = ExampleStruct { field: 2 };
    // This expression macro performs an operation on the two values
    macro_one!(a.to_value(), b.to_value());
}
```
{{#label procedural-macros-impl}}
<span class="caption">Listing {{#ref procedural-macros-impl}}: Example Cairo program using procedural macros.</span>

## How to Create a Procedural Macro

To create a procedural macro, a developer needs to create a new Cairo program, then include `[cairo-plugin]` target type in the `Scarb.toml`. Next, the developer needs to add `Cargo.toml` to the root directory ( same level as the `Scarb.toml` file ), since procedural macros are in fact Rust functions. In the `Cargo.toml` file, the developer needs to add a `crate-type = ["cdylib"]` on the `[lib]` target, and also add the `cairo-lang-macro` crate as a dependency.

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
cairo_test = "2.7.0"
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
cairo-lang-parser = "2.7.0"
cairo-lang-syntax = "2.7.0"

[workspace]
```

{{#label some-macro}}
<span class="caption">Listing {{#ref some-macro}}: Example `Cargo.toml` file needed for building a procedural macro.</span>


> Make sure the package name of both `Scarb.toml` and `Cargo.toml` files are the same or this will lead to an error.

Also notice that you can also add other rust dependencies in your `Cargo.toml` file. In the example above, we added the `bigdecimal`, `cairo-lang-parser` and `cairo-lang-syntax` crates as a dependencies.

Listing {{#ref pow_macro}} shows the rust code for creating an inline macro in Rust:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_15_macro/src/pow.rs:main}}
```

{{#label pow_macro}}
<span class="caption">Listing {{#ref pow_macro}}: Code for creating inline pow procedural macro</span>

## Conclusion

Procedural macros offer a powerful way to extend Cairo's capabilities by leveraging Rust functions to generate new Cairo code. They allow for code generation, custom syntax, and automated implementations, making them a valuable tool for Cairo developers. While they require some setup and careful consideration of performance impacts, the flexibility they provide can significantly enhance your Cairo development experience.
