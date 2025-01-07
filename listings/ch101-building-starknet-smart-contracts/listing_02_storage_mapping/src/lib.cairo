use core::starknet::ContractAddress;

#[starknet::interface]
trait IUserValues<TState> {
    fn set(ref self: TState, amount: u64);
    fn get(self: @TState, address: ContractAddress) -> u64;
}

//ANCHOR: contract
#[starknet::contract]
mod UserValues {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };
    use core::starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        user_values: Map<ContractAddress, u64>,
    }

    impl UserValuesImpl of super::IUserValues<ContractState> {
        // ANCHOR: write
        fn set(ref self: ContractState, amount: u64) {
            let caller = get_caller_address();
            self.user_values.entry(caller).write(amount);
        }
        // ANCHOR_END: write

        // ANCHOR: read
        fn get(self: @ContractState, address: ContractAddress) -> u64 {
            self.user_values.entry(address).read()
        }
        // ANCHOR_END: read
    }
}
//ANCHOR_END: contract


