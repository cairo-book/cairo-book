# Deref Coercion

In Cairo, deref coercion simplifies the way we interact with nested or wrapped data structures by allowing an instance of one type to behave like an instance of another type. This mechanism is enabled by implementing the `Deref` trait, which allows implicit conversion (or coercion) to a different type, providing direct access to the underlying data. Additionally, the `DerefMut` trait allows similar coercion, enabling direct modification of the target data. For now, only member access via deref is supported, i.e. implementations with functions whose `self` argument is of the original type will not be applicable when holding an instance of the coerced type.

## Understanding Deref Coercion

In Cairo, the `Deref` and `DerefMut` traits allow you to customize the behavior of accessing members of a type through another type. When a type `T` implements `Deref` or `DerefMut` to type `K`, instances of `T` can access the members of `K` directly.  

Let's look at the `Deref` and `DerefMut` traits closely :-

### The Deref Trait

The `Deref` trait in Cairo is defined as follows:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:Deref}}
```
Where:
- `type Target`: Specifies the target type `K` that the type `T` will dereference to.
- `fn deref(self: T) -> Self::Target`: This method allows you to define how an instance of type `T` converts into type `K`. When implemented, you can access members of `K` through an instance of `T`.

### The DerefMut Trait

The `DerefMut` trait works similarly but is used for mutable access:

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:DerefMut}}
```
Where:
- `fn deref_mut(ref self: T) -> Self::Target`: This method allows mutable access to the target type `K` through a mutable reference to type `T`.

## Deref and DerefMut Coercion in Action

Let’s consider a generic wrapper type, similar to a smart pointer, that can wrap any data of type `T`. By implementing the `Deref` and `DerefMut` traits generically, we can abstract away the complexity of accessing the inner data, much like how it’s done in core libraries for types like `Box`, `Nullable`, and `StorageNode`. 

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:UserProfile}}
```
The `UserProfile` struct represents a user profile with fields `username`, `email`, and `age`.  

Let's define a generic `Wrapper<T>` type and demonstrate how `Deref` and `DerefMut` can be used to access the wrapped data effortlessly.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:Wrapper}}
```
The `Wrapper` struct wraps a single value of type `T`. Normally, accessing this value would require going through `Wrapper.value`.  

To simplify access to the wrapped value, we implement the `Deref` and `DerefMut` traits for `Wrapper<T>`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:deref}}
```
With these implementations, we can now access and modify the value inside `Wrapper<T>` directly, without needing to manually unwrap it.  

Let's see how this works in practice by using `Wrapper` to wrap a `UserProfile` and demonstrate how `Deref` and `DerefMut` make it easier to work with the wrapped data.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:main}}
```
By using the `Deref` and `DerefMut` traits, we can create a generic wrapper type like `Wrapper<T>` that allows seamless access to the underlying data. This pattern is common in core libraries for abstracting away the complexity of working with various data types while maintaining clear and concise code.  

This example illustrates the power and flexibility of `Deref` and `DerefMut` in Cairo, enabling us to build more intuitive and user-friendly abstractions.