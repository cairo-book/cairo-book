//ANCHOR: all
use core::starknet::ContractAddress;

#[starknet::contract]
mod NameRegistry {
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess, Map, Vec, VecTrait, MutableVecTrait
    };

    //ANCHOR: storage
    #[storage]
    struct Storage {
        names: Map::<ContractAddress, felt252>,
        total_names: u128,
        owner: Person,
        vector: Vec<u64>
    }
    //ANCHOR_END: storage

    //ANCHOR: person
    #[derive(Copy, Drop, Serde, starknet::Store)]
    struct Person {
        name: felt252,
        address: ContractAddress
    }
    //ANCHOR_END: person

    //ANCHOR: event
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        StoredName: StoredName,
    }

    #[derive(Drop, starknet::Event)]
    struct StoredName {
        #[key]
        user: ContractAddress,
        name: felt252
    }

    // ANCHOR: state_internal
    trait InternalFunctionsTrait<TContractState> {
        fn _store_name(ref self: TContractState, user: ContractAddress, name: felt252);
    }

    impl InternalFunctions of InternalFunctionsTrait<ContractState> {
        fn _store_name(ref self: ContractState, user: ContractAddress, name: felt252) {
            let mut total_names = self.total_names.read();
            self.names.write(user, name);
            self.total_names.write(total_names + 1);
            //ANCHOR: emit_event
            self.emit(Event::StoredName(StoredName { user: user, name: name }));
            //ANCHOR_END: emit_event
        }

        //ANCHOR: store_array
        fn _store_array(ref self: ContractState) {
            let array: Array<u64> = array![1, 2, 3, 4, 5];

            for element in array.span() {
                self.vector.append().write(element);
            }
        }
        //ANCHOR_END: store_array
    }
    // ANCHOR_END: state_internal
}
//ANCHOR_END: all


