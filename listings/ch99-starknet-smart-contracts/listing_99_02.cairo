#[starknet::contract]
mod Contract {
    //ANCHOR: here
    struct Storage {
        id: u8,
        names: LegacyMap::<ContractAddress, felt252>,
    }
//ANCHOR_END: here
}
