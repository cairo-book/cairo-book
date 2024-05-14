# Borrowing Code from Another Contract Class

For now, we focused on calling external contracts in order to execute code in the context of the callee. But what if one want to borrow code from another contract class, allowing to execute external code in the caller context?

To achieve this, Starknet makes it possible for any contract to use the `library_call_syscall` system call, either directly or through the library dispatcher. The inner working is very similar to external contract calls.

## Library Dispatcher

The key difference between the contract dispatcher and the library dispatcher lies in the execution context of the logic defined in the class. While regular dispatchers are used to call functions from deployed **contracts**, library dispatchers are used to call stateless **classes**.

Let's consider two contracts A and B.

When A uses `IBDispatcher` to call functions from the **contract** B, the execution context of the logic defined in B is that of B. This means that the value returned by `get_caller_address()` in B will return the address of A, and updating a storage variable in B will update the storage of B.

When A uses `IBLibraryDispatcher` to call functions from the **class** of B, the execution context of the logic defined in B's class is that of A. This means that the value returned by `get_caller_address()` variable in B will be the address of the caller of A, and updating a storage variable in B's class will update the storage of A.

Listing {{#ref expanded-ierc20-library}} describes the library dispatcher and its associated `IERC20DispatcherTrait` trait and impl using the same `IERC20` example: 

```rust,noplayground
{{#include ../listings/ch15-starknet-cross-contract-interactions/listing_04_expanded_ierc20_library/src/lib.cairo}}
```

{{#label expanded-ierc20-library}}
<span class="caption">Listing {{#ref expanded-ierc20-library}}: A simplified example of the `IERC20DLibraryDispatcher` and its associated trait and impl</span>

We can notice a few difference with the contract dispatcher:
- Library dispatcher structs are instantiated with a `class_hash` field instead of `contract_address`.
- Library dispatcher trait implementation uses `library_call_syscall` system call instead of `call_contract_syscall`

Otherwise, everything is entirely similar. Let's see how to use library dispatcher to borrow some logic of another contract class.

> Note: there is no `LibraryDispatcherTrait`. The trait used with `ContractDispatcher` and `LibraryDispatcher` structs is the same, because the same functions are callable with both dispatchers. 

## Calling Contracts using the Library Dispatcher

Listing {{#ref library-dispatcher}} exposes a sample contract that uses the Library Dispatcher to execute another class hash's code in its own context:

```rust,noplayground
{{#include ../listings/ch15-starknet-cross-contract-interactions/listing_05_library_dispatcher/src/lib.cairo:here}}
```

{{#label library-dispatcher}}
<span class="caption">Listing {{#ref library-dispatcher}}: A sample contract using the Library Dispatcher</span>

We first need to import the `IContractADispatcherTrait` and `IContractALibraryDispatcher` which were generated from our interface by the compiler. Then, we can create an instance of `IContractALibraryDispatcher`, passing in the `class_hash` of the class we want to make library calls to. From there, we can call the functions defined in that class, executing its logic in the context of our contract. When we call `set_value` on `ContractA`, it will make a library call to the `set_value` function defined in `IContractA` on the given class, updating the value of the storage variable `value` in `ContractA`.

## Calling Classes Using `library_call_syscall` Low-level System Calls

Similarly to the case of external calls using `call_contract_syscall` system call, it is possible to borrow code from another class hash using the low level system call `library_call_syscall`. This syscall is an equivalent of the functionality provided by `delegatecall` opcode in Solidity smart contracts.

Listing {{#ref library_syscall}} shows an example demonstrating how to use a `library_call_syscall` to call the `set_value` function of `ContractA` contract:

```rust,noplayground
{{#include ../listings/ch15-starknet-cross-contract-interactions/listing_07_library_syscall/src/lib.cairo}}
```

{{#label library_syscall}}
<span class="caption">Listing {{#ref library_syscall}}: A sample contract using `library_call_syscall` system call</span>

To use `library_call_syscall` syscall, we passed in the contract class hash, the selector of the function we want to execute, and the serialized call arguments.

## Summary

Congratulations for finishing this chapter! You have learned many new concepts:
- Contract endpoints, allowing to execute some of the code of any contract.
- Contract ABI, summarizing in a JSON file all entrypoints of a contract, as well as any other additional needed data.
- Contract Dispatcher and Library Dispatcher, which are structs that implement the `DispatcherTrait`, allowing to either call another contract using the `DispatcherImpl` or borrow code from another contract class using the `LibraryDispatcherImpl`.
- Low level `call_contract_syscall`, `library_call_syscall`, used under the hood by the `DispatcherImpl` and the `LibraryDispatcherImpl`, but manipulable by anyone who wants to use them directly.

You should now have all the required tools to know how to interact with a deployed contract, and how to craft a contract that interacts with others or borrows the code form other classes.