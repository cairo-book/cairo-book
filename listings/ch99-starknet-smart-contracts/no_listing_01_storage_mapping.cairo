#[starknet::contract]
mod Contract {
    //ANCHOR: here
    struct Storage {
        allowances: LegacyMap::<(ContractAddress, ContractAddress), u256>
    }
//ANCHOR_END: here
}
