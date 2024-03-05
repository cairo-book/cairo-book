# Appendix C - Derivable Traits

In various places in the book, we’ve discussed the `derive` attribute, which you can apply to a struct or enum definition. The `derive` attribute generates code to implement a default trait on the type you’ve annotated with the `derive` syntax.

In this appendix, we provide a comprehensive reference detailing all the traits in the standard library compatible with the `derive` attribute.

These traits listed here are the only ones defined by the core library that can be implemented on your types using `derive`. Other traits defined in the standard library don’t have sensible default behavior, so it’s up to you to implement them in a way that makes sense for what you’re trying to accomplish.

## Drop and Destruct

When moving out of scope, variables need to be moved first. This is where the `Drop` trait intervenes. You can find more details about its usage [here](ch04-01-what-is-ownership.md#no-op-destruction-the-drop-trait).

Moreover, Dictionaries need to be squashed before going out of scope. Calling the `squash` method on each of them manually can quickly become redundant. `Destruct` trait allows Dictionaries to be automatically squashed when they get out of scope. You can also find more information about `Destruct` [here](ch04-01-what-is-ownership.md#destruction-with-a-side-effect-the-destruct-trait).

## `Clone` and `Copy` for Duplicating Values

The `Clone` trait provides the functionality to explicitly create a deep copy of a value.

Deriving `Clone` implements the `clone` method, which, in turn, calls clone on each of the type's components. This means all the fields or values in the type must also implement `Clone` to derive `Clone`.

Here is a simple example:

```rust
{{#include ../listings/appendix/listing_01_clone/src/lib.cairo}}
```

The `Copy` trait allows for the duplication of values. You can derive `Copy` on any type whose parts all implement `Copy`.

Example:

```rust
{{#include ../listings/appendix/listing_02_copy/src/lib.cairo}}
```

## `Debug` for Programmer Output

The `Debug` trait enables debug formatting in format strings, which you indicate by adding `:?` within `{}` placeholders.

The `Debug` trait allows you to print instances of a type for debugging purposes, so you and other programmers using your type can inspect an instance at a particular point in a program’s execution.

For example:

```rust
{{#include ../listings/appendix/listing_03_debug/src/lib.cairo}}
```

```shell
scarb cairo-run
Point { x: 1, y: 3 }
```

The `Debug` trait is required, for example, in use of the `assert_eq!` macro in tests. This macro prints the values of instances given as arguments if the equality assertion fails so programmers can see why the two instances weren’t equal.

## `PartialEq` for Equality Comparisons

The `PartialEq` trait allows for comparison between instances of a type for equality, thereby enabling the `==` and `!=` operators.

When `PartialEq` is derived on structs, two instances are equal only if all fields are equal, and the instances are not equal if any fields are not equal. When derived on enums, each variant is equal to itself and not equal to the other variants.

The `PartialEq` trait is required, for example, with the use of the `assert_eq!` macro in tests, which needs to be able to compare two instances of a type for equality.

Here is an example:

```rust
{{#include ../listings/appendix/listing_04_partialeq/src/lib.cairo}}
```

## Serializing with `Serde`

`Serde` provides trait implementations for `serialize` and `deserialize` functions for data structures defined in your crate. It allows you to transform your structure into an array (or the opposite).

> **[Serialization](https://en.wikipedia.org/wiki/Serialization)** is a process of transforming data structures into a format that can be easily stored or transmitted. Let's say you are running a program and would like to persist its state to be able to resume it later. To do this, you could take each of the objects your program is using and save information about them, for example in a file. This exactly is a simplified version of serialization. Now if you want to resume your program with this saved state, you would perform **deserialization** which means you would load the state of the objects from some source.

For example:

```rust
{{#include ../listings/appendix/listing_05_serialize/src/lib.cairo}}

```

If you run the `main` function, the output will be:

```shell
Run panicked with [2, 99 ('c'), ].
```

We can see here that our struct `A` has been serialized into the output array. Note that the `serialize` function takes as argument a snapshot of the type you want to convert into an array. This is why deriving `Drop` for `A` is required here, as the `main` function keeps ownership of the `first_struct` struct. 

Also, we can use the `deserialize` function to convert the serialized array back into our `A` struct.

Here is an example:

```rust
{{#include ../listings/appendix/listing_06_deserialize/src/lib.cairo}}
```

Here we are converting a serialized array span back to the struct `A`. `deserialize` returns an `Option` so we need to unwrap it. When using deserialize we also need to specify the type we want to deserialize into.

## Hashing with `Hash`

It is possible to derive the `Hash` trait on structs and enums. This allows them to be hashed easily using any available hash function. For a struct or an enum to derive the `Hash` attribute, all fields or variants need to be themselves hashable.

You can refer to the [Hashes section](ch11-05-hash.md) to get more information about how to hash complexe data types.
