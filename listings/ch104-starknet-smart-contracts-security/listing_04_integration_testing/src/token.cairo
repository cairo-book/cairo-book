// ANCHOR: token_interface
#[starknet::interface]
pub trait IToken<TContractState> {
    fn mint(ref self: TContractState, to: starknet::ContractAddress, amount: u256);
    fn approve(ref self: TContractState, spender: starknet::ContractAddress, amount: u256);
    fn transfer(ref self: TContractState, to: starknet::ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState,
        sender: starknet::ContractAddress,
        recipient: starknet::ContractAddress,
        amount: u256,
    ) -> bool;
    fn balance_of(self: @TContractState, account: starknet::ContractAddress) -> u256;
    fn allowance(
        self: @TContractState, owner: starknet::ContractAddress, spender: starknet::ContractAddress,
    ) -> u256;
}
// ANCHOR_END: token_interface

// ANCHOR: token_contract
#[starknet::contract]
pub mod Token {
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::ContractAddress;
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl TokenImpl of super::IToken<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            self.ownable.assert_only_owner();
            let current = self.balances.read(to);
            self.balances.write(to, current + amount);
        }

        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) {
            let caller = starknet::get_caller_address();
            self.allowances.write((caller, spender), amount);
        }

        fn transfer(ref self: ContractState, to: ContractAddress, amount: u256) -> bool {
            let caller = starknet::get_caller_address();
            let caller_balance = self.balances.read(caller);
            assert!(caller_balance >= amount, "Insufficient balance");

            self.balances.write(caller, caller_balance - amount);
            self.balances.write(to, self.balances.read(to) + amount);
            true
        }

        fn transfer_from(
            ref self: ContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool {
            let caller = starknet::get_caller_address();
            let current_allowance = self.allowances.read((sender, caller));
            assert!(current_allowance >= amount, "Insufficient allowance");

            let sender_balance = self.balances.read(sender);
            assert!(sender_balance >= amount, "Insufficient balance");

            self.allowances.write((sender, caller), current_allowance - amount);
            self.balances.write(sender, sender_balance - amount);
            self.balances.write(recipient, self.balances.read(recipient) + amount);
            true
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.read(account)
        }

        fn allowance(
            self: @ContractState, owner: ContractAddress, spender: ContractAddress,
        ) -> u256 {
            self.allowances.read((owner, spender))
        }
    }
}
// ANCHOR_END: token_contract


