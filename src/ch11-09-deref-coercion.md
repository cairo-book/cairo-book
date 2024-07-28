# Deref Coercion

In Cairo, deref coercion simplifies the way we interact with nested or wrapped data structures by allowing an instance of one type to behave like an instance of another type.   
This mechanism is enabled by implementing the `Deref` trait, which allows implicit conversion (or coercion) of references to a different type, providing direct access to the underlying data. Additionally, the `DerefMut` trait allows mutable references to be coerced similarly, Enabling direct modification of the target data.

## Understanding Deref Coercion

The `Deref` and `DerefMut` traits are used to override the behavior of the dereference operator `*`. When implemented for a type, they allow an instance of that type to automatically convert to its target type, as specified by the traits. This makes accessing fields or calling methods on the target type seamless and intuitive.  
Let's look at the `Deref` and `DerefMut` traits closely :

### The Deref Trait
```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:Deref}}
```
The `Deref` trait allows you to customize the behavior of the dereference operator `*`. When you dereference a value of type `T`, the compiler looks for an implementation of `Deref` for `T`. If found, it applies the `deref` method to obtain a reference to the target type.

### The DerefMut Trait

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/listing_09_deref_coercion/src/lib.cairo:DerefMut}}
```

Similarly, the `DerefMut` trait is used for mutable dereferencing. When you dereference a mutable value of type `T`, the compiler looks for an implementation of `DerefMut` for `T`. If found, it applies the `deref_mut` method to obtain a mutable reference to the target type.

## Deref and DerefMut Coercion in Action

Consider an `Account` that contains a `UserProfile`. By implementing `Deref` and `DerefMut`, we can directly access and modify the `UserProfile` data through the `Account`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:UserProfile}}
```
The `UserProfile` struct represents a user profile with fields `username`, `email`, and `age`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:Account}}
```
The `Account` struct contains an instance of `UserProfile`. Normally, accessing or modifying the `UserProfile`'s fields would require going through `account.profile`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:impl}}
```
The `Deref` and `DerefMut` traits are implemented for `Account`, setting `UserProfile` as the target, Enabling reading and modifications of `UserProfile` through `Account`.
The `deref` method returns the `UserProfile` instance contained within the `Account`. Similarly the `deref_mut` method returns a mutable reference to the `UserProfile`.

```rust, noplayground
{{#rustdoc_include ../listings/ch11-advanced-features/no_listing_09_deref_coercion_example/src/lib.cairo:main}}
```
In `print_username` and `print_age`, we access `username` and `age` directly on `Account`. `Deref` coercion automatically converts `Account` to `UserProfile`, allowing direct field access (`account.username` instead of `account.profile.username`).  
In `update_age`, we use a mutable reference to `Account` and directly modify the `age` field via `deref_mut`.

This example illustrates how deref coercion can streamline access and modification of encapsulated data, leveraging the `Deref` and `DerefMut` traits to provide a seamless interface.