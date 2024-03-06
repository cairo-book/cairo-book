# Anatomy of a Simple Contract

This chapter will introduce you to the basics of Starknet contracts using a very simple smart contract as example. You will learn how to write a contract that allows anyone to store a single number on the Starknet blockchain.

Let's consider the following contract for the whole chapter. It might not be easy to understand it all at once, but we will go through it step by step:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:all}}
```

{{#label simple-contract}}
<span class="caption">Listing {{#ref simple-contract}}: A simple storage contract.</span>

## What is this contract?

Contracts are a combintation of state and logic inside a module annotated with the `#[starknet::contract]` attribute.
The state is defined within the `Storage` struct, and is always initialized empty. Here, our struct contains a single a field called `stored_data` of type `u128` (unsigned integer of 128 bits), indicating that our contract can store any number between 0 and \\( {2^{128}} - 1 \\).
The logic is defined by functions that interact with the state. Here, our contract defines and publicly exposes the functions `set` and `get` that can be used to modify or retrieve the value of the stored variable.
You can think of it as a single slot in a database that you can query and modify by calling functions of the code that manages the database.

## The interface: the contract's blueprint

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:interface}}
```

{{#label interface}}
<span class="caption">Listing {{#ref interface}}: A basic contract interface.</span>


Interfaces represent the blueprint of the contract. They define the functions that the contract exposes to the outside world. In Cairo, they're defined by annotating a trait with the `#[starknet::interface]` attribute. All functions of the trait are considered public functions of any contract that implements this trait, and are callable from the outside world.

All contract interfaces use a generic type for the `self` parameter, representing the contract state. This parameter is required for any Starknet contract function, whether publicly accessible or not. It is a convention to name this generic parameter `TContractState` in interfaces, but this is not enforced and any name can be chosen.

In our case, the interface contains two functions:
- `set` function, which takes 2 parameters: `self`, passed by reference with the `ref` keyword allowing to access and modify the contract state, and `x` which is of type `u128`.
- `get` function that receives a snapshot of `self`, allowing only contract state access. Modifying the storage of a contract is not possible when `self` is of type `@TContractState`, and you will get an error when compiling if you try to do so.

By leveraging the [traits & impls](./ch08-02-traits-in-cairo.md) mechanism from Cairo, we can make sure that the actual implementation of the contract matches its interface. In fact, you will get a compilation error if your contract doesn’t conform with the declared interface. For example, Listing {{#ref wrong-interface}} shows a wrong implementation of `ISimpleStorage` trait of the interface, containing a slightly different `set` function that doesn't take any input, except `self`.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_02/src/lib.cairo:impl}}
```

{{#label wrong-interface}}
<span class="caption">Listing {{#ref wrong-interface}}: A wrong implementation of the previous interface.

Trying to compile a contract using this implementation will result in the following error:

```shell
error: The number of parameters in the impl function `SimpleStorage::set` is incompatible with `ISimpleStorage::set`. Expected: 2, actual: 1.
 --> /SimpleStorage/src/lib.cairo:20:16
        fn set(ref self: ContractState) {}
               ^*********************^

error: Wrong number of arguments. Expected 2, found: 1
 --> /SimpleStorage/src/lib.cairo[contract]:80:5
    SimpleStorage::set(ref contract_state, );
    ^**************************************^

error: could not compile `SimpleStorage` due to previous error
```

## Public functions defined in an implementation block

Before we explore things further down, let's define some terminology.

- In the context of Starknet, a _public function_ is a function that is exposed to the outside world. In the example above, `set` and `get` are public functions. A public function can be called by anyone, either from outside the contract or from within the contract itself. In the example above, `set` and `get` are public functions.

- What we call an _external_ function is a public function that can be directly invoked through a Starknet transaction and that can mutate the state of the contract. External functions always take a reference of the contract state as argument. `set` is an external function.

- A _view_ function is a public read-only function that can be called from outside the contract, but that cannot mutate the state of the contract. View functions always take a snapshot of the contract state as argument, making it impossible to modify the underlying state. `get` is a view function.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:impl}}
```

{{#label implementation}}
<span class="caption">Listing {{#ref implementation}}: SimpleStorage implementation.</span>

Since the contract interface is defined as the `ISimpleStorage` trait, in order to match the interface, the public functions of the contract must be defined in an implementation of this trait — which allows us to make sure that the implementation of the contract matches its interface.

However, simply defining the functions in the implementation block is not enough. The implementation block must be annotated with the `#[abi(embed_v0)]` attribute. This attribute exposes the functions defined in this implementation to the outside world — forget to add it and your functions will not be callable from the outside. All functions defined in a block marked as `#[abi(embed_v0)]` are consequently _public functions_.

Because `SimpleStorage` implementation is defined in a contract which is a module, we need to use the `super` keyword to access the interface defined outside of the contract in the parent module. We can either access the interface at the beginning of the contract with the `use` keyword, or in the implementation declaration like in our contract.

When writing the implementation of an interface, the `self` parameter of generic type in the trait must be of `ContractState` type. The `ContractState` type is generated by the compiler, and gives access to the storage variables defined in the `Storage` struct.
Additionally, `ContractState` gives us the ability to emit events. The name `ContractState` is not surprising, as it’s a representation of the contract’s state, which is what we think of `self` in the contract interface trait.
When `self` is a snapshot of `ContractState`, only read access is allowed, and emitting event is not possible.

## Standalone public functions

It is also possible to define public functions outside of an implementation of a trait, using the `#[external(v0)]` attribute. Doing this will automatically generate the corresponding ABI, allowing these standalone public functions to be callable by anyone from the outside. These functions can also be called from within the contract just like any function in Starknet contracts.

Listing {{#ref standalone}} is a rewrite of our contract, using an interface containing only the `get` function, and implementing the `set` function as a standalone function:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/no_listing_standalone/src/lib.cairo}}
```

{{#label standalone}}
<span class="caption">Listing {{#ref standalone}}: Standalone `set` function.</span>

## Accessing and modifying the contract's state

Two methods are commonly used to access or modify the state of a contract:
- `read` method allowing to read the value of a storage variable. This method takes only one argument, which is the name of the variable being read. 
  
```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:read_state}}
```

- `write` method allowing to write a new value in a storage slot. This method takes 2 arguments, the name of the variable to be updated and the new value to be written.
  
```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_01/src/lib.cairo:write_state}}
```

> Reminder: if the contract state is passed as a snapshot with `@` instead of passed by reference with `ref`, attempting to modify the contract state will result in a compilation error.

This contract does not do much yet apart from allowing anyone to store a single number that is accessible by anyone in the world. Anyone could call `set` again with a different value and overwrite the current number. Nevertheless, each number written in the storage of the contract will still be stored in the history of the blockchain. Later in this book, you will see how you can impose access restrictions so that only you can alter the number.
