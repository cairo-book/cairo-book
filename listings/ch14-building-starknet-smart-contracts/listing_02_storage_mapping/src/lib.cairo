#[starknet::contract]
mod contract {
    use core::starknet::ContractAddress;
    use core::starknet::storage::{Map, StoragePathEntry};
    //ANCHOR: here
    #[storage]
    struct Storage {
        allowances: Map<ContractAddress, Map<ContractAddress, u256>>,
    }
    //ANCHOR_END: here
}
