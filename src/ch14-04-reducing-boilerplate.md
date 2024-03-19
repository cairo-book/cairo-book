# Reducing Boilerplate

In a previous section, we saw this example of an implementation block in a contract that didn't have any corresponding trait.

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/listing_01_reference_contract/src/lib.cairo:generate_trait}}
```

It's not the first time that we encounter this attribute, we already talked about in it [Method Syntax](./ch05-03-method-syntax.md#the-generate_trait-attribute). In this section, we'll be taking a deeper look at it and see how it can be used in contracts.

In order to access the ContractState in a function in an implementation block, this implementation block must be defined with a `ContractState` generic parameter. This implies that we first need to define a generic trait that takes a `TContractState`, and then implement this trait for the `ContractState` type.
But by using the `#[generate_trait]` attribute, this whole process can be skipped and we can simply define the implementation block directly, without any generic parameter, and use `self: ContractState` in our functions.

If we had to manually define the trait for the `InternalFunctions` implementation, it would look something like this:

```rust,noplayground
{{#include ../listings/ch14-building-starknet-smart-contracts/no_listing_03_explicit_internal_fn/src/lib.cairo:state_internal}}
```
