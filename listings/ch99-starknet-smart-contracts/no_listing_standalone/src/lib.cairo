#[starknet::interface]
trait ISimpleStorage<TContractState> {
    fn get(self: @TContractState) -> u128;
}

#[starknet::contract]
mod SimpleStorage {
    #[storage]
    struct Storage {
        stored_data: u128
    }

    #[abi(embed_v0)]
    impl SimpleStorage of super::ISimpleStorage<ContractState> {
        fn get(self: @ContractState) -> u128 {
            self.stored_data.read()
        }
    }

    #[external(v0)]
    fn set(ref self: ContractState, x: u128) {
        self.stored_data.write(x);
    }
}
