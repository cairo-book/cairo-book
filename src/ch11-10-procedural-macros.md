# Procedural Macros

Cairo procedural macros are actually Rust functions that takes Cairo code as input and returns a modified Cairo code as output. The main concept behind this type of macros is to grant developers the ability to create custom macros to support Cairo packages.

Generally there are three ways to use procedural macros:

1. expressions ( `macro!()` )
2. attributes ( `#[macro]` )
3. derive ( `#[derive(Macro)]` )

> To use procedural macros in your Cairo project, you need to have the Rust toolchain setup on your machine.

## How to Use an Already Existing Procedural Macro

To use a procedural macros in your project, a developer needs to add the marco as a dependency in their `Scarb.toml` file and then import and use it in their Cairo program.

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

#[derive(macro_three)]
struct ExampleStruct {
    field: u32,
}

#[macro_two]
fn main() -> u32 {
    let: u32 a = ExampleStruct { field: 1 };
    let: u32 b = ExampleStruct { field: 2 };
    macro_one!(a.to_value(), b.to_value());
}
```
{{#label procedural-macros-impl}}
<span class="caption">Listing {{#ref procedural-macros-impl}}: Example program using procedural macros.</span>

## How to Create a Procedural Macro

To create a new procedural macros, a developer needs to create a new Cairo program, then include `[cairo-plugin]` target type in the `Scarb.toml`. Next, the developer needs to add `Cargo.toml` to the root directory ( same level as the `Scarb.toml` file ), since procedural macros are in fact Rust functions. In the `Cargo.toml` file, the developer needs to add a `crate-type = ["cdylib"]` on the `[lib]` target, and also add th `cairo-lang-macro` crate as a dependency.

Below is an example of the `Scarb.toml` and `Cargo.toml` files:

```toml
# Scarb.toml
[package]
name = "some_macro"
version = "0.1.0"

[cairo-plugin]
```
{{#label procedural-macros-scarb-file}}
<span class="caption">Listing {{#ref procedural-macros-scarb-file}}: Example `Scarb.toml` file needed for building a procedural macro.</span>

```toml
# Cargo.toml
[package]
name = "some_macro"
version = "0.1.0"
edition = "2021"
publish = false

[lib]
crate-type = ["cdylib"]

[dependencies]
cairo-lang-macro = "0.1.0"
```
{{#label some-macro}}
<span class="caption">Listing {{#ref some-macro}}: Example `Cargo.toml` file needed for building a procedural macro.</span>
