use starknet::ContractAddress;

#[starknet::interface]
trait IERC20<TContractState> {
    fn name(self: @TContractState) -> felt252;

    fn symbol(self: @TContractState) -> felt252;

    fn decimals(self: @TContractState) -> u8;

    fn total_supply(self: @TContractState) -> u256;

    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;

    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;

    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;

    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
}

#[starknet::interface]
trait ITokenWrapper<TContractState> {
    fn token_name(self: @TContractState, contract_address: ContractAddress) -> felt252;

    fn transfer_token(
        ref self: TContractState,
        address: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
}


//ANCHOR: here
//**** Specify interface here ****//
#[starknet::contract]
mod TokenWrapper {
    //ANCHOR: import
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    //ANCHOR_END: import
    use super::ITokenWrapper;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {}

    impl TokenWrapper of ITokenWrapper<ContractState> {
        fn token_name(self: @ContractState, contract_address: ContractAddress) -> felt252 {
            //ANCHOR: no_local_variable
            IERC20Dispatcher { contract_address }.name()
            //ANCHOR_END: no_local_variable
        }

        fn transfer_token(
            ref self: ContractState,
            address: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) -> bool {
            //ANCHOR: local_variable
            let erc20_dispatcher = IERC20Dispatcher { contract_address: address };
            erc20_dispatcher.transfer(recipient, amount)
            //ANCHOR_END: local_variable

        }
    }
}
// ANCHOR_END: here


