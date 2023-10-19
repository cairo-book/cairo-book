## Storage Optimization with `StorePacking`

Bit-packing is a simple concept: Use as few bits as possible to store a piece of data. When done well, it can significantly reduce the size of the data you need to store. This is especially important in smart contracts, where storage is expensive.

When writing Cairo smart contracts, it is important to optimize storage usage to reduce gas costs. Indeed, most of the cost associated with a transaction is related to storage updates; and each storage slot costs gas to write to.
This means that by packing multiple values into fewer slots, you can decrease the gas cost incurred by the users of your smart contract.

Cairo provides the `StorePacking` trait to enable packing struct fields into fewer storage slots. For example, consider a `Sizes` struct with 3 fields of different types. The total size is 8 + 32 + 64 = 104 bits. This is less than the 128 bits of a single `u128`. This means we can pack all 3 fields into a single `u128` variable. Since a storage slot can hold up to 251 bits, our packed value will take only one storage slot instead of 3.

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_13_storage_packing/src/lib.cairo:here}}
```

<span class="caption">Optimizing storage by implementing the `StorePacking` trait</span>

The `pack` function combines all three fields into a single `u128` value by performing bitshift and additions. The `unpack` reverses this process to extract the original fields back into a struct.

If you're not familiar with bit operations, here's an explanation of the operations performed in the example:
The goal is to pack the `tiny`, `small`, and `medium` fields into a single `u128` value.
First, when packing:

- `tiny` is a `u8` so we just convert it directly to a `u128` with `.into()`. This creates a `u128` value with the low 8 bits set to `tiny`'s value.
- `small` is a `u32` so we first shift it left by 8 bits (add 8 bits with the value 0 to the left) to create room for the 8 bites taken by `tiny`. Then we add `tiny` to `small` to combine them into a single `u128` value. The value of `tiny` now takes bits 0-7 and the value of small takes bits 8-39.
- Similarly `medium` is a `u64` so we shift it left by 40 (8 + 32) bits (`TWO_POW_40`) to make space for the previous fields. This takes bits 40-103.

When unpacking:

- First we extract `tiny` by bitwise ANDing (&) with a bitmask of 8 ones (`& MASK_8`). This isolates the lowest 8 bits of the packed value, which is `tiny`'s value.
- For `small`, we right shift by 8 bits (`/ TWO_POW_8`) to align it with the bitmask, then use bitwise AND with the 32 ones bitmask.
- For `medium` we right shift by 40 bits. Since it is the last value packed, we don't need to apply a bitmask as the higher bits are already 0.

This technique can be used for any group of fields that fit within the bit size of the packed storage type. For example, if you have a struct with multiple fields whose bit sizes add up to 256 bits, you can pack them into a single `u256` variable. If the bit sizes add up to 512 bits, you can pack them into a single `u512` variable, and so on. You can define your own structs and logic to pack and unpack them.

The rest of the work is done magically by the compiler - if a type implements the `StorePacking` trait, then the compiler will know it can use the `StoreUsingPacking` implementation of the `Store` trait in order to pack before writing and unpack after reading from storage.
One important detail, however, is that the type that `StorePacking::pack` spits out also has to implement `Store` for `StoreUsingPacking` to work. Most of the time, we will want to pack into a felt252 or u256 - but if you want to pack into a type of your own, make sure that this one implements the `Store` trait.
