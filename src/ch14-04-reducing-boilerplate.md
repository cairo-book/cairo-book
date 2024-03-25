# Reducing Boilerplate

In a previous section, we saw this example of an implementation block in a contract that didn't have any corresponding trait.

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:generate_trait}}
```

It's not the first time that we encounter the `#[generate_trait]` attribute, we already talked about in it [Method Syntax](./ch05-03-method-syntax.md#the-generate_trait-attribute). In this section, we'll be taking a deeper look at it and see how it can be used in contracts.

In order to access the contract state in a function in an implementation block, this implementation block must be defined with a `ContractState` parameter. This implies that we first need to define a generic trait that takes a generic parameter, usually called `TContractState` (or sometimes `TState`), and then implement this trait for the `ContractState` type.

Using the `#[generate_trait]` attribute on an impl block allows us to skip this whole process, and we can simply define the implementation block directly, without any generic parameter, and use `self: ContractState` in our functions.

If we had to manually define the trait for the `InternalFunctions` implementation, it would look something like this:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/no_listing_03_explicit_internal_fn/src/lib.cairo:state_internal}}
```

The `#[generate_trait]` attribute is mostly used to define private impl blocks. It might also be used in addition to `#[abi(per_item)]` to define the various entrypoints of a contract, including public functions defined with the `#[external(v0)]` attribute.

Using `#[generate_trait]` in addition to `#[abi(embed_v0)]` for an impl block is not recommended, as it will result in a failure to generate the corresponding ABI. Public functions should only be defined in an impl block annotated with `#[generate_trait]` if this block is also annotated with the `#[abi(per_item)]` attribute.