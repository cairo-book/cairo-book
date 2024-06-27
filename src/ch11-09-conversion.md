# Conversion

Primitive types can be converted to each other through [casting][casting].

Cairo addresses conversion between custom types (i.e., struct and enum) by the use of `Into` and `TryInto` traits. For converting custom types to string (`ByteArray`), refer to the ["Printing" chapter][printing].

[casting]: ./ch02-02-data-types.md#type-casting
[printing]: ./ch11-08-printing.md#printing-custom-data-types

## Into

The `Into` trait allows for a type to define how to convert itself into another type, hence providing a very simple mechanism for converting between several types. There are numerous implementations of this trait within the standard library for conversion of primitive and common types.

For example we can easily convert a `felt252` into a `u256`

```rust,noplayground
    let my_felt: felt252 = 100;
    let my_u256: u256 = my_felt.into();
```

Using the `Into` trait will typically require specification of the type to convert into as the compiler is unable to determine this most of the time. However this is a small trade-off considering we get the functionality for free.

We can do similarly for defining a conversion for our own type.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_15_into/src/lib.cairo}}
```

## TryInto

Similar to `Into`, `TryInto` is a generic trait for converting between types. Unlike `Into`, the `TryInto` trait is used for fallible conversions, and as such, returns [Option][option].

[option]: ./ch06-01-enums.md#the-option-enum-and-its-advantages

```rust
{{#include ../listings/ch11-advanced-features/no_listing_16_tryinto/src/lib.cairo}}
```