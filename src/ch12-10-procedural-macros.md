# Procedural Macros

Cairo provides macros as a fundamental feature that lets you write code that generates other code (known as metaprogramming). When you use macros, you can extend Cairo's capabilities beyond what regular functions offer. Throughout this book, we've used macros like `println!` and `assert!`, but haven't fully explored how we can create our own macros.

Before diving into procedural macros specifically, let's understand why we need macros when we already have functions:

## The Difference Between Macros and Functions

Fundamentally, macros are a way of writing code that writes other code, which
is known as _metaprogramming_. In Appendix C, we discuss derivable traits and the `derive`
attribute, which generates an implementation of various traits for you. We’ve
also used the `println!` and `array!` macros throughout the book. All of these
macros _expand_ to produce more code than the code you’ve written manually.

Metaprogramming is useful for reducing the amount of code you have to write and
maintain, which is also one of the roles of functions. However, macros have
some additional powers that functions don’t.

A function signature must declare the number and type of parameters the
function has. Macros, on the other hand, can take a variable number of
parameters: we can call `println!("hello")` with one argument or
`println!("hello {}", name)` with two arguments. Also, macros are expanded
before the compiler interprets the meaning of the code, so a macro can, for
example, implement a trait on a given type. A function can’t, because it gets
called at runtime and a trait needs to be implemented at compile time.

Another important difference between macros and functions is that the design of Cairo macros is complex: they're written in Rust, but operate on Cairo code. Due to
this indirection and the combination of the two languages, macro definitions are generally more
difficult to read, understand, and maintain than function definitions.

We call _procedural macros_ macros that allow you to run code at compile time that operates over
Cairo syntax, both consuming and producing Cairo syntax. You can sort of think of procedural macros
as functions from an AST to another AST. The three kinds of procedural macros are _custom derive_,
_attribute-like_, and _function-like_, and all work in a similar fashion.

In this chapter, we'll explore what procedural macros are, how they're defined, and examine each of the three types in detail.

## Cairo Procedural Macros are Rust Functions

Just as the Cairo compiler is written in Rust, procedural macros are Rust functions that transform Cairo code. These functions take Cairo code as input and return modified Cairo code as output. To implement macros, you'll need a package with both a `Cargo.toml` and a `Scarb.toml` file. The `Cargo.toml` defines the macro implementation dependencies, while the `Scarb.toml` marks the package as a macro and defines its metadata.

The function that defines a procedural macro operates on two key types:

- `TokenStream`: A sequence of Cairo tokens representing your source code. Tokens are the smallest units of code that the compiler recognizes (like identifiers, keywords, and operators).
- `ProcMacroResult`: An enhanced version of TokenStream that includes both the generated code and any diagnostic messages (warnings or errors) that should be shown to the user during compilation.

The function implementing the macro must be decorated with one of three special attributes that tell the compiler how the macro should be used:

- `#[inline_macro]`: For macros that look like function calls (e.g., `println!()`)
- `#[attribute_macro]`: For macros that act as attributes (e.g., `#[generate_trait]`)
- `#[derive_macro]`: For macros that implement traits automatically

Each attribute type corresponds to a different use case and affects how the macro can be invoked in your code.

Here are the signatures for each types :

```rust, ignore
#[inline_macro]
pub fn inline(code: TokenStream) -> ProcMacroResult {}

#[attribute_macro]
pub fn attribute(attr: TokenStream, code: TokenStream) -> ProcMacroResult {}

#[derive_macro]
pub fn derive(code: TokenStream) -> ProcMacroResult {}
```

### Install dependencies

To use procedural macros, you need to have Rust toolchain (Cargo) installed on your machine. To install Rust using Rustup, you can run the following command in you terminal :

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Create your macro

Creating a procedural macro requires setting up a specific project structure. Your macro project needs:

1. A Rust Project (where you implement the macro):

   - `Cargo.toml`: Defines Rust dependencies and build settings
   - `src/lib.rs`: Contains the macro implementation

2. A Cairo Project:
   - `Scarb.toml`: Declares the macro for Cairo projects
   - No Cairo source files needed

Let's walk through each component and understand its role:

```bash
├── Cargo.toml
├── Scarb.toml
├── src
│   └── lib.rs
```

The project contains a `Scarb.toml` and a `Cargo.toml` file in the root directory.

The Cargo manifest file needs to contain a `crate-type = ["cdylib"]` on the `[lib]` target, and the `cairo-lang-macro` crate on the `[dependencies]` target. Here is an example :

```toml
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_16_procedural_macro_expression/Cargo.toml}}
```

The Scarb manifest file must define a `[cairo-plugin]` target type. Here is an example :

```toml
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_16_procedural_macro_expression/Scarb.toml}}
```

Finally the project needs to contain a Rust library (`lib.rs`), inside the `src/` directory that implements the procedural macro API.

As you might have notice the project doesn't need any cairo code, it only requires the `Scarb.toml` manifest file mentioned.

