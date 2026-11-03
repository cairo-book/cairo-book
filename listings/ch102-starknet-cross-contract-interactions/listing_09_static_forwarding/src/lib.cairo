#[starknet::interface]
pub trait IValueStore<TContractState> {
    fn set_value(ref self: TContractState, value: u128);
    fn get_value(self: @TContractState) -> u128;
}

#[starknet::contract]
pub mod ValueStoreLogic {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        value: u128,
    }

    #[abi(embed_v0)]
    impl ValueStore of super::IValueStore<ContractState> {
        fn set_value(ref self: ContractState, value: u128) {
            self.value.write(value);
        }

        fn get_value(self: @ContractState) -> u128 {
            self.value.read()
        }
    }
}

// ANCHOR: forwarder
#[starknet::contract]
#[feature("forward-impl")]
pub mod StaticValueStoreForwarder {
    #[storage]
    struct Storage {
        value: u128,
    }

    impl LogicClassHash =
        super::ValueStoreLogic__class_hash__::ForwardingClassHashImpl<ContractState>;

    #[abi(embed_v0)]
    impl ValueStoreForwarded = super::IValueStoreForwardImpl<ContractState>;
}
// ANCHOR_END: forwarder

#[cfg(test)]
mod tests;
