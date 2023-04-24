# Contract Dispatcher

Each time a contract interface is created on Starknet, two dispatchers are automatically created and exported:
1. The Contract Dispatcher
2. The Library Dispatcher

In this chapter, we are going to extensively discuss how the Contract dispatcher works and it's usage.

To effectively break down the concepts in this chapter, we are going to be using the IERC20 interface from the previous chapter:

```rust
use starknet::ContractAddress;

#[abi]
trait IERC20 {
    #[view]
    fn get_name() -> felt252;

    #[view]
    fn get_symbol() -> felt252;

    #[view]
    fn get_total_supply() -> felt252;

    #[view]
    fn balance_of(account: ContractAddress) -> u256;

    #[view]
    fn allowance(owner: ContractAddress, spender: ContractAddress) -> u256;

    #[external]
    fn transfer(recipient: ContractAddress, amount: u256);

    #[external]
    fn transfer_from(sender: ContractAddress, recipient: ContractAddress, amount: u256);

    #[external]
    fn approve(spender: ContractAddress, amount: u256);
}
```

Contracts annotated with the `abi` macro/attribute are programmed to automatically generate and export the relevant dispatcher logic on compilation. The compiler also generates a new trait, two new structs(one for contract calls, and the other for library calls) and their implementation of this trait. Our interface is expanded into something like this:

```rust
trait IERC20DispatcherTrait<T> {
    fn get_name(self: T) -> felt252;
    fn transfer(self: T, recipient: ContractAddress, amount: u256);
}

#[derive(Copy, Drop)]
struct IERC20Dispatcher {
    contract_address: starknet::ContractAddress,
}

impl IERC20DispatcherImpl of IERC20DispatcherTrait::<IERC20Dispatcher> {
    fn get_name(self: T) -> felt252 {
        // starknet::call_contract_syscall is called in here
    }
    fn transfer(self: IERC20Dispatcher, recipient: ContractAddress, amount: u256) {
        // starknet::call_contract_syscall is called in here
    }
}
```

**NB:** The expanded code for our IERC20 interface is a lot more robust, but to keep this chapter concise and straight to the point, we focused on one view function `get_name`, and one external function `transfer`.

It's also worthy of note that, all these is abstracted behind the scenes, thanks to the power of Cairo plugins.

## Calling Contracts using the Contract Dispatcher
Calling another contract using the Contract interface dispatcher, calls the contract's logic in it's context, and in most cases may alter the contract's state. Here's an example:

```rust
use super::IERC20DispatcherTrait;
use super::IERC20Dispatcher;
use starknet::ContractAddress;

#[view]
fn token_name(
    _contract_address: ContractAddress
) -> felt252 {
    IERC20Dispatcher {contract_address: _contract_address }.get_name();
} 

#[external]
fn transfer_token(
    _contract_address: ContractAddress, recipient: ContractAddress, amount: u256
) -> felt252 {
    IERC20Dispatcher {contract_address: _contract_address }.transfer(recipient, amount);
} 
```

As you can see, we had to first import the `IERC20DispatcherTrait` and `IERC20Dispatcher` which was generated and exported on compiling our interface, then we make calls to the methods implemented for the `IERC20Dispatcher` struct (`get_name`, `transfer`, etc), passing in the `contract_address` parameter which represents the address of the contract we want to call.