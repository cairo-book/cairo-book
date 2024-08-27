# Procedural Macros

Cairo procedural macros are actually Rust functions that takes Cairo code as input and returns a modified Cairo code as output. The main concept behind this type of macros is to grant developers the ability to create custom macros that supports Cairo packages.

Generally there are three ways to use procedural macros:

1. expressions ( `macro!()` )
2. attributes ( `#[macro]` )
3. derive ( `#[derive(Macro)]` )

> To use procedural macros in your Cairo project, you need to have the Rust toolchain setup on your machine. This is because Cairo procedural macros are implemented in Rust. To set up Rust, visit [rustup](https://rustup.rs) and follow the installation instructions for your operating system.

## How to Use Existing Procedural Macros

To use a procedural macros in your project, a developer needs to add the macro as a dependency in their `Scarb.toml` file and then import and use it in their Cairo program.

> You do not need to know Rust to use already existing procedural macros in your Cairo project.

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
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_15_pow_macro/src/lib.rs:main}}
```

{{#label pow_macro}}
<span class="caption">Listing {{#ref pow_macro}}: Code for creating inline pow procedural macro</span>
