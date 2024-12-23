use core::starknet::ContractAddress;

#[starknet::interface]
trait IWarehouseContract<TState> {
    fn set_quantity(ref self: TState, item_id: u64, quantity: u64);
    fn get_item_quantity(self: @TState, address: ContractAddress, item_id: u64) -> u64;
}

// ANCHOR: contract
#[starknet::contract]
mod WarehouseContract {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };
    use core::starknet::{ContractAddress, get_caller_address};

    // ANCHOR: storage
    #[storage]
    struct Storage {
        user_warehouse: Map<ContractAddress, Map<u64, u64>>,
    }
    // ANCHOR_END: storage

    impl WarehouseContractImpl of super::IWarehouseContract<ContractState> {
        // ANCHOR: accesses
        fn set_quantity(ref self: ContractState, item_id: u64, quantity: u64) {
            let caller = get_caller_address();
            self.user_warehouse.entry(caller).entry(item_id).write(quantity);
        }

        fn get_item_quantity(self: @ContractState, address: ContractAddress, item_id: u64) -> u64 {
            self.user_warehouse.entry(address).entry(item_id).read()
        }
        // ANCHOR_END: accesses
    }
}
// ANCHOR_END: contract


