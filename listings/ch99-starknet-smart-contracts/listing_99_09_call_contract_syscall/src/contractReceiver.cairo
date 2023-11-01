use starknet::ClassHash;
use array::SpanTrait;
#[starknet::interface]
trait IReceiverContract<TContractState> {
    fn example_1(ref self: TContractState, amount: u128);
    fn example_2(ref self: TContractState, amount: u128, value: felt252);
    fn example_3(ref self: TContractState, value: Span<felt252>);
    fn get_value(self: @TContractState) -> u128;
    fn get_information(self: @TContractState) -> felt252;
}


#[starknet::contract]
mod receiver_contract {
    use starknet::ClassHash;
    use array::SpanTrait;
    use serde::Serde;
    use starknet::syscalls::replace_class_syscall;
    #[storage]
    struct Storage {
        value: u128,
        information: felt252
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Example1Invoked: Example1Invoked,
        Example2Invoked: Example2Invoked,
        Example3Invoked: Example3Invoked,
    }

    #[derive(Drop, starknet::Event)]
    struct Example1Invoked {
        amount: u128
    }

    #[derive(Drop, starknet::Event)]
    struct Example2Invoked {
        amount: u128,
        value: felt252
    }

    #[derive(Drop, starknet::Event)]
    struct Example3Invoked {
        amount: u256,
        value: felt252
    }

    #[external(v0)]
    impl ReceiveContract of super::IReceiverContract<ContractState> {
        fn get_value(self: @ContractState) -> u128 {
            self.value.read()
        }

        fn get_information(self: @ContractState) -> felt252 {
            self.information.read()
        }

        fn example_1(ref self: ContractState, amount: u128) {
            let current = self.value.read();
            self.value.write(current + amount);
            self.emit(Example1Invoked { amount });
        }

        fn example_2(ref self: ContractState, amount: u128, value: felt252) {
            let current = self.value.read();
            self.value.write(current + amount);
            self.information.write(value);
            self.emit(Example2Invoked { amount: amount, value: value });
        }

        fn example_3(ref self: ContractState, mut value: Span<felt252>) {
            let val1: u256 = Serde::deserialize(ref value).unwrap();
            let val2: felt252 = Serde::deserialize(ref value).unwrap();
            self.emit(Example3Invoked { amount: val1, value: val2 });
        }
    }
}
//0x05a3bf9b890439e363b8aa37e54e7a2a28426bf0143c9784bb3aea9a63cefb30

