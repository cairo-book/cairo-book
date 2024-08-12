# Deref Coercion

In Cairo, deref coercion simplifies the way we interact with nested or wrapped data structures by allowing an instance of one type to behave like an instance of another type. This mechanism is enabled by implementing the `Deref` trait, which allows implicit conversion (or coercion) to a different type, providing direct access to the underlying data. Additionally, the `DerefMut` trait allows similar coercion, enabling direct modification of the target data. For now, only member access via deref is supported, i.e. implementations with functions whose `self` argument is of the original type will not be applicable when holding an instance of the coerced type.

## Understanding Deref Coercion

In Cairo, the `Deref` and `DerefMut` traits allow you to customize the behavior of accessing members of a type through another type. When a type `T` implements `Deref` or `DerefMut` to type `K`, instances of `T` can access the members of `K` directly.  

Let's look at the `Deref` and `DerefMut` traits closely :-  

The `Deref` trait in Cairo is defined as follows:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:Deref}}
```
Where:
- `type Target`: Specifies the target type `K` that the type `T` will dereference to.
- `fn deref(self: T) -> Self::Target`: This method allows you to define how an instance of type `T` converts into type `K`. When implemented, you can access members of `K` through an instance of `T`.  

The `DerefMut` trait works similarly but is used for mutable access:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:DerefMut}}
```
Where:
- `fn deref_mut(ref self: T) -> Self::Target`: This method allows mutable access to the target type `K` through a mutable reference to type `T`.

## Deref in Action

To better understand how deref coercion works, let's look at a practical example. We'll create a simple generic wrapper type called `Wrapper<T>` and use it to wrap a `UserProfile` struct.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_example/src/lib.cairo:Wrapper}}
```
The `UserProfile` struct represents a user profile with fields `username`, `email`, and `age`.  
The `Wrapper` struct wraps a single value of type `T`. Normally, accessing this value would require going through `Wrapper.value`.  

To simplify access to the wrapped value, we implement the `Deref` trait for `Wrapper<T>`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_example/src/lib.cairo:deref}}
```
With this implementation, we can access the value inside `Wrapper<T>` directly, without needing to manually unwrap it.    

Here’s how it works in practice:  

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_example/src/lib.cairo:main}}
```

## Restricting Deref Coercion with `DerefMut`

While `Deref` works for both mutable and immutable references, `DerefMut` is specifically for mutable access. Here’s an example of how `DerefMut` can be implemented:  

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_mut_example/src/lib.cairo:derefMut}}
```

However, `DerefMut` only works with mutable references. If you try to use `DerefMut` with an immutable reference, the compiler will throw an error.  

Here’s an example that demonstrates this restriction:  

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_mut_example/src/lib.cairo:error}}
```

For the above to work we need to define `wrapped_profile` as a mutable variable. Also `DerefMut` allows us to directly modify the `age` field of `UserProfile` through the `wrapped_profile` instance.  
Here’s an example that demonstrates working with `DerefMut`:  

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_mut_example/src/lib.cairo:example}}
```

By using the `Deref` and `DerefMut` traits, we can create a generic wrapper type like `Wrapper<T>` that allows seamless access to the underlying data. This pattern is common in core libraries for abstracting away the complexity of working with various data types while maintaining clear and concise code.  

This example illustrates the power and flexibility of `Deref` and `DerefMut` in Cairo, enabling us to build more intuitive and user-friendly abstractions.