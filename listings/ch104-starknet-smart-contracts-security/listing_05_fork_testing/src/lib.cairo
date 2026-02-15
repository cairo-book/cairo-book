// TAG: does_not_run
// ANCHOR: deployed_interface
// Interface matching a deployed protocol (e.g., an oracle or DEX)
#[starknet::interface]
pub trait IDeployedProtocol<TContractState> {
    fn get_price(self: @TContractState, token: starknet::ContractAddress) -> u256;
    fn get_reserve(self: @TContractState) -> u256;
}
// ANCHOR_END: deployed_interface

// ANCHOR: my_contract_interface
// Your contract that will interact with deployed protocols
#[starknet::interface]
pub trait IMyContract<TContractState> {
    fn set_oracle(ref self: TContractState, oracle: starknet::ContractAddress);
    fn get_token_value(self: @TContractState, token: starknet::ContractAddress, amount: u256) -> u256;
}
// ANCHOR_END: my_contract_interface

// ANCHOR: my_contract
#[starknet::contract]
pub mod MyContract {
    use starknet::ContractAddress;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::{IDeployedProtocolDispatcher, IDeployedProtocolDispatcherTrait};

    #[storage]
    struct Storage {
        oracle: IDeployedProtocolDispatcher,
    }

    #[abi(embed_v0)]
    impl MyContractImpl of super::IMyContract<ContractState> {
        fn set_oracle(ref self: ContractState, oracle: ContractAddress) {
            self.oracle.write(IDeployedProtocolDispatcher { contract_address: oracle });
        }

        fn get_token_value(self: @ContractState, token: ContractAddress, amount: u256) -> u256 {
            let price = self.oracle.read().get_price(token);
            amount * price
        }
    }
}
// ANCHOR_END: my_contract

#[cfg(test)]
mod tests;
