# Associated Items

_Associated Items_ are the items declared in [traits] or defined in
[implementations]. Specifically, there are [associated functions] (including methods, that we already covered in Chapter {{#chap using-structs-to-structure-related-data}}), [associated types], [associated constants], and [associated implementations].

[traits]: ./ch08-02-traits-in-cairo.md
[implementations]: ./ch08-02-traits-in-cairo.md#implementing-a-trait-on-a-type
[associated types]: ./ch11-10-associated-items.md#associated-types
[associated functions]: ./ch05-03-method-syntax.md#associated-functions
[associated constants]: ./ch11-10-associated-items.md#associated-constants
[associated implementations]: ./ch11-10-associated-items.md#associated-implementations

Associated items are useful when they are logically related to the implementation. For example, the `is_some` method on `Option` is intrinsically related to Options, so should be associated.

Every associated item kind comes in two varieties: definitions that contain the actual implementation and declarations that declare signatures for definitions.

## Associated Types

Associated types are _type aliases_ allowing you to define abstract type placeholders within traits. Instead of specifying concrete types in the trait definition, associated types let trait implementers choose the actual types to use.

Let's consider the following `Pack` trait:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:associated_types}}
```

The `Result` type in our `Pack` trait acts as placeholder for a type that will be filled in later. Think of associated types as leaving a blank space in your trait for each implementation to write in the specific type it needs. This approach keeps your trait definition clean and flexible. When you use the trait, you don't need to worry about specifying these types - they're already chosen for you by the implementation. In our `Pack` trait, the type `Result` is such a placeholder. The method's definition shows that it will return values of type `Self::Result`, but it doesn't specify what `Result` actually is. This is left to the implementers of the `Pack` trait, who will specify the concrete type for `Result`. When the `pack` method is called, it will return a value of that chosen concrete type, whatever it may be.

Let's see how associated types compare to a more traditional generic approach. Suppose we need a function `foo` that can pack two variables of type `T`. Without associated types, we might define a `PackGeneric` trait and an implementation to pack two `u32` like this:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:generics_usage}}
```

With this approach, `foo` would be implemented as:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:foo}}
```

Notice how `foo` needs to specify both `T` and `U` as generic parameters. Now, let's compare this to our `Pack` trait with an associated type:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:associated_types_impl}}
```

With associated types, we can define `bar` more concisely:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:bar}}
```

Finally, let's see both approaches in action, demonstrating that the end result is the same:

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_10_associated_types/src/lib.cairo:main}}
```

As you can see, `bar` doesn't need to specify a second generic type for the packing result. This information is hidden in the implementation of the `Pack` trait, making the function signature cleaner and more flexible. Associated types allow us to express the same functionality with less verbosity, while still maintaining the flexibility of generic programming.

## Associated Constants

Associated constants are constants associated with a type. They are declared using the `const` keyword in a trait and defined in its implementation.
In our next example, we define a generic `Shape` trait that we implement for a `Triangle` and a `Square`. This trait includes an associated constant, defining the number of sides of the type that implements the trait.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo:associated_consts}}
```

After that, we create a `print_shape_info` generic function, which requires that the generic argument implements the `Shape` trait. This function will use the associated constant to retrieve the number of sides of the geometric figure, and print it along with its description.

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo:print_info}}
```

Associated constants allow us to bind a constant number to the `Shape` trait rather than adding it to the struct or just hardcoding the value in the implementation. This approach provides several benefits:

1. It keeps the constant closely tied to the trait, improving code organization.
2. It allows for compile-time checks to ensure all implementors define the required constant.
3. It ensures two instances of the same type have the same number of sides.

Associated constants can also be used for type-specific behavior or configuration, making them a versatile tool in trait design.

We can ultimately run the `print_shape_info` and see the output for both `Triangle` and `Square`:

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_11_associated_consts/src/lib.cairo:main}}
```

## Associated Implementations

Associated implementations allow you to declare that a trait implementation must exist for an associated type. This feature is particularly useful when you want to enforce relationships between types and implementations at the trait level. It ensures type safety and consistency across different implementations of a trait, which is important in generic programming contexts.

To understand the utility of associated implementations, let's examine the `Iterator` and `IntoIterator` traits from the Cairo core library, with their respective implementations using `ArrayIter<T>` as the collection type:

```cairo, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_12_associated_impls/src/lib.cairo:associated_impls}}
```

1. The `IntoIterator` trait is designed to convert a collection into an iterator.
2. The `IntoIter` associated type represents the specific iterator type that will be created. This allows different collections to define their own efficient iterator types.
3. The associated implementation `Iterator: Iterator<Self::IntoIter>` (the key feature we're discussing) declares that this `IntoIter` type must implement the `Iterator` trait.
4. This design allows for type-safe iteration without needing to specify the iterator type explicitly every time, improving code ergonomics.

The associated implementation creates a binding at the trait level, guaranteeing that:

- The `into_iter` method will always return a type that implements `Iterator`.
- This relationship is enforced for all implementations of `IntoIterator`, not just on a case-by-case basis.

The following `main` function demonstrates how this works in practice for an `Array<felt252>`:

```cairo
{{#rustdoc_include ../listings/ch11-advanced-features/listing_12_associated_impls/src/lib.cairo:main}}
```
