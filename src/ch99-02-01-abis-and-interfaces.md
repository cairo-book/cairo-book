# ABIs and Contract Interfaces

Cross-contract interactions between smart contracts on a blockchain is a common practice which enables us to build flexible contracts that can speak with each other.

Achieving this on Starknet requires something we call an interface.

## ABI - Application Binary Interface

On Starknet, the ABI of a contract is a JSON representation of the contract's functions and structures, giving anyone (or any other contract) the ability to form encoded calls to it. It is a blueprint that instructs how functions should be called, what input parameters they expect, and in what format.

While we write our smart contract logics in high-level Cairo, they are stored on the VM as executable bytecodes which are in binary formats. Since this bytecode is not human readable, it requires interpretation to be understood. This is where ABIs come into play, defining specific methods which can be called to a smart contract for execution. Without an ABI, it becomes practically impossible for external actors to understand how to interact with a contract.

ABIs are typically used in dApps frontends, allowing it to format data correctly, making it understandable by the smart contract and vice versa. When you interact with a smart contract through a block explorer like [Voyager](https://voyager.online/) or [Starkscan](https://starkscan.co/), they use the contract's ABI to format the data you send to the contract and the data it returns.

## Interface

The interface of a contract is a list of the functions it exposes publicly.
It specifies the function signatures (name, parameters, visibility and return value) contained in a smart contract without including the function body.

Contract interfaces in Cairo are traits annotated with the `#[starknet::interface]` attribute. If you are new to traits, check out the dedicated chapter on [traits](./ch08-02-traits-in-cairo.md).

One important specification is that this trait must be generic over the `TContractState` type. This is required for functions to access the contract's storage, so that they can read and write to it.

> Note: The contract constructor is not part of the interface. Nor are internal functions part of the interface.

Here's a sample interface for an ERC20 token contract. As you can see, it's a generic trait over the `TContractState` type. `view` functions have a self parameter of type `@TContractState`, while `external` functions have a self parameter of type passed by reference `ref self: TContractState`.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_04_interface/src/lib.cairo}}
```

<span class="caption">Listing 99-4: A simple ERC20 Interface</span>

In the next chapter, we will see how we can call contracts from other smart contracts using _dispatchers_ and _syscalls_ .
