# Associated Items in Traits

Associated items connect an item placeholder with a trait such that the trait method definitions can use these placeholder items in their signatures. The implementor of a trait will specify the concrete item to be used instead of the placeholder item for the particular implementation. That way, we can define a trait that uses some items without needing to know exactly what the types of those items are until the trait is implemented.

Associated items may include:
- Associated types
- Associated consts
- Associated impls

In this chapter, we will illustrate these associated items with short examples, showing how to use them and why they might be useful.

Examples in this chapter have been strongly inspired from [FeedTheFed post] regarding Cairo 2.7 upgrade in the [Starknet Community Forum].

[FeedTheFed post]: https://community.starknet.io/t/cairo-v2-7-0-is-coming/114362
[Starknet Community Forum]: https://community.starknet.io/

## Associated Types

Let's consider the following `CustomAdd` trait: 

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:AssociatedTypes}}
```

The type `Result` is a placeholder, and the method’s definition that follows shows that it will return values of type `Self::Result`. Implementors of the `CustomAdd` trait will specify the concrete type for `Result`, and the next method will return a value of that concrete type.

Let's suppose now that a function `foo<T, U>` needs the ability to add `T` and `U`. If we had defined a `AddGeneric` trait with an additional generic parameter that is used to describe the result, then this trait and one potential implementation using `u32` type for all involved generic types would have looked like this:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:GenericsUsage}}
```

with `foo` being implemented as follows:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:Foo}}
```

However, when using associated types, we can get the result type from the impl of `CustomAdd`, and we don’t need to pollute `foo` with an additional generic argument. In the following snippet, we define a `CustomAddImplU32` impl of `CustomAdd<T, U>` trait with `Result` type being a `u32` :

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:AssociatedTypesImpl}}
```

with `bar` function corresponding to the `foo` function but using an associated type:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:Bar}}
```

Finally, we can run `foo`, and `bar` in our `main` and see that they both produce the same result:

```rust
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:Main}}
```

The point is that `bar` don't need to use a third generic type for the addition result type, this information is actually associated with the impl of the `CustomAdd` trait.

## Associated Consts

Let's now imagine that we are building a game with multiple character types, in our case `Wizard` and `Warrior`, and each character has some fixed `strength` based on its type. We can model this scenario as follows:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo}}
```

Since `strength` is fixed per character type, associated consts allow us to bind this constant number to the character trait rather than adding it to the struct or just hardcoding the value in the implementation. It provides an overall more elegant solution.

## Associated Impls

## Summary
