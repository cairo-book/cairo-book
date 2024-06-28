# Type Conversion

Cairo addresses conversion between types by using the `try_into` and `into` methods provided by the `TryInto` and `Into` traits from the core library. There are numerous implementations of these traits within the standard library for conversion of scalar types, and they can be implemented for custom types as well.

## Into

The `Into` trait allows for a type to define how to convert itself into another type. It can be used for type conversion when success is guaranteed, such as when the source type is smaller than the destination type. 

To perform the conversion, call `var.into()` on the source value to convert it to another type. The new variable's type must be explicitly defined, as demonstrated in the example below.

```rust,noplayground
    let my_u8: u8 = 10;
    let my_u16: u16 = my_u8.into();
    let my_u32: u32 = my_u16.into();
    let my_u64: u64 = my_u32.into();
    let my_u128: u128 = my_u64.into();

    let my_felt252 = 10;
    // As a felt252 is smaller than a u256, we can use the into() method
    let my_u256: u256 = my_felt252.into();
    let my_other_felt252: felt252 = my_u8.into();
    let my_third_felt252: felt252 = my_u16.into();
```

Defining a conversion for a custom type using the `Into` trait will typically require specification of the type to convert into, as the compiler is unable to determine this most of the time. However this is a small trade-off considering we get the functionality for free.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_15_into/src/lib.cairo}}
```

## TryInto

Similar to `Into`, `TryInto` is a generic trait for converting between types. Unlike `Into`, the `TryInto` trait is used for fallible conversions, and as such, returns [Option\<T\>][option]. An example of a fallible conversion is when the target type might not fit the source value.

[option]: ./ch06-01-enums.md#the-option-enum-and-its-advantages

Also similar to `Into` is the process to perform the conversion; just call `var.try_into()` on the source value to convert it to another type. The new variable's type also must be explicitly defined, as demonstrated in the example below.

```rust,noplayground
    let my_u256: u256 = 10;

    // Since a u256 might not fit in a felt252, we need to unwrap the Option<T> type
    let my_felt252: felt252 = my_u256.try_into().unwrap();
    let my_u128: u128 = my_felt252.try_into().unwrap();
    let my_u64: u64 = my_u128.try_into().unwrap();
    let my_u32: u32 = my_u64.try_into().unwrap();
    let my_u16: u16 = my_u32.try_into().unwrap();
    let my_u8: u8 = my_u16.try_into().unwrap();

    let my_large_u16: u16 = 2048;
    let my_large_u8: u8 = my_large_u16.try_into().unwrap(); // panics with 'Option::unwrap failed.'
```

Below is an example of implementing the `TryInto` trait for a custom type.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_16_tryinto/src/lib.cairo}}
```