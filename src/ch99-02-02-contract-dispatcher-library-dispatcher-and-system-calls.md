# Contract Dispatcher, Library Dispatcher and System calls

Each time a contract interface is created on Starknet, two dispatchers are automatically created and exported:

1. The Contract Dispatcher
2. The Library Dispatcher

In this chapter, we are going to extensively discuss how these dispatchers work and their usage.

To effectively break down the concepts in this chapter, we are going to be using the IERC20 interface from the previous chapter (refer to Listing 99-4):

## Contract Dispatcher

Traits annotated with the `#[abi]` attribute are programmed to automatically generate and export the relevant dispatcher logic on compilation. The compiler also generates a new trait, two new structs (one for contract calls, and the other for library calls) and their implementation of this trait. Our interface is expanded into something like this:

**Note:** The expanded code for our IERC20 interface is a lot longer, but to keep this chapter concise and straight to the point, we focused on one view function `get_name`, and one external function `transfer`.

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_05_dispatcher_trait.cairo}}
```

<span class="caption">Listing 99-5: An expanded form of the IERC20 trait</span>

It's also worthy of note that all these are abstracted behind the scenes thanks to the power of Cairo plugins.

### Calling Contracts using the Contract Dispatcher

This is an example of a contract named `TokenWrapper` using the contract interface dispatcher to call an ERC-20, altering the target contract state in the case of `transfer_token`:

```rust,noplayground
{{#rustdoc_include ../listings/ch99-starknet-smart-contracts/listing_99_06_sample_contract.cairo:here}}
```

<span class="caption">Listing 99-6: A sample contract which uses the Contract Dispatcher</span>

As you can see, we had to first import the `IERC20DispatcherTrait` and `IERC20Dispatcher` which were generated and exported after compiling our interface, then we make calls to the methods implemented for the `IERC20Dispatcher` struct (`name`, `transfer`, etc), passing in the `contract_address` of the contract we want to call.

## Library Dispatcher

The key difference between the contract dispatcher and the library dispatcher is that while the contract dispatcher calls an external contract's logic in the external contract's context, the library dispatcher calls the target contract's class hash, whilst executing the call in the calling contract's context.
So unlike the contract dispatcher, calls made using the library dispatcher have no possibility of tampering with the target contract's state.

As stated in the previous chapter, contracts annotated with the `#[abi]` macro on compilation generates a new trait, two new structs (one for contract calls, and the other for library calls) and their implementation of this trait. The expanded form of the library traits looks like:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_07_library_dispatcher.cairo}}
```

Notice that the main difference between the regular contract dispatcher and the library dispatcher is that the former is generated with `call_contract_syscall` while the latter uses `library_call_syscall`.

<span class="caption">Listing 99-7: An expanded form of the IERC20 trait</span>

### Calling Contracts using the Library Dispatcher

Below's a sample code on calling contracts using the Library Dispatcher:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_08_using_library_dispatcher.cairo:here}}
```

<span class="caption">Listing 99-8: A sample contract using the Library Dispatcher</span>

As you can see, we had to first import the `IERC20DispatcherTrait` and `IERC20LibraryDispatcher` which were generated and exported after compiling our interface, then we make calls to the methods implemented for the `IERC20LibraryDispatcher` struct (`name`, `transfer`, etc), passing in the `class_hash` of the contract we want to call.

## Calling Contracts using low-level System calls

Another way to call other contracts is to use the `starknet::call_contract_syscall` system call. The Dispatchers we described in the previous sections are high-level syntaxes for this low-level system call.

Using the system call `starknet::call_contract_syscall` can be handy for customized error handling or possessing more control over the serialization/deserialization of the call data and the returned data. Here's an example demonstrating a low-level `transfer` call:

```rust,noplayground
{{#include ../listings/ch99-starknet-smart-contracts/listing_99_09_call_contract_syscall.cairo}}
```

<span class="caption">Listing 99-9: A sample contract implementing system calls</span>

As you can see, rather than pass our function arguments directly, we passed in the contract address, function selector (which is a keccak hash of the function name), and the calldata (function arguments). At the end, we get returned a serialized value which we'll need to deserialize ourselves!
