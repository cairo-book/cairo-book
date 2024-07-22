#[starknet::contract]
mod contract {
    use starknet::ContractAddress;
    use starknet::storage::{Map, StoragePathEntry};
    //ANCHOR: here
    #[storage]
    struct Storage {
        allowances: Map<ContractAddress, Map<ContractAddress, u256>>,
    }
    //ANCHOR_END: here
}
