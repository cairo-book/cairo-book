## Storage Variables

As stated previously, storage variables allow you to store data that will be stored in the contract's storage that is itself stored on the blockchain. These data are persistent and can be accessed and modified anytime once the contract is deployed.

Storage variables in Starknet contracts are stored in a special struct called `Storage`:

```rust, noplayground
{{#rustdoc_include ../listings/ch99-starknet-smart-contracts/listing_99_02/src/lib.cairo:here}}
```

<span class="caption">Listing 99-2: A Storage Struct</span>

The storage struct is a [struct](./ch05-00-using-structs-to-structure-related-data.md) like any other,
except that it **must** be annotated with `#[storage]` allowing you to store mappings using the `LegacyMap` type.

### Storing data types

The base address `StorageBaseAddress` of a value in storage is `sn_keccak(variable_name)`, with `variable_name` as the ASCII encoding of the variable's name. As the keccak256 hash function produces an output of 256 bits that doesn't fit in a `felt252`, we use `sn_keccak` which is defined as the first 250 bits of the Keccak256 hash.

### Storing structs

Most types from the core library, such as unsigned integers (`u8`, `u128`, `u256`...), `felt252`, `bool`, `ContractAddress`, etc. implement the `Store` trait and can thus be stored without further action. But what if you wanted to store a struct that you defined yourself? In that case, you have to explicitly tell the compiler how to store your struct.
In our example, we want to store a `Person` struct in storage, which is possible by implementing the `Store` trait for the `Person` type. This can be achieved by simply adding a `#[derive(starknet::Store)]` attribute on top of our struct definition.

```rust, noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:person}}
```

The base storage address for structs remains `sn_keccak(variable_name)`, and the value contained at this address is the first primitive type contained by the struct.

Subsequent fields are stored in addresses contiguous to the first elements at addresses `base_address + i`.

### Storing mappings

Mappings are a key-value data structure that you can use to store data within a smart contract. They are essentially hash tables that allow you to associate a unique key with a corresponding value. Mappings are also useful to store sets of data, as it's impossible to store arrays in storage.

A mapping is a variable of type `LegacyMap`, in which the key and value types are specified within angular brackets `<>`.
It is important to note that the `LegacyMap` type can only be used inside the `Storage` struct, and can't be used to define mappings in user-defined structs.

You can also create more complex mappings than that; you can find one in Listing 99-2bis like the popular `allowances` storage variable in the ERC20 Standard which maps the `owner` and `spender` to the `allowance` using tuples:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/no_listing_01_storage_mapping/src/lib.cairo:here}}
```

<span class="caption">Listing 99-2bis: Storing mappings</span>

In mappings, the address of the value at key `k_1,...,k_n` is `h(...h(h(sn_keccak(variable_name),k_1),k_2),...,k_n)` where ℎ is the Pedersen hash and the final value is taken `mod (2^251) − 256`.

If the key of the mapping is a struct, each element of the struct constitutes a key. Moreover, the struct should implement the Hash trait, which can be derived with the `#[derive(Hash)]` attribute. For example, if you have struct with two fields, the address will be `h(h(sn_keccak(variable_name),k_1),k_2)` - where `k_1` and `k_2` are the values of the two fields of the struct.

Similarly, in the case of a nested mapping such as `LegacyMap((ContractAddress, ContractAddress), u8)`, the address will be computed in the same way: `h(h(sn_keccak(variable_name),k_1),k_2)`.

You can learn more about the contract storage layout in the [Starknet Documentation](https://docs.starknet.io/documentation/architecture_and_concepts/Contracts/contract-storage/#storage_variables)

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
