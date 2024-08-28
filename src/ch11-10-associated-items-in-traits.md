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
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo:AssociatedConsts}}
```

Since `strength` is fixed per character type, associated consts allow us to bind this constant number to the character trait rather than adding it to the struct or just hardcoding the value in the implementation. It provides an overall more elegant solution.

A potential battle between a `Warrior` and a `Wizard` could look like this:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo:Battle}}
```


## Associated Impls

The new `iterator` traits are a good example to highlight when one might need to use associated impls. Consider the new `iterator` traits from _iterator.cairo_ in the Cairo corelib:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_12_associated_impls/src/lib.cairo:AssociatedImpl}}
```

An implementation of `IntoIterator` trait is expected to take a collection and return a corresponding `IntoIter` iterator type. How can we enforce that the returned type is indeed an iterator, i.e. something that implements that `Iterator` trait? This is where the associated impl `Iterator` comes in, which is by definition an impl of the `Iterator` trait for the associated `IntoIter` iterator type.

The important observation is that any implementation of `IntoIterator` should return an iterator. Thus, while we can use generic impl parameters to enforce a specific implementation of `IntoIterator` returning an actual iterator, it should be already determined at the trait level. Associated impls are exactly the tool that allows us to do it.

Note that an implementation of `IntoIterator` does not necessarily need to specify the `Iterator` impl, if one exists in your context then it will be deduced, similarly to generic impl params.

Let's focus on the following example to better grasp the concept of associated impls:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_12_associated_impls/src/lib.cairo:EniExample}}
```

We define a generic struct `TupleThree<T>`, as well as a generic impl `IndexTupleThree<T, +Copy<T>>` corresponding to the  `IndexView` trait form the corelib and that implements a `index` method that matches an index to retrieve the corresponding field value of our `TupleThree<T>` struct.

After that, we define a `TupleThreeTrait` trait that contains a `at_index` method and uses an associated impl `impl IndexImpl: core::ops::IndexView<TupleThree<T>` corresponding to our previously implemented `IndexTupleThree<T, +Copy<T>> ` impl. Finally, we implement our `TupleThreeTrait` trait and will use it in the following `main` function: 

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_12_associated_impls/src/lib.cairo:Main}}
```