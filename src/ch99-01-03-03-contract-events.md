## Events

Events are custom data structures that are emitted by smart contracts during execution.
They provide a way for smart contracts to communicate with the external world by logging information
about specific occurrences in a contract.

Events play a crucial role in the creation of smart contracts. Take, for instance, the Non-Fungible Tokens (NFTs) minted on Starknet. All of these are indexed and stored in a database, then displayed to users through the use of these events. Neglecting to include an event within your NFT contract could lead to a bad user experience. This is because users may not see their NFTs appear in their wallets (wallets use these indexers to display a user's NFTs).

### Defining events

All the different events in the contract are defined under the `Event` enum, which implements the `starknet::Event` trait, as enum variants. This trait is defined in the core library as follows:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/no_listing_event_trait/src/lib.cairo}}
```

The `#[derive(starknet::Event)]` attribute causes the compiler to generate an implementation for the above trait,
instantiated with the Event type, which in our example is the following enum:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:event}}
```

Each event variant has to be a struct of the same name as the variant, and each variant needs to implement the `starknet::Event` trait itself.
Moreover, the members of these variants must implement the `Serde` trait (_c.f._ [Appendix C: Serializing with Serde](./appendix-03-derivable-traits.md)), as keys/data are added to the event using a serialization process.

The auto implementation of the `starknet::Event` trait will implement the `append_keys_and_data` function for each variant of our `Event` enum. The generated implementation will append a single key based on the variant name (`StoredName`), and then recursively call `append_keys_and_data` in the impl of the Event trait for the variant’s type .

In our contract, we define an event named `StoredName` that emits the contract address of the caller and the name stored within the contract, where the `user` field is serialized as a key and the `name` field is serialized as data.
To index the key of an event, simply annotate it with the `#[key]` as demonstrated in the example for the `user` key.

When emitting the event with `self.emit(StoredName { user: user, name: name })`, a key corresponding to the name ` StoredName`, specifically `sn_keccak(StoredName)`, is appended to the keys list. `user`is serialized as key, thanks to the `#[key]` attribute, while address is serialized as data. After everything is processed, we end up with the following keys and data: `keys = [sn_keccak("StoredName"),user]` and `data = [address]`.

### Emitting events

After defining events, we can emit them using `self.emit`, with the following syntax:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_03_example_contract/src/lib.cairo:emit_event}}
```
