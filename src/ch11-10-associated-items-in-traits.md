# Associated Items in Traits

Associated items connect a type placeholder with a trait such that the trait method definitions can use these placeholder items in their signatures. The implementor of a trait will specify the concrete type to be used instead of the placeholder item for the particular implementation. That way, we can define a trait that uses some items without needing to know exactly what the types of those items are until the trait is implemented.

Associated items may include:
- Associated types
- Associated consts
- Associated impls

In this chapter, we will illustrate these associated items with short examples, showing how to use them and why they might be useful.

## Associated Types

Let's consider the following `Add` trait: 

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:AssociatedTypes}}
```

The type `Result` is a placeholder, and the next method’s definition shows that it will return values of type `Self::Result`. Implementors of the `Add` trait will specify the concrete type for `Result`, and the next method will return a value of that concrete type.

Let's suppose now that a function `foo<T, U>` needs the ability to add `T` and `U`. If we had defined the `Add` trait with an additional generic parameter that is used to describe the result, then the signature of our function would have looked like this:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:GenericsUsage}}
```

Nevertheless, when using associated types, we can get the result type from the impl of `Add`, and we don’t need to pollute `foo` with an additional generic argument:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:AssociatedTypesUsage}}
```

The point is that `foo` doesn’t necessarily need to generic on the addition result type, this information is associated with the impl of the `Add` trait.

## Associated Consts

## Associated Impls

## Summary