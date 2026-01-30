use starknet::ContractAddress;

// ANCHOR: interface
#[starknet::interface]
pub trait ISimpleToken<TContractState> {
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn total_supply(self: @TContractState) -> u256;
    fn transfer(ref self: TContractState, to: ContractAddress, amount: u256) -> bool;
    fn mint(ref self: TContractState, to: ContractAddress, amount: u256);
}
// ANCHOR_END: interface

// ANCHOR: contract
#[starknet::contract]
pub mod SimpleToken {
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_caller_address};
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        balances: Map<ContractAddress, u256>,
        total_supply: u256,
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, initial_supply: u256) {
        self.owner.write(owner);
        self.balances.write(owner, initial_supply);
        self.total_supply.write(initial_supply);
    }

    #[abi(embed_v0)]
    impl SimpleTokenImpl of super::ISimpleToken<ContractState> {
        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }

        fn total_supply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }

        fn transfer(ref self: ContractState, to: ContractAddress, amount: u256) -> bool {
            let caller = get_caller_address();
            self._transfer(caller, to, amount);
            true
        }

        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            let caller = get_caller_address();
            assert!(caller == self.owner.read(), "Only owner can mint");
            assert!(!to.is_zero(), "Cannot mint to zero address");

            let new_balance = self.balances.read(to) + amount;
            self.balances.write(to, new_balance);
            self.total_supply.write(self.total_supply.read() + amount);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _transfer(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, amount: u256,
        ) {
            assert!(!from.is_zero(), "Transfer from zero address");
            assert!(!to.is_zero(), "Transfer to zero address");

            let sender_balance = self.balances.read(from);
            assert!(sender_balance >= amount, "Insufficient balance");

            self.balances.write(from, sender_balance - amount);
            self.balances.write(to, self.balances.read(to) + amount);
        }
    }
}
// ANCHOR_END: contract
