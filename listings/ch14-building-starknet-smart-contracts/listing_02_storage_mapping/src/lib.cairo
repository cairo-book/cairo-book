#[starknet::contract]
mod contract {
    use starknet::ContractAddress;
    //ANCHOR: here
    #[storage]
    struct Storage {
        allowances: Map<ContractAddress, Map<ContractAddress, u256>>,
    }
    //ANCHOR_END: here
}
