# Generic Structs and Enums

We can also define structs to use a generic type parameter in one or more fields using the `<>` syntax.

## Structs

## Enums

As we did with structs, we can define enums to hold generic data types in their variants. For example the `Option<T>` enum provided by the Cairo's core library:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

The `Option<T>` enum is generic over a type `T` and has two variants: `Some`, which holds one value of type `T` and `None` that doesn't hold any value. By using the `Option<T>` enum, it is possible for us to express the abstract concept of an optional value, and because this value has a generic type `T` we can use this abstraction with any type.

Enums can use multiple generic types as well, like definition of the `Result<T, E>` enum that the standard library provides:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

The `Result<T, E>` enum is generic over two types, `T` and `E`, and has two variants: `Ok` which holds the value of type `T` and `Err` which holds the value of type `E`. This definition makes it convenient to use the `Result` enum anywhere we have an operation that might succed (by returning a value of type `T`) or fail (by returning a value of type `E`).
