# Anatomy of a Simple Contract

This chapter will introduce you to the basics of Starknet contracts with an example of a basic contract. You will learn how to write a simple contract that stores a single number on the blockchain.

Let's consider the following contract to present the basics of a Starknet contract. It might not be easy to understand it all at once, but we will go through it step by step:

```rust
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:all}}
```

{{#label simple-contract}}
<span class="caption">Listing {{#ref simple-contract}}: A simple storage contract.</span>

> Note: Starknet contracts are defined within [modules](./ch07-02-defining-modules-to-control-scope.md).

## What is this contract?

Contracts are a combintation of state and logic.
The state is defined within the `Storage` struct, and is always initialized empty. Here, our struct contains a single a field called `stored_data` of type `u128` (unsigned integer of 128 bits), indicating that our contract can store any number between 0 and \\( {2^{128}} - 1 \\).
The logic is defined by functions that interact with the state. Here, our contract defines and publicly exposes the functions `set` and `get` that can be used to modify or retrieve the value of the stored variable.
You can think of it as a single slot in a database that you can query and modify by calling functions of the code that manages the database.

## The interface: the contract's blueprint

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:interface}}
```

Interfaces represent the blueprint of the contract. They define the functions that the contract exposes to the outside world. In Cairo, they're defined by annotating a trait with the `#[starknet::interface]` attribute. All functions of the trait are considered public functions of any contract that implements this trait, and are callable from the outside world.

Here, the interface contains two functions: `set` and `get`. By leveraging the [traits & impls](./ch08-02-traits-in-cairo.md) mechanism from Cairo, we can make sure that the actual implementation of the contract matches its interface. In fact, you will get a compilation error if your contract doesn’t conform with the declared interface, as shown in Listing {{#ref wrong-interface}}.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_02/src/lib.cairo:impl}}
```

{{#label wrong-interface}}
<span class="caption">Listing {{#ref wrong-interface}}: A wrong implementation of the interface of the contract. This does not compile, as the return type of `set` does not match the trait's.</span>

In the interface, note the generic type `TContractState` of the `self` argument which is passed by reference to the `set` function. The `self` parameter represents the contract state. Seeing the `self` argument passed in a contract function tells us that this function can access the state of the contract. The `ref` modifier implies that `self` may be modified, meaning that the storage variables of the contract may be modified inside the `set` function.

On the other hand, `get` takes a _snapshot_ of `TContractState`, which immediately tells us that it does not modify the state (and indeed, the compiler will complain if we try to modify storage inside the `get` function).

## Public functions defined in an implementation block

Before we explore things further down, let's define some terminology.

- In the context of Starknet, a _public function_ is a function that is exposed to the outside world. In the example above, `set` and `get` are public functions. A public function can be called by anyone, and can be called from outside the contract, or from within the contract. In the example above, `set` and `get` are public functions.

- What we call an _external_ function is a public function that is invoked through a transaction and that can mutate the state of the contract. `set` is an external function.

- A _view_ function is a public function that can be called from outside the contract, but that cannot mutate the state of the contract. `get` is a view function.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:impl}}
```

Since the contract interface is defined as the `ISimpleStorage` trait, in order to match the interface, the public functions of the contract must be defined in an implementation of this trait — which allows us to make sure that the implementation of the contract matches its interface.

However, simply defining the functions in the implementation block is not enough. The implementation block must be annotated with the `#[abi(embed_v0)]` attribute. This attribute exposes the functions defined in this implementation to the outside world — forget to add it and your functions will not be callable from the outside. All functions defined in a block marked as `#[abi(embed_v0)]` are consequently _public functions_.

When writing the implementation of the interface, the generic parameter corresponding to the `self` argument in the trait must be `ContractState`. The `ContractState` type is generated by the compiler, and gives access to the storage variables defined in the `Storage` struct.
Additionally, `ContractState` gives us the ability to emit events. The name `ContractState` is not surprising, as it’s a representation of the contract’s state, which is what we think of `self` in the contract interface trait.

## Standalone public functions

It is also possible to define public functions outside of an impl block, using the `#[external(v0)]` attribute. Doing this will automatically generate the corresponding ABI, allowing these standalone public functions to be callable by anyone from the outside.

## Modifying the contract's state

As you can notice, all functions inside an impl block that need to access the state of the contract are defined under the implementation of a trait that has a `TContractState` generic parameter, and take a `self: ContractState` parameter.
This allows us to explicitly pass the `self: ContractState` parameter to the function, allowing access the storage variables of the contract.
To access a storage variable of the current contract, you add the `self` prefix to the storage variable name, which allows you to use the `read` and `write` methods to either read or write the value of the storage variable.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:write_state}}
```

{{#label write-method}}
<span class="caption">Listing {{#ref write-method}}: Using `self` and the `write` method to modify the value of a storage variable.</span>

> Note: if the contract state is passed as a snapshot with `@` instead of passed by reference with `ref`, attempting to modify the contract state will result in a compilation error.

This contract does not do much yet apart from allowing anyone to store a single number that is accessible by anyone in the world. Anyone could call `set` again with a different value and overwrite the current number, but this number will still be stored in the history of the blockchain. Later, you will see how you can impose access restrictions so that only you can alter the number.
