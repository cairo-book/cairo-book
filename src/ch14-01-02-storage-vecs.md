# Storing Collections with Vectors

The `Vec` type provides a way to store collections of values in the contract's storage. In this section, we will explore how to declare, add elements to, and retrieve elements from a `Vec`, as well as how the storage addresses for `Vec` variables are computed.

The `Vec` type is provided by the Cairo core library, inside the `core::starknet::storage` module. Its associated methods are defined in the `VecTrait` and `MutableVecTrait` traits that you will also need to import for read and write operations on the `Vec` type.

> Unlike the `Array<T>` type, which is a **memory** type that cannot be stored, the `Vec` type is a [phantom type][phantom types] that can only be used as a storage variable. It can't be instantiated, used as a function parameter, or as a regular struct member.

[phantom types]: ./ch10-02-phantom-data.html#phantom-type-in-generics

## Declaring and Using Storage Mappings

To declare a Vec, use the `Vec` type enclosed in angle brackets `<>`, specifying the type of elements it will store. In Listing {{#ref storage-vecs}}, we create a simple contract that registers all the addresses that call it and stores them in a Vec. We can then retrieve the `n`-th registered address, or all registered addresses.

```cairo, noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_storage_vecs/src/lib.cairo:storage_vecs}}
```

{{#label storage-vecs}}
<span class="caption">Listing {{#ref storage-vecs}}: Declaring a storage Vec in the Storage struct</span>

To add an element to a Vec, you use the `append` method to get a storage pointer to the next available slot, and then call the `write` function on it with the value to add.

```cairo, noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_storage_vecs/src/lib.cairo:append}}
```

To retrieve an element, you can use the `at` or `get` methods to get a storage pointer to the element at the specified index, and then call the `read` method to get the value. If the index is out of bounds, the `at` method panics, while the `get` method returns `None`.

```cairo, noplayground
{{#rustdoc_include ../listings/ch14-building-starknet-smart-contracts/listing_storage_vecs/src/lib.cairo:read}}
```

If you want to retrieve all the elements of the Vec, you can iterate over the indices of the storage `Vec`, read the value at each index, and append it to a memory `Array<T>`.
Similarly, you can't store an `Array<T>` in storage: you would need to iterate over the elements of the array and append them to a storage `Vec<T>`.

## Address Computation for Vecs

The address in storage of a variable stored in a Vec is computed according to the following rules:

- The length of the `Vec` is stored at the base address, computed as `sn_keccak(variable_name)`.
- The elements of the `Vec` are stored in addresses computed as `h(base_address, i)`, where `i` is the index of the element in the `Vec` and `h` is the Pedersen hash function.

## Summary

- Use the `Vec` type to store collections of values in contract storage.
- Access Vecs using the `append` method to add elements, and the `at` or `get` methods to read elements.
- The address of a Vec variable is computed using the `sn_keccak` and the Pedersen hash functions.
