//ANCHOR: all

use starknet::ContractAddress;

#[starknet::contract]
mod NameRegistry {
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        names: LegacyMap::<ContractAddress, felt252>,
        total_names: u128,
        owner: Person
    }

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
    }
// ANCHOR: state_internal
}
//ANCHOR_END: all


