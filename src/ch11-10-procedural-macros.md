# Procedural Macros

All trough the book we have used a few macro such as `println!`, `assert!`and `panic!` which are expression macro. Procedural macros accept some code as an input, operate on that code, and produce some code as an output. The three kinds of procedural macros are expression macro (`macro!()`), attribute macro (`#[macro]`) and custom derive (`#[derive(Macro)]`) and all work in a similar fashion.

In this chapter we will see what procedural macro are, how they are defined, and discuss for each of the 3 types how to use and create them.

## Cairo Procedural macro are Rust function

Macros actually share similarities with compilers in how they operate. Just as the Cairo compiler is written in Rust, macros are in fact Rust functions that take Cairo code as input and return modified Cairo code as an output. To define macros, you need a package with both a Cargo.toml and a Scarb.toml file. The first defines macro implementation dependencies, the second marks the package as macro and defines metadata.

The function that defines a procedural macro takes a `TokenStream` as an input and produces a `ProcMacroResult` as an output. Both types are defined in the [cairo_lang_macro](https://docs.rs/cairo-lang-macro/latest/cairo_lang_macro/) Rust crate. `TokenStream` is defined as some encapsulation of code represented in plain Cairo. `Tokenstream` can be created from a String and be converted into a String with `to_string()` method. `ProcMacroResult` extends `TokenStream` with additionnal fields to support diagnostic emission. Diagnostics can be used to emit warnings / errors to the user during the compilation.

The function implementing the macro should be wrapped with one on the tree attributes : `#[inline_macro]` for expression macro, `[attribute_macro]` for attribute macro or `#[derive_macro]` for custom derive.

Here are the signatures for each types : 
```rust
#[inline_macro]
pub fn inline(code: TokenStream) -> ProcMacroResult {}

#[attribute_macro]
pub fn attribute(attr: TokenStream, code: TokenStream) -> ProcMacroResult {}

#[derive_macro]
pub fn derive(code: TokenStream) -> ProcMacroResult {}
```

### Install dependancies

To use procedural macros, you need to have Rust toolchain (Cargo) installed on your machine. To install Rust using Rustup, you can run the following command in you terminal : 

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Create your macro

Now let's review what you need to create your own marco. You will need to have a Rust project where the macro code in defined and a very basic Scarb manifest file to declare the macro. The project will look like this, we will go through each of the items:

```bash
├── Cargo.toml
├── Scarb.toml
├── src
│   └── lib.rs
```

The project contains a `Scarb.toml`and a `Cargo.toml`file in the root directory. 

The Cargo manifest file needs to contain a `crate-type = ["cdylib"]` on `[lib]` target, the cairo-lang-macro crate on `[dependencies]` target. Here is an example : 

```rust
[package]
name = "macro_name"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
cairo-lang-macro = "0.1"
```

The Scarb manifest file must define a `[cairo-plugin]` target type. Here is an example : 

```rust
[package]
name = "macro_name"
version = "0.1.0"
edition = "2024_07"

[cairo-plugin]
```

Finally the project needs to contain a Rust library (`lib.rs`), inside the `src/` directory that implements the procedural macro API. 

As you might have notice the project doesn't need any cairo code, it only requires the `Scarb.toml` manifest file mentionned.

## Using your macro
From the user's perspective, you only need to add the package defining the macro in your dependencies. In the project using the macro you will have a Scarb manifest file with :

```rust
[package]
name = "using_macro"
version = "0.1.0"
edition = "2024_07"

[dependencies]
macro_name = { path = "path/to/macro_name" }
```

## Expression Macros

Expression macros look like function calls but with extended possibilities. They are more flexible than functions, for example they can take an number of arguments that is not predifined,or have inputs argument of not predifined types. Allowing to code funtions in a more generic ways.


### Creating an expression Macros
To understand how to create an expression macro we will look at a pow macro implementation from [Alexandria](https://github.com/keep-starknet-strange/alexandria) library.

The core code of the macro implementation is a Rust code that uses three Rust crates : `cairo_lang_macro` specific to macros implementation, `cairo_lang_parser` crate with function related to the compiler parser and `cairo_lang_syntax` related to the compiler syntax. The two latters were initially created for the Cairo lang compiler, as macro functions operate at the Cairo syntax level, we can reuse the logic directly from the syntax functions created for the compiler to create macros.

> **Note:**
> To understand better the Cairo compiler and some of the concepts we only mention here such as the Cairo parser or the > > Cairo syntax you can read the [Cairo compiler workshop](https://github.com/software-mansion-labs/cairo-compiler-workshop).



In the pow function example below the input is processed to extract the value of the base argument and the exponant argument to return the result of $base^{exponant}$.


```rust
{{#include ../listings/ch11-advanced-features/no_listing_16_procedural_macro_expression/src/lib.rs::pow}}
```

Now that the macro is defined, we can use it. In a Cairo project we need to have `pow = { path = "path/to/pow" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And then we can use it without further import like this :

```rust
fn main() {
    let res = pow(2, 16);
}
```

## Derive Macros

Derive macros automatically implement traits, it's only used for structs or enums. Rather than having to implement a trait for multiple types, you can create a procedural macro and annotate the types with #[derive(Macro)] to get a default and auto-generated implementation of a trait.


### Creating a derive macro

In this example, we will implement a derive macro that will implement the `Hello` Trait. The `Hello` trait will have a `hello()` function that will print : `Hello, StructName!`, where *StructName* is the name of the struct.

Here is the definition of the `Hello` trait : 

```cairo
{{#include ../listings/ch11-advanced-features/no_listing_15_procedural_macro/src/lib.cairo::hello_trait}}
```

Let's check the marcro implementation, first the `hello_derive` function parses the input token stream and then extracts the `struct_name` to implement the trait for that specific struct.

Then hello derived returns a hard-coded piece of code containing the implementation of `Hello` trait for the type *StructName*.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_17_procedural_macro_derive/src/lib.rs::hello}}
```

Now that the macro is defined, we can use it. In a Cairo project we need to have `hello_macro = { path = "path/to/hello_macro" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And we can then use it without further import on any struct :

```cairo
{{#include ../listings/ch11-advanced-features/no_listing_15_procedural_macro/src/lib.cairo::some_struct}}
```

And now we can call the implemented function `hello` on an variable of the type *SomeType*.

```cairo
{{#include ../listings/ch11-advanced-features/no_listing_15_procedural_macro/src/lib.cairo::some_example}}
```

Note that the `Hello` trait that is implemented in the macro has to be defined somewhere in the code or imported.

## Attribute Macros

Attribute-like macros are similar to custom derive macros, but allowing more possibilities, they are not retricted to struct and enum and can be applied to other items as well, such as functions. They can be used for more diverse code generation than implementing trait. It could be used to modify the name of a struct, add fiels in the structure, execute some code before a function, change the signature of a function and many other possibilities.

The extra possibilities also come from the fact that they are defined with a second argument `TokenStream`, indeed the signature looks like this : 
```rust
#[attribute_macro]
pub fn attribute(attr: TokenStream, code: TokenStream) -> ProcMacroResult {}
```

With the first attribute (`attr`) for the attribute arguments (#[macro(arguments)]) and second for the actual code on which the attribute is applied to, the second attribute is the only one the two other macros have.

### Creating an attribute macro

Now let's look at an example of a custom made attribute macro, in this example we will create a macro that will rename the struct.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_18_procedural_macro_attribute/src/lib.rs::rename}}
```

Again, to use the macro in a Cairo project we need to have `rename_macro = { path = "path/to/rename_macro" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And we can then use it without further import on any struct.

The rename macro can be derrived as follow :

```cairo
{{#include ../listings/ch11-advanced-features/no_listing_15_procedural_macro/src/lib.cairo::old_trait}}
```

Now the compiler knows the *RenamedType* struct, therefor we can create an intance as such :

```cairo
{{#include ../listings/ch11-advanced-features/no_listing_15_procedural_macro/src/lib.cairo::rename_example}}
```

You can notice that the names *OldType* and *RenamedType* were harcoded in the example but could be variables leveraging the second arg of rattribute macro. Also note that due to the order of compilation, the derive of other macro such as *Drop* here as to be done in the code generated by the macro. Some deeper understanding of Cairo compilation can be required for custum macro creation.
