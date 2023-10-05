//! A simple contract that sends and receives messages from/to
//! the L1 (Ethereum).
//!
//! The reception of the messages is done using the `l1_handler` functions.
//! The messages are sent by using the `send_message_to_l1_syscall` syscall.

/// A custom struct, which is already
/// serializable as `felt252` is serializable.
#[derive(Drop, Serde)]
struct MyData {
    a: felt252,
    b: felt252,
}

#[starknet::interface]
trait IContractL1<T> {
    /// Sends a message to L1 contract with a single felt252 value.
    ///
    /// # Arguments
    ///
    /// * `to_address` - Contract address on L1.
    /// * `my_felt` - Felt value to be sent in the payload.
    fn send_message_felt(ref self: T, to_address: starknet::EthAddress, my_felt: felt252);

    /// Sends a message to L1 contract with a serialized struct.
    /// To send a struct in a payload of a message, you only have to ensure that
    /// your structure is serializable implementing the `Serde` trait. Which
    /// can be derived automatically if your struct only contains serializable members.
    ///
    /// # Arguments
    ///
    /// * `to_address` - Contract address on L1.
    /// * `data` - Data to be sent in the payload.
    fn send_message_struct(ref self: T, to_address: starknet::EthAddress, data: MyData);
}

#[starknet::contract]
mod contract_msg {
    use super::{IContractL1, MyData};
    use starknet::{EthAddress, SyscallResultTrait};

    #[storage]
    struct Storage {
        allowed_message_sender: felt252,
    }

    //ANCHOR: felt_msg_handler
    #[l1_handler]
    fn msg_handler_felt(ref self: ContractState, from_address: felt252, my_felt: felt252) {
        assert(from_address == self.allowed_message_sender.read(), 'Invalid message sender');

        // You can now use the data, automatically deserialized from the message payload.
        assert(my_felt == 123, 'Invalid value');
    }
    //ANCHOR_END: felt_msg_handler

    #[l1_handler]
    fn msg_handler_struct(ref self: ContractState, from_address: felt252, data: MyData) {
        // assert(from_address == ...);

        assert(!data.a.is_zero(), 'data.a is invalid');
        assert(!data.b.is_zero(), 'data.b is invalid');
    }

    #[external(v0)]
    impl ContractL1Impl of IContractL1<ContractState> {
        //ANCHOR: felt_msg_send
        fn send_message_felt(ref self: ContractState, to_address: EthAddress, my_felt: felt252) {
            // Note here, we "serialize" my_felt, as the payload must be
            // a `Span<felt252>`.
            starknet::send_message_to_l1_syscall(to_address.into(), array![my_felt].span())
                .unwrap();
        }
        //ANCHOR_END: felt_msg_send

        fn send_message_struct(ref self: ContractState, to_address: EthAddress, data: MyData) {
            // Explicit serialization of our structure `MyData`.
            let mut buf: Array<felt252> = array![];
            data.serialize(ref buf);
            starknet::send_message_to_l1_syscall(to_address.into(), buf.span()).unwrap();
        }
    }
}
