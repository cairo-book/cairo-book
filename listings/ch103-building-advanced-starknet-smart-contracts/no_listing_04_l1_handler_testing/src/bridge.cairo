use starknet::ContractAddress;

// ANCHOR: interface
#[starknet::interface]
pub trait IBridge<TContractState> {
    fn get_l1_bridge(self: @TContractState) -> felt252;
    fn get_balance(self: @TContractState, account: ContractAddress) -> u256;
}
// ANCHOR_END: interface

// ANCHOR: contract
#[starknet::contract]
pub mod Bridge {
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::ContractAddress;
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        l1_bridge_address: felt252,
        balances: Map<ContractAddress, u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, l1_bridge_address: felt252) {
        self.l1_bridge_address.write(l1_bridge_address);
    }

    // ANCHOR: l1_handler
    /// Handles deposit messages from L1.
    /// CRITICAL: Always verify from_address to prevent unauthorized deposits.
    #[l1_handler]
    fn handle_deposit(
        ref self: ContractState, from_address: felt252, recipient: ContractAddress, amount: u256,
    ) {
        // SECURITY: This check is the ONLY defense against forged messages.
        // Anyone can call sendMessageToL2 on the Starknet Core Contract.
        // Without this check, attackers could mint unlimited tokens.
        assert!(from_address == self.l1_bridge_address.read(), "Unauthorized: invalid L1 sender");

        // Validate recipient
        assert!(!recipient.is_zero(), "Cannot deposit to zero address");

        // Credit the recipient
        let current_balance = self.balances.read(recipient);
        self.balances.write(recipient, current_balance + amount);
    }
    // ANCHOR_END: l1_handler

    #[abi(embed_v0)]
    impl BridgeImpl of super::IBridge<ContractState> {
        fn get_l1_bridge(self: @ContractState) -> felt252 {
            self.l1_bridge_address.read()
        }

        fn get_balance(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }
    }
}
// ANCHOR_END: contract