## Using your macro

From the user's perspective, you only need to add the package defining the macro in your dependencies. In the project using the macro you will have a Scarb manifest file with :

```toml
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/Scarb.toml}}
```

## Expression Macros

Expression macros provide functionality similar to function calls but with enhanced capabilities. Unlike regular functions, they can:

- Accept a variable number of arguments
- Handle arguments of different types
- Generate code at compile time
- Perform more complex code transformations

This flexibility makes them powerful tools for generic programming and code generation. Let's examine a practical example: implementing a compile-time power function.

### Creating an expression Macros

To understand how to create an expression macro, we will look at a `pow` macro implementation from the [Alexandria](https://github.com/keep-starknet-strange/alexandria) library that computes the power of a number at compile time.

The core code of the macro implementation is a Rust code that uses three Rust crates : `cairo_lang_macro` specific to macros implementation, `cairo_lang_parser` crate with function related to the compiler parser and `cairo_lang_syntax` related to the compiler syntax. The two latters were initially created for the Cairo lang compiler, as macro functions operate at the Cairo syntax level, we can reuse the logic directly from the syntax functions created for the compiler to create macros.

> **Note:**
> To understand better the Cairo compiler and some of the concepts we only mention here such as the Cairo parser or the Cairo syntax, you can read the [Cairo compiler workshop](https://github.com/software-mansion-labs/cairo-compiler-workshop).

In the `pow` function example below the input is processed to extract the value of the base argument and the exponent argument to return the result of \\(base^{exponent}\\).

```rust, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_16_procedural_macro_expression/src/lib.rs:pow}}
```

Now that the macro is defined, we can use it. In a Cairo project we need to have `pow = { path = "path/to/pow" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And then we can use it without further import like this :

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:pow_example}}
```

## Derive Macros

Derive macros let you define custom trait implementations that can be automatically applied to types. When you annotate a type with `#[derive(TraitName)]`, your derive macro:

1. Receives the type's structure as input
2. Contains your custom logic for generating the trait implementation
3. Outputs the implementation code that will be included in the crate

Writing derive macros eliminates repetitive trait implementation code by using a generic logic on how to generate the trait implementation.

### Creating a derive macro

In this example, we will implement a derive macro that will implement the `Hello` Trait. The `Hello` trait will have a `hello()` function that will print : `Hello, StructName!`, where _StructName_ is the name of the struct.

Here is the definition of the `Hello` trait :

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:hello_trait}}
```

Let's check the marcro implementation, first the `hello_derive` function parses the input token stream and then extracts the `struct_name` to implement the trait for that specific struct.

Then hello derived returns a hard-coded piece of code containing the implementation of `Hello` trait for the type _StructName_.

```rust, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_17_procedural_macro_derive/src/lib.rs:hello}}
```

Now that the macro is defined, we can use it. In a Cairo project we need to have `hello_macro = { path = "path/to/hello_macro" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And we can then use it without further import on any struct :

```cairo, noplayground
{{#include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:some_struct}}
```

And now we can call the implemented function `hello` on an variable of the type _SomeType_.

```cairo, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:hello_example}}
```

Note that the `Hello` trait that is implemented in the macro has to be defined somewhere in the code or imported.

## Attribute Macros

Attribute-like macros are similar to custom derive macros, but allowing more possibilities, they are not restricted to struct and enum and can be applied to other items as well, such as functions. They can be used for more diverse code generation than implementing trait. It could be used to modify the name of a struct, add fields in the structure, execute some code before a function, change the signature of a function and many other possibilities.

The extra possibilities also come from the fact that they are defined with a second argument `TokenStream`, indeed the signature looks like this :

```rust, noplayground
#[attribute_macro]
pub fn attribute(attr: TokenStream, code: TokenStream) -> ProcMacroResult {}
```

With the first attribute (`attr`) for the attribute arguments (#[macro(arguments)]) and second for the actual code on which the attribute is applied to, the second attribute is the only one the two other macros have.

### Creating an attribute macro

Now let's look at an example of a custom made attribute macro, in this example we will create a macro that will rename the struct.

```rust, noplayground
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_18_procedural_macro_attribute/src/lib.rs:rename}}
```

Again, to use the macro in a Cairo project we need to have `rename_macro = { path = "path/to/rename_macro" }` in the `[dependencies]` target of the `Scarb.toml` manifest file. And we can then use it without further import on any struct.

The rename macro can be derived as follow :

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:old_trait}}
```

Now the compiler knows the _RenamedType_ struct, therefore we can create an instance as such :

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/no_listing_15_procedural_macro/src/lib.cairo:rename_example}}
```

You can notice that the names _OldType_ and _RenamedType_ were hardcoded in the example but could be variables leveraging the second arg of rattribute macro. Also note that due to the order of compilation, the derive of other macro such as _Drop_ here as to be done in the code generated by the macro. Some deeper understanding of Cairo compilation can be required for custom macro creation.
