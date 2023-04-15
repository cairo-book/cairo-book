# Generic Structs and Enums

We can also define structs and enums to use a generic type parameter in one or more fields using the `<>` syntax.

## Structs

The syntax for using generics in struct definition is similar to that used in fucntion defintions. First we declare the name of the type parameter inside the angle brackets just after the name of the struct. Then we use the generic type in the struct defintion where we would otherwise specify concrete data types. The next listing shows the defintion `Wallet<T>` which holds a balance of type `T`.

```rust
// This code does not compile!

#[derive(Drop)]
struct Wallet<T> {
    balance: T,
}


fn main() {
   let w = Wallet{ balance: 3_u128};
}
```

Compiling the above code would error due to the `derive` macro not working well with generics. When using generic types is best to directly write the traits you want to use:

```rust
struct Wallet<T> {
    balance: T,
}

impl WalletDrop<T, impl TDrop : Drop<T>> of Drop<Wallet<t>>;

fn main() {
   let w = Wallet{ balance: 3_u128};
}
```

We avoid using the `derive` macro for `Drop` implementation of `Walet` and instead define our own `WalletDrop` implementation. Notice that we must define, just like functions, as an extra generic type for `WalletDrop` saying that `T` implements the `Drop` trait as well. We are basically saying that the struct `Wallet<T>` is droppable as long as `T` is droppable as well.

Finally, if we want to add a field to `Wallet` representing it's Cairo address and we want that field to be different than `T` but generic as well can simply add another generic type between the `<>`:

```rust
struct Wallet<T, U> {
    balance: T,
    address: U,
}

impl WalletDrop<T, impl TDrop: Drop<T>, U, impl UDrop: Drop<U>> of Drop<Wallet<T, U>>;


fn main() {
   let w = Wallet{ balance: 3_u128, address: 14};
}
```

We add to `Wallet` struct definiton a new generic type `U` and then assign this type to the new field member `address`.
Then we adapt the `WalletDrop` trait to work with the new generic type `U`. Notice that when initializing the struct inside `main` it automatically infers that `T` is a `u128` and `U` is a `felt252` and since they are both droppable, `Wallet` is droppable as well!

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
