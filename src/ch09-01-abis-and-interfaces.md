# ABIs and Contract Interfaces

Cross-contract interactions between smart contracts on a blockchain is a common practice which enables us build flexible contracts that can speak with each other.

Achieving this on Starknet, requires something we call an interface.

## Interface
An interface, is a list of a contract's function definitions without implementations. In other words, an interface specfies the function declarations (name, parameters, visibility and return value) contained in a smart contract without including the function body.

The Starknet plugin generates a contract interface for your defined contracts, a trait you can find in `<contract_name>::__abi`. But you can also write a contract interface manually to interact with external contracts you do not have direct access to. 
For your Cairo code to qualify as an interface, it must meet the following requirements:

1. Must be appended with the `[abi]` macro.
2. Your interface functions should have no implementations.
3. You must explicitly declare the function's decorator.
4. Your interface should not declare a constructor.
5. Your interface should not declare state variables.

Here's a sample interface for an ERC20 token contract:

```cairo
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

## ABIs
ABI stands for Application Binary Interface. ABIs gives a smart contract the ability to communicate and interact with external applications or other smart contracts. ABIs can be likened to APIs in traditional web development, which helps data flow between applications and servers.

While we write our smart contract logics in high-level Cairo, they are stored on the VM as executable bytecodes which are in binary formats. Since this bytecode is not human readable, it requires interpretation to be understood. This is where ABIs come into play, defining specific methods which can be called to a smart contract for execution.

Every contract on Starknet, has an Application Binary Interface (ABI), that specifies the methods contained in the contract, which can be called or interacted with.

In the next chapter, we are going to be looking into how we can call other smart contracts using a `Contract Dispatcher`.