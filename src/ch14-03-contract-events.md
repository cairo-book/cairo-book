# Contract Events

Events are custom data structures that are emitted by smart contracts during execution. They provide a way for smart contracts to communicate with the external world by logging information
about specific occurrences in a contract.

Events play a crucial role in the creation of smart contracts. Take, for instance, the Non-Fungible Tokens (NFTs) minted on Starknet. All of these are indexed and stored in a database, then displayed to users through the use of these events. Neglecting to include an event within your NFT contract could lead to a bad user experience. This is because users may not see their NFTs appear in their wallets, as wallets use these indexers to display a user's NFTs.

## Defining Events

All the different events in a contract are defined under the `Event` enum, which must implement the `starknet::Event` trait. This trait is defined in the core library as follows:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/no_listing_02_event_trait/src/lib.cairo}}
```

The `#[derive(starknet::Event)]` attribute causes the compiler to generate an implementation for the above trait,
instantiated with the `Event` type, which in our example is the following enum:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:event}}
```

Each variant of the `Event` enum has to be a struct or an enum of structs, with the same name as the variant, and each variant needs to implement the `starknet::Event` trait itself. Moreover, the members of these variants must implement the `Serde` trait (_c.f._ [Appendix C: Serializing with Serde](./appendix-03-derivable-traits.html#serializing-with-serde)), as keys/data are added to the event using a serialization process. If a variant of the `Event` enum is an enum of structs, it must be annotated with the `#[flat]` attribute.

The auto-implementation of the `starknet::Event` trait will implement the `append_keys_and_data` function for each variant of our `Event` enum. The generated implementation will append a single key based on the variant name (`StoredName`), and then recursively call `append_keys_and_data` in the impl of the `Event` trait for the variant’s type.

In our contract, we define an event named `StoredName` that emits the contract address of the caller and the name stored within the contract, where the `user` field is serialized as a key and the `name` field is serialized as data.
To index the key of an event, simply annotate it with the `#[key]` as demonstrated in the example for the `user` key.

Indexing allows for more efficient queries and filtering of events. Choosing to index event's fields with `#[key]` or not will depend on your needs. 

When emitting the event with `self.emit(StoredName { user: user, name: name })`, a key corresponding to the name ` StoredName`, specifically `sn_keccak(StoredName)`, is appended to the keys list. `user`is serialized as key, thanks to the `#[key]` attribute, while address is serialized as data. After everything is processed, we end up with the following keys and data: `keys = [sn_keccak("StoredName"),user]` and `data = [name]`.

## Emitting Events

After defining events, we can emit them using `self.emit`, with the following syntax:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:emit_event}}
```

The `emit` function is called on `self` and takes a reference to `self`, i.e., state modification capabilities are required. Therefore, it is not possible to emit events in view functions.
