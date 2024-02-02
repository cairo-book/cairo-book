//ANCHOR: here
use starknet::ContractAddress;
#[starknet::interface]
trait IContractA<TContractState> {
    fn set_value(ref self: TContractState, value: u128);

    fn get_value(self: @TContractState) -> u128;
}

#[starknet::contract]
mod ContractA {
    use super::{IContractADispatcherTrait, IContractALibraryDispatcher};
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        value: u128
    }

    #[abi(embed_v0)]
    impl ContractA of super::IContractA {
        fn set_value(ref self: ContractState, value: u128) {
            IContractBLibraryDispatcher { class_hash: starknet::class_hash_const::<0x1234>() }
                .set_value(value)
        }

        fn get_value(self: @ContractState) -> u128 {
            self.value.read()
        }
    }
}
//ANCHOR_END: here


