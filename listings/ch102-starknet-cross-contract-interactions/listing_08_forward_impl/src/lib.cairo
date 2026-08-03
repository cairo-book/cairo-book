#[starknet::interface]
trait IValueStore<TContractState> {
    fn set_value(ref self: TContractState, value: u128);
    fn get_value(self: @TContractState) -> u128;
}

#[starknet::contract]
#[feature("forward-impl")]
mod ValueStoreForwarder {
    use starknet::ClassHash;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        logic_library: ClassHash,
        value: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState, logic_library: ClassHash) {
        self.logic_library.write(logic_library);
    }

    // ANCHOR: forwarding_class_hash
    impl ForwardingClassHashImpl of starknet::ForwardingClassHash<ContractState> {
        fn class_hash(self: @ContractState) -> ClassHash {
            self.logic_library.read()
        }
    }
    // ANCHOR_END: forwarding_class_hash

    // ANCHOR: embed
    #[abi(embed_v0)]
    impl ValueStoreForwarded = super::IValueStoreForwardImpl<ContractState>;
    // ANCHOR_END: embed
}
