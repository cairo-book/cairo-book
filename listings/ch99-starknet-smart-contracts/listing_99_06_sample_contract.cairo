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
//**** Specify interface here ****//
#[contract]
mod dispatcher {
    use super::IERC20DispatcherTrait;
    use super::IERC20Dispatcher;
    use starknet::ContractAddress;

    #[view]
    fn token_name(_contract_address: ContractAddress) -> felt252 {
        IERC20Dispatcher { contract_address: _contract_address }.name()
    }

    #[external]
    fn transfer_token(
        _contract_address: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool {
        IERC20Dispatcher { contract_address: _contract_address }.transfer(recipient, amount)
    }
}
// ANCHOR_END: here


