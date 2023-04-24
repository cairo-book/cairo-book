# Library Dispatcher and System calls

In the previous chapter, we looked at how we could carry out cross-contract interactions using the Contract Dispatcher. In this chapter, we are going to take a good look at two other alternatives for cross-contract interactions.

## Library Dispatcher
The key difference between the contract dispatcher and the library dispatcher, is while the contract dispatcher calls an external contract's logic in the external contract's context, the library dispatcher calls the target contract's classhash, whilst executing the call in the calling contract's context. 
So unlike the contract dispatcher, calls made using the library dispatcher has no possibility of tampering with the target contract's state.

As stated in the previous chapter, contracts annotated with the `#[abi]` macro on compilation generates a new trait, two new structs(one for contract calls, and the other for library calls) and their implementation of this trait. The expanded form of the library traits looks like:

```rust
trait IERC20DispatcherTrait<T> {
    fn get_name(self: T) -> felt252;
    fn transfer(self: T, recipient: ContractAddress, amount: u256);
}

#[derive(Copy, Drop)]
struct IERC20LibraryDispatcher {
    class_hash: starknet::ClassHash,
}

impl IERC20LibraryDispatcherImpl of IERC20DispatcherTrait::<IERC20LibraryDispatcher> {
    fn get_name(self: T) -> felt252 {
        // starknet::syscalls::library_call_syscall  is called in here
    }
    fn transfer(self: IERC20Dispatcher, recipient: ContractAddress, amount: u256) {
        // starknet::syscalls::library_call_syscall  is called in here
    }
}
```

## Calling Contracts using the Library Dispatcher
Below's a sample code on calling contracts using the Library Dispatcher:

```rust
use super::IERC20DispatcherTrait;
use super::IERC20LibraryDispatcher;
use starknet::ContractAddress;

#[view]
fn token_name() -> felt252 {
    IERC20LibraryDispatcher { class_hash: starknet::class_hash_const::<0x1234>() }.get_name();
} 

#[external]
fn transfer_token(
    recipient: ContractAddress, amount: u256
) -> felt252 {
    IERC20LibraryDispatcher { class_hash: starknet::class_hash_const::<0x1234>() }.transfer(recipient, amount);
} 
```

As you can see, we had to first import the `IERC20DispatcherTrait` and `IERC20LibraryDispatcher` which was generated and exported on compiling our interface, then we make calls to the methods implemented for the `IERC20LibraryDispatcher` struct (`get_name`, `transfer`, etc), passing in the `class_hash` parameter which represents the class of the contract we want to call.

## Calling Contracts using low-level System calls
Another way to call other contracts, is using the `starknet::call_contract_syscall` system call. The Dispatchers we described in the previous sections are high-level syntaxes for this low-level system call.

Using the system call `starknet::call_contract_syscall` can be handy for customized error handling or possessing more control over the serialization/deserialization of the call data and the returned data. Here's an example demonstrating a low-level `transfer` call:

```rust
#[external]
fn transfer_token(
    address: starknet::ContractAddress, selector: felt252, calldata: Array<felt252>
) -> Span::<felt252> {
    starknet::call_contract_syscall(
        :address, entry_point_selector: selector, calldata: calldata.span()
    ).unwrap_syscall()
} 
```

As you can see, rather than pass our function arguments directly, we rather passed in the contract address, function selector(which is a keccak hash of the function name), and the calldata (function arguments). At the end, we get returned a serialized value which we'll need to deserialize ourselves!