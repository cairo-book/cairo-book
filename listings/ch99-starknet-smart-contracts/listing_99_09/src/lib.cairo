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
    use starknet::{ContractAddress, class_hash::class_hash_const};

    #[storage]
    struct Storage {
        value: u128
    }

    #[abi(embed_v0)]
    impl ContractA of super::IContractA<ContractState> {
        fn set_value(ref self: ContractState, value: u128) {
            IContractALibraryDispatcher { class_hash: class_hash_const::<0x1234>() }
                .set_value(value)
        }

        fn get_value(self: @ContractState) -> u128 {
            self.value.read()
        }
    }
}
//ANCHOR_END: here


