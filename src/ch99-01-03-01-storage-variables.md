## Storage Variables

As stated previously, storage variables allow you to store data that will be stored in the contract's storage that is itself stored on the blockchain. These data are persistent and can be accessed and modified anytime once the contract is deployed.

Storage variables in Starknet contracts are stored in a special struct called `Storage`:

```rust, noplayground
{{#rustdoc_include ../listings/ch99-starknet-smart-contracts/listing_99_02/src/lib.cairo:here}}
```

<span class="caption">Listing 99-2: A Storage Struct</span>

The storage struct is a [struct](./ch04-00-using-structs-to-structure-related-data.md) like any other,
except that it **must** be annotated with `#[storage]` allowing you to store mappings using the `LegacyMap` type.

### Storing Mappings

Mappings are a key-value data structure that you can use to store data within a smart contract. They are essentially hash tables that allow you to associate a unique key with a corresponding value. Mappings are also useful to store sets of data, as it's impossible to store arrays in storage.

A mapping is a variable of type `LegacyMap`, in which the key and value types are specified within angular brackets `<>`.
It is important to note that the `LegacyMap` type can only be used inside the `Storage` struct, and can't be used to define mappings in user-defined structs.

You can also create more complex mappings than that; you can find one in Listing 99-2bis like the popular `allowances` storage variable in the ERC20 Standard which maps the `owner` and `spender` to the `allowance` using tuples:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/no_listing_01_storage_mapping/src/lib.cairo:here}}
```

<span class="caption">Listing 99-2bis: Storing mappings</span>

In mappings, the address of the value at key `k_1,...,k_n` is `h(...h(h(sn_keccak(variable_name),k_1),k_2),...,k_n)` where ℎ
is the Pedersen hash and the final value is taken `mod2251−256`. You can learn more about the contract storage layout in the [Starknet Documentation](https://docs.starknet.io/documentation/architecture_and_concepts/Contracts/contract-storage/#storage_variables)

### Storing custom structs

The compiler knows how to store basic data types, such as unsigned integers (`u8`, `u128`, `u256`...), `felt252`, `ContractAddress`, etc. But what if you want to store a custom struct in storage? In that case, you have to explicitly tell the compiler how to store your struct in storage.
In our example, we want to store a `Person` struct in storage, so we have to tell the compiler how to store it in storage by adding a derive attribute of the `starknet::Store` trait to our struct definition.

```rust, noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:person}}
```

### Reading from Storage

To read the value of the storage variable `names`, we call the `read` function on the `names` storage variable, passing in the key `address` as a parameter.

```rust, noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:read}}
```

<span class="caption">Listing 99-3: Calling the `read` function on the `names` variable</span>

> Note: When the storage variable does not store a mapping, its value is accessed without passing any parameters to the read method

### Writing to Storage

To write a value to the storage variable `names`, we call the `write` function on the `names` storage variable, passing in the key and values as arguments.

```rust, noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:write}}
```

<span class="caption">Listing 99-4: Writing to the `names` variable</span>
