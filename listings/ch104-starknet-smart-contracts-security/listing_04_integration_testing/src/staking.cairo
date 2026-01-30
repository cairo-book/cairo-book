// ANCHOR: staking_interface
#[starknet::interface]
pub trait IStaking<TContractState> {
    fn stake(ref self: TContractState, amount: u256);
    fn withdraw(ref self: TContractState, amount: u256);
    fn staked_amount(self: @TContractState, account: starknet::ContractAddress) -> u256;
    fn total_staked(self: @TContractState) -> u256;
}
// ANCHOR_END: staking_interface

// ANCHOR: staking_contract
#[starknet::contract]
pub mod Staking {
    use starknet::ContractAddress;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use crate::token::{ITokenDispatcher, ITokenDispatcherTrait};

    #[storage]
    struct Storage {
        token: ITokenDispatcher,
        staked_balances: Map<ContractAddress, u256>,
        total_staked: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, token_address: ContractAddress) {
        self.token.write(ITokenDispatcher { contract_address: token_address });
    }

    #[abi(embed_v0)]
    impl StakingImpl of super::IStaking<ContractState> {
        fn stake(ref self: ContractState, amount: u256) {
            let caller = starknet::get_caller_address();
            let this = starknet::get_contract_address();

            // Transfer tokens from caller to this contract
            let token = self.token.read();
            let success = token.transfer_from(caller, this, amount);
            assert!(success, "Transfer failed");

            // Update staked balance
            let current_stake = self.staked_balances.read(caller);
            self.staked_balances.write(caller, current_stake + amount);
            self.total_staked.write(self.total_staked.read() + amount);
        }

        fn withdraw(ref self: ContractState, amount: u256) {
            let caller = starknet::get_caller_address();
            let current_stake = self.staked_balances.read(caller);
            assert!(current_stake >= amount, "Insufficient staked amount");

            // Update staked balance first (checks-effects-interactions)
            self.staked_balances.write(caller, current_stake - amount);
            self.total_staked.write(self.total_staked.read() - amount);

            // Transfer tokens back to caller
            // Note: In a real contract, you'd need a separate transfer function
            // For simplicity, we mint back to the user (not production-ready)
            let token = self.token.read();
            token.mint(caller, amount);
        }

        fn staked_amount(self: @ContractState, account: ContractAddress) -> u256 {
            self.staked_balances.read(account)
        }

        fn total_staked(self: @ContractState) -> u256 {
            self.total_staked.read()
        }
    }
}
// ANCHOR_END: staking_contract
