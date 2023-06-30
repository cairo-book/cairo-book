#[contract]
mod Contract {
    use starknet::ContractAddress;
    //ANCHOR: here
    struct Storage {
        id: u8,
        names: LegacyMap::<ContractAddress, felt252>,
    }
//ANCHOR_END: here
}
