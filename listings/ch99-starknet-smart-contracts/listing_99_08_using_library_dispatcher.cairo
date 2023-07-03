//**** Specify interface here ****//
use starknet::ContractAddress;

#[abi]
trait IERC20 {
    #[view]
    fn name() -> felt252;

    #[view]
    fn symbol() -> felt252;

    #[view]
    fn decimals() -> u8;

    #[view]
    fn total_supply() -> u256;

    #[view]
    fn balance_of(account: ContractAddress) -> u256;

    #[view]
    fn allowance(owner: ContractAddress, spender: ContractAddress) -> u256;

    #[external]
    fn transfer(recipient: ContractAddress, amount: u256) -> bool;

    #[external]
    fn transfer_from(sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;

    #[external]
    fn approve(spender: ContractAddress, amount: u256) -> bool;
}

//ANCHOR: here
#[contract]
mod contract {
    use super::IERC20DispatcherTrait;
    use super::IERC20LibraryDispatcher;
    use starknet::ContractAddress;

    #[view]
    fn token_name() -> felt252 {
        IERC20LibraryDispatcher { class_hash: starknet::class_hash_const::<0x1234>() }.name()
    }

    #[external]
    fn transfer_token(recipient: ContractAddress, amount: u256) -> bool {
        IERC20LibraryDispatcher {
            class_hash: starknet::class_hash_const::<0x1234>()
        }.transfer(recipient, amount)
    }
}
//ANCHOR_END: here


