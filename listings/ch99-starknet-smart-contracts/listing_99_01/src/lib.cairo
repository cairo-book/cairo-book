// ANCHOR:all
// ANCHOR: interface
#[starknet::interface]
trait ISimpleStorage<TContractState> {
    fn set(ref self: TContractState, x: u128);
    fn get(self: @TContractState) -> u128;
}
//ANCHOR_END: interface

#[starknet::contract]
mod SimpleStorage {
    use starknet::get_caller_address;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        stored_data: u128
    }

    //ANCHOR: impl
    #[external(v0)]
    impl SimpleStorage of super::ISimpleStorage<ContractState> {
        //ANCHOR: write_state
        fn set(ref self: ContractState, x: u128) {
            self.stored_data.write(x);
        }
        //ANCHOR_END: write_state
        fn get(self: @ContractState) -> u128 {
            self.stored_data.read()
        }
    }
//ANCHOR_END: impl
}
//ANCHOR_END: all


