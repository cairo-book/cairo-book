# Hashes

At its essence, hashing is a process of converting input data (often called a message) of any length into a fixed-size value, typically referred to as a hash value or simply "hash." This transformation is deterministic, meaning that the same input will always produce the same hash value. Hash functions are a fundamental component in various fields, including data storage, cryptography, and data integrity verification.

In this chapter we will present the two hash functions implemented in Cairo : Poseidon and Pedersen. We will discuss about when and how to use them and see how structures can be hashed.


### Hash functions in Cairo

The Cairo core library provides two hash functions: Pedersen and Poseidon.

Pedersen hash functions are cryptographic algorithms that use the principles of elliptic curve cryptography, a field of mathematics that involves curves plotted over a finite field. These functions perform operations on points along an elliptic curve — essentially, doing math with the locations of these points — which are easy to do in one direction and hard to undo. This one-way difficulty is based on the Elliptic Curve Discrete Logarithm Problem (ECDLP), which is a problem so hard to solve that it ensures the security of the hash function. The difficulty of reversing these operations is what makes the Pedersen hash function secure and reliable for cryptographic purposes.

Poseidon is a family of hash functions designed for being very efficient as algebraic circuits. Its design is particularly efficient for Zero-Knowledge proof systems, including STARKs. Poseidon uses a method called a 'sponge construction,' which soaks up data and transforms it securely using a process known as the Hades permutation. Cairo's version of Poseidon is based on a three element state permutation with [specific parameters](https://github.com/starkware-industries/poseidon/blob/main/poseidon3.txt)

#### When to use them ?

Pedersen was introduced first, and is still used to compute the addresses of variables in storage (for example, `LegacyMap` uses Pedersen to hash the keys of a storage mapping on Starknet). As Poseidon is cheaper and faster than Pedersen when working with a STARK proof system, it should be used in priority when possible.

### Working with Hashes

The core library makes it easy to work with hashes. The `Hash` trait is implemented for all types that can be converted to `felt252`, including `felt252` itself. For more complex types like structs, deriving `Hash` allows them to be hashed easily using the hash function of your choice - given that all of the struct's fields are themselves hashable. You cannot derive the `Hash` trait on a struct that contains un-hashable values, such as `Array<T>` or a `Felt252Dict<T>`.

The `Hash` trait is accompanied by the `HashStateTrait`, defined as follows:

```rust
{{#include ../listings/ch11-advanced-features/no_listing_03_hash_trait/src/lib.cairo:hashtrait}}
```


To use hashes in your code, you must first import the relevant traits and functions. In the following example, we will demonstrate how to hash a struct using both the Pedersen and Poseidon hash functions.

The first step is to initialize the hash with either `PoseidonTrait::new() -> HashState` or `PedersenTrait::new(base: felt252) -> HashState` depending on which hash function we want to work with. Then the hash state can be updated with the `update(self: HashState, value: felt252) -> HashState` or `update_with(self: S, value: T) -> S` functions as many times as required. Then the function `finalize(self: HashState) -> felt252`  is called on the hash state and it returns the value of the hash as a `felt252`/



```rust
{{#include ../listings/ch11-advanced-features/no_listing_04_hash/src/lib.cairo:import}}
```

```rust
{{#include ../listings/ch11-advanced-features/no_listing_04_hash/src/lib.cairo:structure}}
```


As our struct derives the trait HashTrait, we can call the function as follow for Poseidon hashing :


```rust
{{#include ../listings/ch11-advanced-features/no_listing_04_hash/src/lib.cairo:example_poseidon}}
```

And as follow for Pedersen hashing :

```rust
{{#include ../listings/ch11-advanced-features/no_listing_04_hash/src/lib.cairo:example_perdersen}}

```

### Advanced Hashing: Hashing arrays with Poseidon

Let us look at an example of hashing a function that contains an `Span<felt252>`.
To hash an `Span<felt252>` or a struct that contains an `Span<felt252>` you can use the build-in function in poseidon
` poseidon_hash_span(mut span: Span<felt252>) -> felt252`. Similarly you can hash `Array<felt252>` by calling `poseidon_hash_span` on its span.

First let us import the following trait and function :

```rust
{{#include ../listings/ch11-advanced-features/no_listing_05_   advanced_hash/src/lib.cairo:import}}
```

Now we define the structure, as you might have notice we didn't derived the Hash trait. If you try to derive the
Hash trait on this structure it will rise an error because the structure contains a field not hashable.


```rust
{{#include ../listings/ch11-advanced-features/no_listing_05_   advanced_hash/src/lib.cairo:structure}}

```

In this example, we initialized a HashState (`hash`) and updateted it and then called the function `finalize()` on the
HashState to get the computed hash `hash_felt252`. We used the `poseidon_hash_span` on the `Span` of the `Array<felt252>` to compute its hash.

```rust
{{#include ../listings/ch11-advanced-features/no_listing_05_   advanced_hash/src/lib.cairo:example_struct_array}}

```
