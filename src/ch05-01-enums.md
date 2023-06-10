# Enums

Enums, short for "enumerations," are a way to define a custom data type that consists of a fixed set of named values, called _variants_. Enums are useful for representing a collection of related values where each value is distinct and has a specific meaning.

## Enum Variants and Values

Here's a simple example of an enum:

```rust
{{#include ../listings/ch05-enums-and-pattern-matching/no_listing_01_enum_example.cairo:enum_example}}
```

Unlike other languages like Rust, every variant has a type. In this example, we've defined an enum called `Direction` with four variants: `North`, `East`, `South`, and `West`. The naming convention is to use PascalCase for enum variants. Each variant represents a distinct value of the Direction type and is associated with a unit type `()`. One variant can be instantiated using this syntax:

```rust
{{#rustdoc_include ../listings/ch05-enums-and-pattern-matching/no_listing_01_enum_example.cairo:here}}
```

It's easy to write code that acts differently depending on the variant of an enum instance, in this example to run specific code according to a Direction. You can learn more about it on [The Match Control Flow Construct page](ch05-02-the-match-control-flow-construct.md).

## Enums Combined with Custom Types

Enums can also be used to store more interesting data associated with each variant. For example:

```rust
{{#include ../listings/ch05-enums-and-pattern-matching/no_listing_02_enum_message.cairo:message}}
```

In this example, the `Message` enum has three variants: `Quit`, `Echo` and `Move`, all with different types:

- `Quit` is the unit type - it has no data associated with it at all.
- `Echo` is a single felt.
- `Move` is a tuple of two u128 values.

You could even use a Struct or another Enum you defined inside one of your Enum variants.

## Trait Implementations for Enums

In Cairo, you can define traits and implement them for your custom enums. This allows you to define methods and behaviors associated with the enum. Here's an example of defining a trait and implementing it for the previous `Message` enum:

```rs
{{#include ../listings/ch05-enums-and-pattern-matching/no_listing_02_enum_message.cairo:trait_impl}}
```

In this example, we implemented the `Processing` trait for `Message`. Here is how it could be used to process a Quit message:

```rust
{{#rustdoc_include ../listings/ch05-enums-and-pattern-matching/no_listing_02_enum_message.cairo:main}}
```

Running this code would print `quitting`.

## The Option Enum and Its Advantages

The Option enum is a standard Cairo enum that represents the concept of an optional value. It has two variants: `Some: T` and `None: ()`. `Some: T ` indicates that there's a value of type `T`, while `None` represents the absence of a value.

```rust
enum Option<T> {
    Some: T,
    None: (),
}
```

The `Option` enum is helpful because it allows you to explicitly represent the possibility of a value being absent, making your code more expressive and easier to reason about. Using `Option` can also help prevent bugs caused by using uninitialized or unexpected `null` values.

To give you an example, here is a function which returns the index of the first element of an array with a given value, or None if the element is not present.

We are demonstrating two approaches for the above function:

- Recursive Approach `find_value_recursive`
- Iterative Approach `find_value_iterative`

> Note: in the future it would be nice to replace this example by something simpler using a loop and without gas related code.

```rust
{{#include ../listings/ch05-enums-and-pattern-matching/no_listing_03_enum_option.cairo}}

```

Running this code would print `it worked`.
