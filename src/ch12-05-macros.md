# Macros

We’ve used macros like `println!` throughout this book, but we haven’t fully
explored what a macro is and how it works. The term _macro_ refers to a family
of features in Cairo: _declarative_ macros with `macro` and three kinds
of _procedural_ macros covered in [Procedural Macros](./ch12-10-procedural-macros.md):

- Custom `#[derive]` macros that specify code added with the `derive` attribute
  used on structs and enums
- Attribute-like macros that define custom attributes usable on any item
- Function-like macros that look like function calls but operate on the tokens
  specified as their argument

We’ll talk about each of these in turn, but first, let’s look at why we even
need macros when we already have functions.

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

The downside to implementing a macro instead of a function is that macro definitions are more
complex than function definitions because you’re writing Cairo code — or, even more complex, Rust
code — that writes Cairo code. Due to this indirection, macro definitions are generally more
difficult to read, understand, and maintain than function definitions.

Another important difference between macros and functions is that you must
define macros or bring them into scope _before_ you call them in a file, as
opposed to functions you can define anywhere and call anywhere.

## Declarative Inline Macros for General Metaprogramming

The most simple form of macros in Cairo is the _declarative macro_, also sometimes referred to as
just plain “macros.” At their core, declarative macros allow you to write something similar to a
`match` expression. As discussed in [Chapter 6](./ch06-00-enums-and-pattern-matching.md), `match` expressions are control structures that
take an expression, compare the resultant value of the expression to patterns, and then run the code
associated with the matching pattern. Macros also compare a value to patterns that are associated
with particular code: in this situation, the value is the literal Cairo source code passed to the
macro; the patterns are compared with the structure of that source code; and the code associated
with each pattern, when matched, replaces the code passed to the macro. This all happens during
compilation.

To define a macro, you use the `macro` construct. Let’s explore this style by
looking at how an “array-building” macro works. Earlier, we used Cairo’s
built-in `array!` macro to create arrays with particular values. For example,
the following creates a new array containing three integers:

```cairo
let a = array![1, 2, 3];
```

We could also use `array!` to make an array of two integers or five values of
other types, because the macro can accept a variable number of arguments.
We wouldn’t be able to use a regular function to do the same because we
wouldn’t know the number or types of values up front.

Below is a slightly simplified definition of an array-building macro written in
Cairo. It isn’t the exact `array!` macro from the core library, but it shows
the same core idea using declarative inline macros:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_inline_macros/src/lib.cairo:make_array_macro}}
```

> Note: The built-in `array!` macro in the standard library may include
> optimizations (like reserving capacity) that we don’t include here to keep
> the example simple.

The structure of the macro body is similar to a `match` expression. Here we
have one arm with the pattern `($($x:expr), *)`, followed by `=>` and the
block of code associated with this pattern. If the pattern matches, the
associated block of code is emitted. More complex macros can have multiple
arms, each with a different pattern.

Pattern syntax in macro definitions differs from pattern syntax used when
matching values: macro patterns are matched against Cairo source code
structure. Let’s walk through the pattern pieces in the example above:

- We use parentheses to encompass the whole matcher pattern.
- A dollar sign (`$`) introduces a macro variable that will capture the code
  matching the subpattern. Within `$()` is `$x:expr`, which matches any Cairo
  expression and gives that expression the name `$x`.
- The comma following `$()` requires literal commas between each matched
  expression.
- The `*` quantifier specifies the subpattern can repeat zero or more times.

When we call this macro with `make_array![1, 2, 3]`, the `$x` pattern matches
three times: the expressions `1`, `2`, and `3`.

Now look at the expansion side: `$(arr.append($x);)*` is generated once for
each match of `$()` in the pattern. The `$x` is replaced with each matched
expression. Calling `make_array![1, 2, 3]` expands to code like the following:

> Note: The VSCode extension can help you inspect the expanded code by doing `Ctrl+Shift+P` and then `Cairo: Recursively expand macros for item at caret`.

```cairo,ignore
{
    let mut arr = ArrayTrait::new();
    arr.append(1);
    arr.append(2);
    arr.append(3);
    arr
}
```

We’ve defined a macro that can take any number of arguments of any type and
generate code to create an array containing the specified elements.

Usage looks like this:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_inline_macros/src/lib.cairo:make_array_usage}}
```

To use them, enable the experimental feature in your `Scarb.toml`:

```toml
{{#rustdoc_include ../listings/ch12-advanced-features/listing_inline_macros/Scarb.toml:feature_flag}}
```

Inline macros are defined with `macro name { ... }` where each arm matches a code pattern and expands to replacement code. Like Rust’s macros-by-example, you capture syntax fragments with `$var: kind` and can repeat matches with `$()*`, `$()+`, or `$()?`.

<!-- Removed trivial first macro example to reduce redundancy with array example -->

### Hygiene, `$defsite`/`$callsite`, and `expose!`

Cairo’s inline macros are hygienic: names
introduced in the macro definition don’t leak into the call site unless you
explicitly expose them. Name resolution within macros can reference either the
macro definition site or the call site using `$defsite::` and `$callsite::`.

Note that, similarly to Rust, macros are expected to expand to a single
expression; thus, if your macro defines several statements, you should wrap
them with an additional `{}` block that returns a final expression.

The following end-to-end example illustrates all of these aspects together:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_inline_macros/src/lib.cairo:hygiene_e2e_module}}
```

Usage at the call site:

```cairo
{{#rustdoc_include ../listings/ch12-advanced-features/listing_inline_macros/src/lib.cairo:hygiene_e2e_usage}}
```

What this demonstrates:

- `$defsite::...` resolves to items next to the macro definition, stable across
  call sites.
- `$callsite::...` resolves to items visible where the macro is invoked.
- Names don’t leak by default; `expose!` can deliberately introduce new items
  into the call site.
- Exposed names are accessible to other inline macros invoked inside your macro
  body via `$callsite::name`.

<!-- Removed standalone repetition section; already covered in make_array example matcher and expansion explanation. -->

<!-- Consolidated into the hygiene e2e example above. -->

<!-- Covered by the hygiene e2e example (returns from a block). -->

<!-- Omitted to keep this section focused on core concepts for release notes. -->

Notes:

- This feature is experimental; syntax and capabilities may evolve.
- Item-producing macros (structs, enums, functions, etc.) are not yet supported; support will be added in future versions.
- For attributes, derives, and crate-wide transformations, prefer procedural macros (next section).
